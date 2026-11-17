const CACHE='massad-field-v8';
const INDEX=new URL('./index.html',self.location.href).href;
const FILES=['./index.html','./style.css?v=8','./gate.js?v=8','./app.enc.json?v=8','./logo.png','./vendor/jspdf.umd.min.js','./vendor/html-to-image.js'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(file=>new Request(new URL(file,self.location.href),{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('massad-field-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  if(event.request.mode==='navigate'){
   const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),5000);
   try{const response=await fetch(event.request,{cache:'no-store',signal:abort.signal});if(response.ok&&(!url.pathname.split('/').pop()||url.pathname.endsWith('/index.html')))await cache.put(INDEX,response.clone());return response;}
   catch{return await cache.match(INDEX)||Response.error();}
   finally{clearTimeout(timer);}
  }
  return await cache.match(event.request)||fetch(event.request);
 })());
});
