import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import App from './App';  // The main component to render
import './index.css'; // Global styles

const container = document.getElementById('root'); // Find the root container
const root = createRoot(container); // Create a root

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
