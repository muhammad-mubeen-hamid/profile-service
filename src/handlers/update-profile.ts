import { APIGatewayProxyHandler } from 'aws-lambda';
import { UserProfile } from '../repository/interface/profile-interface';
import {ProfileBootstrap} from "../bootstrap/profile-bootstrap";

const { profileService } = ProfileBootstrap.initializeProfileService();

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const userProfile: UserProfile = JSON.parse(event.body || '{}');

        if (!userProfile.email || !userProfile.phone) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing required profile information' }),
            };
        }

        const savedProfile = await profileService.saveUserProfile(userProfile);
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
