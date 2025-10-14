const request = require("supertest");
const app = require("../../app");
const Customer = require("../../models/customers");

describe("Orders routes", () => {
    const newOrder = { products: [], orderer: "Axel", area: "areaOrder" };

    beforeAll(async () => {
        const newCustomer = new Customer({
            name: "Bob",
            phoneNumber: "09",
            email: "Axe",
        });

        const data = await newCustomer.save();
        newOrder.customerId = data._id;
    });

    describe("POST /", () => {
        it("should send an new invite token", async () => {
            const res = await request(app)
                .post("/orders")
                .send(newOrder)
                .set("Authorization", `Bearer test`)
                .expect(201);

            expect(res.body.result).toBeTruthy();

            expect(res.body.data.area).toBe(newOrder.area)
        });
    });

    describe("GET /" , ()=>{
        it("should get all orders of the group" ,async ()=>{
            const res = await request(app)
                .get("/orders")
                .set("Authorization", `Bearer test`)
                .expect(200);

            expect(res.body.result).toBeTruthy()

            expect(res.body.orders[0].area).toBe(newOrder.area)
        })
    })

    describe("GET /allAreas" ,()=>{
        it("should return all areas available for the group" , async()=>{

            const res = await request(app)
            .get(`/orders/allAreas`)
            .set("Authorization", `Bearer test`)
            .expect(200);
            
            expect(res.body.result).toBeTruthy()

        expect(res.body.areas).toContain(newOrder.area)


        })
    })

    describe("GET /filter" , ()=>{
        it("should return orders depend of the filter" ,async ()=>{
            const res = await request(app)
            .get(`/orders/filter?area=areaOrder`)
            .set("Authorization", `Bearer test`)
            .expect(200);

            expect(res.body.result).toBeTruthy()
            
        })
    })
});
