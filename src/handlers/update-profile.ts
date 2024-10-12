import {
    AppResponseFailureBody,
    CognitoCodes,
    ParsedJWK,
    Profile,
    ProfileCodes,
    SendResponse,
    getCognitoPublicKeys,
    verifyToken,
} from '@muhammad-mubeen-hamid/marhaba-commons';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { updateProfile } from '../service/profile-service';

const jwksUrl = `https://cognito-idp.${process.env.REGION}.amazonaws.com/${process.env.USER_POOL_ID}/.well-known/jwks.json`;
let keys: ParsedJWK[] | null = null;

export const handler = async (event: APIGatewayProxyEvent) => {
    console.log('header', event.headers);
    if (!keys) {
        keys = await getCognitoPublicKeys(jwksUrl);
    }

    if (!event.headers.Authorization) {
        const failureResponse: AppResponseFailureBody = {
            message: CognitoCodes.NO_TOKEN,
            success: false,
        };
        const body = JSON.stringify(SendResponse({
            body: failureResponse,
            statusCode: 401,
        }));

        return {
            body: body,
            statusCode: 401,
        };
    }

    const data = verifyToken(event.headers.Authorization, keys);

    if (!data) {
        const failureResponse: AppResponseFailureBody = {
            message: CognitoCodes.INVALID_TOKEN,
            success: false,
        };
        const body = JSON.stringify(SendResponse({
            body: failureResponse,
            statusCode: 400,
        }));

        return {
            body: body,
            statusCode: 400,
        };
    }

    const { email } = data;

    const { pathParameters } = event;
    if (!pathParameters) {
        const failureResponse: AppResponseFailureBody = {
            message: ProfileCodes.INVALID_PATH_PARAMETERS,
            success: false,
        };
        const body = JSON.stringify(SendResponse({
            body: failureResponse,
            statusCode: 400,
        }));

        return {
            body: body,
            statusCode: 400,
        };
    }

    const { body } = event;

    if (!body) {
        const failureResponse: AppResponseFailureBody = {
            message: ProfileCodes.INVALID_BODY,
            success: false,
        };
        const body = JSON.stringify(SendResponse({
            body: failureResponse,
            statusCode: 400,
        }));

        return {
            body: body,
            statusCode: 400,
        };
    }

    const profile = JSON.parse(body) as Profile;

    const response = await updateProfile(email, profile);

    return {
        body: JSON.stringify(response.body),
        statusCode: response.statusCode,
    };
};