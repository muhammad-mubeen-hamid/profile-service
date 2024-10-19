// service/profile-service.ts\
import {
    AppResponse,
    AppResponseSuccessBody,
    Profile,
    ProfileCodes,
    SendResponse,
} from '@muhammad-mubeen-hamid/marhaba-commons';
import { getProfileUsingRepository, upsertProfileUsingRepository } from '../repository/profile-repository';

export const getProfile = async (email: string): Promise<AppResponse<Profile | null>> => {
    try {
        const profile = await getProfileUsingRepository(email);
        if (!profile) {
            return SendResponse({
                body: {
                    message: ProfileCodes.PROFILE_NOT_FOUND,
                    success: false,
                },
                statusCode: 404,
            });
        }
        const success: AppResponseSuccessBody<Profile | null> = {
            data: profile,
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

export const updateProfile = async (email: string, profile: Profile): Promise<AppResponse<Profile>> => {
    try {
        const existingProfile = await getProfile(email);
        console.log('existingProfile:', existingProfile);

        const savedProfile = await upsertProfileUsingRepository(email, profile);
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
