const productService = require('../services/product.service');

// Create Product
exports.createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating product" });
    }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const products = await productService.getAllProducts(page, limit);

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
};

// Get Product By ID
exports.getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching product" });
    }
};
// Update Product
exports.updateProduct = async (req, res) => {
    try {
        const product = await productService.updateProduct(
            req.params.id,
            req.body
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating product" });
    }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await productService.deleteProduct(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting product" });
    }
};