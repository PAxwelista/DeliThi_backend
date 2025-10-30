var express = require("express");
var router = express.Router();
const { checkBody, jsonResponse } = require("../modules");
const { auth } = require("../middlewares");
const { getOrders, getAllOrderAreas,getAllOrderAreasObj, createOrder,updateOrdersInfos } = require("../services/orders");

router.use(auth);

router.get("/", async (req, res) => {
    const { group } = req;
    const { area, state } = req.query;

    const orders = await getOrders(group, { area, state });

    res.status(200).json({ result: true, orders });
});

router.get("/allAreas", async (req, res) => {
    const { group } = req;
    const areas = await getAllOrderAreas(group);
    const areasObj = await getAllOrderAreasObj(group)

    res.status(200).json({ result: true, areas,areasObj });
});

router.get("/filter", async (req, res) => {
    const { group } = req;
    const { beginAt, endAt, area, product } = req.query;

    let data = await getOrders(group, { beginAt, endAt, area, product });

    jsonResponse(res, { data });
});

router.post("/", async (req, res) => {
    const { group } = req;

    const { products, orderer, customerId, area } = req.body;

    if (!checkBody(req.body, ["products", "orderer", "customerId", "area"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const data = await createOrder(group, { products, orderer, customerId, area });

    res.status(201).json({ result: true, data });
});

router.patch("/state", async (req, res) => {
    const { newState, ordersID } = req.body;

    if (!checkBody(req.body, ["newState", "ordersID"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    await updateOrdersInfos(ordersID, { state: newState });

    res.status(200).json({ result: true });
});

router.patch("/deliveryDate", async (req, res) => {
    const { newDeliveryDate, ordersID } = req.body;

    if (!checkBody(req.body, ["newDeliveryDate", "ordersID"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });
    const data = await updateOrdersInfos(ordersID, { deliveryDate: newDeliveryDate });

    res.status(200).json({ result: true, data });
});

router.patch("/:id", async (req, res) => {
    const { area, deliveryDate, state, amountPaid } = req.body;
    const updateData = { area, deliveryDate, state, amountPaid };

    const data = await updateOrdersInfos([req.params.id], updateData);

    res.status(200).json({ result: true, data });
});

module.exports = router;
