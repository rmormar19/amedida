/* ================= toma de medidas: perfil restringido ISAK nivel 1 ================= */
/* lado derecho del cuerpo; en la vista de frente el lado derecho queda a la izquierda de la imagen y en la de espalda, a la derecha */
var SITIOS=[
 {g:'Básicas',n:'Masa corporal',u:'kg',prev:78.5,uno:true,lb:'Balanza',c:'Con ropa mínima y sin calzado. Una sola medición.',x:null},
 {g:'Básicas',n:'Talla',u:'cm',prev:176,lb:'Estadiómetro',c:'De espaldas al estadiómetro, talones juntos y cabeza en el plano de Frankfort. Inspiración profunda y tracción suave hacia arriba desde la mandíbula.',x:null},
 {g:'Pliegues',n:'Tríceps',u:'mm',prev:10,s6:1,c:'Cara posterior del brazo, a la altura del punto medio acromiale-radiale, sobre la parte más posterior. Pliegue vertical.',x:76.8,y:30.2},
 {g:'Pliegues',n:'Subescapular',u:'mm',prev:12,s6:1,c:'2 cm desde el ángulo inferior de la escápula, en dirección oblicua hacia abajo y afuera (45°).',x:72.9,y:33.6},
 {g:'Pliegues',n:'Bíceps',u:'mm',prev:5,c:'Cara anterior del brazo, a la altura del punto medio acromiale-radiale, sobre la parte más anterior. Pliegue vertical.',x:22.9,y:30.5},
 {g:'Pliegues',n:'Cresta ilíaca',u:'mm',prev:15,c:'Inmediatamente por encima del iliocrestídeo, sobre la línea ilio-axilar. Pliegue casi horizontal, levemente hacia abajo y adelante.',x:25.1,y:40},
 {g:'Pliegues',n:'Supraespinal',u:'mm',prev:12.5,s6:1,c:'Donde la línea del ilioespinale al borde axilar anterior cruza la horizontal del iliocrestídeo. Pliegue oblicuo hacia abajo y adentro (≈45°).',x:27.1,y:40.6},
 {g:'Pliegues',n:'Abdominal',u:'mm',prev:16,s6:1,c:'5 cm a la derecha del ombligo (onfalion). Pliegue vertical.',x:29.2,y:38.1},
 {g:'Pliegues',n:'Muslo frontal',u:'mm',prev:13,s6:1,c:'Sentado, en el punto medio entre el pliegue inguinal y el borde superior de la rótula, cara anterior. Pliegue vertical.',x:27.3,y:61.3},
 {g:'Pliegues',n:'Pantorrilla medial',u:'mm',prev:7,s6:1,c:'Pie apoyado en un cajón con la rodilla a 90°. Cara medial de la pierna, a la altura del perímetro máximo. Pliegue vertical.',x:28,y:72.7},
 {g:'Perímetros',n:'Brazo relajado',u:'cm',prev:35.5,c:'Brazo colgando relajado, a la altura del punto medio acromiale-radiale, con la cinta perpendicular al eje del brazo.',x:22.1,y:31.4},
 {g:'Perímetros',n:'Brazo flexionado y contraído',u:'cm',prev:38,c:'Brazo al frente a la horizontal, codo a unos 45° y bíceps contraído al máximo. Perímetro máximo.',x:23.2,y:28.9},
 {g:'Perímetros',n:'Cintura',u:'cm',prev:83.5,c:'Punto más estrecho entre el borde costal inferior y la cresta ilíaca, al final de una espiración normal.',x:31.2,y:39},
 {g:'Perímetros',n:'Glúteo (cadera)',u:'cm',prev:98,c:'De pie con los pies juntos, a la altura de la máxima protuberancia posterior de los glúteos.',x:68.9,y:50.8},
 {g:'Perímetros',n:'Pantorrilla',u:'cm',prev:38,c:'Perímetro máximo de la pierna, de pie con el peso repartido en ambos pies.',x:72.9,y:69.1},
 {g:'Diámetros',n:'Húmero (biepicondilar)',u:'cm',prev:7.1,c:'Brazo al frente a la horizontal y codo a 90°. Distancia entre epicóndilo y epitróclea, con presión firme.',x:21.1,y:36.6},
 {g:'Diámetros',n:'Fémur (biepicondilar)',u:'cm',prev:9.9,c:'Sentado con la rodilla a 90°. Distancia entre los epicóndilos del fémur, con presión firme.',x:26.6,y:67}];
SITIOS.forEach(function(s){s.v=[null,null,null];});
var GRUPOS_SING={'Básicas':'Básica','Pliegues':'Pliegue','Perímetros':'Perímetro','Diámetros':'Diámetro'};
/* ISAK: se mide todo una vez (1ª vuelta), después todo de nuevo (2ª vuelta) y la 3ª sólo donde las dos primeras difieren más de 5 % (pliegues) o 1 % (resto) */
function PASOS(){var p=[];SITIOS.forEach(function(s,k){p.push([k,0]);});SITIOS.forEach(function(s,k){if(!s.uno)p.push([k,1]);});
 SITIOS.forEach(function(s,k){if(!s.uno&&evalSitio(s).est==='pide'||(!s.uno&&s.v[2]!=null))p.push([k,2]);});return p;}
