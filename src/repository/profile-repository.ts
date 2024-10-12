import { DynamoDBClient, GetItemCommand, UpdateItemCommand, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb';
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
        Key: marshall({ profileId: email }), // Ensure key attribute name matches PK
        TableName: tableName,
    };

    const command = new GetItemCommand(params);
    const result = await client.send(command);

    if (result.Item) {
        return unmarshall(result.Item) as Profile;
    }
    return null;
};

/**
 * Upserts a profile into DynamoDB.
 * If the profile exists, it updates the existing profile, otherwise, it creates a new one.
 *
 * @returns Promise<Profile> - The upserted profile
 * @param profile
 */
export const upsertProfileUsingRepository = async (profile: Profile): Promise<Profile> => {
    const dbClient = getDBClient();

    const modifiedAt = new Date().toISOString();

    console.log('Upserting profile:', profile);

    // Prepare the update parameters
    const updateParams: UpdateItemCommandInput = {
        ExpressionAttributeValues: marshall({
            ':contactNumber': profile.contactNumber,
            ':createdAt': profile.createdAt || modifiedAt, // If profile is new, set created_at
            ':email': profile.email,
            ':modifiedAt': modifiedAt, // Always update modified_at
        }),
        Key: marshall({ profileId: profile.email }), // Primary key for the profile
        ReturnValues: 'ALL_NEW', // Return the updated profile
        TableName: tableName,
        UpdateExpression: `SET profileId= :profileId, email = :email, contactNumber = :contactNumber, 
        createdAt = if_not_exists(createdAt, :createdAt), modifiedAt = :modifiedAt`,
    };

    // Execute the update command
    const command = new UpdateItemCommand(updateParams);
    const response = await dbClient.send(command);
    console.log('Upserted profile:', response);

    return profile;
};