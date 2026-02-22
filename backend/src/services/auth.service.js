const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async ({ name, email, password }) => {
    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1,$2,$3,'CUSTOMER')
         RETURNING id,name,email,role`,
        [name, email, hashed]
    );

    return result.rows[0];
};

const login = async (email, password) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE email=$1',
        [email]
    );

    const user = result.rows[0];
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid password");

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { token, role: user.role };
};

module.exports = { register, login };