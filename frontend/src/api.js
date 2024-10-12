// In api.js (Use sessionStorage instead of localStorage)
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Set the authorization token for requests if available
API.interceptors.request.use((req) => {
  const token = sessionStorage.getItem('token');  // Get the token from sessionStorage
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;  // Attach token to Authorization header
  }
  return req;
});

// User registration and login
export const registerUser = (formData) => API.post('/auth/register', formData);
export const loginUser = (formData) => API.post('/auth/login', formData);

// Provider profile APIs
export const getProviderProfile = () => API.get('/provider/profile');
export const updateProviderProfile = (profileData) => API.put('/provider/profile', profileData);

// Menu item APIs
export const getMenuItems = () => API.get('/provider/menu');
export const addMenuItem = (menuItemData) => API.post('/provider/menu', menuItemData);
export const updateMenuItem = (id, menuItemData) => API.put(`/provider/menu/${id}`, menuItemData); // Added this line
export const deleteMenuItem = (id) => API.delete(`/provider/menu/${id}`); // Added this line
