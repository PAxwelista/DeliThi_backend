const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
    name: String,
    area: String,
    latitude: Number,
    longitude: Number,
});

const customerSchema = mongoose.Schema({
    name: String,
    location: locationSchema,
    phoneNumber: String,
});

const Customer = mongoose.model("customers", customerSchema);

module.exports = Customer;
