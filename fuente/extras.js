/* ================= extras (30 oct): guardado en el celular, cola para el panel, notificaciones, sesión de gimnasio ================= */
var QS=new URLSearchParams(location.search),USUARIO=QS.get('usuario'),GUARDA=!USUARIO,NOMBRE=USUARIO||'Ricky';
var COLA=[],NOTIFS=[],MISCOM=[['Pechuga de pollo 150 g',46,0,4],['Avena 60 g con leche',16,40,7],['Huevos revueltos (3)',19,1,15]];
var CLAVE='amedida-nueva-v1';
I.campana=P('<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.6 2.2H4.4z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>');
function guardar(){if(!GUARDA)return;try{localStorage.setItem(CLAVE,JSON.stringify({h:BLQ.map(function(b){return b.h;}),v:BLQ.map(function(b){return b.ej.map(function(e){return e.v;});}),com:NUT.com.map(function(m){return m.it;}),sit:SITIOS.map(function(s){return s.v;}),mov:MOVS,cola:COLA,notifs:NOTIFS,mis:MISCOM,esf:U.esf,ses:U.ses.on}));}catch(e){}}
function cargar(){if(!GUARDA)return;try{var d=JSON.parse(localStorage.getItem(CLAVE)||'null');if(!d)return;
 if(d.h)d.h.forEach(function(h,i){if(BLQ[i])BLQ[i].h=h;});
 if(d.v)d.v.forEach(function(vs,i){vs.forEach(function(v,k){if(BLQ[i]&&BLQ[i].ej[k]&&v)BLQ[i].ej[k].v=v;});});
 if(d.com)d.com.forEach(function(it,i){if(NUT.com[i])NUT.com[i].it=it;});
 if(d.sit)d.sit.forEach(function(v,i){if(SITIOS[i])SITIOS[i].v=v;});
 if(d.mov)Object.keys(d.mov).forEach(function(k){MOVS[k]=d.mov[k];});
 COLA=d.cola||[];NOTIFS=d.notifs||[];if(d.mis)MISCOM=d.mis;if(d.esf)U.esf=d.esf;if(d.ses)U.ses.on=true;}catch(e){}}
function cola(txt){COLA.unshift({t:Date.now(),txt:txt});if(COLA.length>60)COLA.length=60;}
var hhmm=function(t){var d=new Date(t);return d.getHours()+':'+String(d.getMinutes()).padStart(2,'0');};
var noLeidas=function(){return NOTIFS.filter(function(n){return !n.leida;}).length;};

/* ----- sesión de gimnasio: pantalla encendida, aviso de fin de descanso, carga sugerida y botones de peso ----- */
var WL=null;
function pedirPantalla(){try{if(navigator.wakeLock&&!WL)navigator.wakeLock.request('screen').then(function(l){WL=l;l.addEventListener('release',function(){WL=null;});}).catch(function(){});}catch(e){}}
function soltarPantalla(){try{if(WL){WL.release();WL=null;}}catch(e){}}
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&U.ses.on&&U.pila[0]==='sesion')pedirPantalla();});
var AC=null;
document.addEventListener('pointerdown',function(){try{if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(C)AC=new C();}else if(AC.state==='suspended')AC.resume();}catch(e){}},{passive:true});
function finDescanso(){try{if(navigator.vibrate)navigator.vibrate([220,120,220]);}catch(e){}
 try{if(AC){[0,.24].forEach(function(dl){var o=AC.createOscillator(),g=AC.createGain(),t0=AC.currentTime+dl;o.type='sine';o.frequency.value=880;g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(.22,t0+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+.18);o.connect(g);g.connect(AC.destination);o.start(t0);o.stop(t0+.2);});}}catch(e){}
 document.body.classList.remove('flash');void document.body.offsetWidth;document.body.classList.add('flash');setTimeout(function(){document.body.classList.remove('flash');},1100);
 toast('Descanso terminado: siguiente serie');}
function incDe(e){return e.u==='pl'?1:/mancuern|martillo|inclinado/i.test(e.n)?2:2.5;}
function topReps(e){var m=/× (\d+)/.exec(e.o);return m?+m[1]:10;}
function alTope(e){var t=topReps(e);return e.p.every(function(s){return s[1]>=t;});}
function sugerido(e,i){return alTope(e)?Math.round((e.p[0][0]+incDe(e))*100)/100:e.p[i][0];}
function chipSug(e){if(!alTope(e))return '';return '<span class="sugc">↑ Subí a '+co(sugerido(e,0))+(e.u==='pl'?' placas':' kg')+': la semana pasada llegaste a '+topReps(e)+' reps en todas</span>';}
var ACCIN=null;
function mostrarAcc(){var a=document.getElementById('acc');if(!a||!ACCIN)return;a.hidden=false;var inc=+ACCIN.dataset.inc,u=ACCIN.dataset.u==='pl'?' pl':' kg';
 a.querySelector('[data-d="-1"]').textContent='−'+co(inc)+u;a.querySelector('[data-d="1"]').textContent='+'+co(inc)+u;
 document.getElementById('accV').textContent=(ACCIN.value||ACCIN.placeholder)+(ACCIN.dataset.u==='pl'?' placas':' kg');}
