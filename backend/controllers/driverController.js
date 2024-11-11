// controllers/driverController.js
const { check, validationResult } = require('express-validator');
const Driver = require('../models/Driver');
const User = require('../models/User'); // Ensure this import is present

  // Register vehicle for driver
  exports.registerVehicle = [
    // Backend validation rules
    check('vehicleType')
      .trim()
      .notEmpty()
      .withMessage('Vehicle type is required.')
      .isIn(['Car', 'Van', 'Bike', 'Truck'])
      .withMessage('Vehicle type must be one of Car, Van, Bike, or Truck.'),
    check('licenseNumber')
      .trim()
      .notEmpty()
      .withMessage('License number is required.')
      .matches(/^[A-Za-z0-9]{2,8}$/)
      .withMessage('License number must be between 2 to 8 alphanumeric characters.'),
    check('deliveryRadius')
      .isInt({ min: 1, max: 100 })
      .withMessage('Delivery radius must be between 1 and 100 km.'),
    check('phoneNumber')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Phone number is required.')
      .matches(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/)
      .withMessage('Phone number must be in a valid Canadian format (e.g., 123-456-7890).'),
  
    // Controller logic
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation failed:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { vehicleType, licenseNumber, deliveryRadius, phoneNumber } = req.body;
      const driverId = req.user.userId;
  
      try {
        const driver = await Driver.findOne({ userId: driverId });
  
        if (!driver) {
          console.log('No driver profile found for this user');
          return res.status(404).json({ message: 'Driver profile not found' });
        }
  
        driver.vehicleType = vehicleType;
        driver.licenseNumber = licenseNumber;
        driver.deliveryRadius = deliveryRadius;
        driver.phoneNumber = phoneNumber;
  
        await driver.save();
  
        console.log('Vehicle details updated successfully for driver:', driver);
        res.status(200).json({ message: 'Vehicle registered successfully', driver });
      } catch (error) {
        console.error('Error updating vehicle details:', error);
        res.status(500).json({ message: 'Error updating vehicle details', error });
      }
    }
  ];
  
  
  exports.getDriverProfile = async (req, res) => {
    try {
      // Find the driver and populate the 'userId' field to include 'name'
      const driver = await Driver.findOne({ userId: req.user.userId }).populate('userId', 'name');
      
      if (!driver) {
        return res.status(404).json({ message: 'Driver profile not found' });
      }
  
      res.json(driver);
    } catch (error) {
      console.error("Error fetching driver profile:", error);
      res.status(500).json({ message: 'Error fetching driver profile' });
    }
  };
  
  exports.updateDriverProfile = async (req, res) => {
    console.log("Starting updateDriverProfile...");
  
    const { vehicleType, licenseNumber, deliveryRadius, phoneNumber, currentStatus, name, address } = req.body;
    const userId = req.user.userId;
    console.log("User ID from request:", userId);
    console.log("Values to update in User document:", { name });
  
    try {
      console.log("Attempting to update User document with name...");
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name }, // Update only `name` in User document
        { new: true }
      );
      console.log("User document updated:", updatedUser);
  
      console.log("Attempting to update Driver document...");
      const updatedDriver = await Driver.findOneAndUpdate(
        { userId },
        { vehicleType, licenseNumber, deliveryRadius, phoneNumber, currentStatus, address },
        { new: true }
      );
      console.log("Driver document updated:", updatedDriver);
  
      if (!updatedDriver || !updatedUser) {
        console.log("Either User or Driver profile not found.");
        return res.status(404).json({ message: 'Driver or User profile not found' });
      }
  
      res.json({ message: 'Driver profile updated successfully', driver: updatedDriver, user: updatedUser });
    } catch (error) {
      console.error("Error updating driver profile:", error);
      res.status(500).json({ message: 'Error updating driver profile', error });
    }
  };
  
  

// controllers/driverController.js
exports.uploadProfilePhoto = async (req, res) => {
  try {
    console.log("Upload Profile Photo API called");

    // Check if authentication is applied by logging req.user
    console.log("req.user:", req.user); // Log req.user to check if it's populated

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    // Check if a file exists in the request
    if (!req.file) {
      console.log("No file uploaded in the request");
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const driverId = req.user.userId;
    console.log("Driver ID:", driverId);

    const photoPath = `/uploads/${req.file.filename}`;
    console.log("File path to save:", photoPath);

    const driver = await Driver.findOneAndUpdate(
      { userId: driverId },
      { profilePhoto: photoPath },
      { new: true }
    );

    if (!driver) {
      console.log("No driver profile found for this user ID:", driverId);
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    console.log("Profile photo updated successfully:", driver);
    res.status(200).json({ message: 'Profile photo uploaded successfully', profilePhoto: driver.profilePhoto });
  } catch (error) {
    console.error("Error in uploadProfilePhoto:", error);
    res.status(500).json({ message: 'Error uploading profile photo', error });
  }
};
