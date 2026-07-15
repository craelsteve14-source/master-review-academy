import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

// iOS Safari only applies :active CSS states to elements that have a touch
// listener registered somewhere on the page - without this, the circular
// tap-fade effect on buttons/nav items/cards never engages on tap.
document.addEventListener('touchstart', function () {}, false);
