var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const { groupId } = require("../middleware");

const Customer = require("../models/customers");

router.use(groupId)

router.get("/", async (req, res) => {
    const { groupId } = req;
    data = await Customer.find({groupId});
    res.status(200).json({ customers: data });
});

router.get("/:customer", async (req, res) => {
    const { groupId } = req;
    data = await Customer.findOne({groupId, name: { $regex: req.params.customer, $options: "i" } });
    res.status(200).json({ customer: data });
});

//pas sur que ca serve finalement
// router.get("/:id", async (req, res) => {
//     data = await Customer.findById(req.params.id);
//     res.status(200).json({ customer: data });
// });

router.post("/", async (req, res) => {
    const { name, locationName, area, phoneNumber, email ,groupId } = req.body;
    if (!checkBody(req.body, ["name", "locationName", "area","groupId"]))
        return res.status(400).json({ result: false, error: "Missing or empty fields" });

    if ((test = await Customer.findOne({ name: { $regex: name, $options: "i" } })))
        return res.status(409).json({ result: false, error: "This customer name already exist" });

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
        groupId,
    });
    data = await newCustomer.save();
    res.status(201).json({ result: true, data });
});

router.patch("/:id/", async (req, res) => {
    const { name, locationName, area, email, phoneNumber } = req.query;
    const { id } = req.params;

    const updateData= {location : {}};

    if (!name && !locationName && !area && !email && !phoneNumber)
        return res.status(400).json({ result: false, error: "Not any infos to changes" });

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

    res.status(200).json({ result: true, data });
});

module.exports = router;
