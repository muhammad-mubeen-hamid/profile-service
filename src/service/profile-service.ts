// service/profile-service.ts
import {
    AppResponse,
    AppResponseSuccessBody,
    Profile,
    ProfileCodes,
    SendResponse,
} from '@muhammad-mubeen-hamid/marhaba-commons';
import { getProfileUsingRepository, updateProfileUsingRepository } from '../repository/profile-repository';

export const getProfile = async (email: string): Promise<AppResponse<Profile | null>> => {
    try {
        const userProfile = await getProfileUsingRepository(email);
        const success: AppResponseSuccessBody<Profile | null> = {
            data: userProfile,
            message: ProfileCodes.ALL_OKAY,
            success: true,
        };
        return SendResponse({ body: success, statusCode: 200 });
    } catch (error) {
        console.log(error);
        return SendResponse({
            body: {
                message: ProfileCodes.INTERNAL_SERVER_ERROR,
                success: false,
            },
            statusCode: 500,
        });
    }
};

export const updateProfile = async (profile: Profile): Promise<AppResponse<Profile>> => {
    try {
        const savedProfile = await updateProfileUsingRepository(profile);
        const success: AppResponseSuccessBody<Profile> = {
            data: savedProfile,
            message: ProfileCodes.PROFILE_UPDATED,
            success: true,
        };
        return SendResponse({ body: success, statusCode: 200 });
    } catch (error) {
        console.log(error);
        return SendResponse({
            body: {
                message: ProfileCodes.INTERNAL_SERVER_ERROR,
                success: false,
            },
            statusCode: 500,
        });
    }
};
