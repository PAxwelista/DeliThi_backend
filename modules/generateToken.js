const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function generateToken(user) {
    
    return jwt.sign({ id: user._id , groupId : user.group }, JWT_SECRET, { expiresIn: "24h" });
}

module.exports = { generateToken };
