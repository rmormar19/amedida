/* ================= mejoras desde el uso de un cliente ================= */
var WA='https://wa.me/59899095446';
/* esfuerzo de la sesión: lo marca el cliente al terminar (subjetivo) */
var ESF=[['liviano','Liviano','<svg viewBox="0 0 24 24"><rect x="4" y="14" width="4" height="6" rx="1.5"/><rect x="10" y="10" width="4" height="10" rx="1.5" opacity=".25"/><rect x="16" y="5" width="4" height="15" rx="1.5" opacity=".25"/></svg>','Me sobró energía'],
 ['moderado','Moderado','<svg viewBox="0 0 24 24"><rect x="4" y="14" width="4" height="6" rx="1.5"/><rect x="10" y="10" width="4" height="10" rx="1.5"/><rect x="16" y="5" width="4" height="15" rx="1.5" opacity=".25"/></svg>','Exigente, pero bien'],
 ['duro','Duro','<svg viewBox="0 0 24 24"><rect x="4" y="14" width="4" height="6" rx="1.5"/><rect x="10" y="10" width="4" height="10" rx="1.5"/><rect x="16" y="5" width="4" height="15" rx="1.5"/></svg>','Terminé al límite']];
var ESF_LV={liviano:1,moderado:2,duro:3};
if(typeof U.esf!=='string'||!ESF_LV[U.esf])U.esf=null;
var leeLS=function(k){try{return localStorage.getItem(k);}catch(e){return null;}},ponLS=function(k,v){try{localStorage.setItem(k,v);}catch(e){}};
I.wa=P('<path d="M4 20l1.3-3.8A8 8 0 1 1 8 19z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.3-1.4-2-1-1 .8a4 4 0 0 1-2.2-2.2l.8-1-1-2z"/>');
/* sesión: dónde quedó (bloque y hora de inicio) sobrevive si se cierra la app */
(function(){if(!GUARDA)return;try{var d=JSON.parse(leeLS('amedida-ses-v1')||'null');if(d&&U.ses.on){U.ses.b=d.b||0;U.ses.t0=d.t0||null;}if(d&&d.fin&&d.dia===kdC0()){U.ses.fin=true;U.ses.on=false;if(d.esf)U.esf=d.esf;}}catch(e){}})();
function kdC0(){var d=new Date();return d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate();}
function guardarSes2(){if(GUARDA)ponLS('amedida-ses-v1',JSON.stringify({b:U.ses.b,t0:U.ses.t0,fin:!!U.ses.fin,esf:U.esf,dia:kdC0()}));}
/* ayuda de la sesión: una vez, corta y descartable (antes era un párrafo fijo en cada bloque) */
function tipSesion(){if(leeLS('am.tip.ses')==='1')return '';
 return '<div class="tip"><b>Cómo se registra</b><ul><li><b>Gris</b> = lo que te toca hoy. Si coincide, tocá ✓ sin escribir.</li><li>Tocá el <b>peso</b> para subir o bajar con − y +.</li><li>Tocá la <b>lámina</b> para ver cómo se hace.</li></ul><button type="button" data-a="tipOk">Entendido</button></div>';}
function bajoSesion(ult){var nx=BLQ[U.ses.b+1];
 if(ult)return '<div class="bajo"><button type="button" class="pri full" data-a="terminar">'+I.chk+'Terminar sesión</button></div>';
 return '<div class="bajo"><button type="button" class="sec" data-a="terminar">Terminar</button><button type="button" class="pri" data-a="blq" data-v="'+(U.ses.b+1)+'">Siguiente: '+nx.n+' '+I.der+'</button></div>';}
