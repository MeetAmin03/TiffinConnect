// backend/controllers/providerController.js

const Provider = require('../models/Provider');
const MenuItem = require('../models/MenuItem');

// Get provider profile
exports.getProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user.userId }).populate('userId');
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update provider profile
exports.updateProviderProfile = async (req, res) => {
  try {
    const updatedData = req.body;
    const provider = await Provider.findOneAndUpdate({ userId: req.user.userId }, updatedData, { new: true });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete provider profile
exports.deleteProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findOneAndDelete({ userId: req.user.userId });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }
    res.json({ message: 'Provider profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new menu item
exports.createMenuItem = async (req, res) => {
  const { mealName, description, price, imageURL, mealType } = req.body;
  try {
    const menuItem = await MenuItem.create({
      providerId: req.user.userId,
      mealName,
      description,
      price,
      imageURL,
      mealType
    });
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all menu items for a provider
exports.getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ providerId: req.user.userId }); // Query based on providerId
    res.json(menuItems); // Return the list of menu items
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items' });
  }
};

// Update a menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(updatedMenuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
