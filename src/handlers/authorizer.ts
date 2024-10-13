import { APIGatewayTokenAuthorizerEvent, AuthResponse, PolicyDocument } from 'aws-lambda';
import { ParsedJWK, getCognitoPublicKeys, verifyToken } from '@muhammad-mubeen-hamid/marhaba-commons';

const jwksUrl = `https://cognito-idp.${process.env.REGION}.amazonaws.com/${process.env.USER_POOL_ID}/.well-known/jwks.json`;

let cachedKeys: ParsedJWK[];

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

const extractUserIdFromPath = (methodArn: string): string | undefined => {
    console.log('Extracting userId from path:', methodArn);
    // Example: arn:aws:execute-api:{region}:{account-id}:{api-id}/{stage}/{method}/{path}
    return methodArn.split('/').pop();
};

exports.handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<AuthResponse> => {
    console.log('Event received:', event);

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
        if (!cachedKeys) {
            console.log('Fetching Cognito public keys');
            cachedKeys = await getCognitoPublicKeys(jwksUrl);
        }

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

        console.log('|:===> Token verified successfully <===:|');
        const userId = decoded.sub;

        const userIdFromPath = extractUserIdFromPath(event.methodArn); // Implement this

        if (!userIdFromPath) {
            console.log('No userId found in path');
            return {
                policyDocument: generatePolicy(userId, 'Deny', event.methodArn),
                principalId: userId,
            };
        }

        // Check if the authenticated user is trying to access their own resource
        if (userId !== userIdFromPath) {
            console.log(`Access denied: ${userId} cannot access resource of ${userIdFromPath}`);
            return {
                policyDocument: generatePolicy(userId, 'Deny', event.methodArn),
                principalId: userId,
            };
        }

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

