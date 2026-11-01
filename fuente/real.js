/* ================= cliente real: la app conectada al Monitor por el puente =================
   El link que manda Ricky trae ?c=<token>&p=<id del puente>. Con eso la app:
   · trae del puente la rutina, las semanas anteriores y las medidas del cliente (sólo las suyas);
   · manda lo que el cliente hace (series, notas, sesión, día libre) al buzón del puente.
   Sin link, la app sigue siendo la demo. */
var REAL=null,CLAVE_REAL='amedida-real',CLAVE_ENV='amedida-envios',CLAVE_RC='amedida-real-c';
(function(){var q=new URLSearchParams(location.search),c=q.get('c'),p=q.get('p'),g=(q.get('g')||'').toLowerCase();
 try{var prev=JSON.parse(localStorage.getItem(CLAVE_REAL)||'null');
  if(c&&p&&/^[\w-]{20,}$/.test(c)&&/^[\w-]{20,}$/.test(p)){
   if(!prev||prev.token!==c){['amedida-nueva-v1','amedida-notas-v1','amedida-ses-v1','amedida-cardio-v1','amedida-panel-h',CLAVE_ENV,CLAVE_RC].forEach(function(k){localStorage.removeItem(k);});
    localStorage.setItem(CLAVE_REAL,JSON.stringify({token:c,p:p,g:g}));location.reload();return;}
   if(g&&prev.g!==g){prev.g=g;localStorage.setItem(CLAVE_REAL,JSON.stringify(prev));}}
  REAL=JSON.parse(localStorage.getItem(CLAVE_REAL)||'null');}catch(e){}})();
function urlPuente(){return 'https://script.google.com/macros/s/'+REAL.p+'/exec';}
function nombreReal(c){NOMBRE=String(c.nombre||'').trim().split(/\s+/)[0]||NOMBRE;}
function linkInvalido(){toast('Tu link ya no es válido. Pedile uno nuevo a tu entrenador.');}
/* lo que viene del puente */
var trayendo=false;
function traerCliente(){if(!REAL||trayendo)return;trayendo=true;
 fetch(urlPuente()+'?accion=cliente&token='+encodeURIComponent(REAL.token),{cache:'no-store'}).then(function(r){return r.json();}).then(function(r){trayendo=false;
  if(!r||!r.ok){if(r&&(r.error==='link'||r.error==='cliente'))linkInvalido();return;}
  var c=r.cliente,txt=JSON.stringify(c),ant=null;try{ant=localStorage.getItem(CLAVE_RC);}catch(e){}
  try{localStorage.setItem(CLAVE_RC,txt);}catch(e){}
  if(ant===txt&&PANEL)return;nombreReal(c);AM_PANEL(c,{silencio:!PANEL});}).catch(function(){trayendo=false;});}
/* lo que sale hacia el puente: se guarda y se reintenta hasta que llega */
var ENV=[];try{ENV=JSON.parse(localStorage.getItem(CLAVE_ENV)||'[]')||[];}catch(e){}
function guardarEnv(){try{localStorage.setItem(CLAVE_ENV,JSON.stringify(ENV));}catch(e){}}
var enviando=false;
function enviarPuente(){if(!REAL||enviando||!ENV.length)return;enviando=true;var lote=ENV.slice(0,50);
 fetch(urlPuente(),{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({token:REAL.token,items:lote})}).then(function(r){return r.json();}).then(function(r){enviando=false;
  if(r&&r.ok){var u=r.uids||[];ENV=ENV.filter(function(x){return u.indexOf(x.uid)<0;});guardarEnv();if(ENV.length)setTimeout(enviarPuente,500);}
  else if(r&&r.error==='link')linkInvalido();}).catch(function(){enviando=false;});}
(function(){var c0=cola;cola=function(t,d){var r=c0.apply(this,arguments);
 if(REAL&&d){ENV.push({uid:Date.now().toString(36)+Math.random().toString(36).slice(2,8),d:JSON.parse(JSON.stringify(d))});guardarEnv();setTimeout(enviarPuente,300);}return r;};})();
