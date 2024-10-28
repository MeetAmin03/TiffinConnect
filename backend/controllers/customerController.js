const Customer = require('../models/Customer');

// Get Customer Profile
exports.getCustomerProfile = async (req, res) => {
  try {
    console.log(`Fetching profile for userId: ${req.user.userId}`);
    
    const customer = await Customer.findOne({ userId: req.user.userId }).populate('favoriteProviders');
    if (!customer) {
      console.log('Customer not found');
      return res.status(404).json({ message: 'Customer not found' });
    }

    console.log(`Customer profile retrieved successfully for userId: ${req.user.userId}`);
    res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    res.status(500).json({ message: 'Error retrieving profile', error });
  }
};



exports.updateProfile = async (req, res) => {
  try {
    const { name, address, preferences } = req.body;
    const parsedPreferences = JSON.parse(preferences); // Parse JSON string if sent as such

    const profilePicture = req.file ? `${req.protocol}://${req.get('host')}/${req.file.path}` : null;

    const updatedCustomer = await Customer.findOneAndUpdate(
      { userId: req.user.userId },
      { name, address, preferences: parsedPreferences, profilePicture },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', customer: updatedCustomer });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

