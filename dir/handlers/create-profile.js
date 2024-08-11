"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const bootstrap_1 = __importDefault(require("../bootstrap"));
const handler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body || '{}');
        const { username, email, name, dateOfBirth } = requestBody;
        const service = bootstrap_1.default.getInstance();
        const result = await service.saveUserProfile({ username, email, name, dateOfBirth });
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User created successfully', data: result }),
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: 'error...' }),
        };
    }
};
exports.handler = handler;
