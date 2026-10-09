const CACHE_NAME = 'karawan-player-v7';
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then(networkResponse => {
        // كاش فقط للـ assets الثابتة (مش API calls)
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === 'basic'
        ) {
          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
        }
        return networkResponse;
      }).catch(() => {
        // لو الشبكة انقطعت، رجع الـ index.html للـ offline
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
