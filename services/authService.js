const User = require("../models/users");
const { createExactRegexInsensitive } = require("../modules");
const bcrypt = require("bcrypt");

const authenticate = async (username, password) => {
    const user = await User.findOne({ username: createExactRegexInsensitive(username) });

    if (!user) return ({result : false , error: "User not find"})

    if (bcrypt.compareSync(password, user.password)){
        return {result : true , user}
    }
    else{
        return {result : false , error : "Wrong password"}
    }

};

module.exports = { authenticate };
