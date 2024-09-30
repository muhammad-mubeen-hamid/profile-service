import { APIGatewayTokenAuthorizerEvent, AuthResponse, PolicyDocument } from 'aws-lambda';
import axios from 'axios';
import { JwtPayload, VerifyErrors, verify } from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

interface CognitoJwtPayload extends JwtPayload {
    sub: string;
    email: string;
    ['cognito:username']: string;
}

const jwksUrl = `https://cognito-idp.${process.env.REGION}.amazonaws.com/${process.env.USER_POOL_ID}/.well-known/jwks.json`;

let cachedKeys: any = null;

const getCognitoPublicKeys = async (): Promise<any> => {
    if (!cachedKeys) {
        console.log('Fetching JWKS keys from Cognito');
        const { data } = await axios.get(jwksUrl);
        cachedKeys = data.keys;
        console.log('Fetched keys:', cachedKeys);
    }
    return cachedKeys;
};

const generatePolicy = (principalId: string, effect: 'Allow' | 'Deny', resource: string): PolicyDocument => {
    console.log(`Generating policy: principalId=${principalId}, effect=${effect}, resource=${resource}`);
    return {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource,
            },
        ],
    };
};

exports.handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<AuthResponse> => {
    console.log('Event received:', JSON.stringify(event, null, 2));

    const token = event.authorizationToken;
    if (!token) {
        console.log('No token provided');
        return {
            principalId: 'unauthorized',
            policyDocument: generatePolicy('unauthorized', 'Deny', event.methodArn),
        };
    }

    try {
        console.log('Retrieving Cognito public keys');
        const keys = await getCognitoPublicKeys();

        console.log('Verifying token');
        const decoded = verifyToken(token, keys);
        if (!decoded) {
            console.log('Token verification failed');
            return {
                principalId: 'unauthorized',
                policyDocument: generatePolicy('unauthorized', 'Deny', event.methodArn),
            };
        }

        console.log('Token verified successfully:', decoded);
        const userId = decoded.sub;

        return {
            principalId: userId,
            policyDocument: generatePolicy(userId, 'Allow', event.methodArn),
            context: {
                userId,
                email: decoded.email,
            },
        };
    } catch (error) {
        console.error('Authorization error:', error);
        return {
            principalId: 'unauthorized',
            policyDocument: generatePolicy('unauthorized', 'Deny', event.methodArn),
        };
    }
};

const verifyToken = (token: string, keys: any): CognitoJwtPayload | null => {
    // Strip 'Bearer' from the token if present
    if (token.startsWith("Bearer ")) {
        token = token.slice(7);
    }

    console.log('Token after removing Bearer:', token);
    console.log('Token length:', token.length);
    console.log('Token parts:', token.split('.'));

    // Parse the header (first part of the JWT)
    const decodedHeader: any = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
    console.log('Decoded header:', decodedHeader);

    // Find the matching key based on the kid in the token header
    const key = keys.find((k: any) => k.kid === decodedHeader.kid);
    console.log('Matching key:', key);

    if (!key) {
        console.error('No matching key found for kid:', decodedHeader.kid);
        return null;
    }

    const pem = jwkToPem(key);
    console.log('PEM:', pem);

    try {
        console.log('Verifying JWT with PEM');
        return verify(token, pem, { algorithms: ['RS256'] }) as CognitoJwtPayload;
    } catch (error: VerifyErrors | any) {
        console.error('Token verification failed:', error);
        return null;
    }
};

