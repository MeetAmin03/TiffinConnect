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

// Importing routes for provider profile management
const providerRoutes = require('./routes/providerRoutes');
app.use('/api/provider', providerRoutes);

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
    const hashedPasswordProvider1 = await bcrypt.hash('111111', 10);
    const hashedPasswordProvider2 = await bcrypt.hash('111111', 10);
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

    const userProvider1 = await User.create({
      name: 'Provider 1',
      email: 'p1@gmail.com',
      password: hashedPasswordProvider1,
      role: 'provider',
      contactNumber: '2345678901',
      address: '101 Apple St, Foodville',
      isVerified: true,
      profilePictureURL: 'https://example.com/profile/provider1.jpg',
    });

    const userProvider2 = await User.create({
      name: 'Provider 2',
      email: 'p2@gmail.com',
      password: hashedPasswordProvider2,
      role: 'provider',
      contactNumber: '3456789012',
      address: '202 Orange St, Mealville',
      isVerified: true,
      profilePictureURL: 'https://example.com/profile/provider2.jpg',
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
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPasswordAdmin,
      role: 'admin',
      contactNumber: '4567890123',
      address: '101 Cedar Ln, Cityville',
      isVerified: true,
      profilePictureURL: 'https://example.com/profile/admin.jpg',
    });

    // Sample providers
    const provider1 = await Provider.create({
      userId: userProvider1._id,
      restaurantName: 'Provider 1 Meals',
      deliveryOptions: 'Home Delivery',
      rating: 4.8,
      reviews: [{ reviewId: new mongoose.Types.ObjectId(), comment: 'Great food!' }],
      restaurantLogoURL: 'https://example.com/logo/provider1.jpg',
      address: '101 Apple St, Foodville',
      subscriptionPlans: [{ planId: new mongoose.Types.ObjectId(), price: 50, duration: 'monthly' }],
    });

    const provider2 = await Provider.create({
      userId: userProvider2._id,
      restaurantName: 'Provider 2 Kitchen',
      deliveryOptions: 'Takeaway and Delivery',
      rating: 4.6,
      reviews: [{ reviewId: new mongoose.Types.ObjectId(), comment: 'Tasty and quick!' }],
      restaurantLogoURL: 'https://example.com/logo/provider2.jpg',
      address: '202 Orange St, Mealville',
      subscriptionPlans: [{ planId: new mongoose.Types.ObjectId(), price: 60, duration: 'monthly' }],
    });

    // Sample menu items for Provider 1
    const menuItemsProvider1 = await MenuItem.insertMany([
      {
        providerId: provider1._id,
        mealName: 'Grilled Chicken Salad',
        description: 'Healthy grilled chicken with fresh salad.',
        price: 8.99,
        imageURL: 'https://example.com/menu/chicken-salad.jpg',
        mealType: 'non-vegetarian',
      },
      {
        providerId: provider1._id,
        mealName: 'Vegetarian Pizza',
        description: 'Delicious veggie pizza with a crispy crust.',
        price: 10.99,
        imageURL: 'https://example.com/menu/veggie-pizza.jpg',
        mealType: 'vegetarian',
      },
      {
        providerId: provider1._id,
        mealName: 'Spaghetti Bolognese',
        description: 'Classic spaghetti with rich bolognese sauce.',
        price: 12.99,
        imageURL: 'https://example.com/menu/spaghetti.jpg',
        mealType: 'non-vegetarian',
      },
      {
        providerId: provider1._id,
        mealName: 'Vegan Burrito',
        description: 'A flavorful vegan burrito.',
        price: 7.99,
        imageURL: 'https://example.com/menu/vegan-burrito.jpg',
        mealType: 'vegan',
      },
      {
        providerId: provider1._id,
        mealName: 'Fruit Smoothie',
        description: 'A refreshing blend of fresh fruits.',
        price: 5.99,
        imageURL: 'https://example.com/menu/smoothie.jpg',
        mealType: 'vegan',
      },
    ]);

    // Sample menu items for Provider 2
    const menuItemsProvider2 = await MenuItem.insertMany([
      {
        providerId: provider2._id,
        mealName: 'Beef Steak',
        description: 'Juicy beef steak with garlic butter sauce.',
        price: 15.99,
        imageURL: 'https://example.com/menu/steak.jpg',
        mealType: 'non-vegetarian',
      },
      {
        providerId: provider2._id,
        mealName: 'Margherita Pizza',
        description: 'Classic Margherita pizza with fresh tomatoes and basil.',
        price: 9.99,
        imageURL: 'https://example.com/menu/margherita.jpg',
        mealType: 'vegetarian',
      },
      {
        providerId: provider2._id,
        mealName: 'Chicken Caesar Wrap',
        description: 'Chicken Caesar wrap with a fresh salad.',
        price: 8.99,
        imageURL: 'https://example.com/menu/caesar-wrap.jpg',
        mealType: 'non-vegetarian',
      },
      {
        providerId: provider2._id,
        mealName: 'Falafel Wrap',
        description: 'Vegan falafel wrap with hummus and salad.',
        price: 7.99,
        imageURL: 'https://example.com/menu/falafel-wrap.jpg',
        mealType: 'vegan',
      },
      {
        providerId: provider2._id,
        mealName: 'Mango Lassi',
        description: 'Refreshing mango lassi drink.',
        price: 4.99,
        imageURL: 'https://example.com/menu/lassi.jpg',
        mealType: 'vegetarian',
      },
    ]);

    console.log('Sample data with two providers and five menu items each inserted successfully');
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

// Admin APIs (existing code)

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

// Get user by ID (Admin only)
app.get('/api/admin/users/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Get provider by ID (Admin only)
app.get('/api/admin/providers/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching provider' });
  }
});

// Update user by ID (Admin only)
app.put('/api/admin/users/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Update provider by ID (Admin only)
app.put('/api/admin/providers/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const updatedProvider = await Provider.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProvider) return res.status(404).json({ message: 'Provider not found' });
    res.json(updatedProvider);
  } catch (error) {
    res.status(500).json({ message: 'Error updating provider' });
  }
});

// Delete user by ID (Admin only)
app.delete('/api/admin/users/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Delete provider by ID (Admin only)
app.delete('/api/admin/providers/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const deletedProvider = await Provider.findByIdAndDelete(req.params.id);
    if (!deletedProvider) return res.status(404).json({ message: 'Provider not found' });
    res.json({ message: 'Provider deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting provider' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
