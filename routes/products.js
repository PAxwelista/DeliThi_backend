var express = require("express");
var router = express.Router();
const { checkBody, createExactRegexInsensitive } = require("../modules");
const { auth } = require("../middlewares");

const Product = require("../models/products");

router.use(auth);

router.get("/", async (req, res) => {
    const { group } = req;
    const data = await Product.find({ group });
    res.json({ products: data });
});

//not really usefull
router.get("/:product", async (req, res) => {
    const { group } = req;
    const data = await Product.findOne({ group, name: createExactRegexInsensitive(req.params.product) });
    res.status(200).json({ product: data });
});

router.post("/", async (req, res) => {
    const { group } = req;
    const { name, price } = req.body;

    if (!checkBody(req.body, ["name", "price"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });
    const data = await Product.findOne({ group, name });

    if (data) return res.status(409).json({ result: false, error: "Product already exist" });

    const newProduct = new Product({ name, price, group });

    newDoc = await newProduct.save();
    res.status(201).json({ result: true, data: newDoc });
});

router.delete("/:product", async (req, res) => {
    const { group } = req;
    await Product.deleteOne({ group, name: req.params.name });

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
