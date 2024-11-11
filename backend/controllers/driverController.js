// controllers/driverController.js
const { check, validationResult } = require('express-validator');
const Driver = require('../models/Driver');
const uploadProfilePhotoHelper = require('../helpers/uploadProfileHelper');


// Get driver profile
exports.getDriverProfile = async (req, res) => {
    try {
      const driver = await Driver.findOne({ userId: req.user.userId });
      if (!driver) {
        return res.status(404).json({ message: 'Driver profile not found' });
      }
      res.json(driver);
    } catch (error) {
      console.error("Error fetching driver profile:", error);
      res.status(500).json({ message: 'Error fetching driver profile' });
    }
  };
  
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
      const driverId = req.user.userId; // JWT should carry userId
  
      try {
        // Ensure driver document exists, then update
        const driver = await Driver.findOne({ userId: driverId });
  
        if (!driver) {
          console.log('No driver profile found for this user');
          return res.status(404).json({ message: 'Driver profile not found' });
        }
  
        // Update driver profile with vehicle information
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
  
  

// Update Driver Profile
exports.updateDriverProfile = async (req, res) => {
  const { vehicleType, licenseNumber, deliveryRadius, phoneNumber, currentStatus } = req.body;
  try {
    const updatedDriver = await Driver.findOneAndUpdate(
      { userId: req.user.userId },
      { vehicleType, licenseNumber, deliveryRadius, phoneNumber, currentStatus },
      { new: true }
    );
    if (!updatedDriver) return res.status(404).json({ message: 'Driver profile not found' });
    res.json({ message: 'Driver profile updated successfully', driver: updatedDriver });
  } catch (error) {
    res.status(500).json({ message: 'Error updating driver profile', error });
  }
};

exports.uploadProfilePhoto = async (req, res) => {
  try {
    console.log("Upload Profile Photo API called"); // Log entry into the API

    // Check if a file exists in the request
    if (!req.file) {
      console.log("No file uploaded in the request"); // Log if no file
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const driverId = req.user.userId; // Use the logged-in user ID as driverId
    console.log("Driver ID:", driverId); // Log driver ID for verification

    const photoPath = `/uploads/${req.file.filename}`; // Define file path
    console.log("File path to save:", photoPath); // Log the file path

    // Update the driver profile with the profile photo path
    const driver = await Driver.findOneAndUpdate(
      { userId: driverId },
      { profilePhoto: photoPath }, // Update profilePhoto field
      { new: true }
    );

    // Verify if the driver document was found and updated
    if (!driver) {
      console.log("No driver profile found for this user ID:", driverId); // Log if driver not found
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    console.log("Profile photo updated successfully:", driver); // Log entire driver document after update
    res.status(200).json({ message: 'Profile photo uploaded successfully', profilePhoto: driver.profilePhoto });
  } catch (error) {
    console.error("Error in uploadProfilePhoto:", error); // Log any errors
    res.status(500).json({ message: 'Error uploading profile photo', error });
  }
};