/* resumen con lo que hizo de verdad hoy */
function vResumen2(){var hp=hechas(),hec=[],ej={},volH=0,volA=0,repH=0,repA=0,dur=0,durA=0;
 BLQ.forEach(function(b){b.ej.forEach(function(e,k){b.h.forEach(function(r,i){var x=r[k];if(!x)return;var a=e.p[i];hec.push(x);volH+=x[0]*x[1];volA+=a[0]*a[1];repH+=x[1];repA+=a[1];if(x[2]<=1)dur++;if(a[2]<=1)durA++;
  (ej[e.id]=ej[e.id]||{e:e,x:[]}).x.push([x,a]);});});});
 var min=U.ses.t0?Math.max(1,Math.round((Date.now()-U.ses.t0)/60000)):null,rir=hec.length?hec.reduce(function(s,x){return s+x[2];},0)/hec.length:null;
 var pct=function(a,b){if(!b)return '—';var v=Math.round((a-b)/b*100);return (v>0?'+':'')+v+' %';},dif=function(a,b){var v=a-b;return (v>0?'+':'')+v;};
 var s='<section class="card hero"><div class="img"><img src="../cuerpo/mapa_brazos.webp" alt="Músculos trabajados: bíceps y tríceps"></div><div class="in"><h2><i>'+I.chk+'</i>'+(hp[0]===hp[1]?'¡Sesión completa!':'¡Listo por hoy!')+'</h2><p class="sub">Brazos · '+hp[0]+' de '+hp[1]+' series'+(hp[0]<hp[1]?' · te faltaron '+(hp[1]-hp[0]):'')+'</p>'+
  '<div class="k4"><div><b>'+(min==null?'—':min)+'</b><span>min</span></div><div><b>'+hp[0]+'/'+hp[1]+'</b><span>series</span></div><div><b>'+(rir==null?'—':co(rir.toFixed(1)))+'</b><span>RIR medio</span></div><div><b>'+(hec.length?pct(volH,volA):'—')+'</b><span>volumen</span></div></div></div></section>';
 if(hec.length){var C=[['Volumen',volA,volH,pct(volH,volA)],['Reps totales',repA,repH,dif(repH,repA)],['Series RIR 0–1',durA,dur,dif(dur,durA)]];
  s+='<section class="card"><h3>Contra la semana pasada</h3><p class="sub">Las mismas series que hiciste hoy. Gris: viernes 23 · azul: hoy.</p><div class="cmp">'+C.map(function(r){var m=Math.max(r[1],r[2])*1.05||1,neg=String(r[3]).charAt(0)==='-';return '<div class="r"><span>'+r[0]+'</span><span class="br"><i class="a" style="width:'+(r[1]/m*100)+'%"></i><i class="b" style="width:'+(r[2]/m*100)+'%"></i></span><b class="'+(neg?'dn':'up')+'">'+r[3]+'</b></div>';}).join('')+'</div></section>';
  var L=[];Object.keys(ej).forEach(function(id){var o=ej[id],e=o.e,u=e.u==='pl'?' pl':' kg',mw=Math.max.apply(null,o.x.map(function(z){return z[0][0];})),aw=e.p[0][0],rH=o.x.reduce(function(s,z){return s+z[0][1];},0),rA=o.x.reduce(function(s,z){return s+z[1][1];},0);
   if(mw>aw)L.push([I.trofeo,'wa',e.n+' · '+co(mw)+u,'Subiste de '+co(aw)+' a '+co(mw)+u+'.']);
   else if(rH>rA)L.push([I.trofeo,'wa',e.n+' · +'+(rH-rA)+' reps','Mismo peso y más repeticiones que la semana pasada.']);
   var top=topReps(e);if(o.x.length===e.p.length&&o.x.every(function(z){return z[0][1]>=top;}))L.push([I.flecha,'','La próxima: '+e.n.toLowerCase()+' a '+co(Math.round((mw+incDe(e))*100)/100)+u,'Llegaste al tope del rango ('+top+' reps) en todas las series.']);});
  if(L.length)s+='<section class="card lista" style="padding:4px 16px">'+L.slice(0,4).map(function(l){return '<div class="fila"><span class="ico '+l[1]+'">'+l[0]+'</span><span><b>'+l[2]+'</b><span class="s">'+l[3]+'</span></span><span></span></div>';}).join('')+'</section>';}
 else s+='<section class="card"><p class="sub" style="margin:0">No marcaste ninguna serie. Si entrenaste, volvé y tildá lo que hiciste para que tu entrenador lo vea.</p><button type="button" class="sec full" style="margin-top:12px" data-a="volverSes">Volver a la sesión</button></section>';
 s+='<section class="card"><h3>¿Cómo sentiste el entrenamiento?</h3><p class="sub">Tu sensación de esfuerzo de toda la sesión. Le sirve a tu entrenador para ajustar la próxima.</p><div class="esf3">'+ESF.map(function(e){return '<button type="button" class="'+e[0]+'" data-a="esf" data-v="'+e[0]+'" aria-pressed="'+(U.esf===e[0])+'"><i>'+e[2]+'</i><b>'+e[1]+'</b><span>'+e[3]+'</span></button>';}).join('')+'</div>'+
  '<textarea aria-label="Nota de la sesión" placeholder="¿Algo para contarle a tu entrenador? (opcional)"></textarea><button type="button" class="pri full" style="margin-top:14px" data-a="guardarSes">Guardar y mandar a tu entrenador</button></section>';
 return s;}
