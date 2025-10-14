var express = require("express");
var router = express.Router();
const { checkBody, jsonResponse, createExactRegexInsensitive } = require("../modules");
const { auth } = require("../middlewares");

const Customer = require("../models/customers");

router.use(auth);

router.get("/", async (req, res) => {
    const { group } = req;
    data = await Customer.find({ group });

    jsonResponse(res, {
        data,
        key: "customers",
    });
});

router.get("/:customer", async (req, res) => {
    const { group } = req;
    data = await Customer.findOne({ group, name: createExactRegexInsensitive(req.params.customer) });

    jsonResponse(res, {
        data,
        key: "customer",
    });
});

router.post("/", async (req, res) => {
    const { group } = req;
    const { name, locationName, area, phoneNumber, email } = req.body;
    if (!checkBody(req.body, ["name", "locationName", "area"]))
        return jsonResponse(res, { result: false, error: "Missing or empty fields", code: 400 });

    if ((test = await Customer.findOne({ name: createExactRegexInsensitive(name) })))
        return jsonResponse(res, { result: false, error: "This customer name already exist", code: 409 });

    const locationData = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${locationName}`);
    const location = await locationData.json();

    const newCustomer = new Customer({
        name,
        location: {
            name: locationName,
            area,
            longitude: location.features[0].geometry.coordinates[0],
            latitude: location.features[0].geometry.coordinates[1],
        },
        phoneNumber,
        email,
        group,
    });
    data = await newCustomer.save();

    jsonResponse(res, {
        data,
        code: 201,
    });
});

router.patch("/:id", async (req, res) => {
    const { name, locationName, area, email, phoneNumber } = req.query;
    const { id } = req.params;

    const updateData = { location: {} };

    if (!name && !locationName && !area && !email && !phoneNumber)
        return jsonResponse(res, { result: false, error: "Not any infos to changes", code: 400 });

    if (name) {
        updateData.name = name;
    }

    if (locationName) {
        const locationData = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${locationName}`);
        const location = await locationData.json();
        updateData.location.name = locationName;
        updateData.location.longitude = location?.features?.[0]?.geometry.coordinates[0];
        updateData.location.latitude = location?.features?.[0]?.geometry.coordinates[1];
    }

    if (area) {
        updateData.location.area = area;
    }
    if (email) {
        updateData.email = email;
    }
    if (phoneNumber) {
        updateData.phoneNumber = phoneNumber;
    }

    const data = await Customer.updateOne({ _id: id }, { $set: updateData });

    jsonResponse(res, { data });
});

module.exports = router;
