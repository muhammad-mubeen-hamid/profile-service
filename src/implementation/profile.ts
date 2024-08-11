import {UserProfile} from "../types";
import UserRepository from "../repository/profile";

class ProfileImplementation {
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async saveUserProfile(userProfile: UserProfile): Promise<UserProfile> {
        if (!userProfile.username || !userProfile.email) {
            throw new Error('Username and email are required');
        }
        return await this.userRepository.saveUserProfile(userProfile);
    }
}

export default ProfileImplementation;
