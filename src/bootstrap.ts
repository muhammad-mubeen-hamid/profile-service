// src/bootstrap.ts
import ProfileImplementation from "./implementation/profile";
import ProfileRepository from "./repository/profile";

class ProfileService {
    private static instance: ProfileService | null = null;
    private readonly profileRepository: ProfileRepository;
    private profileImplementation: ProfileImplementation;

    private constructor() {
        const profileTableName = process.env.PROFILE_TABLE_NAME;
        if (!profileTableName) {
            throw new Error('PROFILE_TABLE_NAME is not set');
        }

        this.profileRepository = new ProfileRepository(profileTableName);
        this.profileImplementation = new ProfileImplementation(this.profileRepository);
    }

    public static getInstance(): ProfileImplementation {
        if (!ProfileService.instance) {
            ProfileService.instance = new ProfileService();
        }
        return ProfileService.instance.profileImplementation;
    }
}

export default ProfileService;
