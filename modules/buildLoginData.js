const { generateUserToken } = require("./generateUserToken");
const buildLoginData = user => {
    return {
        username: user.username,
        token: generateUserToken(user, process.env.ACCESS_TOKEN_EXPIRY),
        refreshToken: generateUserToken(user, process.env.REFRESH_TOKEN_EXPIRY),
        role: user.role,
    };
};

module.exports = { buildLoginData };
