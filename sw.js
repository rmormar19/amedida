/* AMedida · service worker: abre sin internet y se actualiza solo */
const V = 'amedida-202611020212';
const BASE = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
const EXTRA = ["./cuerpo/mapa_brazos.webp", "./cuerpo/mapa_espalda.webp", "./cuerpo/mapa_pecho.webp", "./cuerpo/mapa_pierna.webp", "./cuerpo/pecho2.webp", "./cuerpo/pierna.webp", "./laminas/aductores.webp", "./laminas/bulgara.webp", "./laminas/curl.webp", "./laminas/curlinclinado.webp", "./laminas/curlpred.webp", "./laminas/extension.webp", "./laminas/fondos.webp", "./laminas/gemelosprensa.webp", "./laminas/gen_abp.webp", "./laminas/gen_adu.webp", "./laminas/gen_apc.webp", "./laminas/gen_cbp.webp", "./laminas/gen_cma.webp", "./laminas/gen_eta.webp", "./laminas/gen_etb.webp", "./laminas/gen_etp.webp", "./laminas/gen_etu.webp", "./laminas/gen_pan.webp", "./laminas/gen_ppb.webp", "./laminas/hack.webp", "./laminas/hipthrust.webp", "./laminas/jalon.webp", "./laminas/patada.webp", "./laminas/prensa45.webp", "./laminas/pressinclinado.webp", "./laminas/pressmilitar.webp", "./laminas/remopolea.webp", "./laminas/remot.webp", "./laminas/rumano.webp", "./laminas/sentadilla.webp", "./laminas/smith.webp", "./laminas/tricmanc.webp", "./laminas/vuelosmanc.webp", "./laminas/vuelospolea.webp"];

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

/* avisos con la app cerrada: el aviso llega vacío y el texto se le pide al puente con el link del cliente */
self.addEventListener('push', e => {
  e.waitUntil((async () => {
    let t = 'A medida', b = 'Tu entrenador actualizó tu rutina. Tocá para verla.';
    try {
      const R = await (await caches.open('am-real')).match('./__real.json');
      if (R) {
        const real = await R.json();
        const res = await Promise.race([fetch('https://script.google.com/macros/s/' + real.p + '/exec?accion=aviso&token=' + encodeURIComponent(real.token)), new Promise((_, no) => setTimeout(() => no(new Error('t')), 6000))]);
        const j = await res.json(); if (j && j.ok && j.aviso) { t = j.aviso.titulo || t; b = j.aviso.cuerpo || b; }
      }
    } catch (err) {}
    await self.registration.showNotification(t, { body: b, icon: './icons/icon-192.png', badge: './icons/icon-192.png', tag: 'amedida-rutina', renotify: true, data: { url: './?aviso=1' } });
  })());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
    for (const w of ws) { if ('focus' in w) { w.postMessage('am-aviso'); return w.focus(); } }
    return self.clients.openWindow((e.notification.data && e.notification.data.url) || './');
  }));
});
