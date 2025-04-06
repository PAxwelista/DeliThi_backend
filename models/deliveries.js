const mongoose = require("mongoose");

const deliverySchema = mongoose.Schema({
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "orders" }],
    deliveryDate : Date,
});

const Delivery = mongoose.model("deliveries", deliverySchema);

module.exports = Delivery;
