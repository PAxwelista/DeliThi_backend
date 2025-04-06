var express = require("express");
var router = express.Router();

const Product = require("../models/products");

router.get("/", (req, res) => {
    Product.find().then(data => res.json({ products: data }));
});

//not really usefull
router.get("/:product", async (req, res) => {
    Product.findOne(req.params.product);
    res.json({ product: data });
});

router.post("/", async (req, res) => {
    const newProduct = new Product({
        name: req.body.name,
    });
    newDoc = await newProduct.save();
    console.log(newDoc);
    res.json({ result: true });
});

router.delete("/:product", async (req, res) => {
    await Product.deleteOne({ name: req.params.name });

    res.json({ result: true });
});

module.exports = router;
