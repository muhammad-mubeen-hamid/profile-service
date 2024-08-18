export interface UserProfile {
    username: string;
    email: string;
    name: string;
    dateOfBirth: string;
}
export interface ProfileRepository {
    saveUserProfile(userProfile: UserProfile): Promise<UserProfile>;
}