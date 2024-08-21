import { APIGatewayProxyHandler } from 'aws-lambda';
import { Bootstrap } from '../bootstrap';

const { imageService } = Bootstrap.initializeImageService();

const text: APIGatewayProxyHandler = async (event) => {
    try {
        const userId = event.pathParameters?.userId;
        const picture = Buffer.from(event.body || '', 'base64');
        console.log(`Received picture for user ${userId}, with buffer: ${picture}`);

        if (!userId || !picture) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required information' }),
            };
        }

        const pictureKey = await imageService.uploadPicture(userId, picture);
        return {
            statusCode: 200,
            body: JSON.stringify({ pictureKey }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
};

export const handler: APIGatewayProxyHandler = async (event) => {
    console.log('Hello');
    const req = require('@muhummad-mubeen-hamid/marhaba-commons');
    console.log(req);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Hello' }),
    }
};
