const customerService = require('../services/customer.service');

exports.createCustomer = async (req, res) => {
    try {
        const customer = await customerService.createCustomer(req.body);
        res.status(201).json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating customer" });
    }
};

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await customerService.getAllCustomers();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching customers" });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await customerService.getCustomerById(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: "Error fetching customer" });
    }
};