/**
 * @fileoverview Application Entry Point
 * 
 * This is the main entry file for the React application.
 * It demonstrates several fundamental React concepts:
 * 
 * Key Concepts:
 * 1. React 18 Features
 *    - createRoot API for concurrent rendering
 *    - StrictMode for development checks
 * 
 * 2. Application Bootstrap
 *    - DOM mounting point
 *    - Root component rendering
 *    - Global style imports
 * 
 * 3. Modern React Patterns
 *    - ES6 module imports
 *    - Component composition
 *    - Development mode features
 */

import React from 'react';
import { createRoot } from 'react-dom/client';  // React 18's new root API
import 'bootstrap/dist/css/bootstrap.min.css';  // Global Bootstrap styles
import './App.css';  // Application-wide styles
import App from './App';  // Root component

/**
 * Application Mounting
 * 
 * Steps:
 * 1. Get the root DOM element
 * 2. Create a React root using createRoot
 * 3. Render the App component inside StrictMode
 */
const container = document.getElementById('root');  // Get root DOM node
const root = createRoot(container);  // Create React root

// Render application with StrictMode for additional development checks
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
