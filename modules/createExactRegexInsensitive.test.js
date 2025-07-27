const { createExactRegexInsensitive } = require("./");

describe("createExactRegexInsensitive", () => {
    it("should return a correct regex", () => {});

    expect(createExactRegexInsensitive("hello")).toMatchObject({"$options": "i", "$regex": "^hello$"})


});
