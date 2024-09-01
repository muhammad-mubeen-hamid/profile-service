import { ProfileService } from "../interface/profile-interface";
import { ProfileRepository, UserProfile } from "../../repository/interface/profile-interface";
import {AppResponse, SendResponse, AppResponseSuccessBody, ProfileCodes} from "@muhammad-mubeen-hamid/marhaba-commons";

export class ProfileServiceImplementation implements ProfileService {
    private profileRepository: ProfileRepository;

    constructor(profileRepository: ProfileRepository) {
        this.profileRepository = profileRepository;
    }

    async saveUserProfile(userProfile: UserProfile): Promise<AppResponse<UserProfile>> {
        try {
            const repoResponse = await this.profileRepository.saveUserProfile(userProfile);
            const success: AppResponseSuccessBody<UserProfile> = {
                success: true,
                message: ProfileCodes.PROFILE_UPDATED,
                data: repoResponse
            }
            const response: AppResponse<UserProfile> = {
                statusCode: 200,
                body: success
            }
            return SendResponse(response);
        } catch (error) {
            const response: AppResponse<null> = {
                statusCode: 500,
                body: {
                    success: false,
                    message: {
                        code: 'INTERNAL_SERVER_ERROR',
                        content: 'Internal server error'
                    },
                }
            }
            return SendResponse(response);
        }
    }
}
