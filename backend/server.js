const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for generating tokens
const cors = require('cors'); // Import cors

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
    // Sample user with hashed password
    const hashedPassword = await bcrypt.hash('password123', 10); // Hashing the password
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'customer',
      contactNumber: '1234567890',
      address: '123 Main St'
    });

    // Sample provider
    const provider = await Provider.create({
      userId: user._id,
      restaurantName: 'Best Restaurant',
      deliveryOptions: 'Doorstep',
      rating: 4.5,
      reviews: [{ reviewId: new mongoose.Types.ObjectId(), comment: 'Great food!' }] // Use a new ObjectId for reviewId
    });

    // Sample menu item
    const menuItem = await MenuItem.create({
      providerId: provider._id,
      mealName: 'Spaghetti Bolognese',
      description: 'Delicious spaghetti with meat sauce',
      price: 12.99,
      imageURL: 'https://example.com/spaghetti.jpg'
    });

    // Sample customer
    const customer = await Customer.create({
      userId: user._id,
      subscriptions: [{ providerId: provider._id, mealPlanId: 'basic', startDate: new Date(), endDate: new Date() }],
      paymentInfo: [{ paymentId: 'PAY12345', paymentMethod: 'Credit Card' }]
    });

    // Sample order
    const order = await Order.create({
      customerId: customer._id,
      providerId: provider._id,
      menuItemIds: [menuItem._id],
      totalAmount: 12.99,
      orderDate: new Date(),
      status: 'completed'
    });

    // Sample driver
    const driver = await Driver.create({
      userId: user._id,
      vehicleType: 'bike',
      licenseNumber: 'LIC12345',
      deliveryRadius: 10,
      currentStatus: 'available',
      rating: 4.8,
      completedDeliveries: 100,
      earnings: 1500.00
    });

    // Sample delivery
    await Delivery.create({
      orderId: order._id,
      driverId: driver._id,
      status: 'completed',
      deliveryTime: new Date(),
      deliveryAddress: '123 Main St'
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

// Optional: Uncomment if you want to insert sample data on each run
// insertSampleData();
