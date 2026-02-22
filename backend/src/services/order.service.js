const pool = require('../config/db');

const createOrder = async (userId, items) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        let total = 0;

        for (let item of items) {

            // 🔥 Find product by NAME instead of ID
            const productRes = await client.query(
                'SELECT * FROM products WHERE name=$1 FOR UPDATE',
                [item.product_name]
            );

            const product = productRes.rows[0];

            if (!product) throw new Error("Product not found");

            if (product.stock_quantity < item.quantity)
                throw new Error("Insufficient stock");

            total += product.price * item.quantity;

            // 🔥 Reduce stock
            await client.query(
                'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id=$2',
                [item.quantity, product.id]
            );
        }

        const orderRes = await client.query(
            `INSERT INTO orders (user_id,total_amount)
             VALUES ($1,$2)
             RETURNING *`,
            [userId, total]
        );

        const order = orderRes.rows[0];

        for (let item of items) {

            const productRes = await client.query(
                'SELECT * FROM products WHERE name=$1',
                [item.product_name]
            );

            const product = productRes.rows[0];

            await client.query(
                `INSERT INTO order_items(order_id,product_id,quantity,price)
                 VALUES ($1,$2,$3,$4)`,
                [order.id, product.id, item.quantity, product.price]
            );
        }

        await client.query('COMMIT');
        return order;

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

const getMyOrders = async (userId) => {
    const result = await pool.query(
        'SELECT * FROM orders WHERE user_id=$1 ORDER BY id DESC',
        [userId]
    );
    return result.rows;
};

const getAllOrders = async () => {
    const result = await pool.query(
        `SELECT o.*, u.name
         FROM orders o
         JOIN users u ON o.user_id=u.id
         ORDER BY o.id DESC`
    );
    return result.rows;
};
const cancelOrder = async (orderId, userId) => {
    const result = await pool.query(
        'SELECT * FROM orders WHERE id=$1',
        [orderId]
    );

    const order = result.rows[0];
    if (!order) throw new Error("Order not found");

    if (order.user_id !== userId)
        throw new Error("Not authorized");

    await pool.query(
        'UPDATE orders SET status=$1 WHERE id=$2',
        ['CANCELLED', orderId]
    );

    return { message: "Order cancelled" };
};

const updateOrderStatus = async (orderId, status) => {
    const result = await pool.query(
        'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *',
        [status, orderId]
    );

    return result.rows[0];
};
module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    cancelOrder,
    updateOrderStatus
};