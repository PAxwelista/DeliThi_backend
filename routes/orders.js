var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");

const Order = require("../models/orders");

router.get("/", async (req, res) => {
    const { area, state } = req.query;
    const filter = {};
    area && (filter.area = area);
    state && (filter.state = state);
    const data = await Order.find(state).populate("customer")
    const filteredData = await data.filter(v=> v.customer.location.area === area)
    res.status(200).json({ orders: filteredData });
});

router.get("/allAreas", async (req, res) => {
    let areas = [];
    const data = await Order.find().populate("customer");
    console.log(data);
    areas = data.map(v => v.customer.location.area);

    res.status(200).json({ areas: [...new Set(areas)] }); // supprimer les doublons
});

router.post("/", async (req, res) => {
    const { products, deliveryDate, orderer, customerId } = req.body;

    if (!checkBody(req.body, ["products", "deliveryDate", "orderer", "customerId"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const newOrder = new Order({
        products,
        deliveryDate,
        orderer,
        state: "pending",
        customer: customerId,
    });

    const data = await newOrder.save();

    res.status(201).json({ result: true, data });
});

router.patch("/:id/state", async (req, res) => {
    const orderId = req.params.id;
    const { newState } = req.body;

    const data = await Order.updateOne({ _id: orderId }, { state: newState });

    res.status(200).json({ result: true, data });
});

module.exports = router;