/* comidas: lo de ayer (ejemplo) */
var AYER=[['Yogur proteico + avena + banana',32,48,6],['Arroz con pollo y ensalada',45,70,12],['Batido de whey con leche descremada',30,14,4],['Tostadas integrales con atún',28,36,8],null];
var sinTilde=function(t){return String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');};
document.addEventListener('input',function(ev){if(ev.target.id!=='cBus')return;var q=sinTilde(ev.target.value.trim()),n=0;
 document.querySelectorAll('.sheet .lista .it').forEach(function(it){var ok=!q||sinTilde(it.textContent).indexOf(q)>=0;it.hidden=!ok;if(ok)n++;});
 var nv=document.getElementById('cNo');if(nv)nv.hidden=n>0||!q;if(nv)nv.querySelector('b').textContent=ev.target.value.trim();});
/* hojas nuevas */
function hojasCliente(h){var s='';
 if(h.t==='term')s='<h2>¿Terminar la sesión?</h2><p class="sub">Te faltan <b>'+h.f+' series</b>. Si no las vas a hacer, tu entrenador lo ve en el resumen.</p><div class="bajo" style="margin-top:16px"><button type="button" class="sec" data-a="cerrar">Seguir entrenando</button><button type="button" class="pri" data-a="terminar" data-v="1">Terminar igual</button></div>';
 if(h.t==='peso')s='<h2>Tu peso de hoy</h2><p class="sub">En ayunas, después de ir al baño y siempre en la misma balanza.</p><div class="pesoin"><button type="button" data-a="pesoD" data-v="-1" aria-label="Bajar 100 gramos">−</button><label><input id="pIn" inputmode="decimal" value="'+co(h.v)+'" aria-label="Peso en kg"><span>kg</span></label><button type="button" data-a="pesoD" data-v="1" aria-label="Subir 100 gramos">+</button></div><p class="sub" style="text-align:center">Último: 78,5 kg · 25 oct</p><button type="button" class="pri full" style="margin-top:12px" data-a="pesoOk">Guardar y mandar a tu entrenador</button>';
 if(h.t==='obj'){var o=NUT.obj;s='<h2>Tus objetivos</h2><p class="sub">Los define tu entrenador según tu objetivo y tu peso.</p><div class="fp" style="grid-template-columns:repeat(4,1fr);margin-top:12px"><div><b>'+o.p+' g</b><span>proteína</span></div><div><b>'+o.c+' g</b><span>carbohidratos</span></div><div><b>'+o.g+' g</b><span>grasas</span></div><div><b>'+kf(kc(o.p,o.c,o.g))+'</b><span>kcal</span></div></div><a class="sec full wab" href="'+WA+'" target="_blank" rel="noopener">'+I.wa+'¿Querés cambiarlos? Escribile</a>';}
 if(h.t==='perfil'){var cl=document.documentElement.classList.contains('claro');s='<div class="pf"><span class="yo grande">'+NOMBRE.charAt(0)+'</span><div><h2>'+NOMBRE+'</h2><p class="sub">Entrena con Ricky</p></div></div>'+
  '<div class="lista" style="margin-top:8px">'+
  '<a class="fila" href="'+WA+'" target="_blank" rel="noopener"><span class="ico ok">'+I.wa+'</span><span><b>Escribile a tu entrenador</b><span class="s">WhatsApp · 099 095 446</span></span>'+I.der+'</a>'+
  '<button type="button" class="fila" data-a="notifs"><span class="ico">'+I.campana+'</span><span><b>Notificaciones</b><span class="s">'+(noLeidas()?noLeidas()+' sin leer':'Rutinas nuevas y avisos')+'</span></span>'+I.der+'</button>'+
  '<button type="button" class="fila" data-a="sync"><span class="ico">'+I.nube+'</span><span><b>Lo que le mandaste</b><span class="s">'+(COLA.length?COLA.length+(COLA.length===1?' registro guardado':' registros guardados'):'Nada pendiente')+'</span></span>'+I.der+'</button>'+
  '<button type="button" class="fila" data-a="modo"><span class="ico">'+(cl?I.luna:I.sol)+'</span><span><b>Modo '+(cl?'oscuro':'claro')+'</b><span class="s">Ahora estás en modo '+(cl?'claro':'oscuro')+'</span></span><span></span></button>'+
  '<button type="button" class="fila" data-a="tipRe"><span class="ico">'+I.chk+'</span><span><b>Cómo se registra una sesión</b><span class="s">Vuelve a mostrar la ayuda</span></span><span></span></button>'+
  ((window.PWA&&!PWA.sola)?'<button type="button" class="fila" data-a="instalar"><span class="ico">'+I.mas+'</span><span><b>Instalar la app</b><span class="s">Ícono en el inicio, sin internet</span></span>'+I.der+'</button>':'')+
  '</div><p class="sub" style="text-align:center;margin-top:14px">AMedida</p>';}
 return s;}
/* al guardar la sesión: lo que recibe el Monitor (por ahora, la simulación al lado del iPhone) */
function mandarSesionMonitor(){try{var hp=hechas(),rirs=[];BLQ.forEach(function(b){b.h.forEach(function(r){r.forEach(function(x){if(x)rirs.push(x[2]);});});});
 var rut={quien:NOMBRE,dia:'Brazos',ej:[]};BLQ.forEach(function(bb){bb.ej.forEach(function(x){rut.ej.push({id:x.id,n:x.n,pauta:(/(\d+ × \d+)/.exec(x.o)||['',''])[1]+' · '+co(x.p[0][0])+(x.u==='pl'?' pl':' kg')});});});
 var H=PROG.H,lu=lunes(new Date()),sem=[],SENS=['liviano','moderado','duro'];
 for(var k=45;k<=51;k++){var dd=new Date(lu.getTime()-(52-k)*7*864e5),n=H.dias[k],r=H.rir[k],ss=[];for(var j=0;j<n;j++){var z=(2.2-r)*1.1+(Math.sin((k*7+j)*12.9898)*43758.5453%1+1)%1*.9;ss.push(SENS[Math.max(0,Math.min(2,Math.floor(z+.6)))]);}
  sem.push({lab:dd.getDate()+'/'+(dd.getMonth()+1),rir:r,s:ss});}
 var rirH=rirs.length?rirs.reduce(function(a,b){return a+b;},0)/rirs.length:null;
 sem.push({lab:'Esta sem.',rir:rirH,s:['moderado','duro',U.esf],hoy:true});
 window.parent.postMessage({am:'sesion',quien:NOMBRE,dia:'Brazos',esf:U.esf,series:hp[0],total:hp[1],rir:rirH,rutina:rut,sem:sem,t:Date.now()},'*');}catch(e){}}
