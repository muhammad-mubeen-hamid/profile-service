// bootstrap/profile-bootstrap.ts
import { UserProfile } from "../repository/profile-repository";
import {getUserProfileService, saveUserProfileService } from "../service/profile-service";

export const initializeProfileServices = () => {
    const tableName = process.env.USER_PROFILE_TABLE;

    if (!tableName) {
        throw new Error('Missing required environment variable: USER_PROFILE_TABLE');
    }

    return {
        saveUserProfile: (userProfile: UserProfile) => saveUserProfileService(tableName, userProfile),
        getUserProfile: (email: string) => getUserProfileService(tableName, email),
    };
};
