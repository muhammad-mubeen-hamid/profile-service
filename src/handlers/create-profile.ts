import { APIGatewayProxyHandler } from 'aws-lambda';
import { Bootstrap } from '../bootstrap';
import { UserProfile } from '../repository/interface/profile-interface';

const { profileService } = Bootstrap.initializeProfileService();

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const userProfile: UserProfile = JSON.parse(event.body || '{}');

        if (!userProfile.username || !userProfile.email || !userProfile.name || !userProfile.dateOfBirth) {
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
