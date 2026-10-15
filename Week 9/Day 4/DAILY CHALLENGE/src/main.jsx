import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import AgeTracker from './AgeTracker.jsx';
import store from './ageStore.js';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AgeTracker />
    </Provider>
  </React.StrictMode>,
);
