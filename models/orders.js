const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
    quantity: Number,
});

const orderSchema = mongoose.Schema({
    products: [productSchema],
    creationDate: Date,
    deliveryDate: Date,
    orderer: String,
    state: String,
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "customers" },
    area: String,
    groupId: String,
    amountPaid : Number,
});

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;
