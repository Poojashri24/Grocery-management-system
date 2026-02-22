const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken, authorizeRole } = require('../middleware/auth.middleware');

/* =======================
   VIEW PRODUCTS (All Logged-in Users)
======================= */
router.get('/',
    verifyToken,
    productController.getAllProducts
);

router.get('/:id',
    verifyToken,
    productController.getProductById
);

/* =======================
   ADMIN ONLY ACTIONS
======================= */
router.post('/',
    verifyToken,
    authorizeRole('ADMIN'),
    productController.createProduct
);

router.put('/:id',
    verifyToken,
    authorizeRole('ADMIN'),
    productController.updateProduct
);

router.delete('/:id',
    verifyToken,
    authorizeRole('ADMIN'),
    productController.deleteProduct
);
router.delete('/:id',
    verifyToken,
    authorizeRole('ADMIN'),
    productController.deleteProduct
);
module.exports = router;