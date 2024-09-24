import { DynamoDB } from 'aws-sdk';

export interface UserProfile {
    email: string;
    phone: string;
}

const dynamoDb = new DynamoDB.DocumentClient();

export const saveUserProfile = async (tableName: string, userProfile: UserProfile): Promise<UserProfile> => {
    const params = {
        TableName: tableName,
        Item: {
            email: userProfile.email,
            phone: userProfile.phone,
        },
    };
    await dynamoDb.put(params).promise();
    return userProfile;
};

export const getUserProfile = async (tableName: string, email: string): Promise<UserProfile | null> => {
    const params = {
        TableName: tableName,
        Key: { email },
    };
    const result = await dynamoDb.get(params).promise();
    return result.Item as UserProfile;
};

