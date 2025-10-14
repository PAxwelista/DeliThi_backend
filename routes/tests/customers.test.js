const request = require("supertest");
const app = require("../../app");
const Customer = require("../../models/customers");

describe("Customers routes", () => {
    const customer = { name: "Bob", locationName: "1 rue de la stockholm Paris", area: "Paris" };
    let customerId;

    describe("POST /", () => {
        Object.keys(customer).forEach(key => {
            it(`should not create a new customer without ${key}`, async () => {
                const res = await request(app)
                    .post("/customers/")
                    .send({ ...customer, [key]: "" })
                    .set("Authorization", `Bearer test`)
                    .expect(400);

                expect(res.body.result).toBeFalsy();
            });
        });

        it("should not create a new customer without bearer authorization", async () => {
            await request(app).post("/customers/").send(customer).expect(401);
        });

        it("should create a new customer", async () => {
            const res = await request(app)
                .post("/customers/")
                .send(customer)
                .set("Authorization", `Bearer test`)
                .expect(201);

            expect(res.body.result).toBeTruthy();

            customerId = res.body.data._id;
        });
    });

    describe("GET /", () => {
        it("should not get all customers without bearer authorization", async () => {
            await request(app).get("/customers/").send(customer).expect(401);
        });

        it("should get all customers", async () => {
            const res = await request(app).get("/customers/").set("Authorization", `Bearer test`).expect(200);

            const dbCustomers = res.body.customers;

            expect(dbCustomers.length).toBeGreaterThan(0);
            expect(dbCustomers[0].name).toBe(customer.name);
        });
    });

    describe("GET /:customer", () => {
        it("should not get the customer without bearer authorization", async () => {
            await request(app).get(`/customers/${customer.name}`).send(customer).expect(401);
        });

        it("should get a customer with his name", async () => {
            const res = await request(app)
                .get(`/customers/${customer.name}`)
                .set("Authorization", `Bearer test`)
                .expect(200);
            expect(res.body.customer.name).toBe(customer.name);
        });
    });

    describe("PATCH /:id", () => {
        const newCustomerInfos = {
            name: { value: "Eric", finalKey: "name" },
            locationName: { value: "1 rue de la paix Paris", finalKey: "location.name" },
            area: { value: "New area", finalKey: "location.area" },
            email: { value: "newEmail@gmail.com", finalKey: "email" },
            phoneNumber: { value: "304", finalKey: "phoneNumber" },
        };

        it("should not get all customers without bearer authorization", async () => {
            await request(app).patch("/customers/test").send(customer).expect(401);
        });

        Object.entries(newCustomerInfos).forEach(([key, value]) => {
            it(`should change ${key}`, async () => {
                const res = await request(app)
                    .patch(`/customers/${customerId}`)
                    .query({ [key]: value.value })
                    .set("Authorization", `Bearer test`)
                    .expect(200);

                expect(res.body.result).toBeTruthy();

                const customerWithChanges = await Customer.findOne({ _id: customerId });

                const newCustValue = value.finalKey.split(".").reduce((obj,part)=>obj?.[part] , customerWithChanges) 

                expect(newCustValue).toBe(newCustomerInfos[key].value);
            });
        });
    });
});
