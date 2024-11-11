const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for generating tokens
const cors = require('cors'); // Import cors
const { authMiddleware, isAdmin } = require('./middleware/authMiddleware');
const SubscriptionPlan = require('./models/SubscriptionPlan'); // Add this line
const customerRoutes = require('./routes/customerRoutes');
const providerRoutes = require('./routes/providerRoutes');
const authRoutes = require('./routes/authRoutes'); // Import authRoutes
const path = require('path');
const driverRoutes = require('./routes/driverRoutes');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
app.use(express.json()); // Middleware for parsing JSON
app.use(cors()); // Enable CORS for all requests

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    // Insert sample data after successful connection
    (async () => {
      await insertSampleData();
    })(); // Wrapping insertSampleData in an async IIFE
  })
  .catch((error) => console.log('MongoDB connection error:', error));

// Importing models
const User = require('./models/User');
const Provider = require('./models/Provider');
const MenuItem = require('./models/MenuItem');
const Customer = require('./models/Customer');
const Order = require('./models/Order');
const Delivery = require('./models/Delivery');
const Driver = require('./models/Driver');

// Importing routes for provider profile management
app.use('/api/provider', providerRoutes);

// Register customer routes under /api/customer
app.use('/api/customer', customerRoutes);

app.use('/api', authRoutes); // Use authRoutes here

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/driver', driverRoutes);


// Function to insert sample data
async function insertSampleData() {
  try {
    // Clear all collections before inserting new data
    await User.deleteMany({});
    await Provider.deleteMany({});
    await MenuItem.deleteMany({});
    await Customer.deleteMany({});
    await Order.deleteMany({});
    await Delivery.deleteMany({});
    await Driver.deleteMany({});
    await SubscriptionPlan.deleteMany({});

    console.log('All collections cleared successfully.');

    // Hash passwords for users
    const hashedPasswordProvider = await bcrypt.hash('111111', 10);

    // Sample providers and subscription plans data
    const providers = [
      { name: 'Provider 1', email: 'p1@gmail.com', restaurantName: 'Provider 1 Meals', address: '101 Apple St, Foodville' },
      { name: 'Provider 2', email: 'p2@gmail.com', restaurantName: 'Provider 2 Kitchen', address: '202 Orange St, Mealville' },
      { name: 'Provider 3', email: 'p3@gmail.com', restaurantName: 'Provider 3 Dishes', address: '303 Banana St, Tastyville' },
      { name: 'Provider 4', email: 'p4@gmail.com', restaurantName: 'Provider 4 Eatery', address: '404 Cherry St, Foodtown' },
      { name: 'Provider 5', email: 'p5@gmail.com', restaurantName: 'Provider 5 Bistro', address: '505 Grape St, Mealville' }
    ];

    for (const providerData of providers) {
      // Create user for each provider
      const user = await User.create({
        name: providerData.name,
        email: providerData.email,
        password: hashedPasswordProvider,
        role: 'provider',
        contactNumber: '1234567890',
        address: providerData.address,
        isVerified: true,
        profilePictureURL: `https://example.com/profile/${providerData.name.toLowerCase()}.jpg`
      });

      // Create provider
      const provider = await Provider.create({
        userId: user._id,
        restaurantName: providerData.restaurantName,
        deliveryOptions: 'Home Delivery',
        rating: 4.5,
        reviews: [{ reviewId: new mongoose.Types.ObjectId(), comment: 'Great food!' }],
        restaurantLogoURL: `https://example.com/logo/${providerData.name.toLowerCase()}.jpg`,
        address: providerData.address,
        subscriptionPlans: []
      });

      // Sample menu items for each provider
      const menuItems = await MenuItem.insertMany([
        {
          providerId: provider._id,
          mealName: 'Grilled Chicken Salad',
          description: 'Healthy grilled chicken with fresh salad.',
          price: 8.99,
          imageURL: 'https://example.com/menu/chicken-salad.jpg',
          mealType: 'non-vegetarian',
        },
        {
          providerId: provider._id,
          mealName: 'Vegetarian Pizza',
          description: 'Delicious veggie pizza with a crispy crust.',
          price: 10.99,
          imageURL: 'https://example.com/menu/veggie-pizza.jpg',
          mealType: 'vegetarian',
        },
        {
          providerId: provider._id,
          mealName: 'Beef Steak',
          description: 'Juicy beef steak with garlic butter sauce.',
          price: 15.99,
          imageURL: 'https://example.com/menu/steak.jpg',
          mealType: 'non-vegetarian',
        },
        {
          providerId: provider._id,
          mealName: 'Margherita Pizza',
          description: 'Classic Margherita pizza with fresh tomatoes and basil.',
          price: 9.99,
          imageURL: 'https://example.com/menu/margherita.jpg',
          mealType: 'vegetarian',
        }
      ]);

      // Sample subscription plans for each provider
      const subscriptionPlans = await SubscriptionPlan.insertMany([
        {
          providerId: provider._id,
          planName: 'Weekly Meal Plan',
          description: '7 meals per week.',
          price: 30,
          duration: 'weekly',
          meals: [menuItems[0]._id, menuItems[1]._id, menuItems[2]._id]
        },
        {
          providerId: provider._id,
          planName: 'Monthly Meal Plan',
          description: 'Includes 30 meals per month.',
          price: 100,
          duration: 'monthly',
          meals: [menuItems[1]._id, menuItems[2]._id, menuItems[3]._id]
        },
        {
          providerId: provider._id,
          planName: 'Family Meal Plan',
          description: '15 meals per week, designed for families.',
          price: 70,
          duration: 'weekly',
          meals: [menuItems[0]._id, menuItems[2]._id, menuItems[3]._id]
        }
      ]);

      // Update provider with their subscription plans
      provider.subscriptionPlans.push(...subscriptionPlans.map(plan => plan._id));
      await provider.save();
    }

    console.log('Sample data with 5 providers, menu items, and subscription plans inserted successfully.');
  } catch (error) {
    console.log('Error inserting sample data:', error);
  }
}

// REST API routes for admin actions
app.get('/api/admin/users', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Other admin routes, including providers and orders, go here...

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
