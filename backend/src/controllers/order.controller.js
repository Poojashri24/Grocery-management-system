const orderService = require('../services/order.service');

/* ================= CUSTOMER ================= */

// Place Order
exports.createOrder = async (req, res) => {
    try {
        const order = await orderService.createOrder(
            req.user.id,
            req.body.items
        );
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// View Own Orders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await orderService.getMyOrders(req.user.id);
        res.json(orders);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Cancel Own Order
exports.cancelOrder = async (req, res) => {
    try {
        const order = await orderService.cancelOrder(
            req.params.id,
            req.user.id
        );
        res.json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


/* ================= ADMIN ================= */

// View All Orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.json(orders);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await orderService.updateOrderStatus(
            req.params.id,
            req.body.status
        );
        res.json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};