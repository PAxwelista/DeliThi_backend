var express = require("express");
const { jsonResponse, generateUserToken } = require("../modules");
var router = express.Router();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/", async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return jsonResponse(res, { error: "Refresh token missing", code: 401, result: false });
    }

    try {
        const decoded = jwt.verify(refreshToken, JWT_SECRET);
        const newAccessToken = generateUserToken({_id : decoded.id , group :decoded.groupId } , process.env.ACCESS_TOKEN_EXPIRY);
        return jsonResponse(res, { data: newAccessToken, key: "accessToken" });
    } catch (error) {
        return jsonResponse(res, { error: error, code: 403, result: false });
    }
});

module.exports = router;
