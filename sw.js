// ShoreSquad Service Worker
// Provides offline functionality and caching

const CACHE_NAME = 'shoresquad-v1.0.0';
const STATIC_CACHE = 'shoresquad-static-v1';
const DYNAMIC_CACHE = 'shoresquad-dynamic-v1';

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/data/tips.json',
  '/manifest.json'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('🌊 ShoreSquad SW: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('🌊 ShoreSquad SW: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('🌊 ShoreSquad SW: Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('🌊 ShoreSquad SW: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('🌊 ShoreSquad SW: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🌊 ShoreSquad SW: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('🌊 ShoreSquad SW: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip external requests (APIs, CDNs)
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('🌊 ShoreSquad SW: Serving from cache', request.url);
          return cachedResponse;
        }
        
        // If not in cache, fetch from network and cache dynamic content
        return fetch(request)
          .then(networkResponse => {
            // Don't cache non-successful responses
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Cache dynamic content
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                console.log('🌊 ShoreSquad SW: Caching dynamic content', request.url);
                cache.put(request, responseToCache);
              });
            
            return networkResponse;
          })
          .catch(error => {
            console.log('🌊 ShoreSquad SW: Network fetch failed', error);
            
            // Serve offline fallback for navigation requests
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // Return error for other requests
            throw error;
          });
      })
  );
});

// Background sync for when user comes back online
self.addEventListener('sync', event => {
  console.log('🌊 ShoreSquad SW: Background sync', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync any pending data when back online
      syncPendingData()
    );
  }
});

// Push notification handler
self.addEventListener('push', event => {
  console.log('🌊 ShoreSquad SW: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New beach cleanup event available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Event',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('🌊 ShoreSquad Update', options)
  );
});

// Helper function to sync pending data
async function syncPendingData() {
  try {
    // Implementation for syncing any offline actions
    console.log('🌊 ShoreSquad SW: Syncing pending data...');
    
    // This could include:
    // - Sending stored volunteer signups
    // - Uploading cached user preferences
    // - Syncing offline interactions
    
    console.log('🌊 ShoreSquad SW: Data sync complete');
  } catch (error) {
    console.error('🌊 ShoreSquad SW: Data sync failed', error);
  }
}

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('🌊 ShoreSquad SW: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    // Open the app to the events section
    event.waitUntil(
      clients.openWindow('/#map')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('🌊 ShoreSquad Service Worker loaded successfully');
