var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const { groupId } = require("../middleware");

const Product = require("../models/products");

router.use(groupId);

router.get("/", async (req, res) => {
    const { groupId } = req;
    const data = await Product.find({ groupId });
    res.json({ products: data });
});

//not really usefull
router.get("/:product", async (req, res) => {
    const { groupId } = req;
    const data = await Product.findOne({ groupId, name: { $regex: req.params.product, $option: "i" } });
    res.status(200).json({ product: data });
});

router.post("/", async (req, res) => {
    const { groupId } = req;
    const { name, price } = req.body;
    if (!checkBody(req.body, ["name", "groupId"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const data = await Product.findOne({ groupId, name: { $regex: name, $options: "i" } });

    if (data) return res.status(409).json({ result: false, error: "Product already exist" });

    const newProduct = new Product({ name, price, groupId });

    newDoc = await newProduct.save();
    res.status(201).json({ result: true });
});

router.delete("/:product", async (req, res) => {
    const {groupId} = req
    await Product.deleteOne({groupId, name: req.params.name });

    res.status(200).json({ result: true });
});

router.patch("/:id", async (req, res) => {
    const { name, price } = req.query;
    const updateData = {};

    if (name) {
        updateData.name = name;
    }

    if (price) {
        updateData.price = price;
    }

    const data = await Product.updateOne({ _id: req.params.id }, { $set: updateData });

    res.status(200).json({ result: true, data });
});

module.exports = router;
