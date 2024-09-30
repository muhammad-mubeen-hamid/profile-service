import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Profile } from '@muhammad-mubeen-hamid/marhaba-commons';
import GetItemInput = DocumentClient.GetItemInput;
import PutItemInput = DocumentClient.PutItemInput;

// Initialize environment variables at module level
const region = process.env.REGION;
const tableName = process.env.PROFILE_TABLE_NAME;

if (!region || !tableName) {
    throw new Error(
        `Invalid environment variables. REGION: ${region}, PROFILE_TABLE_NAME: ${tableName}`,
    );
}

let dbClient: DocumentClient | null = null;

const getDBClient = (): DocumentClient => {
    if (!dbClient) {
        dbClient = new DocumentClient({ region });
    }
    return dbClient;
};

export const getProfileUsingRepository = async (
    email: string,
): Promise<Profile | null> => {
    const client = getDBClient();

    const params: GetItemInput = {
        Key: { email },
        TableName: tableName,
    };

    const result = await client.get(params).promise();
    return result.Item as Profile | null;
};

export const updateProfileUsingRepository = async (
    profile: Profile,
): Promise<Profile> => {
    const client = getDBClient();

    const params: PutItemInput = {
        Item: {
            email: profile.email,
            phone: profile.phone,
        },
        TableName: tableName,
    };

    await client.put(params).promise();
    return profile;
};
