import React, { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import './BillingForm.css';

const BillingForm = ({ subscriptionId }) => {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(''); // State to store the success message
  const navigate = useNavigate();

  // Validation rules
  const validateForm = () => {
    const newErrors = {};
    if (!formData.address) newErrors.address = 'Address is required.';
    if (!formData.city) newErrors.city = 'City is required.';
    if (!formData.state) newErrors.state = 'Province is required.';
    if (!formData.zipCode || !/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Valid Canadian postal code is required (e.g., B3S 9Z9).';
    }
    if (!formData.cardNumber || !/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(formData.cardNumber)) {
      newErrors.cardNumber = 'Valid 16-digit card number is required (formatted as XXXX-XXXX-XXXX-XXXX).';
    }
    if (!formData.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) newErrors.expiryDate = 'Valid expiry date is required (MM/YY).';
    if (!formData.cvv || !/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = 'Valid 3 or 4-digit CVV is required.';
    if (!formData.cardHolderName) newErrors.cardHolderName = 'Cardholder name is required.';
    return newErrors;
  };

  // Card number formatting function
  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, '') // Remove all non-digit characters
      .replace(/(\d{4})(?=\d)/g, '$1-') // Add hyphen after every 4 digits
      .slice(0, 19); // Limit to 19 characters (16 digits + 3 hyphens)
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Apply formatting for card number
    if (name === 'cardNumber') {
      setFormData({ ...formData, cardNumber: formatCardNumber(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        // Process payment
        console.log("Processing payment with form data:", formData);
        const paymentResponse = await axios.post('/customer/payment', { ...formData, subscriptionId });
        console.log("Payment processed successfully:", paymentResponse.data);

        // If payment is successful, book the subscription
        console.log(`Booking subscription for subscription ID: ${subscriptionId}`);
        const bookingResponse = await axios.post('/provider/bookSubscription', { subscriptionId });
        console.log("Subscription booked successfully:", bookingResponse.data);

        // Set success message
        setSuccessMessage("Payment successful! Your subscription has been booked.");
        
        // Redirect to customer dashboard after a short delay
        setTimeout(() => navigate('/customer-dashboard'), 2000);
      } catch (error) {
        console.error("Error during payment or booking:", error);
      }
    }
  };

  return (
    <div className="billing-form">
      <h2>Billing Information</h2>
      {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}
      <form onSubmit={handleFormSubmit} noValidate>
        <div className="form-group">
          <label>Billing Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
          {errors.address && <small className="error">{errors.address}</small>}
        </div>
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
          />
          {errors.city && <small className="error">{errors.city}</small>}
        </div>
        <div className="form-group">
          <label>Province</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
          />
          {errors.state && <small className="error">{errors.state}</small>}
        </div>
        <div className="form-group">
          <label>Postal Code</label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
          />
          {errors.zipCode && <small className="error">{errors.zipCode}</small>}
        </div>
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            maxLength="19" // Limit input length to 19 characters
          />
          {errors.cardNumber && <small className="error">{errors.cardNumber}</small>}
        </div>
        <div className="form-group">
          <label>Expiry Date (MM/YY)</label>
          <input
            type="text"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
          />
          {errors.expiryDate && <small className="error">{errors.expiryDate}</small>}
        </div>
        <div className="form-group">
          <label>CVV</label>
          <input
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleInputChange}
          />
          {errors.cvv && <small className="error">{errors.cvv}</small>}
        </div>
        <div className="form-group">
          <label>Cardholder Name</label>
          <input
            type="text"
            name="cardHolderName"
            value={formData.cardHolderName}
            onChange={handleInputChange}
          />
          {errors.cardHolderName && <small className="error">{errors.cardHolderName}</small>}
        </div>
        <div className="form-actions">
          <button type="submit" className="pay-button">Pay Now</button>
        </div>
      </form>
    </div>
  );
};

export default BillingForm;
