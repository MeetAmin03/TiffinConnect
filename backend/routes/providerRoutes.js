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
  getMenuItems, 
  createSubscriptionPlan, 
  getSubscriptionPlans, 
  updateSubscriptionPlan, 
  deleteSubscriptionPlan
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


// Subscription plan routes
router.get('/plans', authMiddleware, getSubscriptionPlans);
router.post('/plans', authMiddleware, createSubscriptionPlan);
router.put('/plans/:id', authMiddleware, updateSubscriptionPlan);
router.delete('/plans/:id', authMiddleware, deleteSubscriptionPlan);

module.exports = router;
