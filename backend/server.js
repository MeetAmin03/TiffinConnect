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
const adminRoutes = require('./routes/adminRoutes');


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

app.use('/api/admin', adminRoutes);



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
    const hashedPassword = await bcrypt.hash('1111', 10);

    // Sample providers and subscription plans data
    const providers = [
      { name: 'Provider 1', email: 'p1@gmail.com', restaurantName: 'Provider 1 Meals', address: '101 Apple St, Foodville' },
      { name: 'Provider 2', email: 'p2@gmail.com', restaurantName: 'Provider 2 Kitchen', address: '202 Orange St, Mealville' },
      { name: 'Provider 3', email: 'p3@gmail.com', restaurantName: 'Provider 3 Dishes', address: '303 Banana St, Tastyville' },
      { name: 'Provider 4', email: 'p4@gmail.com', restaurantName: 'Provider 4 Eatery', address: '404 Cherry St, Foodtown' },
      { name: 'Provider 5', email: 'p5@gmail.com', restaurantName: 'Provider 5 Bistro', address: '505 Grape St, Mealville' }
    ];

    // Insert providers, subscription plans, and menu items
    for (const providerData of providers) {
      const user = await User.create({
        name: providerData.name,
        email: providerData.email,
        password: hashedPassword,
        role: 'provider',
        contactNumber: '1234567890',
        address: providerData.address,
        isVerified: true,
      });

      const provider = await Provider.create({
        userId: user._id,
        restaurantName: providerData.restaurantName,
        deliveryOptions: 'Home Delivery',
        rating: 4.5,
        address: providerData.address,
      });

      const menuItems = await MenuItem.insertMany([
        { providerId: provider._id, mealName: 'Meal A', price: 10.0, description: 'Delicious meal A', mealType: 'vegetarian' },
        { providerId: provider._id, mealName: 'Meal B', price: 15.0, description: 'Delicious meal B', mealType: 'non-vegetarian' },
      ]);

      const subscriptionPlans = await SubscriptionPlan.insertMany([
        { providerId: provider._id, planName: 'Weekly Plan', price: 50, duration: 'weekly', meals: menuItems.map(item => item._id) },
        { providerId: provider._id, planName: 'Monthly Plan', price: 150, duration: 'monthly', meals: menuItems.map(item => item._id) },
      ]);
    }

    // Insert sample customers
    const customers = [
      { name: 'Customer 1', email: 'c1@gmail.com', address: 'Customer Address 1' },
      { name: 'Customer 2', email: 'c2@gmail.com', address: 'Customer Address 2' },
    ];

    for (const customerData of customers) {
      const user = await User.create({
        name: customerData.name,
        email: customerData.email,
        password: hashedPassword,
        role: 'customer',
        contactNumber: '9876543210',
        address: customerData.address,
        isVerified: true,
      });

      await Customer.create({ userId: user._id });
    }

    // Insert sample drivers
    const drivers = [
      { name: 'Driver 1', email: 'd1@gmail.com', address: 'Driver Address 1', currentStatus: 'available' },
      { name: 'Driver 2', email: 'd2@gmail.com', address: 'Driver Address 2', currentStatus: 'available' },
    ];

    for (const driverData of drivers) {
      const user = await User.create({
        name: driverData.name,
        email: driverData.email,
        password: hashedPassword,
        role: 'driver',
        contactNumber: '1231231230',
        address: driverData.address,
        isVerified: true,
      });

      await Driver.create({
        userId: user._id,
        vehicleType: 'Car',
        licenseNumber: `LICENSE-${Math.floor(1000 + Math.random() * 9000)}`,
        deliveryRadius: 50,
        currentStatus: driverData.currentStatus,
      });
    }

    // Insert sample orders
    const customer = await Customer.findOne(); // Assuming at least one customer exists
    const provider = await Provider.findOne(); // Assuming at least one provider exists
    const subscriptionPlan = await SubscriptionPlan.findOne(); // Assuming at least one subscription plan exists

    await Order.create([
      { customerId: customer._id, providerId: provider._id, subscriptionPlanId: subscriptionPlan._id, startDate: new Date(), endDate: new Date(), status: 'pending' },
      { customerId: customer._id, providerId: provider._id, subscriptionPlanId: subscriptionPlan._id, startDate: new Date(), endDate: new Date(), status: 'assigned' },
    ]);

    console.log('Sample data inserted successfully.');
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
}



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
