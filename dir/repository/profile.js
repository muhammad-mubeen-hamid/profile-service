"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient();
class ProfileRepository {
    constructor(tableName) {
        this.tableName = tableName;
    }
    async saveUserProfile(userProfile) {
        const params = {
            TableName: this.tableName,
            Item: {
                UserId: userProfile.username,
                Email: userProfile.email,
                Name: userProfile.name,
                DateOfBirth: userProfile.dateOfBirth,
            },
        };
        await dynamoDb.put(params).promise();
        return userProfile;
    }
}
exports.default = ProfileRepository;
