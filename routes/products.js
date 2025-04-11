var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");

const Product = require("../models/products");

router.get("/", async (req, res) => {
    const data = await Product.find();
    res.json({ products: data });
});

//not really usefull
router.get("/:product", async (req, res) => {
    const data = await Product.findOne({ name: { $regex: req.params.product, $option: "i" } });
    res.status(200).json({ product: data });
});

router.post("/", async (req, res) => {
    const { name } = req.body;
    if (!checkBody(req.body, ["name"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    const data = await Product.findOne({ name: { $regex: name, $options: "i" } });

    if (data) return res.status(409).json({ result: false, error: "Product already exist" });

    const newProduct = new Product({ name });

    newDoc = await newProduct.save();
    res.status(201).json({ result: true });
});

router.delete("/:product", async (req, res) => {
    await Product.deleteOne({ name: req.params.name });

    res.status(200).json({ result: true });
});

module.exports = router;
