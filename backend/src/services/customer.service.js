const pool = require('../config/db');

const createCustomer = async (data) => {
    const { name, email } = data;

    const result = await pool.query(
        `INSERT INTO customers (name, email)
         VALUES ($1, $2)
         RETURNING *`,
        [name, email]
    );

    return result.rows[0];
};

const getAllCustomers = async () => {
    const result = await pool.query(
        'SELECT * FROM customers ORDER BY id DESC'
    );
    return result.rows;
};

const getCustomerById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM customers WHERE id = $1',
        [id]
    );
    return result.rows[0];
};

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById
};