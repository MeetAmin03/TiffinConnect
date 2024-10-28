import React, { useState, useEffect } from 'react';
import { getSubscriptionPlans, addSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan, getMenuItems } from '../api'; // Import API functions
import './SubscriptionPlanList.css'; // Custom CSS for subscription plan list

const SubscriptionPlanList = () => {
  const [plans, setPlans] = useState([]);
  const [menuItems, setMenuItems] = useState([]); // State for available menu items
  const [isAdding, setIsAdding] = useState(false);
  const [newPlan, setNewPlan] = useState({
    planName: '',
    description: '',
    price: '',
    duration: 'monthly',
    meals: [] // Meals to be selected from the menu items
  });
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getSubscriptionPlans();
        setPlans(response.data);
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
      }
    };

    const fetchMenuItems = async () => {
      try {
        const response = await getMenuItems(); // Fetch the menu items
        setMenuItems(response.data); // Set the available menu items to the state
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchPlans();
    fetchMenuItems();
  }, []);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/placeholder-food.jpg';
  };

  const handleChange = (e) => {
    setNewPlan({ ...newPlan, [e.target.name]: e.target.value });
  };

  const handleMealChange = (e) => {
    const selectedMeals = Array.from(e.target.selectedOptions, (option) => option.value);
    setNewPlan({ ...newPlan, meals: selectedMeals });
  };

  const handleAddNewPlanClick = () => {
    setIsAdding(true);
    setEditingPlan(null);
  };

  const handleEditClick = (plan) => {
    setEditingPlan(plan);
    setNewPlan({
      ...plan,
      meals: plan.meals.map((meal) => meal._id), // Set the meals for editing
    });
    setIsAdding(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteSubscriptionPlan(id);
      setPlans(plans.filter((plan) => plan._id !== id));
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
    }
  };

  const handleBackClick = () => {
    history.back(); // Navigate back to the previous page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await updateSubscriptionPlan(editingPlan._id, newPlan);
      } else {
        await addSubscriptionPlan(newPlan);
      }
      // After adding or updating, refetch the plans from the backend
      const response = await getSubscriptionPlans();
      setPlans(response.data);

      // Reset the form and state
      setNewPlan({ planName: '', description: '', price: '', duration: 'monthly', meals: [] });
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding/updating subscription plan:', error);
    }
  };


  return (
    <div className="subscription-container">
      <button className="back-button" onClick={handleBackClick}>&#11013;</button>
      <h2>Manage Subscription Plans</h2>

      {!isAdding && (
        <button onClick={handleAddNewPlanClick} className="add-new-plan-btn">
          Add New Subscription Plan
        </button>
      )}

      {isAdding && (
        <form onSubmit={handleSubmit}>
          <label>
            Plan Name:
            <input
              type="text"
              name="planName"
              value={newPlan.planName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={newPlan.description}
              onChange={handleChange}
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={newPlan.price}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Duration:
            <select name="duration" value={newPlan.duration} onChange={handleChange}>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </label>

          {/* Dropdown for selecting meals */}
          <label>
            Select Meals:
            <select
              name="meals"
              multiple={true} // Allow multiple selection
              value={newPlan.meals}
              onChange={handleMealChange}
            >
              {menuItems.map((meal) => (
                <option key={meal._id} value={meal._id}>
                  {meal.mealName}
                </option>
              ))}
            </select>
            <div className="selected-meals-preview">
              {newPlan.meals.map((mealId) => {
                const meal = menuItems.find((item) => item._id === mealId);
                return meal && meal.imageURL ? (
                  <div key={meal._id} className="meal-preview">
                    <img
                      src={meal.imageURL}
                      alt={meal.mealName}
                      onError={handleImageError}
                      className="meal-preview-image"
                    />
                    <span>{meal.mealName}</span>
                  </div>
                ) : null;
              })}
            </div>
          </label>

          <button type="submit">
            {editingPlan ? 'Update Subscription Plan' : 'Add Subscription Plan'}
          </button>
          <button type="button" onClick={() => setIsAdding(false)} className="cancel-btn">
            Cancel
          </button>
        </form>
      )
      }

      <div className="subscription-list">
        <h3>Existing Subscription Plans</h3>
        {plans.map((plan) => (
          <div key={plan._id} className="subscription-item">
            <h4>{plan.planName}</h4>
            <p>{plan.description}</p>
            <p>Price: ${plan.price}</p>
            <p>Duration: {plan.duration}</p>

            <div className="subscription-meals">
              <h5>Included Meals:</h5>
              <div className="meal-grid">
                {plan.meals.map((meal) => (
                  <div key={meal._id} className="meal-card">
                    {meal.imageURL && (
                      <img
                        src={meal.imageURL}
                        alt={meal.mealName}
                        onError={handleImageError}
                        className="meal-image"
                      />
                    )}
                    <span className="meal-name">{meal.mealName}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="subscription-actions">
              <button onClick={() => handleEditClick(plan)} className="edit-btn">Edit</button>
              <button onClick={() => handleDeleteClick(plan._id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default SubscriptionPlanList;
