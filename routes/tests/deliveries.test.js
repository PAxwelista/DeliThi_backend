const request = require("supertest");
const app = require("../../app");
const Order = require("../../models/orders");
const Product = require("../../models/products");

describe("Deliveries route", () => {
    let deliveryID;
    let ordersID;
    const product = { name: "productName", price: 3 };
    describe("POST /", () => {
        

        let order = { products: [], orderer: "Axel", customerId: "1", area: "area" };

        beforeAll(async () => {
            const newProduct = new Product(product);
            const productData = await newProduct.save();
            order.products[0] = { product: productData._id, quantity: 3 };

            const newOrder = new Order(order);

            const data = await newOrder.save();
            ordersID = [data._id];
        });

        it("should not create a new delivery without ordersId", async () => {
            const res = await request(app).post("/deliveries/").set("Authorization", `Bearer test`).expect(400);

            expect(res.result).toBeFalsy();
        });

        it("should create a new delivery", async () => {
            const res = await request(app)
                .post("/deliveries/")
                .send({ ordersID })
                .set("Authorization", `Bearer test`)
                .expect(201);

            expect(res.body.result).toBeTruthy();

            expect(res.body.data.orders[0].orderer).toBe(order.orderer);

            deliveryID = res.body.data._id;
        });
    });

    describe("GET /", () => {
        it("should get all deliveries from group", async () => {
            const res = await request(app).get("/deliveries/").set("Authorization", `Bearer test`).expect(200);

            expect(res.body.result).toBeTruthy();

            expect(res.body.deliveries.length).toBeGreaterThan(0);
        });
    });

    describe("GET /:id/allProduct", () => {
        it("should return all products names for a delivery", async () => {
            const res = await request(app)
                .get(`/deliveries/${deliveryID}/allProducts`)
                .set("Authorization", `Bearer test`)
                .expect(200);

            expect(res.body).toBeTruthy();

            expect(res.body.totalProduct[0]).toEqual({ name: product.name, quantity: 3 });
        });
    });

    describe("PATCH /state" ,()=>{
        it("should change the state of a delivery" , async()=>{

            const send ={newState:"processing" , deliveryID}

            const res = await request(app)
            .patch(`/deliveries/state`)
            .send(send)
            .set("Authorization", `Bearer test`)
            .expect(200);

            expect(res.body.result).toBeTruthy()

        })
    })

    describe("GET /actualDelivery", () => {
        it("should get the actualDelivery", async () => {

            const res = await request(app)
                .get(`/deliveries/actualDelivery`)
                .set("Authorization", `Bearer test`)
                .expect(200);

                expect(res.body.result).toBeTruthy()
                expect(res.body.data._id).toBe(deliveryID)

        });
    });

    describe("PATCH /:ID/removeOrder/:orderID" , ()=>{
        it("should remove an order" , async()=>{
            const res = await request(app)
            .patch(`/deliveries/${deliveryID}/removeOrder/${ordersID[0]}`)
            .set("Authorization", `Bearer test`)
            .expect(200)

            expect(res.body.result).toBeTruthy()
        })
    })
});
