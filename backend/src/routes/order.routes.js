const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken, authorizeRole } = require('../middleware/auth.middleware');

/* =======================
   CUSTOMER ROUTES
======================= */

// Place order
router.post('/',
    verifyToken,
    authorizeRole('CUSTOMER'),
    orderController.createOrder
);

// View own orders
router.get('/my',
    verifyToken,
    authorizeRole('CUSTOMER'),
    orderController.getMyOrders
);

// Cancel own order
router.patch('/:id/cancel',
    verifyToken,
    authorizeRole('CUSTOMER'),
    orderController.cancelOrder
);


/* =======================
   ADMIN ROUTES
======================= */

// View all orders
router.get('/',
    verifyToken,
    authorizeRole('ADMIN'),
    orderController.getAllOrders
);

// Update order status (SHIPPED, etc)
router.patch('/:id/status',
    verifyToken,
    authorizeRole('ADMIN'),
    orderController.updateOrderStatus
);

module.exports = router;