// Service Worker for Free TV - Caching and Performance
const CACHE_NAME = 'freetv-v1.0.0';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/performance.js',
    '/manifest.json'
];

const API_CACHE_NAME = 'freetv-api-v1.0.0';
const API_URLS = [
    'https://iptv-org.github.io/api/channels.json',
    'https://iptv-org.github.io/api/streams.json'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Handle API requests with cache-first strategy for performance
    if (API_URLS.some(apiUrl => request.url.includes(apiUrl))) {
        event.respondWith(
            caches.open(API_CACHE_NAME).then(cache => {
                return cache.match(request).then(cachedResponse => {
                    if (cachedResponse) {
                        // Return cached version immediately
                        // Update cache in background
                        fetch(request).then(response => {
                            if (response.ok) {
                                cache.put(request, response.clone());
                            }
                        }).catch(() => {
                            // Network failed, cached version is still good
                        });
                        return cachedResponse;
                    }
                    
                    // No cache, fetch from network
                    return fetch(request).then(response => {
                        if (response.ok) {
                            cache.put(request, response.clone());
                        }
                        return response;
                    });
                });
            })
        );
        return;
    }
    
    // Handle static assets with cache-first strategy
    if (STATIC_ASSETS.includes(url.pathname) || request.destination === 'style' || request.destination === 'script') {
        event.respondWith(
            caches.match(request).then(cachedResponse => {
                return cachedResponse || fetch(request).then(response => {
                    if (response.ok && request.method === 'GET') {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                });
            })
        );
        return;
    }
    
    // For all other requests, try network first
    event.respondWith(
        fetch(request).catch(() => {
            return caches.match(request);
        })
    );
});

// Handle background sync for offline functionality
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Update API cache when back online
    try {
        const cache = await caches.open(API_CACHE_NAME);
        for (const url of API_URLS) {
            const response = await fetch(url);
            if (response.ok) {
                await cache.put(url, response);
            }
        }
    } catch (error) {
        console.log('Background sync failed:', error);
    }
}