document.addEventListener('focusin',function(e){var t=e.target;if(t.matches&&t.matches('.sr input[data-inc]')){ACCIN=t;mostrarAcc();}});
document.addEventListener('focusout',function(){setTimeout(function(){if(document.activeElement!==ACCIN){var a=document.getElementById('acc');if(a)a.hidden=true;ACCIN=null;}},150);});
document.addEventListener('pointerdown',function(e){var b=e.target.closest&&e.target.closest('#acc button');if(!b||!ACCIN)return;e.preventDefault();
 var d=+b.dataset.d,inc=+ACCIN.dataset.inc,cur=num(ACCIN.value!==''?ACCIN.value:ACCIN.placeholder);if(isNaN(cur))cur=0;
 ACCIN.value=d===0?(ACCIN.dataset.ant||ACCIN.placeholder):co(Math.max(0,Math.round((cur+d*inc)*100)/100));mostrarAcc();});

/* ----- constancia: un toque cerca de un cuadradito lo elige (los cuadraditos son chicos para el dedo) ----- */
document.addEventListener('click',function(e){var cs=e.target.closest&&e.target.closest('.cs');if(!cs||e.target.closest('.cq'))return;var best=null,bd=1e9;
 cs.querySelectorAll('.cq').forEach(function(q){var r=q.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),dd=dx*dx+dy*dy;if(dd<bd){bd=dd;best=q;}});
 if(best&&bd<500)best.click();});

/* ----- notificación de rutina nueva (la manda el panel cuando cargás una rutina) ----- */
window.AM_NOTIF=function(d){d=d||{};var ej=d.ejercicios||[],n={t:Date.now(),titulo:(d.cambio?'Rutina actualizada':'Nueva rutina')+' de '+(d.quien||'tu entrenador'),cuerpo:(d.grupo||'Tu entreno')+' · '+ej.length+' ejercicios'+(d.cambio?'':'. Tocá para verla.'),grupo:d.grupo||'',dia:d.dia||'hoy',ejercicios:ej,cambio:!!d.cambio,leida:false};
 NOTIFS.unshift(n);if(NOTIFS.length>20)NOTIFS.length=20;guardar();
 var b=document.getElementById('notifB');
 if(!b){document.body.insertAdjacentHTML('beforeend','<button type="button" class="notifb" id="notifB" aria-live="polite"></button>');b=document.getElementById('notifB');
  b.addEventListener('click',function(){b.classList.remove('on');if(NOTIFS[0])NOTIFS[0].leida=true;U.hoja=null;U.rn=0;U.pila=['rnueva'];irArriba();render();});}
 b.innerHTML='<span class="nbi">'+LOGO+'</span><span class="nbt"><span class="nbh"><b>AMedida</b><small>ahora</small></span><b>'+n.titulo+'</b><span>'+n.cuerpo+'</span></span>';
 b.classList.remove('on');void b.offsetWidth;b.classList.add('on');try{if(navigator.vibrate)navigator.vibrate(60);}catch(e){}
 clearTimeout(window.__nbT);window.__nbT=setTimeout(function(){b.classList.remove('on');},7000);render();};
function vRnueva(){var n=NOTIFS[U.rn]||NOTIFS[0];if(!n)return '<p class="sub">Sin notificaciones.</p>';
 return '<div class="hd"><span class="ey">'+hhmm(n.t)+' · de tu entrenador</span><h1>'+(n.cambio?'Rutina actualizada':'Rutina nueva')+'</h1><p>'+(n.grupo||'Entreno')+' · '+n.ejercicios.length+' ejercicios · para '+n.dia+'</p></div>'+
  '<section class="card"><div class="ct"><h3>'+(n.grupo||'Entreno')+'</h3><span class="chip ac">'+n.dia+'</span></div><div class="lista" style="margin-top:6px">'+
  n.ejercicios.map(function(e,i){return '<div class="rnx" style="animation-delay:'+(i*70)+'ms"><span class="rnn">'+(i+1)+'</span><span><b>'+e.n+'</b><span class="s">'+e.s+' × '+e.r+' · '+co(e.kg)+' '+(e.u||'kg')+' · RIR '+e.rir+'</span></span></div>';}).join('')+'</div></section>'+
  '<p class="mu" style="font-size:12.5px;margin:10px 2px 0">Ya quedó cargada en tu calendario. El día que te toca aparece en Hoy con el botón para empezar.</p><div class="bajo"><button type="button" class="sec" data-a="tab" data-v="hoy">Más tarde</button><button type="button" class="pri" data-a="rnOk">Entendido</button></div>';}
