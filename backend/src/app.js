const express = require('express');
require('dotenv').config();

const productRoutes = require('./routes/product.routes');
const customerRoutes = require('./routes/customer.routes');
const orderRoutes = require('./routes/order.routes');
const errorHandler = require('./middleware/error.middleware');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const app = express();

app.use(cors());          // 👈 ADD THIS
app.use(express.json());   // VERY IMPORTANT - must be before routes

app.get('/', (req, res) => {
    res.send("Grocery Store Backend Running");
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);

app.use(errorHandler);
module.exports = app;