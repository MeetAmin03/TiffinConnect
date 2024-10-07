// Admin routes in your server.js or a separate admin controller
const authMiddleware = require('./middleware/authMiddleware');
const { isAdmin } = require('./middleware/roleMiddleware'); // Middleware to check if the user is admin
const User = require('./models/User');
const Provider = require('./models/Provider');
const Order = require('./models/Order');

// Get all users (Admin only)
app.get('/api/admin/users', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// Get all providers (Admin only)
app.get('/api/admin/providers', authMiddleware, isAdmin, async (req, res) => {
  try {
    const providers = await Provider.find();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching providers', error });
  }
});

// Get all orders (Admin only)
app.get('/api/admin/orders', authMiddleware, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate('customer').populate('provider');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});
