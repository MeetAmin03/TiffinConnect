// backend/routes/providerRoutes.js

const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { 
  getProviderProfile, 
  updateProviderProfile, 
  deleteProviderProfile, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  getMenuItems // Import the getMenuItems controller
} = require('../controllers/providerController');

const router = express.Router();

// Provider profile routes
router.get('/profile', authMiddleware, getProviderProfile);
router.put('/profile', authMiddleware, updateProviderProfile);
router.delete('/profile', authMiddleware, deleteProviderProfile);

// Menu item routes
router.get('/menu', authMiddleware, getMenuItems); // Add this route for fetching menu items
router.post('/menu', authMiddleware, createMenuItem);
router.put('/menu/:id', authMiddleware, updateMenuItem);
router.delete('/menu/:id', authMiddleware, deleteMenuItem);

module.exports = router;
