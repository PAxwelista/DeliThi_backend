const { isValidEmail } = require("./");

describe("isValidEmail", () => {
    it("should return false with a uncorrect email", () => {
        const emails = ["DUMMY" , "DUMMY@" , "DUMMY@helloYou." , "DUMMYger.com" , "DUMMY@a.c"]

        emails.forEach(email=>expect(isValidEmail(email)).toBe(false))

        
    });
    it("should return true with a correct email", () => {
        const email = "DUMMY@gmail.com"

        expect(isValidEmail(email)).toBe(true);
    });
});
