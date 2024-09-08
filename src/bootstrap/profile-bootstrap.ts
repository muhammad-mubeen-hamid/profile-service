import ProfileRepositoryImplementation from "../repository/implementation/profile-repository";
import { ProfileServiceImplementation } from "../service/implementation/profile-service";

export class ProfileBootstrap {
    public static initializeProfileService(): { profileService: ProfileServiceImplementation } {
        const table = process.env.USER_PROFILE_TABLE;
        if (!table) {
            throw new Error('Missing required environment variable: USER_PROFILE_TABLE');
        }
        const profileRepository = new ProfileRepositoryImplementation(table);
        const profileService = new ProfileServiceImplementation(profileRepository);
        return { profileService };
    }
}
