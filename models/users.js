const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    groupId: String,
    role:String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
