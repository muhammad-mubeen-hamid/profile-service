"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProfileImplementation {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async saveUserProfile(userProfile) {
        if (!userProfile.username || !userProfile.email) {
            throw new Error('Username and email are required');
        }
        return await this.userRepository.saveUserProfile(userProfile);
    }
}
exports.default = ProfileImplementation;