function sitioActual(){var p=PASOS()[U.toma.i];return p?SITIOS[p[0]]:SITIOS[0];}
function sumaPl(sel){var t=0,ok=true;SITIOS.forEach(function(x){if(x.g!=='Pliegues'||(sel&&!x.s6))return;var e=evalSitio(x);if(e.m==null)ok=false;else t+=e.m;});return ok?Math.round(t*10)/10:null;}
function vToma2(){var P=PASOS(),i=U.toma.i,n=P.length;
 if(i>=n){var s='<div class="hd"><span class="ey">Toma del 30 de octubre · ISAK</span><h1>Revisá y guardá</h1></div><section class="card" style="padding:6px 16px 10px"><table class="tabla"><thead><tr><th>Sitio</th><th>Hoy</th><th>25 oct</th></tr></thead><tbody>',g='';
  SITIOS.forEach(function(x){var e=evalSitio(x);if(x.g!==g){g=x.g;s+='<tr class="g"><td colspan="3">'+g+'</td></tr>';}s+='<tr><td>'+x.n+'</td><td><b>'+(e.m==null?'—':co(e.m))+'</b></td><td class="mu">'+co(x.prev)+'</td></tr>';});
  var s6=sumaPl(true),s8=sumaPl(false);
  s+='<tr class="t"><td>Σ 6 pliegues</td><td>'+(s6==null?'—':co(s6))+'</td><td class="mu">70,5</td></tr><tr class="t"><td>Σ 8 pliegues</td><td>'+(s8==null?'—':co(s8))+'</td><td class="mu">90,5</td></tr></tbody></table></section>'+
   '<p class="sub" style="margin:8px 2px 0">Σ 6: tríceps, subescapular, supraespinal, abdominal, muslo frontal y pantorrilla medial. Σ 8 suma bíceps y cresta ilíaca.</p>'+
   '<div class="nav2"><button type="button" class="sec" data-a="tomaI" data-v="'+(n-1)+'">'+I.atras+'</button><button type="button" class="pri" data-a="guardarToma">Guardar toma</button></div>';return s;}
 var q=P[i],k=q[0],vu=q[1],x=SITIOS[k],e=evalSitio(x),mismos=SITIOS.filter(function(y){return y.g===x.g;}),gIdx=mismos.indexOf(x)+1;
 var enV=P.filter(function(z){return z[1]===vu;}),posV=enV.indexOf(q)+1;
 var s='<div class="prb"><i style="width:'+(i/n*100)+'%"></i></div><p class="vtx"><b>'+['1ª vuelta','2ª vuelta','3ª vuelta'][vu]+'</b> · '+posV+' de '+enV.length+(vu===2?' · sólo donde las dos tomas difieren':'')+'</p>';
 s+='<div class="mapa"><img src="../cuerpo/mapa_brazos.webp" alt="Silueta de frente y de espalda con los sitios de medición">'+SITIOS.map(function(y,j){if(y.x==null)return '';var ev=evalSitio(y),hecho=y.v[vu]!=null;return '<span class="pt '+(j===k?'on':(hecho||ev.m!=null?'ok':''))+'" style="left:'+y.x+'%;top:'+y.y+'%"></span>';}).join('')+'<span class="lb">'+(x.x==null?x.lb:'Lado derecho')+'</span></div>';
 s+='<div class="sit"><span class="ey">'+(GRUPOS_SING[x.g]||x.g)+' '+gIdx+' de '+mismos.length+'</span><h2>'+x.n+'</h2><p>'+x.c+'</p></div>';
 var lab=['1ª toma','2ª toma','3ª toma'];
 s+='<div class="tm uno"><label>'+(x.uno?x.n+' ('+x.u+')':lab[vu]+' ('+x.u+')')+'<input inputmode="decimal" data-t="'+vu+'" placeholder="'+(vu===0?co(x.prev):'—')+'" value="'+(x.v[vu]==null?'':co(x.v[vu]))+'" autofocus></label></div>';
 if(vu>0)s+='<p class="vprev">'+[0,1].filter(function(t){return t<vu;}).map(function(t){return lab[t]+': <b>'+(x.v[t]==null?'—':co(x.v[t]))+'</b>';}).join(' · ')+'</p>';
 s+='<div id="al">'+(vu>0?alerta(x,e):'')+'</div>';
 s+='<div class="res"><div><span class="lbl">Valor que se guarda</span><b id="med">'+(vu===0&&!x.uno?'—':(e.m==null?'—':co(e.m)+' '+x.u))+'</b></div><div><span class="lbl">Toma anterior · 25 oct</span><b>'+co(x.prev)+' '+x.u+'</b></div></div>';
 var sig=P[i+1],sigN=sig?SITIOS[sig[0]].n+(sig[1]!==vu?' ('+['1ª','2ª','3ª'][sig[1]]+' vuelta)':''):'';
 s+='<div class="nav2">'+(i>0?'<button type="button" class="sec" data-a="tomaI" data-v="'+(i-1)+'">'+I.atras+'</button>':'<span></span>')+'<button type="button" class="pri" data-a="tomaI" data-v="'+(i+1)+'">'+(i===n-1?'Revisar toma':'Siguiente: '+sigN)+'</button></div>';
 return s;}
