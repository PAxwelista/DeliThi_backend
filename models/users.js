const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    group: { type: mongoose.Schema.Types.ObjectId, ref: "group" },
    role: String,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
