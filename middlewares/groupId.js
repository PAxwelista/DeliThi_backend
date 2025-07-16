function groupId(req, res, next) { // replace by auth.js
    const groupId = req.headers["group-id"];

    if (!groupId) {
        return res.status(400).json({result :false ,  error: "Missing group-id" });
    }

    req.groupId = groupId;
    next();
}

module.exports = { groupId };
