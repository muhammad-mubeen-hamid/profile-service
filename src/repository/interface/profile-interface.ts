export interface UserProfile {
    email: string;
    phone: string;
}
export interface ProfileRepository {
    saveUserProfile(userProfile: UserProfile): Promise<UserProfile>;
}