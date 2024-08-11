"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/bootstrap.ts
const profile_1 = __importDefault(require("./implementation/profile"));
const profile_2 = __importDefault(require("./repository/profile"));
class ProfileService {
    constructor() {
        const profileTableName = process.env.PROFILE_TABLE_NAME;
        if (!profileTableName) {
            throw new Error('PROFILE_TABLE_NAME is not set');
        }
        this.profileRepository = new profile_2.default(profileTableName);
        this.profileImplementation = new profile_1.default(this.profileRepository);
    }
    static getInstance() {
        if (!ProfileService.instance) {
            ProfileService.instance = new ProfileService();
        }
        return ProfileService.instance.profileImplementation;
    }
}
ProfileService.instance = null;
exports.default = ProfileService;
