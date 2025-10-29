var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const { auth } = require("../middlewares");
const {
    getAllDeliveries,
    getDelivery,
    getDeliveryProducts,
    getActualDelivery,
    createDelivery,
    updateState,
    removeOrders,
    deleteDelivery,
} = require("../services/deliveries");
const { updateOrdersInfos } = require("../services/orders");

router.use(auth);

router.get("/", async (req, res) => {
    const { group } = req;
    const deliveries = await getAllDeliveries(group);
    res.status(200).json({ result: true, deliveries });
});

router.get("/:id/allProducts", async (req, res) => {
    //the problem is right here, one time the id is undefined so this broke everthing. Maybe I have to put a middleware that test the id
    if (!req.params.id) return res.status(400).json({ result: false, error: "Missing or empty fields" });
    const totalProduct = await getDeliveryProducts(req.params.id);
    res.status(200).json({ result: true, totalProduct });
});

router.get("/actualDelivery", async (req, res) => {
    const { group } = req;

    const deliveries = await getActualDelivery(group);

    if (!deliveries) return res.status(404).json({ result: false });

    res.status(200).json({ result: true, data: deliveries });
});

router.post("/", async (req, res) => {
    const { group } = req;
    const { ordersID } = req.body;

    const data = await createDelivery(group, ordersID);

    if (!checkBody(req.body, ["ordersID"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    res.status(201).json({ result: true, data });
});

router.patch("/state", async (req, res) => {
    const { newState, deliveryID } = req.body;

    if (!checkBody(req.body, ["newState", "deliveryID"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const data = await updateState(deliveryID, newState);

    if (!data.modifiedCount) return res.status(404).json({ result: false, data });

    res.status(200).json({ result: true, data });
});

router.patch("/:ID/removeOrders", async (req, res) => {
    const { ID } = req.params;
    const { ordersID } = req.body;

    if (!ordersID) return res.status(400).json({ result: false, error: "ordersID required" });

    const deliveryData = await removeOrders(ID, ordersID);

    if (!deliveryData.modifiedCount) return res.status(404).json({ result: false, data });

    const delivery = await getDelivery(ID);

    if (delivery.orders.length === 0) await deleteDelivery(ID);

    const orderData = await updateOrdersInfos(ordersID, { state: "pending" });

    res.status(200).json({ result: true, data: { deliveryData, orderData } });
});

module.exports = router;
