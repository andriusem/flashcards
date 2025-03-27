// Service Worker for Phrasal Verb Flashcards PWA

const CACHE_NAME = 'flashcards-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/js/bundle.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Installation - Cache assets
/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation - Clean up old caches
/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null; // Return null for caches we want to keep
        })
      );
    })
  );
});

// Fetch - Serve from cache, fallback to network
/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request because it's a stream and can only be consumed once
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response because it's a stream and can only be consumed once
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                // Don't cache if it's a data API call or external resource
                const url = new URL(event.request.url);
                /* eslint-disable-next-line no-restricted-globals */
                if (url.pathname.includes('/api/') || url.origin !== self.location.origin) {
                  return;
                }
                cache.put(event.request, responseToCache);
              });
              
            return response;
          }
        );
      })
  );
});
