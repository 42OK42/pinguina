// Service worker: shows reminder pushes and opens the page when one is tapped. No caching.
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(ev){ ev.waitUntil(self.clients.claim()); });
self.addEventListener('push', function(ev){
  var d = {};
  try { d = ev.data ? ev.data.json() : {}; } catch(e) { d = { body: ev.data ? ev.data.text() : '' }; }
  ev.waitUntil(self.registration.showNotification(d.title || 'Pingüina 🐧', {
    body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png', tag: d.slot || 'pinguina', renotify: true,
    data: { url: d.url || './', slot: d.slot || null }
  }));
});
self.addEventListener('notificationclick', function(ev){
  ev.notification.close();
  var data = ev.notification.data || {}, url = new URL(data.url || './', self.registration.scope).href;
  ev.waitUntil(self.clients.matchAll({ type:'window', includeUncontrolled:true }).then(function(list){
    for (var i = 0; i < list.length; i++){
      if (list[i].url.indexOf(self.registration.scope) === 0){ list[i].postMessage({ open: data.url || './' }); return list[i].focus(); }
    }
    return self.clients.openWindow(url);
  }));
});
