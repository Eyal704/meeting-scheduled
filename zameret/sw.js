// Tzameret field app: shows a system notification for a new call (also when the phone is locked, via Web Push) and brings the app back on tap.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(
    self.registration.showNotification(d.title || 'צמרת מעליות', {
      body: d.body || '',
      tag: d.tag || 'zameret',
      renotify: true,
      requireInteraction: !!d.urgent,
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      lang: 'he',
      dir: 'rtl',
      vibrate: d.urgent ? [500, 150, 500, 150, 900] : [300, 120, 300],
    }),
  );
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
      for (const c of cs) if ('focus' in c) return c.focus();
      return self.clients.openWindow(self.registration.scope);
    }),
  );
});
