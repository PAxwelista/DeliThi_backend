var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");

const Order = require("../models/orders");

router.get("/", async (req, res) => {
    const { area, state } = req.query;
    const data = await Order.find(state ? { state } : {})
        .populate("customer")
        .populate({ path: "products.product" });
    const filteredData = area ? data.filter(v => v.customer.location.area === area) : data;
    res.status(200).json({ orders: filteredData });
});

router.get("/allAreas", async (req, res) => {

    const data = await Order.find();
    const areas = data.map(v => v.area);

    res.status(200).json({ areas: [...new Set(areas)] }); // supprimer les doublons
});

router.post("/", async (req, res) => {
    const { products, orderer, customerId, area } = req.body;

    if (!checkBody(req.body, ["products", "orderer", "customerId", "area"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const newOrder = new Order({
        products,
        creationDate: new Date(),
        deliveryDate: null,
        orderer,
        state: "pending",
        customer: customerId,
        area,
    });

    const data = await newOrder.save();

    res.status(201).json({ result: true, data });
});

router.patch("/state", async (req, res) => {
    const { newState, ordersID } = req.body;

    if (!checkBody(req.body, ["newState", "ordersID"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const data = await Order.updateMany({ _id: { $in: ordersID } }, { state: newState });

    res.status(200).json({ result: true, data });
});

router.patch("/deliveryDate", async (req, res) => {
    const { newDeliveryDate, ordersID } = req.body;

    if (!checkBody(req.body, ["newDeliveryDate", "ordersID"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const data = await Order.updateMany({ _id: { $in: ordersID } }, { deliveryDate: newDeliveryDate });

    res.status(200).json({ result: true, data });
});

router.patch("/area", async (req, res) => {
    const { newArea, ordersID } = req.body;

    if (!checkBody(req.body, ["newArea", "ordersID"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const data = await Order.updateMany({ _id: { $in: ordersID } }, { area: newArea });

    res.status(200).json({ result: true, data });
});

module.exports = router;
