// service/profile-service.ts
import { saveUserProfile, getUserProfile, UserProfile } from '../repository/profile-repository';
import { AppResponse, SendResponse, AppResponseSuccessBody, ProfileCodes } from '@muhammad-mubeen-hamid/marhaba-commons';

export const saveUserProfileService = async (tableName: string, userProfile: UserProfile): Promise<AppResponse<UserProfile>> => {
    try {
        const savedProfile = await saveUserProfile(tableName, userProfile);
        const success: AppResponseSuccessBody<UserProfile> = {
            success: true,
            message: ProfileCodes.PROFILE_UPDATED,
            data: savedProfile,
        };
        return SendResponse({ statusCode: 200, body: success });
    } catch (error) {
        return SendResponse({
            statusCode: 500,
            body: {
                success: false,
                message: {
                    code: 'INTERNAL_SERVER_ERROR',
                    content: 'Internal server error',
                },
            },
        });
    }
};

export const getUserProfileService = async (tableName: string, email: string): Promise<AppResponse<UserProfile | null>> => {
    try {
        const userProfile = await getUserProfile(tableName, email);
        const success: AppResponseSuccessBody<UserProfile | null> = {
            success: true,
            message: ProfileCodes.ALL_OKAY,
            data: userProfile,
        };
        return SendResponse({ statusCode: 200, body: success });
    } catch (error) {
        return SendResponse({
            statusCode: 500,
            body: {
                success: false,
                message: {
                    code: 'INTERNAL_SERVER_ERROR',
                    content: 'Internal server error',
                },
            },
        });
    }
};
