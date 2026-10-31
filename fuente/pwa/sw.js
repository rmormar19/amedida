/* AMedida · service worker: abre sin internet y se actualiza solo */
const V = 'amedida-__VER__';
const BASE = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
const EXTRA = __EXTRA__;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(BASE).then(() => Promise.all(EXTRA.map(u => c.add(u).catch(() => {}))))));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('amedida-') && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data === 'saltar') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET') return;
  // los videos se piden por partes (Safari): van directo a la red
  if (r.headers.has('range') || u.pathname.endsWith('.mp4')) return;
  // la app: primero la red (para tener la última versión), si no hay internet, la guardada
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(V).then(k => k.put('./index.html', c)); return res; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  // imágenes, íconos y letras: la guardada al instante y se refresca por detrás
  const propio = u.origin === location.origin, letras = /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if (!propio && !letras) return;
  e.respondWith(caches.open(V).then(c => c.match(r).then(hit => {
    const red = fetch(r).then(res => { if (res && (res.ok || res.type === 'opaque')) c.put(r, res.clone()); return res; }).catch(() => hit);
    return hit || red;
  })));
});
