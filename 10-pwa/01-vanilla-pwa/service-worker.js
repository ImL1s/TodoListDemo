/**
 * PWA Todo List - Service Worker
 * 實現離線功能、緩存策略、後台同步、推送通知等 PWA 核心特性
 */

// 緩存版本號（更新時需修改以觸發新的緩存）
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `pwa-todo-${CACHE_VERSION}`;
const DATA_CACHE_NAME = `pwa-todo-data-${CACHE_VERSION}`;

// 需要緩存的靜態資源
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/style.css',
  '/js/app.js',
  '/js/db.js',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-180x180.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// API 端點（用於數據緩存）
const API_CACHE_URLS = [
  '/api/todos'
];

/**
 * Service Worker 安裝事件
 * 在安裝時緩存所有靜態資源
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('[Service Worker] Installed successfully');
        // 立即激活新的 Service Worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

/**
 * Service Worker 激活事件
 * 清理舊版本的緩存
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // 刪除舊版本的緩存
            if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activated successfully');
        // 立即控制所有頁面
        return self.clients.claim();
      })
  );
});

/**
 * Fetch 事件處理
 * 實現各種緩存策略
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳過 Chrome 擴展請求
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // API 請求：Network First 策略
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // 靜態資源：Cache First 策略
  event.respondWith(cacheFirstStrategy(request));
});

/**
 * Cache First 策略
 * 優先從緩存讀取，緩存不存在則從網絡獲取
 * 適用於靜態資源（HTML, CSS, JS, 圖片等）
 */
async function cacheFirstStrategy(request) {
  try {
    // 嘗試從緩存獲取
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[Service Worker] Cache hit:', request.url);
      return cachedResponse;
    }

    // 緩存不存在，從網絡獲取
    console.log('[Service Worker] Cache miss, fetching:', request.url);
    const networkResponse = await fetch(request);

    // 僅緩存成功的 GET 請求
    if (request.method === 'GET' && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);

    // 如果是 HTML 請求，返回離線頁面
    if (request.destination === 'document') {
      const cache = await caches.open(CACHE_NAME);
      return cache.match('/index.html');
    }

    throw error;
  }
}

/**
 * Network First 策略
 * 優先從網絡獲取，失敗則從緩存讀取
 * 適用於 API 請求（需要最新數據）
 */
async function networkFirstStrategy(request) {
  try {
    // 嘗試從網絡獲取
    console.log('[Service Worker] Fetching from network:', request.url);
    const networkResponse = await fetch(request);

    // 緩存成功的響應
    if (networkResponse.status === 200) {
      const cache = await caches.open(DATA_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network failed, using cache:', request.url);

    // 網絡失敗，嘗試從緩存獲取
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

/**
 * Stale While Revalidate 策略
 * 立即返回緩存，同時在後台更新
 * 適用於需要快速響應但也要保持更新的資源
 */
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  // 在後台更新緩存
  const fetchPromise = fetch(request).then((networkResponse) => {
    cache.put(request, networkResponse.clone());
    return networkResponse;
  });

  // 立即返回緩存（如果存在）或等待網絡響應
  return cachedResponse || fetchPromise;
}

/**
 * 後台同步事件
 * 當網絡恢復時同步數據
 */
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync triggered:', event.tag);

  if (event.tag === 'sync-todos') {
    event.waitUntil(syncTodos());
  }
});

/**
 * 同步待辦事項數據
 */
async function syncTodos() {
  try {
    console.log('[Service Worker] Syncing todos...');

    // 這裡可以實現與後端 API 的同步邏輯
    // 由於這是純前端應用，我們主要確保 IndexedDB 數據完整性

    // 通知所有客戶端同步完成
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETED',
        timestamp: Date.now()
      });
    });

    console.log('[Service Worker] Sync completed');
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
    throw error;
  }
}

/**
 * 推送通知事件
 * 接收並顯示推送通知
 */
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');

  const options = {
    body: event.data ? event.data.text() : '您有新的待辦事項',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'todo-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: '查看',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: '關閉',
        icon: '/icons/action-dismiss.png'
      }
    ],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('PWA Todo List', options)
  );
});

/**
 * 通知點擊事件
 * 處理用戶點擊通知的行為
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'view') {
    // 打開應用
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // 如果已有窗口打開，聚焦到該窗口
          for (let client of clientList) {
            if (client.url === '/' && 'focus' in client) {
              return client.focus();
            }
          }
          // 否則打開新窗口
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
});

/**
 * 消息事件
 * 與頁面通信
 */
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION',
      version: CACHE_VERSION
    });
  }

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        event.ports[0].postMessage({
          type: 'CACHE_CLEARED',
          success: true
        });
      })
    );
  }
});

/**
 * 定期後台同步（Periodic Background Sync）
 * Chrome 80+ 支援
 */
self.addEventListener('periodicsync', (event) => {
  console.log('[Service Worker] Periodic sync triggered:', event.tag);

  if (event.tag === 'update-todos') {
    event.waitUntil(syncTodos());
  }
});

/**
 * 錯誤處理
 */
self.addEventListener('error', (event) => {
  console.error('[Service Worker] Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[Service Worker] Unhandled rejection:', event.reason);
});

/**
 * 工具函數：清理舊緩存
 */
async function cleanupOldCaches() {
  const cacheWhitelist = [CACHE_NAME, DATA_CACHE_NAME];
  const cacheNames = await caches.keys();

  return Promise.all(
    cacheNames.map((cacheName) => {
      if (!cacheWhitelist.includes(cacheName)) {
        console.log('[Service Worker] Deleting old cache:', cacheName);
        return caches.delete(cacheName);
      }
    })
  );
}

/**
 * 工具函數：預緩存資源
 */
async function precacheResources(resources) {
  const cache = await caches.open(CACHE_NAME);
  return cache.addAll(resources);
}

/**
 * 工具函數：更新緩存
 */
async function updateCache(request, response) {
  const cache = await caches.open(CACHE_NAME);
  return cache.put(request, response);
}

/**
 * 工具函數：從緩存中刪除資源
 */
async function removeFromCache(request) {
  const cache = await caches.open(CACHE_NAME);
  return cache.delete(request);
}

console.log('[Service Worker] Loaded, version:', CACHE_VERSION);
