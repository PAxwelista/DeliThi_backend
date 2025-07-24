const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function generateUserToken(user , expiresIn) {
    
    return jwt.sign({ id: user._id , groupId : user.group }, JWT_SECRET, { expiresIn });
}

module.exports = { generateUserToken };
