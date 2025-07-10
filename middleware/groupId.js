function groupId(req, res, next) {
    const groupId = req.headers["group-id"];

    if (!groupId) {
        return res.status(400).json({result :false ,  error: "Missing groupeId" });
    }

    req.groupId = groupId;

    next();
}

module.exports = { groupId };
