/* ================= app instalable: service worker, instalar, actualizar ================= */
var PWA={evt:null,sola:(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true,
 ios:/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),nueva:null};
var noInst=function(){try{return localStorage.getItem('am.inst.no')==='1';}catch(e){return false;}};
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){
 window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').then(function(reg){
  function esperando(w){PWA.nueva=w;avisoVersion();}
  if(reg.waiting&&navigator.serviceWorker.controller)esperando(reg.waiting);
  reg.addEventListener('updatefound',function(){var w=reg.installing;if(!w)return;w.addEventListener('statechange',function(){if(w.state==='installed'&&navigator.serviceWorker.controller)esperando(w);});});
  setInterval(function(){reg.update().catch(function(){});},60*60*1000);
 }).catch(function(){});
 var recargado=false;navigator.serviceWorker.addEventListener('controllerchange',function(){if(recargado)return;recargado=true;location.reload();});});
}
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();PWA.evt=e;if(U.tab==='hoy'&&!U.pila.length)render();});
window.addEventListener('appinstalled',function(){PWA.evt=null;PWA.sola=true;toast('AMedida quedó instalada');render();});
function avisoVersion(){if(document.getElementById('nver'))return;document.body.insertAdjacentHTML('beforeend','<div class="nver" id="nver" role="status"><span><b>Hay una versión nueva</b>Se actualiza en un segundo.</span><button type="button" id="nverOk">Actualizar</button></div>');
 document.getElementById('nverOk').addEventListener('click',function(){if(PWA.nueva)PWA.nueva.postMessage('saltar');});}
/* tarjeta en Hoy: sólo si todavía no está instalada */
function instalarCard(){if(PWA.sola||noInst())return '';if(!PWA.evt&&!PWA.ios)return '';
 return '<div class="inst"><span class="ii">'+LOGO+'</span><span><b>Instalá AMedida en tu celular</b><span class="s">Queda con su ícono en el inicio, se abre a pantalla completa y funciona sin internet.</span></span><div class="ib2"><button type="button" class="pri" data-a="instalar">Instalar</button><button type="button" class="sec" data-a="instNo">Ahora no</button></div></div>';}
var ICSHARE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8"/></svg>';
var ICPLUSQ='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';
function hojaInstalar(){return '<h2>Instalá AMedida</h2><p class="sub">En iPhone se instala desde Safari, en tres toques.</p><ol class="ipa">'+
 '<li><span>1</span><div>Tocá <b>Compartir</b> '+ICSHARE+' en la barra de Safari.</div></li>'+
 '<li><span>2</span><div>Bajá y elegí <b>Agregar a inicio</b> '+ICPLUSQ+'.</div></li>'+
 '<li><span>3</span><div>Tocá <b>Agregar</b>. El ícono de AMedida queda en tu pantalla de inicio.</div></li></ol>'+
 '<p class="sub" style="margin-top:10px">Si no ves la opción, abrí este link en Safari (no desde WhatsApp o Instagram).</p><button type="button" class="pri full" style="margin-top:12px" data-a="cerrar">Entendido</button>';}
(function(){var _a=avisoHoy;avisoHoy=function(){return instalarCard()+_a();};})();
/* atajos del ícono (mantener apretado): abre directo en una sección */
(function(){var ir=new URLSearchParams(location.search).get('ir');if(ir&&TITULO[ir]){U.tab=ir;U.pila=[];}})();
