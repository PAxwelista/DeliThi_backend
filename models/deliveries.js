const mongoose = require("mongoose");

const deliverySchema = mongoose.Schema({
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "orders" }],
    deliveryDate : Date,
    state : String,
});

const Delivery = mongoose.model("deliveries", deliverySchema);

module.exports = Delivery;
