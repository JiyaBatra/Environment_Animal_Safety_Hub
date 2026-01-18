const CACHE_NAME = 'ecolife-v2.1';
const STATIC_CACHE = 'ecolife-static-v2.1';
const DYNAMIC_CACHE = 'ecolife-dynamic-v2.1';
const IMAGE_CACHE = 'ecolife-images-v2.1';

// Static assets to cache immediately (using original filenames since minified in place)
const staticAssets = [
  '/',
  '/index.html',
  '/manifest.json',
  // Core CSS (minified in place)
  '/css/global/variables.css',
  '/css/global/utilities.css',
  '/css/style.css',
  '/css/components/navbar.css',
  '/css/components/footer.css',
  // Core JS (minified in place)
  '/js/main.js',
  '/js/global/main.js',
  '/js/components/loadComponents.js',
  // Critical images
  '/assets/images/others/envirnoment-logo.png',
  '/assets/images/others/Logo.png'
];

// Runtime caching patterns
const cacheStrategies = {
  // Cache-first for static assets
  static: {
    pattern: /\.(?:css|js|woff2?|ttf|eot)$/,
    strategy: 'cache-first'
  },
  // Cache-first for images
  images: {
    pattern: /\.(?:png|jpg|jpeg|gif|webp|avif|svg)$/,
    strategy: 'cache-first'
  },
  // Network-first for API calls
  api: {
    pattern: /\/api\//,
    strategy: 'network-first'
  },
  // Network-first for pages
  pages: {
    pattern: /\.(?:html|htm)$/,
    strategy: 'network-first'
  }
};

// Install event - cache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(staticAssets)),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (![STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE].includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event with intelligent caching strategies
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip external requests
  if (!url.origin.includes(self.location.origin)) return;

  // Determine caching strategy
  let strategy = 'network-first'; // Default

  for (const [key, config] of Object.entries(cacheStrategies)) {
    if (config.pattern.test(url.pathname)) {
      strategy = config.strategy;
      break;
    }
  }

  // Apply caching strategy
  switch (strategy) {
    case 'cache-first':
      event.respondWith(cacheFirst(event.request));
      break;
    case 'network-first':
      event.respondWith(networkFirst(event.request));
      break;
    case 'stale-while-revalidate':
      event.respondWith(staleWhileRevalidate(event.request));
      break;
    default:
      event.respondWith(fetch(event.request));
  }
});

// Cache-first strategy (for static assets)
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Cache-first failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy (for dynamic content)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network-first failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline actions like form submissions
  console.log('Background sync triggered');
}

// Push notifications (for future use)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/assets/images/others/envirnoment-logo.png',
      badge: '/assets/images/others/envirnoment-logo.png',
      vibrate: [100, 50, 100],
      data: data.url
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});

// Performance monitoring
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'GET_CACHE_STATS') {
    getCacheStats().then(stats => {
      event.ports[0].postMessage(stats);
    });
  }
});

async function getCacheStats() {
  const cacheNames = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];
  const stats = {};

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    stats[cacheName] = keys.length;
  }

  return stats;
}