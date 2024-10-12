import React, { useState, useEffect } from 'react';
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '../api'; // Import API functions
import './MenuItemList.css'; // Custom CSS for menu list

const MenuItemList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isAdding, setIsAdding] = useState(false); // State to control the visibility of the add menu form
  const [newItem, setNewItem] = useState({
    mealName: '',
    description: '',
    price: '',
    imageURL: '',
    mealType: 'vegetarian',
  });
  const [editingItem, setEditingItem] = useState(null); // Track the item being edited

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await getMenuItems();
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    fetchMenuItems();
  }, []);

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddNewItemClick = () => {
    setIsAdding(true); // Show the add menu item form
    setEditingItem(null); // Reset editing
  };

  const handleEditClick = (item) => {
    setEditingItem(item); // Set the item to be edited
    setNewItem(item); // Populate the form with the item's current data
    setIsAdding(true); // Show the form to edit the item
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteMenuItem(id);
      setMenuItems(menuItems.filter((item) => item._id !== id)); // Remove the deleted item from the list
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Update existing menu item
        await updateMenuItem(editingItem._id, newItem);
        setMenuItems(menuItems.map((item) => (item._id === editingItem._id ? newItem : item)));
      } else {
        // Add new menu item
        const response = await addMenuItem(newItem);
        setMenuItems([...menuItems, response.data]);
      }
      setNewItem({ mealName: '', description: '', price: '', imageURL: '', mealType: 'vegetarian' });
      setIsAdding(false); // Hide the form after submission
    } catch (error) {
      console.error('Error adding/updating menu item:', error);
    }
  };

  // Cancel form submission and hide the form
  const handleCancelClick = () => {
    setNewItem({ mealName: '', description: '', price: '', imageURL: '', mealType: 'vegetarian' });
    setIsAdding(false); // Hide the form
    setEditingItem(null); // Reset editing
  };

  return (
    <div className="menu-container">
      <h2>Manage Menu Items</h2>

      {/* Button to add new menu item */}
      {!isAdding && (
        <button onClick={handleAddNewItemClick} className="add-new-item-btn">
          Add New Menu Item
        </button>
      )}

      {/* Form for adding or editing a menu item */}
      {isAdding && (
        <form onSubmit={handleSubmit}>
          <label>
            Meal Name:
            <input
              type="text"
              name="mealName"
              value={newItem.mealName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={newItem.description}
              onChange={handleChange}
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={newItem.price}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Image URL:
            <input
              type="text"
              name="imageURL"
              value={newItem.imageURL}
              onChange={handleChange}
            />
          </label>
          <label>
            Meal Type:
            <select name="mealType" value={newItem.mealType} onChange={handleChange}>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
            </select>
          </label>
          <button type="submit">
            {editingItem ? 'Update Menu Item' : 'Add Menu Item'}
          </button>
          <button type="button" onClick={handleCancelClick} className="cancel-btn">
            Cancel
          </button> {/* Cancel button */}
        </form>
      )}

      {/* List of existing menu items */}
      <div className="menu-list">
        <h3>Existing Menu Items</h3>
        {menuItems.map((item) => (
          <div key={item._id} className="menu-item">
            <h4>{item.mealName}</h4>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <button onClick={() => handleEditClick(item)} className="edit-btn">Edit</button>
            <button onClick={() => handleDeleteClick(item._id)} className="delete-btn">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuItemList;
