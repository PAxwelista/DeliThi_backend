const Order = require("../models/orders");

const getOrders = async (group, { area, state, beginAt, endAt, product }) => {
    const query = { group };

    if (state) query.state = state;
    if (area) query.area = area;

    let data = await Order.find(query).populate([{ path: "customer" }, { path: "products.product" }]);

    if (beginAt) {
        data = data.filter(v => new Date(v.creationDate) >= new Date(beginAt));
    }

    if (endAt) {
        data = data.filter(v => new Date(v.creationDate) <= new Date(endAt));
    }

    if (product) {
        data = data.filter(v => v.products.some(productFilter => productFilter.product.name === product));
    }

    return data;
};

const getAllOrderAreas = async group => {
    const data = await Order.find({ group });

    return [...new Set(data.map(v => v.area))];
};

const getAllOrderAreasObj = async group => {
    const data = await Order.find({ group });

    const areas = [...new Set(data.map(v => v.area))];

    return areas.map(v => {
        const state = data.find(order=>v === order.area && order.state === "processing") ? "processing" : "pending"
        return {
            name: v,
            nbPending: data.filter(order => order.area === v && order.state === state).length,
            state,
        };
    });
};

const createOrder = (group, { products, orderer, customerId, area }) => {
    const newOrder = new Order({
        products,
        creationDate: new Date(),
        deliveryDate: null,
        orderer,
        state: "pending",
        customer: customerId,
        area,
        group,
    });

    return newOrder.save();
};

const updateOrdersInfos = (ordersID, { area, deliveryDate, state, amountPaid }) => {
    const updateData = { area, deliveryDate, state, amountPaid };

    return Order.updateMany({ _id: { $in: ordersID } }, updateData);
};

module.exports = { getOrders, getAllOrderAreas, getAllOrderAreasObj, createOrder, updateOrdersInfos };
