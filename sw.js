/* AMedida · service worker: abre sin internet y se actualiza solo */
const V = 'amedida-202611181125';
const BASE = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
const EXTRA = ["./cuerpo/capa_abductor.webp", "./cuerpo/capa_biceps.webp", "./cuerpo/capa_core.webp", "./cuerpo/capa_espalda.webp", "./cuerpo/capa_gluteo.webp", "./cuerpo/capa_hombro.webp", "./cuerpo/capa_pecho.webp", "./cuerpo/capa_piernas.webp", "./cuerpo/capa_triceps.webp", "./cuerpo/mapa_brazos.webp", "./cuerpo/mapa_espalda.webp", "./cuerpo/mapa_pecho.webp", "./cuerpo/mapa_pierna.webp", "./cuerpo/modelo_base.webp", "./cuerpo/pecho2.webp", "./cuerpo/pierna.webp", "./cuerpo/mujer/capa_abductor.webp", "./cuerpo/mujer/capa_biceps.webp", "./cuerpo/mujer/capa_core.webp", "./cuerpo/mujer/capa_espalda.webp", "./cuerpo/mujer/capa_gluteo.webp", "./cuerpo/mujer/capa_hombro.webp", "./cuerpo/mujer/capa_pecho.webp", "./cuerpo/mujer/capa_piernas.webp", "./cuerpo/mujer/capa_triceps.webp", "./cuerpo/mujer/mapa_brazos.webp", "./cuerpo/mujer/mapa_espalda.webp", "./cuerpo/mujer/mapa_pecho.webp", "./cuerpo/mujer/mapa_pierna.webp", "./cuerpo/mujer/modelo_base.webp", "./laminas/abdpolea.webp", "./laminas/abductores.webp", "./laminas/aductores.webp", "./laminas/aperturas.webp", "./laminas/bulgara.webp", "./laminas/cruce.webp", "./laminas/crunch.webp", "./laminas/crunchpeso.webp", "./laminas/crunchpolea.webp", "./laminas/curl.webp", "./laminas/curlbayes.webp", "./laminas/curlinclinado.webp", "./laminas/curlmanc.webp", "./laminas/curlmartillo.webp", "./laminas/curlpolea.webp", "./laminas/curlpred.webp", "./laminas/curlsentado.webp", "./laminas/curlw.webp", "./laminas/dominadas.webp", "./laminas/elevpiernas.webp", "./laminas/estocadasmith.webp", "./laminas/extension.webp", "./laminas/flexiones.webp", "./laminas/fondos.webp", "./laminas/frances.webp", "./laminas/frontal.webp", "./laminas/gemelosprensa.webp", "./laminas/gen_abp.webp", "./laminas/gen_adu.webp", "./laminas/gen_apc.webp", "./laminas/gen_cbp.webp", "./laminas/gen_cma.webp", "./laminas/gen_eta.webp", "./laminas/gen_etb.webp", "./laminas/gen_etp.webp", "./laminas/gen_etu.webp", "./laminas/gen_pan.webp", "./laminas/gen_ppb.webp", "./laminas/goblet.webp", "./laminas/hack.webp", "./laminas/hiper45.webp", "./laminas/hipthrust.webp", "./laminas/hipthrustmaq.webp", "./laminas/jalon.webp", "./laminas/patada.webp", "./laminas/patadamaq.webp", "./laminas/patadatric.webp", "./laminas/pecdeck.webp", "./laminas/pecdeckinv.webp", "./laminas/pendulo.webp", "./laminas/pesomuerto.webp", "./laminas/plancha.webp", "./laminas/prensa45.webp", "./laminas/prensahor.webp", "./laminas/pressbancasmith.webp", "./laminas/pressdecl.webp", "./laminas/pressinclinado.webp", "./laminas/pressinclsmith.webp", "./laminas/pressmanc.webp", "./laminas/pressmaq.webp", "./laminas/pressmilitar.webp", "./laminas/pressplano.webp", "./laminas/pullover.webp", "./laminas/remobarra.webp", "./laminas/remomanc.webp", "./laminas/remomaq.webp", "./laminas/remopolea.webp", "./laminas/remot.webp", "./laminas/rumano.webp", "./laminas/sentadilla.webp", "./laminas/smith.webp", "./laminas/stepup.webp", "./laminas/sumo.webp", "./laminas/tricbarra.webp", "./laminas/tricmanc.webp", "./laminas/tricpolea.webp", "./laminas/vuelopost.webp", "./laminas/vuelosmanc.webp", "./laminas/vuelospolea.webp", "./laminas/zancadas.webp"];
// 18 nov 2026 · huella de cada imagen: al publicar una versión nueva sólo se bajan las que cambiaron (antes se volvían a
// bajar las ~16 MB de láminas y cuerpos con cada versión, muchas veces con datos móviles) y, ya guardadas, no se vuelven a pedir
const HASH = {"./cuerpo/capa_abductor.webp": "52ac651ad933", "./cuerpo/capa_biceps.webp": "bd897cd18cd1", "./cuerpo/capa_core.webp": "5b54083501a3", "./cuerpo/capa_espalda.webp": "213303f468bc", "./cuerpo/capa_gluteo.webp": "b889d7aaeb52", "./cuerpo/capa_hombro.webp": "6beac862bec7", "./cuerpo/capa_pecho.webp": "425d9c5690a4", "./cuerpo/capa_piernas.webp": "71f3fb5759ec", "./cuerpo/capa_triceps.webp": "ed79272d53e6", "./cuerpo/mapa_brazos.webp": "a65f827a7431", "./cuerpo/mapa_espalda.webp": "d4119f2c06f2", "./cuerpo/mapa_pecho.webp": "8e2ef12e6e47", "./cuerpo/mapa_pierna.webp": "66ee05c2a97b", "./cuerpo/modelo_base.webp": "92afd6c54a9e", "./cuerpo/pecho2.webp": "f3d1aa6437a8", "./cuerpo/pierna.webp": "4eec5ceba973", "./cuerpo/mujer/capa_abductor.webp": "78822ae13ed6", "./cuerpo/mujer/capa_biceps.webp": "72a5f7f70b55", "./cuerpo/mujer/capa_core.webp": "ff4423a3dac7", "./cuerpo/mujer/capa_espalda.webp": "38e14f6762fa", "./cuerpo/mujer/capa_gluteo.webp": "da203065d088", "./cuerpo/mujer/capa_hombro.webp": "facb8229e172", "./cuerpo/mujer/capa_pecho.webp": "03872e9628d8", "./cuerpo/mujer/capa_piernas.webp": "13501d36abf1", "./cuerpo/mujer/capa_triceps.webp": "306e25d2efb4", "./cuerpo/mujer/mapa_brazos.webp": "43c9d2b6f180", "./cuerpo/mujer/mapa_espalda.webp": "5d14f582551e", "./cuerpo/mujer/mapa_pecho.webp": "541673bd6151", "./cuerpo/mujer/mapa_pierna.webp": "2fcb2c2ef101", "./cuerpo/mujer/modelo_base.webp": "9708e5e3dbf0", "./laminas/abdpolea.webp": "ddeaaf87ae16", "./laminas/abductores.webp": "f693d5192958", "./laminas/aductores.webp": "16064642d295", "./laminas/aperturas.webp": "1502f83558cb", "./laminas/bulgara.webp": "f15a8e00ebbe", "./laminas/cruce.webp": "9e48c91ce35b", "./laminas/crunch.webp": "0d388ad6175f", "./laminas/crunchpeso.webp": "6f3fe936a620", "./laminas/crunchpolea.webp": "bba717c349f9", "./laminas/curl.webp": "292781c1e189", "./laminas/curlbayes.webp": "4284c92d9fc4", "./laminas/curlinclinado.webp": "309a39f33269", "./laminas/curlmanc.webp": "057cf6f78aa6", "./laminas/curlmartillo.webp": "c15abb734069", "./laminas/curlpolea.webp": "10d4fdf5bd00", "./laminas/curlpred.webp": "d2acf48e3fde", "./laminas/curlsentado.webp": "83a98b40bf36", "./laminas/curlw.webp": "842bbd1b1c6f", "./laminas/dominadas.webp": "05f28e45cf9c", "./laminas/elevpiernas.webp": "4d737c8c5f5b", "./laminas/estocadasmith.webp": "5be4eee7e399", "./laminas/extension.webp": "9419adb063cd", "./laminas/flexiones.webp": "cd8639e27662", "./laminas/fondos.webp": "b2601b01f605", "./laminas/frances.webp": "29deca416b68", "./laminas/frontal.webp": "2f414cf1a0fa", "./laminas/gemelosprensa.webp": "fdbe0f23e383", "./laminas/gen_abp.webp": "027b6b596d46", "./laminas/gen_adu.webp": "abb46d75d7aa", "./laminas/gen_apc.webp": "ae068249614d", "./laminas/gen_cbp.webp": "fd644bd2b043", "./laminas/gen_cma.webp": "162832376526", "./laminas/gen_eta.webp": "c9379c926672", "./laminas/gen_etb.webp": "3901a6085255", "./laminas/gen_etp.webp": "bc57572300b0", "./laminas/gen_etu.webp": "b9b280db1668", "./laminas/gen_pan.webp": "f3fa7906604f", "./laminas/gen_ppb.webp": "d631f7759f95", "./laminas/goblet.webp": "3493c5eb8f8f", "./laminas/hack.webp": "f76c177e7726", "./laminas/hiper45.webp": "37961e363e73", "./laminas/hipthrust.webp": "50b3fc0ae6dc", "./laminas/hipthrustmaq.webp": "9d3f8a342367", "./laminas/jalon.webp": "24b32300211d", "./laminas/patada.webp": "07d434fe5a56", "./laminas/patadamaq.webp": "48d9381b8e68", "./laminas/patadatric.webp": "6b38f6ef9207", "./laminas/pecdeck.webp": "babc8e3fc16b", "./laminas/pecdeckinv.webp": "113041313888", "./laminas/pendulo.webp": "5220bcdfecd3", "./laminas/pesomuerto.webp": "785eb66ea218", "./laminas/plancha.webp": "f3844c43f94b", "./laminas/prensa45.webp": "82464ca1cb77", "./laminas/prensahor.webp": "631a2903e87b", "./laminas/pressbancasmith.webp": "e1ae744a0751", "./laminas/pressdecl.webp": "15cc38051f03", "./laminas/pressinclinado.webp": "cbb6fddba164", "./laminas/pressinclsmith.webp": "0b80c9e1b775", "./laminas/pressmanc.webp": "6d4917e86f9a", "./laminas/pressmaq.webp": "8088e7be4a1b", "./laminas/pressmilitar.webp": "007ef76a55b6", "./laminas/pressplano.webp": "de81c2ab8817", "./laminas/pullover.webp": "d6067bc884ed", "./laminas/remobarra.webp": "3421084726f9", "./laminas/remomanc.webp": "95da3aabe6ca", "./laminas/remomaq.webp": "45c524e665da", "./laminas/remopolea.webp": "ddf58497296f", "./laminas/remot.webp": "353edb4d84a2", "./laminas/rumano.webp": "3851f00524d3", "./laminas/sentadilla.webp": "00525186df04", "./laminas/smith.webp": "4fdad4fb1ce1", "./laminas/stepup.webp": "0ebc23a9f3a6", "./laminas/sumo.webp": "d98373ba1f78", "./laminas/tricbarra.webp": "b0dae07dde03", "./laminas/tricmanc.webp": "ae6a2648e6cb", "./laminas/tricpolea.webp": "b476b887b945", "./laminas/vuelopost.webp": "cea32205a7de", "./laminas/vuelosmanc.webp": "1319c71f864c", "./laminas/vuelospolea.webp": "c27db5438b27", "./laminas/zancadas.webp": "998073ba43b7"}, ALCANCE = new URL(self.registration.scope).pathname;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(async c => {
    await c.addAll(BASE);
    let viejo = null, hv = {};
    try {
      const ks = (await caches.keys()).filter(k => k.startsWith('amedida-') && k !== V).reverse();
      for (const k of ks) { const ck = await caches.open(k), r = await ck.match('./__huellas.json'); if (r) { viejo = ck; hv = await r.json(); break; } }
    } catch (x) {}
    await Promise.all(EXTRA.map(async u => {
      try {
        if (viejo && HASH[u] && hv[u] === HASH[u]) { const r = await viejo.match(u); if (r) { await c.put(u, r); return; } }
        await c.add(u);
      } catch (x) {}
    }));
    await c.put('./__huellas.json', new Response(JSON.stringify(HASH), { headers: { 'content-type': 'application/json' } }));
  }));
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
    // las imágenes con huella ya guardadas no cambian hasta la próxima versión: no se vuelven a pedir
    if (hit && propio && !u.search && HASH['./' + u.pathname.slice(ALCANCE.length)]) return hit;
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
