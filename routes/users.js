var express = require("express");
var router = express.Router();
const { checkBody, generateToken } = require("../modules");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const User = require("../models/users");
const Group = require("../models/groups");

router.post("/signIn", async (req, res) => {
    const { username, password } = req.body;
    if (!checkBody(req.body, ["username", "password"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const user = await User.findOne({ username: { $regex: `^${username}$`, $options: "i" } });

    if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({
            result: true,
            login: { username: user.username, token: generateToken(user), role: user.role },
        });
    } else {
        res.status(400).json({ result: false, error: "Password wrong or username doesn't exist" });
    }
});

router.post("/signUp", async (req, res) => {
    const { username, password, token } = req.body;
    const isNewGroup = token === "";
    if (!checkBody(req.body, ["username", "password"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const UserData = await User.findOne({ username });

    if (UserData) return res.status(409).json({ result: false, error: "Username already used" });

    let group;

    const newUser = User({
        username,
        password: bcrypt.hashSync(password, 10),
        group,
        role: isNewGroup ? "admin" : "user",
    });

    const data = await newUser.save();

    if (isNewGroup) {
        const newGroup = Group({ adminId: data._id });

        const groupData = await newGroup.save();

        group = groupData._id;
    } else {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            group = decoded.groupId;
        } catch (err) {
            return res.status(403).json({ result: false, error: "Token invalide" });
        }
    }

    res.status(201).json({
        result: true,
        data,
        login: { username: data.username, token: generateToken(newUser), role: data.role },
    });
});

module.exports = router;
