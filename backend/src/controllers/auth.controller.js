const authService = require('../services/auth.service');

exports.register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json(user);
    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(400).json({
            message: err.message,
            details: err.detail
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};