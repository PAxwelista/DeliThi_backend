var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");

const Delivery = require("../models/deliveries");

router.get("/", async (req, res) => {
    const deliveries = await Delivery.find().populate({
        path: "orders",
        populate: { path: ["products.product", "customer"] },
    });
    res.status(200).json({ result: true, deliveries });
});

router.get("/:id/allProducts", async (req, res) => {
    if (!req.params.id) return res.status(400).json({ result: false, error: "Missing or empty fields" });

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

    const reducedData = filteredData.flat().reduce((a, { name, quantity }) => {
        const existing = a.find(item => item.name === name);
        existing ? (existing.quantity += quantity) : a.push({ name, quantity });
        return a;
    }, []);

    res.status(200).json({ result: true, totalProduct: reducedData });
});

router.get("/actualDelivery", async (req, res) => {
    const deliveries = await Delivery.findOne({ state: "processing" }).populate({
        path: "orders",
        populate: { path: ["products.product", "customer"] },
    });

    if (!deliveries) return res.status(404).json({ result: false });

    res.status(200).json({ result: true, data: deliveries });
});

router.post("/", async (req, res) => {
    const { ordersID } = req.body;

    if (!checkBody(req.body, ["ordersID"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const newDelivery = new Delivery({
        orders: ordersID,
        deliveryDate: new Date(),
        state: "pending",
    });

    const data = await newDelivery.save();

    const dataPopulate = await data.populate({
        path: "orders",
        populate: { path: ["products.product", "customer"] },
    });

    res.status(201).json({ result: true, data: dataPopulate });
});

router.patch("/state", async (req, res) => {
    const { newState, deliveryID } = req.body;

    if (!checkBody(req.body, ["newState", "deliveryID"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });
  
    const data = await Delivery.updateOne({ _id: deliveryID }, { state: newState });

    if (!data.modifiedCount) return  res.status(404).json({result : false , data})

    res.status(200).json({ result: true, data });
});

router.patch("/:ID/removeOrder/:orderID" , async (req,res) =>{
    const {ID,orderID} = req.params

    const data = await Delivery.updateOne({ _id: ID }, { $pull: { orders: orderID} });

    if (!data.modifiedCount) return  res.status(404).json({result : false , data})

    res.status(200).json({result : true , data})
})

module.exports = router;
