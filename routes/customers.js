var express = require("express");
var router = express.Router();

const Customer = require("../models/customers");

router.get("/:customer", async (req, res) => {
    data = await Customer.findOne({name : req.params.customer});
    res.json({ product: data });
});

router.post("/", async (req, res) => {
    const newCustomer = new Customer({
        name: "test",
        location: {
            name: "here",
            area: "ZoneB",
            latitude: 34,
            longitude: 42,
        },
        phoneNumber: "06",
    });
    data = await newCustomer.save()
    res.json({result : true , data})
});

module.exports = router;
