import { APIGatewayTokenAuthorizerEvent, AuthResponse, PolicyDocument } from 'aws-lambda';
import { ParsedJWK, verifyToken } from '@muhammad-mubeen-hamid/marhaba-commons';

const jwksUrl = `https://cognito-idp.${process.env.REGION}.amazonaws.com/${process.env.USER_POOL_ID}/.well-known/jwks.json`;

const cachedKeys: ParsedJWK[] = [
    {
        alg: 'RS256',
        e: 'AQAB',
        kid: 'test-key',
        kty: 'RSA',
        n: 'test-key',
        use: 'sig',
    },
];

const generatePolicy = (principalId: string, effect: 'Allow' | 'Deny', resource: string): PolicyDocument => {
    console.log(`Generating policy: principalId=${principalId}, effect=${effect}, resource=${resource}`);
    return {
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource,
            },
        ],
        Version: '2012-10-17',
    };
};

exports.handler = (event: APIGatewayTokenAuthorizerEvent): AuthResponse => {
    console.log('Event received:', event);
    console.log('Authorization token:', jwksUrl);

    const token = event.authorizationToken;
    if (!token) {
        console.log('No token provided');
        return {
            policyDocument: generatePolicy('unauthorized', 'Deny', event.methodArn),
            principalId: 'unauthorized',
        };
    }

    try {
        console.log('Retrieving Cognito public keys');
        // if (!cachedKeys) {
        //     console.log('Fetching Cognito public keys');
        //     cachedKeys = await getCognitoPublicKeys(jwksUrl);
        // }

        console.log('Verifying token');
        const decoded = verifyToken(token, cachedKeys);
        console.log('Decoded token:', decoded);
        if (!decoded) {
            console.log('Token verification failed');
            return {
                policyDocument: generatePolicy('unauthorized', 'Deny', event.methodArn),
                principalId: 'unauthorized',
            };
        }

        console.log('Token verified successfully:', decoded);
        const userId = decoded.sub;

        return {
            context: {
                email: decoded.email,
                userId,
            },
            policyDocument: generatePolicy(userId, 'Allow', event.methodArn),
            principalId: userId,
        };
    } catch (error) {
        console.error('Authorization error:', error);
        return {
            policyDocument: generatePolicy('unauthorized', 'Deny', event.methodArn),
            principalId: 'unauthorized',
        };
    }
};

