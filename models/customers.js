const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
    name: String,
    area: String,
    longitude: Number,
    latitude: Number,
});

const customerSchema = mongoose.Schema({
    name: String,
    location: locationSchema,
    phoneNumber: String,
    email: String,
    group: { type: mongoose.Schema.Types.ObjectId, ref: "group" },
});

const Customer = mongoose.model("customers", customerSchema);

module.exports = Customer;
