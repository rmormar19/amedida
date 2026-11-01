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
