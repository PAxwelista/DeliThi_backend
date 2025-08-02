const User = require("../models/users");
const Group = require("../models/groups");
const Customer = require("../models/customers");
const Delivery = require("../models/deliveries");
const Order = require("../models/orders");
const Product = require("../models/products");
const { authenticate } = require("./authService");

const deleteUser = async (username, password) => {
    const { user } = await authenticate(username, password);

    if (!user) return { result: false, error: "User not find or wrong password" };

    const group = user.group;

    await User.deleteOne({ username });

    if (user.role != "admin") return { result: true };

    const othersUserInGroup = await User.find({ group });

    if (othersUserInGroup.length > 0) {
        await User.updateOne({ _id: othersUserInGroup[0]._id }, { role: "admin" });
    } else {
        await Group.deleteOne({ _id: group });
        await Customer.deleteMany({ group });
        await Delivery.deleteMany({ group });
        await Order.deleteMany({ group });
        await Product.deleteMany({ group });
    }

    return { result: true };
};

module.exports = { deleteUser };
