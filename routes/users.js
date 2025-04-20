var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const bcrypt = require("bcrypt");

const User = require("../models/users");

router.post("/signIn", async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body)
    if (!checkBody(req.body, ["username", "password"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const data =  await User.findOne({ username  : {"$regex" : username , $options : 'i' }})

    if (data   && bcrypt.compareSync(password, data.password)) {
        res.status(200).json({ result: true });
    } else {
        res.status(400).json({ result: false , error : "Password wrong or username doesn't exist" });
    }
});

router.post("/signUp", async (req, res) => {
    const { username, password } = req.body;
    if (!checkBody(req.body, ["username", "password"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const UserData = await User.findOne({ username })

    if (UserData) return res.status(409).json({ result: false, error: "Username already used" });

    const newUser = User({
        username,
        password: bcrypt.hashSync(password, 10),
    });

    const data = await newUser.save();

    res.status(201).json({ result: true, data });
});

module.exports = router;
