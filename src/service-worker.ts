
/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { BackgroundSyncPlugin } from 'workbox-background-sync'

declare const self: ServiceWorkerGlobalScope

// Precache all static assets
precacheAndRoute(self.__WB_MANIFEST)

// Cache the Kenya-specific data
registerRoute(
  ({ url }) => url.pathname.includes('/api/kenya'),
  new NetworkFirst({
    cacheName: 'kenya-api-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
)

// Cache map tiles for offline access
registerRoute(
  ({ url }) => url.pathname.includes('/tiles/'),
  new CacheFirst({
    cacheName: 'map-tiles-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 500,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
)

// Cache optimization models and data
registerRoute(
  ({ url }) => url.pathname.includes('/models/'),
  new StaleWhileRevalidate({
    cacheName: 'optimization-models-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 14 * 24 * 60 * 60, // 14 days
      }),
    ],
  })
)

// Cache informal market data
registerRoute(
  ({ url }) => url.pathname.includes('/api/markets'),
  new NetworkFirst({
    cacheName: 'informal-markets-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 3 * 24 * 60 * 60, // 3 days
      }),
    ],
  })
)

// Handle offline fallback
self.addEventListener('fetch', (event) => {
  if (!navigator.onLine) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response
        }
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html')
        }
        return new Response('Offline content not available')
      })
    )
  }
})

// Background sync for offline data collection
const bgSyncPlugin = new BackgroundSyncPlugin('offlineQueue', {
  maxRetentionTime: 24 * 60 // Retry for up to 24 hours
})

registerRoute(
  ({ url }) => url.pathname.includes('/api/data-collection'),
  new NetworkFirst({
    cacheName: 'offline-data-collection',
    plugins: [bgSyncPlugin],
  })
)

// Specific sync for market data submissions
const marketSyncPlugin = new BackgroundSyncPlugin('marketDataQueue', {
  maxRetentionTime: 48 * 60 // Retry for up to 48 hours for critical market data
})

registerRoute(
  ({ url }) => url.pathname.includes('/api/markets/submit'),
  new NetworkFirst({
    cacheName: 'market-data-submissions',
    plugins: [marketSyncPlugin],
  })
)