if(REAL){
 setTimeout(function(){var c=null;try{c=JSON.parse(localStorage.getItem(CLAVE_RC)||'null');}catch(e){}if(c){nombreReal(c);AM_PANEL(c,{silencio:true});}traerCliente();enviarPuente();},0);
 setInterval(function(){if(document.visibilityState==='visible'){traerCliente();enviarPuente();}},120000);
 document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'){traerCliente();enviarPuente();}});
 window.addEventListener('online',enviarPuente);
}
/* app instalada sin link: pedir el link (en el iPhone la app instalada no comparte lo guardado en Safari) */
(function(){var inst=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone;
 var demo=false;try{demo=localStorage.getItem('amedida-demo')==='1';}catch(e){}
 if(REAL||!inst||demo||window.top!==window)return;
 var d=document.createElement('div');d.className='conx';d.setAttribute('role','dialog');d.setAttribute('aria-label','Conectá tu app');
 d.innerHTML='<div class="conx-in"><span class="conx-lg"><b>A medida</b><small>Entrenamiento integral</small></span><h1>Conectá tu app</h1><p>Pegá acá el link que te mandó tu entrenador por WhatsApp.</p><input id="conxIn" type="url" inputmode="url" autocomplete="off" placeholder="https://rmormar19.github.io/amedida/?c=…" aria-label="Link de tu entrenador"><button type="button" class="pri full" id="conxOk">Conectar</button><button type="button" class="sec full" id="conxDemo">Ver la demo</button><p class="conx-e" id="conxE" role="alert"></p></div>';
 document.body.appendChild(d);
 document.getElementById('conxOk').onclick=function(){var v=document.getElementById('conxIn').value.trim(),m=v.match(/[?&]c=([\w-]{20,})/),n=v.match(/[?&]p=([\w-]{20,})/);
  if(!m||!n){document.getElementById('conxE').textContent='Ese link no es el de la app. Copiá el link completo del mensaje.';return;}
  location.href=location.pathname+'?c='+m[1]+'&p='+n[1];};
 document.getElementById('conxDemo').onclick=function(){try{localStorage.setItem('amedida-demo','1');}catch(e){}d.remove();};})();
/* ================= avisos al celular con la app cerrada =================
   El cliente toca «Activar avisos» una vez. El celular queda suscripto en el puente y, cuando el
   entrenador cambia la rutina, le llega el aviso aunque la app esté cerrada. */
var PUSH_OK=('serviceWorker' in navigator)&&('PushManager' in window)&&('Notification' in window);
function esIOS(){return /iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);}
function instalada(){return (window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;}
function b64aU8(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';var r=atob(s),o=new Uint8Array(r.length);for(var i=0;i<r.length;i++)o[i]=r.charCodeAt(i);return o;}
/* el service worker lee de acá el link para pedir el texto del aviso */
function guardarRealSW(){if(!REAL||!window.caches)return;try{caches.open('am-real').then(function(c){c.put('./__real.json',new Response(JSON.stringify({token:REAL.token,p:REAL.p}),{headers:{'Content-Type':'application/json'}}));});}catch(e){}}
function suscribir(pedir){if(!REAL||!PUSH_OK)return Promise.resolve(false);
 var permiso=Notification.permission==='granted'?Promise.resolve('granted'):(pedir?Notification.requestPermission():Promise.resolve(Notification.permission));
 return permiso.then(function(p){if(p!=='granted')return false;
  return Promise.all([navigator.serviceWorker.ready,fetch(urlPuente()+'?accion=vapid').then(function(r){return r.json();})]).then(function(x){var reg=x[0],k=x[1]&&x[1].key;if(!k)return false;
   return reg.pushManager.getSubscription().then(function(s){return s||reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64aU8(k)});}).then(function(s){
    return fetch(urlPuente(),{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({token:REAL.token,sub:s.toJSON()})}).then(function(r){return r.json();}).then(function(r){return !!(r&&r.ok);});});});}).catch(function(){return false;});}
function pushCard(){if(!REAL||!PUSH_OK&&!esIOS())return '';var ya=PUSH_OK&&Notification.permission==='granted',no=PUSH_OK&&Notification.permission==='denied',oc=false;try{oc=localStorage.getItem('amedida-push-ocultar')==='1';}catch(e){}
 if(ya||oc)return '';
 var txt=no?'Los avisos están bloqueados. Activalos en los ajustes del celular para esta app.':(esIOS()&&!instalada()?'Primero agregá la app a la pantalla de inicio (Compartir → Agregar a inicio) y abrila desde ahí.':'Te avisamos cuando tu entrenador te carga o cambia la rutina, aunque tengas la app cerrada.');
 return '<section class="card pushc"><div class="fila" style="padding:0"><span class="ico">'+(I.campana||'')+'</span><span><b>Avisos de tu rutina</b><span class="s">'+txt+'</span></span><span></span></div><div class="bajo" style="margin-top:10px">'+(!no&&!(esIOS()&&!instalada())?'<button type="button" class="pri" data-push="on">Activar avisos</button>':'')+'<button type="button" class="sec" data-push="off">Ahora no</button></div></section>';}
document.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('[data-push]');if(!b)return;ev.preventDefault();
 if(b.dataset.push==='off'){try{localStorage.setItem('amedida-push-ocultar','1');}catch(e){}render();return;}
 b.disabled=true;suscribir(true).then(function(ok){toast(ok?'Listo: te avisamos cuando cambie tu rutina':(Notification.permission==='denied'?'Quedaron bloqueados: activalos en los ajustes del celular':'No se pudo activar. Probá de nuevo con internet.'));render();});});
if(REAL){guardarRealSW();setTimeout(function(){if(PUSH_OK&&Notification.permission==='granted')suscribir(false);},3000);
 if(navigator.serviceWorker)navigator.serviceWorker.addEventListener('message',function(e){if(e.data==='am-aviso'){traerCliente();}});
 if(/[?&]aviso=1/.test(location.search))setTimeout(traerCliente,500);}
