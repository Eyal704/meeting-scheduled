const CACHE='massad-field-v5';
const FILES=['./','./index.html','./style.css?v=5','./app.js?v=5','./email.js?v=5','./checklist.js','./logo.png','./pdf.js','./vendor/jspdf.umd.min.js','./vendor/html-to-image.js'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('massad-field-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;event.respondWith(caches.open(CACHE).then(async cache=>await cache.match(event.request)||(event.request.mode==='navigate'?await cache.match('./index.html'):null)||fetch(event.request)));});
