import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AppResponseFailureBody, ProfileCodes, SendResponse } from '@muhammad-mubeen-hamid/marhaba-commons';
import { getProfile } from '../service/profile-service';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { pathParameters } = event;
    const failureResponse: AppResponseFailureBody = {
        message: ProfileCodes.INVALID_PATH_PARAMETERS,
        success: false,
    };
    const body = JSON.stringify(SendResponse({
        body: failureResponse,
        statusCode: 400,
    }));

    if (!pathParameters) {
        return {
            body: body,
            statusCode: 400,
        };
    }

    const { userId } = pathParameters;

    if (!userId) {
        return {
            body: body,
            statusCode: 400,
        };
    }

    const response = await getProfile(userId);

    return {
        body: JSON.stringify(response.body),
        statusCode: response.statusCode,
    };
};
