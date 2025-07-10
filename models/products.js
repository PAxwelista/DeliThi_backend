const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    groupId: String,
});

const Product = mongoose.model("products", productSchema);

module.exports = Product;
