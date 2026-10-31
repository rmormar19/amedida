/* ================= contrato con el Monitor: lo que la app guarda para mandar y cómo lee lo que manda el panel ================= */
/* cada registro de la cola lleva el texto para mostrar y el dato con el formato de Base Panel (ver contrato-datos-app-panel.md) */
var DIA_SES='Brazos';
function hoyISO(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function paq(tipo,o){o=o||{};o.tipo=tipo;o.cliente=NOMBRE;o.fecha=o.fecha||hoyISO();return o;}
function cola(txt,d){COLA.unshift({t:Date.now(),txt:txt,d:d||null});if(COLA.length>120)COLA.length=120;}
/* peso como texto con unidad, igual que lo guarda el panel ("7 placas", "62,5 kg") */
function pesoTxt(e,w){return co(w)+(e.u==='pl'?' placas':e.u==='lb'?' lb':' kg');}
function ejRef(e){return {id:e.id,nombre:e.n};}
/* foto del estado justo antes de cada toque (la acción principal la cambia antes de que la anotemos) */
var PRE={};
document.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('[data-a]');if(!b)return;
 PRE={hoja:U.hoja?JSON.parse(JSON.stringify(U.hoja)):null,b:U.ses.b,sel:U.cal&&U.cal.sel};
 if(b.dataset.a==='guardarSes'){var ta=document.querySelector('textarea[aria-label="Nota de la sesión"]');PRE.notaSes=ta?ta.value.trim():'';}},true);
function anotarDato(ev){var b=ev.target.closest&&ev.target.closest('[data-a]');if(!b)return;var a=b.dataset.a,v=b.dataset.v;
 if(a==='serie'){var q=v.split('-'),bl=BLQ[PRE.b],x=bl&&bl.h[+q[0]][+q[1]],e=bl&&bl.ej[+q[1]];
  if(x)cola('Serie hecha · '+e.n+' · '+pesoTxt(e,x[0])+' × '+x[1]+' · RIR '+x[2],paq('serie',{dia:DIA_SES,ejercicio:ejRef(e),n:+q[0]+1,ss:bl.ss?bl.k:null,serie:{peso:pesoTxt(e,x[0]),reps:String(x[1]),rir:String(x[2]),tipo:bl.drop&&+q[0]===2?'drop':''}}));}
 if(a==='guardarSes'&&U.esf&&U.ses.fin&&!U.pila.length){var hp=hechas(),rr=[];BLQ.forEach(function(bb){bb.h.forEach(function(r){r.forEach(function(x){if(x)rr.push(x[2]);});});});
  cola('Sesión de '+DIA_SES+' terminada · esfuerzo: '+U.esf,paq('sesion',{dia:DIA_SES,esfuerzo:U.esf,series:hp[0],total:hp[1],rirMedio:rr.length?Math.round(rr.reduce(function(s,y){return s+y;},0)/rr.length*10)/10:null,estado:'Entrené',nota:PRE.notaSes||''}));}
 if(a==='sumar'&&PRE.hoja){var r=RECIENTES[+v],m=NUT.com[PRE.hoja.i];if(r&&!PRE.hoja.ok[v])cola('Comida · '+r[0],paq('comida',{comida:m.n,texto:r[0],p:r[1],c:r[2],g:r[3]}));}
 if(a==='sumarMis'&&PRE.hoja){var r2=MISCOM[+v],m2=NUT.com[PRE.hoja.i];if(r2&&!(PRE.hoja.okm&&PRE.hoja.okm[v]))cola('Comida · '+r2[0],paq('comida',{comida:m2.n,texto:r2[0],p:r2[1],c:r2[2],g:r2[3]}));}
 if(a==='confMover'&&PRE.hoja){var de=dk(PRE.hoja.k),aK=U.cal.sel,aD=dk(aK),g=(MOVS[aK]||{}).g;
  cola('Entreno movido · '+(GFULL[g]||g||'')+' al '+DSEM[aD.getDay()].toLowerCase()+' '+aD.getDate(),paq('obs',{texto:'Movió '+(GFULL[g]||g||'el entreno')+' del '+DSEM[de.getDay()].toLowerCase()+' '+de.getDate()+' al '+DSEM[aD.getDay()].toLowerCase()+' '+aD.getDate()+' (desde la app).',mover:{de:PRE.hoja.k,a:aK,grupo:g}}));}
 if(a==='libre'){var dl=dk(v);cola('Día libre · '+DSEM[dl.getDay()].toLowerCase()+' '+dl.getDate(),paq('obs',{texto:'No va a entrenar el '+DSEM[dl.getDay()].toLowerCase()+' '+dl.getDate()+'/'+(dl.getMonth()+1)+' (lo marcó desde la app).',fechaDia:v}));}
 if(a==='varSel'&&PRE.hoja){var ev2=BLQ[PRE.hoja.b].ej[PRE.hoja.k];cola('Opción de ejercicio · '+ev2.n+' · '+v.split('|')[1],paq('variante',{ejercicio:ejRef(ev2),variante:JSON.parse(JSON.stringify(ev2.v))}));}
 if(COLA.length){var t=document.querySelector('[data-a="sync"]');if(t){t.classList.add('sync');t.setAttribute('aria-label',COLA.length+' cambios sin mandar al panel');}}}
