const { getShorterOrder } = require("./getShorterOrder");
const { checkBody } = require("./checkBody");
const { generateUserToken } = require("./generateUserToken");
const { jsonResponse } = require("./jsonResponse");
const { matrixFromCoords } = require("./matrixFromCoords");
const { createCodeAndExpireDate } = require("./createCodeAndExpireDate");
const { buildLoginData } = require("./buildLoginData");
const {createExactRegexInsensitive} = require("./createExactRegexInsensitive")
const {isValidEmail} = require("./emailValidator")
module.exports = {
    getShorterOrder,
    checkBody,
    generateUserToken,
    jsonResponse,
    matrixFromCoords,
    createCodeAndExpireDate,
    buildLoginData,
    createExactRegexInsensitive,
    isValidEmail
};
