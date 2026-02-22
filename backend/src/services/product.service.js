const pool = require('../config/db');

// Create Product
const createProduct = async (data) => {
    const { name, price, stock_quantity } = data;

    const query = `
        INSERT INTO products (name, price, stock_quantity)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    const values = [name, price, stock_quantity];
    const result = await pool.query(query, values);

    return result.rows[0];
};

// Get All Products
const getAllProducts = async (page = 1, limit = 5) => {
    const offset = (page - 1) * limit;

    const result = await pool.query(
        `SELECT * FROM products
         ORDER BY id DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    return result.rows;
};

// Get Product By ID
const getProductById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM products WHERE id = $1',
        [id]
    );
    return result.rows[0];
};

// Update Product
const updateProduct = async (id, data) => {
    const { name, price, stock_quantity } = data;

    const query = `
        UPDATE products
        SET name = $1,
            price = $2,
            stock_quantity = $3
        WHERE id = $4
        RETURNING *;
    `;

    const values = [name, price, stock_quantity, id];

    const result = await pool.query(query, values);

    return result.rows[0];
};

// Delete Product
const deleteProduct = async (id) => {
    const result = await pool.query(
        'DELETE FROM products WHERE id = $1 RETURNING *',
        [id]
    );

    return result.rows[0];
};
module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};