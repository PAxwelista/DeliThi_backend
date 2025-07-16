const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Token manquant" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        req.group = decoded.groupId;
        next();
    } catch (err) {
        res.status(403).json({ message: "Token invalide" });
    }
};

module.exports = {auth}; 
