// This is the standard entry point for a React web application
// It mounts the App component into the 'root' div in index.html

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/App.css'; // Import global styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);