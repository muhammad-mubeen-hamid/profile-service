import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = event.requestContext.authorizer?.userId;
    const email = event.requestContext.authorizer?.email;

    return {
        statusCode: 200,
        body: JSON.stringify({
            userId,
            email,
        }),
    };
}