import { AppResponseFailureBody, Profile, ProfileCodes, SendResponse } from '@muhammad-mubeen-hamid/marhaba-commons';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { updateProfile } from '../service/profile-service';

exports.handler = async (event: APIGatewayProxyEvent) => {
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

    const response = await updateProfile(profile);

    return {
        body: JSON.stringify(response.body),
        statusCode: response.statusCode,
    };
};