var HOJAS_EXTRA=function(h){var s='';
 if(h.t==='cola')s='<h2>Cambios para el panel</h2><p class="sub">Quedan guardados en el celular y se mandan cuando conectemos la app al panel.</p><div class="lista" style="margin-top:8px">'+(COLA.length?COLA.slice(0,30).map(function(c){return '<div class="sx"><span>'+c.txt+'</span><b class="mu" style="font-weight:500">'+hhmm(c.t)+'</b><span></span></div>';}).join(''):'<p class="sub" style="padding:12px 0">No hay cambios pendientes.</p>')+'</div><button type="button" class="pri full" style="margin-top:12px" data-a="cerrar">Listo</button>';
 if(h.t==='notifs')s='<h2>Notificaciones</h2><div class="lista" style="margin-top:8px">'+(NOTIFS.length?NOTIFS.map(function(n,i){return '<button type="button" class="fila" data-a="abrirNotif" data-v="'+i+'"><span class="ico">'+I.campana+'</span><span><b>'+n.titulo+'</b><span class="s">'+n.cuerpo+' · '+hhmm(n.t)+'</span></span>'+(n.leida?'<span></span>':'<span class="ndot"></span>')+'</button>';}).join(''):'<p class="sub" style="padding:12px 0">Todavía no tenés notificaciones. Cuando tu entrenador te cargue una rutina, te llega acá.</p>')+'</div><button type="button" class="pri full" style="margin-top:12px" data-a="cerrar">Listo</button>';
 return s;};
/* lo que se anota en la cola: corre después del manejador principal */
function anotar(ev){var b=ev.target.closest&&ev.target.closest('[data-a]');if(!b)return;var a=b.dataset.a,v=b.dataset.v,antes=COLA.length;
 if(a==='serie'){var q=v.split('-'),bl=BLQ[U.ses.b],x=bl&&bl.h[+q[0]][+q[1]],e=bl&&bl.ej[+q[1]];if(x)cola('Serie hecha · '+e.n+' · '+co(x[0])+(e.u==='pl'?' pl':' kg')+' × '+x[1]+' · RIR '+x[2]);}
 if(a==='guardarSes'&&U.esf&&U.pila[U.pila.length-1]!=='resumen')cola('Sesión de Brazos terminada · esfuerzo: '+U.esf);
 if(a==='sumar'){var r=RECIENTES[+v];if(r)cola('Comida · '+r[0]);}
 if(a==='sumarMis'){var r2=MISCOM[+v];if(r2)cola('Comida · '+r2[0]);}
 if(a==='guardarToma')cola('Toma de medidas guardada');
 if(a==='confMover')cola('Entreno movido de día');
 if(a==='libre')cola('Día marcado como libre');
 if(a==='varSel')cola('Opción de ejercicio · '+v.split('|')[1]);
 if(COLA.length!==antes){guardar();var t=document.querySelector('[data-a="sync"]');if(t){t.classList.add('sync');t.setAttribute('aria-label',COLA.length+' cambios sin mandar al panel');}}}
function extrasInit(){cargar();
 document.body.insertAdjacentHTML('beforeend','<div class="acc" id="acc" hidden><button type="button" data-d="-1">−</button><span id="accV"></span><button type="button" data-d="1">+</button><button type="button" class="ant" data-d="0">= semana pasada</button></div>');
 document.addEventListener('click',anotar);}
function avisoHoy(){var n=NOTIFS[0];if(!n||n.vista)return '';return '<button type="button" class="aviso" data-a="abrirNotif" data-v="0"><span class="ico">'+I.campana+'</span><span><b>'+(n.cambio?'Tu rutina cambió':'Tenés una rutina nueva')+'</b><span class="s">'+n.grupo+' · '+n.ejercicios.length+' ejercicios · para '+n.dia+'</span></span><span class="ir">Ver</span></button>';}
function listaMis(h){var ok=h.okm||{};return '<div class="lista">'+MISCOM.map(function(r,k){return '<div class="it"><div><b>'+r[0]+'</b><span class="s"><u>P '+r[1]+'</u> · C '+r[2]+' · G '+r[3]+' · '+kf(kc(r[1],r[2],r[3]))+' kcal</span></div><button type="button" class="'+(ok[k]?'hecho':'')+'" data-a="sumarMis" data-v="'+k+'" aria-label="Agregar '+r[0]+'">'+(ok[k]?I.chk:I.mas)+'</button></div>';}).join('')+'</div>'+
 '<span class="lbl" style="display:block;margin-top:14px">Guardar una comida nueva</span><div class="nmf"><input id="nmN" placeholder="Nombre (ej.: Tarta de atún, 1 porción)" aria-label="Nombre de la comida"><input id="nmP" inputmode="decimal" placeholder="Prot. g" aria-label="Proteína en gramos"><input id="nmC" inputmode="decimal" placeholder="Carb. g" aria-label="Carbohidratos en gramos"><input id="nmG" inputmode="decimal" placeholder="Grasa g" aria-label="Grasa en gramos"><button type="button" class="sec" data-a="nuevaMis">Guardar en Mis comidas</button></div>';}
