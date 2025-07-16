const mongoose = require("mongoose");

const groupSchema = mongoose.Schema({
    adminId : { type: mongoose.Schema.Types.ObjectId, ref: "users" }
});

const Group = mongoose.model("groups", groupSchema);

module.exports = Group;
