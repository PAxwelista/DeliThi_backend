const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    capacity: Number,
    group: { type: mongoose.Schema.Types.ObjectId, ref: "group" },
});

const Product = mongoose.model("products", productSchema);

module.exports = Product;
