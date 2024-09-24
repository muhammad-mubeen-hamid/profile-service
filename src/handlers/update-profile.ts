import { APIGatewayProxyHandler } from 'aws-lambda';
import {initializeProfileServices} from "../bootstrap/profile-bootstrap";
import {UserProfile} from "../repository/profile-repository";

const { saveUserProfile } = initializeProfileServices();

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const userProfile: UserProfile = JSON.parse(event.body || '{}');

        if (!userProfile.email || !userProfile.phone) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required profile information' }),
            };
        }

        const savedProfile = await saveUserProfile(userProfile);
        return {
            statusCode: 200,
            body: JSON.stringify(savedProfile),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
};
