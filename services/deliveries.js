const Delivery = require("../models/deliveries");
const { combineProducts, extractProductsFromOrders } = require("../modules");

const getAllDeliveries = group => {
    return Delivery.find({ group }).populate({
        path: "orders",
        populate: { path: ["products.product", "customer"] },
    });
};

const getDelivery = id => {
    if (!id) return null;
    return Delivery.findById(id);
};

const getDeliveryProducts = async id => {
    console.log(id)
    if (!id) return null;
    //it is comming with a "undefined" word that is not false

    const data = await getDelivery(id).populate({
        path: "orders",
        populate: { path: "products.product" },
    });

    if (!data?.orders) return null;

    const products = extractProductsFromOrders(data.orders);

    return combineProducts(products);
};

const getActualDelivery = group => {
    return Delivery.findOne({ group, state: "processing" }).populate({
        path: "orders",
        populate: { path: ["products.product", "customer"] },
    });
};

const createDelivery = async (group, ordersID) => {
    const newDelivery = new Delivery({
        orders: ordersID,
        deliveryDate: new Date(),
        state: "pending",
        group,
    });

    const saveDelivery = await newDelivery.save();

    return saveDelivery.populate({
        path: "orders",
        populate: { path: ["products.product", "customer"] },
    });
};

const updateState = (id, newState) => {
    return Delivery.updateOne({ _id: id }, { state: newState });
};

const removeOrders = (id, ordersID) => {
    return Delivery.updateOne({ _id: id }, { $pull: { orders: { $in: ordersID } } });
};

const deleteDelivery = id => {
    return Delivery.deleteOne({ _id: id });
};

module.exports = {
    getAllDeliveries,
    getDelivery,
    getDeliveryProducts,
    getActualDelivery,
    createDelivery,
    updateState,
    removeOrders,
    deleteDelivery,
};
