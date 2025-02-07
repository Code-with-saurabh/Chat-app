// This file handles the registration of a service worker for your app

// Check if service workers are supported in the current environment
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname === '127.0.0.1'
);

export function register() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // The service worker file is located at /service-worker.js
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // Check if service worker exists in localhost
        checkValidServiceWorker(swUrl);
      } else {
        // Register the service worker in production
        registerValidSW(swUrl);
      }
    });
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      console.log('Service Worker registration successful with scope: ', registration.scope);
    })
    .catch(error => {
      console.error('Service Worker registration failed: ', error);
    });
}

function checkValidServiceWorker(swUrl) {
  // Check if the service worker exists
  fetch(swUrl)
    .then(response => {
      if (
        response.status === 404 ||
        response.type === 'error'
      ) {
        // No service worker found. Possibly the app is not being served from a server.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister();
        });
      } else {
        // Service worker exists
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}

