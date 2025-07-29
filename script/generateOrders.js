const { faker } = require("@faker-js/faker");
const fs = require("fs");

const generateOrders = count => {
    const customers = Array.from({ length: count }, () => {
        const longitude = faker.location.longitude({ min: 4.082826, max: 5.822442 });
        const area = longitude > 5 ? "Zone 1" : "Zone 2";

        return {
            _id: { $oid: faker.string.hexadecimal({ length: 24, prefix: "" }) },
            name: faker.person.firstName() + " " + faker.person.lastName(),
            phoneNumber: faker.phone.number({ style: "international" }),
            location: {
                name: "location name",
                area,
                longitude: longitude,
                latitude: faker.location.latitude({ min: 48.767084, max: 49.307249 }),
            },
            group: { $oid: "6877c21e2849078caf344b43" },
        };
    });

    const orders = customers.map(customer => ({
        _id: { $oid: faker.string.hexadecimal({ length: 24, prefix: "" }) },
        customer: { $oid: customer._id },
        state: "pending",
        creationDate: faker.date.anytime(),
        deliveryDate: "",
        orderer: "Axel",
        area : customer.location.area,
        amountPaid: 0,
        products: [
            {
                _id: { $oid: faker.string.hexadecimal({ length: 24, prefix: "" }) },
                product: { $oid: "6877c62aaed17235608b5510" },
                quantity: 2,
            },
        ],
        group: { $oid: "6877c21e2849078caf344b43" },
    }));

    return { customers, orders };
};

const { orders, customers } = generateOrders(75);

fs.writeFileSync("./script/json/orders.json", JSON.stringify(orders, null, 2), "utf-8");

fs.writeFileSync("./script/json/customers.json", JSON.stringify(customers, null, 2), "utf-8");

console.log("✅ Fichiers générés");
