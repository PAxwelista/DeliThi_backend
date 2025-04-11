var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");

const Delivery = require("../models/deliveries");

router.get("/", async (req, res) => {
    const data = await Delivery.find();
    res.status(200).json({ result: true, data });
});

router.get("/:id/allProducts", async (req, res) => {
    const data = await Delivery.findById(req.params.id).populate({
        path: "orders",
        populate: { path: "products.product" },
    });

    const filteredData = await data.orders.map(order =>
        order.products.map(product => {
            return {
                name: product.product.name,
                quantity: product.quantity,
            };
        })
    );
    console.log(filteredData.flat());

    const reducedData = filteredData
        .flat()
        .reduce((a, {name, quantity}) => (a[name] ? (a[name].quantity += quantity) : (a[name] = {name , quantity}) , a), {});

    res.status(200).json({ result: true, totalProduct: reducedData });
});

router.post("/", async (req, res) => {
    const { ordersID } = req.body;

    if (!checkBody(req.body, ["ordersID"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const newDelivery = new Delivery({
        orders: ordersID,
        deliveryDate: new Date(),
    });

    const data = await newDelivery.save();

    res.status(201).json({ result: true, data });
});

module.exports = router;
