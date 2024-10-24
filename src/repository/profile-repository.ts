import {
    DynamoDBClient,
    GetItemCommand,
    GetItemCommandInput,
    UpdateItemCommand,
    UpdateItemCommandInput,
} from '@aws-sdk/client-dynamodb';
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

    const params: GetItemCommandInput = {
        Key: marshall({ profileId: email }), // Ensure key attribute name matches PK
        TableName: tableName,
    };

    const command = new GetItemCommand(params);
    const result = await client.send(command);

    console.log('Result:', result);

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
 * @param email - The email of the profile - acts as the primary key
 * @param profile - The profile to upsert
 */
export const upsertProfileUsingRepository = async (email: string, profile: Profile): Promise<Profile> => {
    const client = getDBClient();
    const modifiedAt = new Date().toISOString();

    console.log('Upserting profile:', profile);

    const updateParams: UpdateItemCommandInput = {
        ExpressionAttributeValues: marshall({
            ':contactNumber': profile.contactNumber,
            ':countryOfOrigin': profile.countryOfOrigin ?? null,
            ':createdAt': profile.createdAt || modifiedAt,
            ':dateOfBirth': profile.dateOfBirth ?? null,
            ':firstName': profile.firstName ?? null,
            ':lastName': profile.lastName ?? null,
            ':modifiedAt': modifiedAt,
            ':spokenLanguages': profile.spokenLanguages || [],
        }),
        Key: marshall({ profileId: email }),
        ReturnValues: 'ALL_NEW',
        TableName: tableName,
        UpdateExpression: `
            SET contactNumber = :contactNumber,
                createdAt = if_not_exists(createdAt, :createdAt), 
                modifiedAt = :modifiedAt,
                firstName = :firstName,
                lastName = :lastName,
                dateOfBirth = :dateOfBirth,
                countryOfOrigin = :countryOfOrigin,
                spokenLanguages = :spokenLanguages
        `,
    };

    try {
        const command = new UpdateItemCommand(updateParams);
        const response = await client.send(command);
        console.log('Upserted profile:', response);

        return profile;
    } catch (error) {
        console.error('Error upserting profile:', error);
        throw error;
    }
};
