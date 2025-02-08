import React from 'react';
import { createRoot } from 'react-dom/client'; 
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import './index.css';  
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import store from './store/store.js';

createRoot(document.getElementById('root')).render(
<Provider store={store}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </Provider>
);

// Service worker registration
serviceWorker.unregister(); 
// or serviceWorker.register() if you want to enable the service worker