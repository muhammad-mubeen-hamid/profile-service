import { DynamoDB } from 'aws-sdk';
import {ProfileRepository, UserProfile} from "../interface/profile-interface";
import {AttributeValue, PutItemInput} from "aws-sdk/clients/dynamodb";

const dynamoDb = new DynamoDB.DocumentClient();

class ProfileRepositoryImplementation implements ProfileRepository {
    private readonly tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    public async saveUserProfile(userProfile: UserProfile): Promise<UserProfile> {
        try {
            const username: AttributeValue = {
                S: userProfile.email
            }
            const phone: AttributeValue = {
                S: userProfile.phone
            }
            const params: PutItemInput = {
                TableName: this.tableName,
                Item: {
                    username: username,
                    phone: phone,
                },
            };

            await dynamoDb.put(params).promise();
            return userProfile;
        } catch (error) {
            throw new Error('ProfileRepositoryImplementation :: Error saving user profile');
        }
    }
}

export default ProfileRepositoryImplementation;
