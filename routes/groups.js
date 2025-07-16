var express = require("express");
var router = express.Router();
const { auth } = require("../middlewares");
const { jsonResponse } = require("../modules");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const Group = require("../models/groups");

router.use(auth);

router.get("/invite-token", async (req, res) => {
    const { id, group } = req;

    const userGroup = await Group.findOne({_id: group });

    if (!userGroup) 
        return jsonResponse(res, { result: false, error: "Not any group find with this id", code: 404 });

    if (id != userGroup.adminId)
        return jsonResponse(res, { result: false, error: "You are not the admin of the group", code: 403 });

    const token = jwt.sign({ groupId: group }, process.env.JWT_SECRET, { expiresIn: "1h" });

    jsonResponse(res, { data: token, key: "token" });
});

module.exports = router;
