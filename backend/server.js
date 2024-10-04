const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for generating tokens
const cors = require('cors'); // Import cors
const { authMiddleware, isAdmin } = require('./middleware/authMiddleware');

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
    insertSampleData(); // Uncomment if you want to insert sample data on each run
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

    console.log('All collections cleared successfully.');

    // Hash passwords for users
    const hashedPasswordCustomer = await bcrypt.hash('passwordCustomer123', 10);
    const hashedPasswordProvider = await bcrypt.hash('passwordProvider123', 10);
    const hashedPasswordDriver = await bcrypt.hash('passwordDriver123', 10);
    const hashedPasswordAdmin = await bcrypt.hash('passwordAdmin123', 10);

    // Sample users
    const userCustomer = await User.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: hashedPasswordCustomer,
      role: 'customer',
      contactNumber: '1234567890',
      address: '123 Maple St, Cityville',
      isVerified: true,
      profilePictureURL: 'https://example.com/profile/john.jpg',
    });

    const userProvider = await User.create({
      name: 'Sarah Williams',
      email: 'sarah.williams@food.com',
      password: hashedPasswordProvider,
      role: 'provider',
      contactNumber: '2345678901',
      address: '456 Elm St, Townsville',
      isVerified: true,
      profilePictureURL: 'https://example.com/profile/sarah.jpg',
    });

    const userDriver = await User.create({
      name: 'Michael Johnson',
      email: 'michael.johnson@food.com',
      password: hashedPasswordDriver,
      role: 'driver',
      contactNumber: '3456789012',
      address: '789 Oak Ave, Villageland',
      isVerified: true,
      profilePictureURL: 'https://example.com/profile/michael.jpg',
    });

    const userAdmin = await User.create({
      name: 'Olivia Brown',
      email: 'olivia.brown@example.com',
      password: hashedPasswordAdmin,
      role: 'admin',
      contactNumber: '4567890123',
      address: '101 Cedar Ln, Cityville',
      isVerified: true,
      profilePictureURL: 'https://example.com/profile/olivia.jpg',
    });

    // Sample provider
    const provider = await Provider.create({
      userId: userProvider._id,
      restaurantName: 'Healthy Home Meals',
      deliveryOptions: 'Doorstep Delivery',
      rating: 4.7,
      reviews: [{ reviewId: new mongoose.Types.ObjectId(), comment: 'Excellent meals!' }],
      restaurantLogoURL: 'https://example.com/logo/healthy-home.jpg',
      address: '456 Elm St, Townsville',
      subscriptionPlans: [{ planId: new mongoose.Types.ObjectId(), price: 50, duration: 'monthly' }],
    });

    // Sample menu items for provider
    const menuItem1 = await MenuItem.create({
      providerId: provider._id,
      mealName: 'Vegan Buddha Bowl',
      description: 'A fresh mix of quinoa, chickpeas, and veggies.',
      price: 10.99,
      imageURL: 'https://example.com/menu/vegan-bowl.jpg',
      mealType: 'vegan',
    });

    const menuItem2 = await MenuItem.create({
      providerId: provider._id,
      mealName: 'Chicken Biryani',
      description: 'Aromatic rice with flavorful chicken pieces.',
      price: 12.99,
      imageURL: 'https://example.com/menu/chicken-biryani.jpg',
      mealType: 'non-vegetarian',
    });

    // Sample customer with subscription to provider
    const customer = await Customer.create({
      userId: userCustomer._id,
      subscriptions: [{
        providerId: provider._id,
        mealPlanId: new mongoose.Types.ObjectId(),
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Subscription for 30 days
      }],
      paymentInfo: [{ paymentId: new mongoose.Types.ObjectId(), paymentMethod: 'Credit Card' }],
      favoriteProviders: [provider._id],
      address: ['123 Maple St, Cityville'],
      preferences: { vegetarian: true, spiceLevel: 'medium' },
    });

    // Sample order
    const order = await Order.create({
      customerId: customer._id,
      providerId: provider._id,
      menuItemIds: [menuItem1._id, menuItem2._id], // Order includes multiple menu items
      totalAmount: 23.98, // Sum of menuItem1 and menuItem2
      status: 'active',
      orderDate: new Date(),
      subscriptionType: 'monthly',
      paymentStatus: 'paid',
    });

    // Sample driver
    const driver = await Driver.create({
      userId: userDriver._id,
      vehicleType: 'motorbike',
      licenseNumber: 'DRIVER1234',
      deliveryRadius: 15, // Delivery radius in kilometers
      currentStatus: 'available',
      rating: 4.9,
      completedDeliveries: 150,
      earnings: 2000.00, // Total earnings from deliveries
      currentLocation: { latitude: 40.7128, longitude: -74.0060 },
      phoneNumber: '9876543210',
    });

    // Sample delivery
    const delivery = await Delivery.create({
      orderId: order._id,
      driverId: driver._id,
      status: 'in-progress', // Delivery status
      deliveryTime: new Date(),
      deliveryAddress: '123 Maple St, Cityville',
      deliveryRating: 4.5,
      driverFeedback: 'Fast and professional delivery',
    });

    console.log('Sample data inserted successfully');
  } catch (error) {
    console.log('Error inserting sample data:', error);
  }
}



// Registration Endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role, contactNumber, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      contactNumber,
      address
    });

    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error during user registration:', error);
    return res.status(500).json({ message: 'Error registering user' });
  }
});


// Login Endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h' // Token expires in 1 hour
    });

    console.log(token);

    // Include the user's role in the response
    return res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role // Include the user's role
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error logging in user', error });
  }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/// Get all users (Admin only)
app.get('/api/admin/users', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get all providers (Admin only)
app.get('/api/admin/providers', authMiddleware, isAdmin, async (req, res) => {
  try {
    const providers = await Provider.find();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching providers' });
  }
});

// Get all orders (Admin only)
app.get('/api/admin/orders', authMiddleware, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name email') // Populate customerId with specific fields
      .populate('providerId', 'restaurantName') // Populate providerId with specific fields
      .populate('menuItemIds', 'mealName price'); // Populate menuItemIds with meal details
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});
