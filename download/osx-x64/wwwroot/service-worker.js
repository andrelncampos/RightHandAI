// Right Hand AI+ — Service Worker
// Strategy: Cache app shell for installability + offline fallback page
// API calls and dynamic content always go to network (app requires server)

const CACHE_NAME = 'right-hand-ai-shell-v1';
const OFFLINE_PAGE = '/offline.html';

// App shell: static assets that make the app installable and fast to load
const SHELL_ASSETS = [
    '/',
    '/offline.html',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Cache each asset individually so one failure doesn't prevent others
            return Promise.allSettled(
                SHELL_ASSETS.map((url) => cache.add(url).catch(() => {
                    console.warn(`Failed to cache: ${url}`);
                }))
            );
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Clean up old caches
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        }).then(() => clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Only handle GET requests
    if (request.method !== 'GET') return;

    // Skip non-http(s) requests (e.g., chrome-extension://)
    if (!request.url.startsWith('http')) return;

    // For navigation requests: network-first with offline fallback
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(() => {
                return caches.match(OFFLINE_PAGE);
            })
        );
        return;
    }

    // For static assets (_framework, _content, css, js, icons): cache-first
    const url = new URL(request.url);
    const isStaticAsset = url.pathname.startsWith('/_framework/') ||
                          url.pathname.startsWith('/_content/') ||
                          url.pathname.startsWith('/css/') ||
                          url.pathname.startsWith('/js/') ||
                          url.pathname.startsWith('/icons/');

    if (isStaticAsset) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    // Cache successful responses for next time
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    }
                    return response;
                }).catch(() => {
                    // Static asset unavailable offline — return nothing
                    return new Response('', { status: 503 });
                });
            })
        );
        return;
    }

    // All other requests (API, SignalR, etc.): network only, no caching
});
