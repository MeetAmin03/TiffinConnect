// customerController.js
const Customer = require('../models/Customer');

exports.updateProfile = async (req, res) => {
    try {
        const { name, address, preferences } = req.body;
        const profilePicture = req.file ? req.file.path : null;

        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.user.id, // Assuming customer ID is in req.user after authentication
            { name, address, preferences, profilePicture },
            { new: true }
        );

        res.status(200).json({ message: 'Profile updated successfully', customer: updatedCustomer });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
};
