// backend/controllers/providerController.js

const Provider = require('../models/Provider');
const MenuItem = require('../models/MenuItem');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const Customer = require('../models/Customer');
const Order = require('../models/Order'); 




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



// Create a new subscription plan
exports.createSubscriptionPlan = async (req, res) => {
  const { planName, description, price, duration, meals } = req.body;
  try {
    const subscriptionPlan = await SubscriptionPlan.create({
      providerId: req.user.userId,
      planName,
      description,
      price,
      duration,
      meals // Include the selected menu items (array of menu item IDs)
    });
    res.status(201).json(subscriptionPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a subscription plan
exports.updateSubscriptionPlan = async (req, res) => {
  try {
    const { planName, description, price, duration, meals } = req.body;
    const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, {
      planName,
      description,
      price,
      duration,
      meals // Update the menu items associated with the plan
    }, { new: true });

    if (!updatedPlan) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }
    res.json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all subscription plans for a provider
exports.getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ providerId: req.user.userId })
      .populate('meals', 'mealName'); // Populate meals with only the mealName field

      console.log(plans);

    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscription plans' });
  }
};


// Delete a subscription plan
exports.deleteSubscriptionPlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }
    res.json({ message: 'Subscription plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// backend/controllers/providerController.js

exports.getAllSubscriptionPlans = async (req, res) => {
  try {
    console.log("getAllSubscriptionPlans API called");
    const plans = await SubscriptionPlan.find({})
      .populate('meals', 'mealName price')
      .populate('providerId', 'restaurantName'); // Populate provider's restaurant name
    
    if (plans.length === 0) {
      console.log("No subscription plans found");
    } else {
      console.log("Subscription plans retrieved:", plans);
    }

    res.json(plans);
  } catch (error) {
    console.error("Error fetching all subscription plans:", error);
    res.status(500).json({ message: 'Error fetching all subscription plans' });
  }
};

exports.getSubscriptionById = async (req, res) => {
  try {
    console.log(`Fetching subscription with ID: ${req.params.id}`);
    const subscription = await SubscriptionPlan.findById(req.params.id).populate('meals', 'mealName price');
    if (!subscription) {
      console.log(`Subscription with ID ${req.params.id} not found`);
      return res.status(404).json({ message: 'Subscription not found' });
    }
    console.log(`Subscription fetched successfully: ${JSON.stringify(subscription)}`);
    res.json(subscription);
  } catch (error) {
    console.error(`Error fetching subscription with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error fetching subscription', error });
  }
};

// Book subscription for customer
exports.bookSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.body; // This is the correct field sent from the frontend
    const customerId = req.user.userId;

    console.log('Received subscriptionId:', subscriptionId);
    console.log('Customer ID from JWT:', customerId);

    const subscription = await SubscriptionPlan.findById(subscriptionId).populate('providerId');
    console.log('Fetched subscription object:', subscription);

    if (!subscription) {
      console.log('Subscription plan not found for ID:', subscriptionId);
      return res.status(404).json({ message: 'Subscription plan not found' });
    }

    const customer = await Customer.findOneAndUpdate(
      { userId: customerId },
      {
        $push: {
          subscriptions: {
            providerId: subscription.providerId._id,
            subscriptionPlanId: subscription._id,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        },
      },
      { new: true }
    );
    console.log('Updated customer object:', customer);

    if (!customer) {
      console.log('Customer not found for ID:', customerId);
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Create a new order
    const order = new Order({
      customerId: customer._id,
      providerId: subscription.providerId._id,
      subscriptionPlanId: subscription._id, // Ensure correct key
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      status: 'pending',
    });

    console.log('Order object before saving:', order);

    await order.save();

    console.log('Order saved successfully:', order);

    res.status(200).json({
      message: 'Subscription booked successfully',
      customer,
      order,
      subscription,
    });
  } catch (error) {
    console.error('Error booking subscription:', error);
    res.status(500).json({ message: 'Error booking subscription', error });
  }
};

// Get order history for the provider
exports.getOrderHistoryForProvider = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user.userId });
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const orders = await Order.find({ providerId: provider._id })
      .populate('customerId', 'name') // Populate customer details
      .populate('subscriptionPlanId', 'planName'); // Populate subscription plan details

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this provider.' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching provider orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};




