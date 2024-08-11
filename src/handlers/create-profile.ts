import { APIGatewayProxyHandler } from 'aws-lambda';
import ProfileService from "../bootstrap";

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body || '{}');

        const { username, email, name, dateOfBirth } = requestBody;

        const service = ProfileService.getInstance();

        const result = await service.saveUserProfile({ username, email, name, dateOfBirth });

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User created successfully', data: result }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: 'error...' }),
        };
    }
};
