import React from 'react';
import { createRoot } from 'react-dom/client'; 
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import './index.css';  
import App from './App';
import * as serviceWorker from './serviceWorker';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Service worker registration
serviceWorker.unregister(); 
// or serviceWorker.register() if you want to enable the service worker