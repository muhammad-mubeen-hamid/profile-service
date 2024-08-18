import { DynamoDB } from 'aws-sdk';
import {ProfileRepository, UserProfile} from "../interface/profile-interface";

const dynamoDb = new DynamoDB.DocumentClient();

class ProfileRepositoryImplementation implements ProfileRepository {
    private readonly tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    public async saveUserProfile(userProfile: UserProfile): Promise<UserProfile> {
        const params = {
            TableName: this.tableName,
            Item: {
                UserId: userProfile.username, // Assuming username is unique and used as the primary key
                Email: userProfile.email,
                Name: userProfile.name,
                DateOfBirth: userProfile.dateOfBirth,
            },
        };

        await dynamoDb.put(params).promise();
        return userProfile;
    }
}

export default ProfileRepositoryImplementation;
