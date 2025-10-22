const extractProductsFromOrders = orders => {

    return orders?.map(order =>
        order.products.map(product => ({
            name: product.product.name,
            quantity: product.quantity,
        }))
    ).flat();
};

module.exports = { extractProductsFromOrders };
