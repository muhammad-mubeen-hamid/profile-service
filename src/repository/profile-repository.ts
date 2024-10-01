import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Profile } from '@muhammad-mubeen-hamid/marhaba-commons';

// Initialize environment variables at module level
const region = process.env.REGION;
const tableName = process.env.PROFILE_TABLE_NAME;

if (!region || !tableName) {
    throw new Error(
        `Invalid environment variables. REGION: ${region}, PROFILE_TABLE_NAME: ${tableName}`,
    );
}

let dbClient: DynamoDBClient | null = null;

const getDBClient = (): DynamoDBClient => {
    if (!dbClient) {
        dbClient = new DynamoDBClient({ region });
    }
    return dbClient;
};

export const getProfileUsingRepository = async (
    email: string,
): Promise<Profile | null> => {
    const client = getDBClient();

    const params = {
        Key: marshall({ email }),
        TableName: tableName,
    };

    const command = new GetItemCommand(params);
    const result = await client.send(command);

    if (result.Item) {
        return unmarshall(result.Item) as Profile;
    }
    return null;

};

export const updateProfileUsingRepository = async (
    profile: Profile,
): Promise<Profile> => {
    const client = getDBClient();

    const params = {
        Item: marshall({
            email: profile.email,
            phone: profile.phone,
        }),
        TableName: tableName,
    };

    console.log('params', params);

    const command = new PutItemCommand(params);
    const response = await client.send(command);
    console.log('response', response);

    return profile;
};
