const mongoose = require("mongoose");

const code = mongoose.Schema({
    code: String,
    createdAt: Date,
    expiresAt: Date,
});
const userSchema = mongoose.Schema({
    username: String,
    password: String,
    group: { type: mongoose.Schema.Types.ObjectId, ref: "group" },
    role: String,
    emailVerified: Boolean,
    email: String,
    loginCode: code,
    forgetPasswordCode : code
});

const User = mongoose.model("users", userSchema);

module.exports = User;
