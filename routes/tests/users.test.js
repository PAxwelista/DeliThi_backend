const request = require("supertest");
const app = require("../../app");
const User = require("../../models/users");

describe("Users routes", () => {
    const user1 = { username: "Axel", password: "test", email: "madotto.Axel@gmail.com" };
    const user1ToSignIn = Object.assign({}, user1);
    delete user1ToSignIn.email;

    describe("POST /signUp", () => {
        Object.keys(user1).forEach(key => {
            it(`should not signUp without a ${key}`, async () => {
                const res = await request(app)
                    .post("/users/signUp")
                    .send({ ...user1, [key]: "" })
                    .expect(400);

                expect(res.body.result).toBeFalsy();
            });
        });

        it("should signUp user1", async () => {
            const res = await request(app).post("/users/signUp").send(user1).expect(201);

            expect(res.body.result).toBeTruthy();
        });
    });

    describe("POST /sendNewEmailVerifCode", () => {
        it("should not send a new verif email without email", async () => {
            const res = await request(app).post("/users/sendNewEmailVerifCode").send({}).expect(400);

            expect(res.body.result).toBeFalsy();
        });

        it("should send a new verif email", async () => {
            const res = await request(app)
                .post("/users/sendNewEmailVerifCode")
                .send({ username: user1.username })
                .expect(200);

            expect(res.body.result).toBeTruthy();
        });
    });

    describe("POST /signIn", () => {
        Object.keys(user1ToSignIn).forEach(key => {
            it(`should not sign without ${key}`, async () => {
                const res = await request(app)
                    .post("/users/signIn")
                    .send({ ...user1ToSignIn, [key]: "" })
                    .expect(400);

                expect(res.body.result).toBeFalsy();
            });
        });

        it("should signIn user1 with the correct values", async () => {
            const res = await request(app).post("/users/signIn").send(user1ToSignIn).expect(200);

            expect(res.body.result).toBeTruthy();
        });
    });

    describe("POST /verifyEmail", () => {
        it("should verify email", async () => {
            const code = (await User.findOne({ username: user1.username })).loginCode.code;

            const res = await request(app)
                .post("/users/verifyEmail")
                .send({ username: user1.username, code })
                .expect(200);

            expect(res.body.result).toBeTruthy();
        });
    });

    describe("PATCH /updateEmail", () => {
        it("should update the email", async () => {
            const newEmail = "test@gmail.com";

            const res = await request(app)
                .patch("/users/updateEmail")
                .send({ username: user1.username, email: newEmail })
                .expect(200);

            expect(res.body.result).toBeTruthy();

            const user = await User.findOne({ username: user1.username });

            expect(user.email).toBe(newEmail);
        });
    });

    describe("DELETE /", () => {
        Object.keys(user1ToSignIn).forEach(key => {
            it(`should not delete the user1 without ${key}`, async () => {
                const res = await request(app)
                    .delete("/users")
                    .send({ ...user1ToSignIn, [key]: "" })
                    .expect(400);

                expect(res.body.result).toBeFalsy();
            });
        });
        it("should delete the user1", async () => {
            const res = await request(app).delete("/users").send(user1ToSignIn).expect(200);

            expect(res.body.result).toBeTruthy();
        });
    });
});
