const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

process.env.JWT_SECRET = "test-secret";
process.env.ACCESS_TOKEN_EXPIRY = "1d";
process.env.REFRESH_TOKEN_EXPIRY = "1d";

jest.mock("resend", () => {
    return {
        Resend: jest.fn().mockImplementation(() => ({
            emails: {
                send: jest.fn().mockResolvedValue({ id: "mocked-email-id" }),
            },
        })),
    };
});

jest.mock("jsonwebtoken", () => {
    const originalModule = jest.requireActual("jsonwebtoken");
    return {...originalModule, verify: jest.fn().mockResolvedValue({ id: "T", goupeId: "groupIds" }) };
});

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});
