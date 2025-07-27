const createExactRegexInsensitive = word => {
    return { $regex: `^${word}$`, $options: "i" };
};

module.exports = { createExactRegexInsensitive };
