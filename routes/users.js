var express = require("express");
var router = express.Router();
const {
    checkBody,
    jsonResponse,
    createCodeAndExpireDate,
    buildLoginData,
    createExactRegexInsensitive,
    isValidEmail,
} = require("../modules");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const sendLoginCode = require("../emails/sendLoginCode");
const { deleteUser } = require("../services/userService");

const User = require("../models/users");
const Group = require("../models/groups");

router.post("/signIn", async (req, res) => {
    const { username, password } = req.body;
    if (!checkBody(req.body, ["username", "password"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const user = await User.findOne({ username: createExactRegexInsensitive(username) });

    if (user && bcrypt.compareSync(password, user.password)) {
        if (!user.emailVerified) {
            const { data: dataSendLoginCode, error } = await sendLoginCode(user.email, user.loginCode.code);
            if (error) {
                return jsonResponse(res, {
                    result: false,
                    code: error.statusCode,
                    error: error?.message || error?.error,
                });
            }

            return jsonResponse(res, { result: true, key: "login", data: { _id: user._id, emailVerified: false } });
        }

        res.status(200).json({
            result: true,
            login: buildLoginData(user),
        });
    } else {
        res.status(400).json({ result: false, error: "Password wrong or username doesn't exist" });
    }
});

router.post("/signUp", async (req, res) => {
    const { username, password, token, email } = req.body;
    const isNewGroup = !token;
    if (!checkBody(req.body, ["username", "password", "email"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    if (!isValidEmail(email)) return res.status(400).json({ result: false, error: "Email is not valid" });

    const UserData = await User.findOne({
        $or: [
            {
                username: createExactRegexInsensitive(username),
            },
            {
                email: createExactRegexInsensitive(email),
            },
        ],
    });

    if (UserData) return res.status(409).json({ result: false, error: "Username or email already used" });

    const newUser = User({
        username,
        password: bcrypt.hashSync(password, 10),
        role: isNewGroup ? "admin" : "user",
        emailVerified: false,
        email,
    });

    const data = await newUser.save();

    let group;

    if (isNewGroup) {
        const newGroup = Group({ adminId: data._id });

        const groupData = await newGroup.save();

        group = groupData._id;
    } else {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            group = decoded.groupId;
        } catch (err) {
            return res.status(403).json({ result: false, error: "Invalid token" });
        }
    }

    const updateGroupData = await User.updateOne({ _id: data._id }, { group });

    res.status(201).json({
        result: true,
        data,
    });
});

router.post("/sendNewEmailVerifCode", async (req, res) => {
    const { username } = req.body;

    if (!checkBody(req.body, ["username"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const user = await User.findOne({ username });

    const loginCode = createCodeAndExpireDate();

    const { data: loginData, error } = await sendLoginCode(user.email, loginCode.code);

    const data = await User.updateOne({ username }, { loginCode });

    if (error)
        return jsonResponse(res, {
            result: false,
            code: error.statusCode,
            error: error.message,
        });

    jsonResponse(res, {
        data,
    });
});

router.post("/verifyEmail", async (req, res) => {
    const { username, code } = req.body;

    if (!checkBody(req.body, ["code", "username"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    try {
        const user = await User.findOne({ username });

        if (!user) return jsonResponse(res, { result: false, code: 404, error: "Not any user with this ID" });

        const { loginCode } = user;

        if (code != loginCode.code || new Date() > loginCode.expiresAt)
            return jsonResponse(res, { result: false, code: 400, error: "Expired or incorrect code" });

        const data = await User.updateOne({ username }, { emailVerified: true });
        res.status(200).json({
            result: true,
            data,
            login: buildLoginData(user),
        });
    } catch (error) {
        return jsonResponse(res, { result: false, code: 500, error });
    }
});

router.delete("/", async (req, res) => {
    if (!checkBody(req.body, ["username", "password"]))
        return jsonResponse(res, { result: false, error: "Missing or empty fields", code: 400 });

    const deleteData = await deleteUser(req.body.username, req.body.password);

    if (deleteData.result) {
        return jsonResponse(res, {});
    }
    return jsonResponse(res, { result: false, error: deleteData.error, code: 403 });
});

router.patch("/updateEmail", async (req, res) => {
    if (!checkBody(req.body, ["username", "email"]))
        return jsonResponse(res, { result: false, error: "Missing or empty fields", code: 400 });

    const { username, email } = req.body;

    if (!isValidEmail(email)) return res.status(400).json({ result: false, error: "Email is not valid" });

    const UserData = await User.findOne({
        email: createExactRegexInsensitive(email),
    });

    if (UserData) return res.status(400).json({ result: false, error: "Email already used" });

    const data = await User.updateOne({ username }, { email, emailVerified: false });

    if (data.matchedCount === 0)
        return jsonResponse(res, { result: false, error: "Nobody with this username", code: 400 });

    return jsonResponse(res, { data });
});

module.exports = router;
