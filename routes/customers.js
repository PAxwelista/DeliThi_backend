var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");

const Customer = require("../models/customers");

router.get("/:customer", async (req, res) => {
    data = await Customer.findOne({ name: {"$regex" : req.params.customer , $options : 'i' }});
    res.status(200).json({ customer: data });
});

router.post("/", async (req, res) => {
    const { name, locationName, area, phoneNumber } = req.body;

    if (!checkBody(req.body, ["name", "locationName", "area"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    if ((test = await Customer.findOne({ name  : {"$regex" : name , $options : 'i' }})))
        return res.status(409).json({ result: false, error: "This customer name already exist" });

    const locationData = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${locationName}`);
    const location = await locationData.json();

    const newCustomer = new Customer({
        name: name,
        location: {
            name: locationName,
            area: area,
            longitude: location.features[0].geometry.coordinates[0],
            latitude: location.features[0].geometry.coordinates[1],
        },
        phoneNumber: phoneNumber,
    });
    data = await newCustomer.save();
    res.status(201).json({ result: true, data });
});

module.exports = router;