/* lo que manda el panel: un día de rutina en el formato de Base Panel → lo que muestra la app */
function numPeso(p){var m=String(p||'').replace(',','.').match(/[\d.]+/);return m?parseFloat(m[0]):null;}
function uniPeso(p){p=String(p||'').toLowerCase();return /placa/.test(p)?'placas':/lb|libra/.test(p)?'lb':'kg';}
function rutinaDesdePanel(d){var ej=(d.ejercicios||[]).map(function(e){var ss=(e.series||[]).filter(function(s){return s.tipo!=='aprox';}),reps=ss.map(function(s){return s.reps;}).filter(Boolean),pmax=null,uni='kg';
  ss.forEach(function(s){var w=numPeso(s.peso);if(w!=null&&(pmax==null||w>pmax)){pmax=w;uni=uniPeso(s.peso);}});
  var lo=Math.min.apply(null,reps.map(Number)),hi=Math.max.apply(null,reps.map(Number));
  return {n:e.nombre,s:ss.length,r:reps.length?(lo===hi?String(lo):lo+'–'+hi):'—',kg:pmax==null?0:pmax,u:uni,rir:(ss[0]&&ss[0].rir)||'—',ss:e.ss||null};});
 var cd=(d.cardio||[]).map(function(c){return {tipo:c.tipo,cant:c.cant,modo:c.modo,zona:c.zona,cuando:c.cuando,inclinacion:c.inclinacion,velocidad:c.velocidad,nota:c.nota};});
 return {quien:d.quien,grupo:d.grupo||d.dia,dia:d.diaTxt||d.dia,cambio:!!d.cambio,ejercicios:ej,cardio:cd};}
(function(){var _n=window.AM_NOTIF;window.AM_NOTIF=function(d){d=d||{};if(d.ejercicios&&d.ejercicios[0]&&d.ejercicios[0].nombre)d=rutinaDesdePanel(d);_n(d);if(d.cardio&&d.cardio.length&&NOTIFS[0])NOTIFS[0].cardio=d.cardio;};})();
/* cardio de la sesión: lo programa el panel; el cliente anota minutos reales y FC promedio (alimenta FATMAX en el Monitor) */
var CARDIO=[{tipo:'Caminata en cinta',modo:'min',cant:15,zona:2,inclinacion:'8 %',cuando:'al final',minReal:'',fc:'',estado:''}];
try{if(GUARDA){var cdg=JSON.parse(localStorage.getItem('amedida-cardio-v1')||'null');if(cdg&&cdg.dia===hoyISO())CARDIO=cdg.c;}}catch(e){}
function guardarCardio(){if(GUARDA)try{localStorage.setItem('amedida-cardio-v1',JSON.stringify({dia:hoyISO(),c:CARDIO}));}catch(e){}}
var ZONA_TXT={1:'muy suave',2:'ritmo cómodo: podés hablar',3:'exigente: frases cortas'};
function bloqueCardio(){if(!CARDIO.length)return '';return '<div class="bk" style="margin-top:18px"><b>Cardio</b><span>'+CARDIO[0].cuando+'</span></div>'+CARDIO.map(function(c,i){var hecho=c.estado==='hecho';
 return '<div class="cdx'+(hecho?' h':'')+'"><div class="cdt"><b>'+c.tipo+' · '+c.cant+' min</b><span>Zona '+c.zona+' · '+(ZONA_TXT[c.zona]||'')+(c.inclinacion?' · inclinación '+c.inclinacion:'')+'</span></div>'+
  '<div class="cdi"><label>Minutos<input inputmode="numeric" data-cd="minReal" data-i="'+i+'" placeholder="'+c.cant+'" value="'+(c.minReal||'')+'"></label><label>FC promedio<input inputmode="numeric" data-cd="fc" data-i="'+i+'" placeholder="lpm" value="'+(c.fc||'')+'"></label><button type="button" class="ok" data-a="cdOk" data-v="'+i+'" aria-label="Marcar cardio hecho">'+I.chk+'</button></div>'+
  '<p class="cdn">La FC promedio la ves en el reloj o la cinta al terminar. Con eso tu entrenador ve en qué zona trabajaste.</p></div>';}).join('');}
document.addEventListener('input',function(ev){var t=ev.target;if(!t.dataset||t.dataset.cd==null)return;CARDIO[+t.dataset.i][t.dataset.cd]=t.value.trim();guardarCardio();});
