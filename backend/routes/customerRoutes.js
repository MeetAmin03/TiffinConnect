// customerRoutes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const upload = require('../middleware/upload'); // Assumes middleware for file uploads

// Route for updating customer profile
router.put('/profile', upload.single('profilePicture'), customerController.updateProfile);

module.exports = router;
