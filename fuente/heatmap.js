/* ================= Constancia: mapa de calor diario (un cuadrado por día, columnas = semanas) ================= */
var DIAS_C=['dom','lun','mar','mié','jue','vie','sáb'];
var r1C=function(v){return Math.round(v*10)/10;};
function hh(n){var x=Math.sin(n*12.9898+78.233)*43758.5453;return x-Math.floor(x);}
var kdC=function(d){return d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate();};
/* qué pasó cada día: 'ok' entrenó (con nivel 1–4), 'fa' faltó, 'de' descanso, 'au' viaje, 'hoy', 'pl' por venir */
var CST_CACHE={};
function diasAnio(Y){if(CST_CACHE[Y])return CST_CACHE[Y];var out={},SEP1=+new Date(2026,8,1),hoy=+HOYC,maxS=Math.max.apply(null,PROG.H.ser);
 var m0=lunes(new Date(Y,0,1)),fin=new Date(Y,11,31);
 while(+m0<=+fin){var dd=semDias(m0),kk=semIdx(m0),inf=dd.map(diaInfo),P=[];
  dd.forEach(function(d,i){var t=+d,x=inf[i];if(t>=hoy)return;if(x.g&&x.e!=='au')P.push(i);});
  var n=null;
  if(+m0<SEP1){if(kk>=0&&kk<=51)n=Math.min(P.length,PROG.H.dias[kk]);else n=Math.min(P.length,2+Math.round(hh(+m0/864e5)*2.2));}
  var orden=P.slice().sort(function(a,b){return hh(+dd[a]/864e5+1)-hh(+dd[b]/864e5+1);}),hechos=n==null?null:orden.slice(0,n);
  var base=kk>=0&&kk<=51?PROG.H.ser[kk]/maxS:.55+hh(kk)*.3;
  dd.forEach(function(d,i){var t=+d,x=inf[i],k=kdC(d),o;
   if(t>hoy)o={e:x.g?'pl':'de',g:x.g};
   else if(t===hoy){var hz=U.ses.on||U.ses.fin;o={e:hz?'ok':(x.g?'hoy':'de'),g:x.g,lv:hz?(ESF_LV[U.esf]||2):0,cur:U.ses.on};}
   else if(!x.g)o={e:x.libre?'de':'de'};
   else if(x.e==='au')o={e:'au',g:x.g,o:x.o};
   else if(hechos){o=hechos.indexOf(i)>=0?{e:'ok',g:x.g}:{e:'fa',g:x.g};}
   else o={e:x.e==='ok'?'ok':'fa',g:x.g,o:x.o};
   if(o.e==='ok'&&!o.lv){var r=base*3+(hh(t/864e5+7)-.5)*1.1+(x.g==='Pierna'?.4:0);o.lv=Math.max(1,Math.min(3,1+Math.floor(r*.75)));}
   o.d=new Date(d);o.ser=kk>=0&&kk<=51&&o.e==='ok'?Math.round(PROG.H.ser[kk]/Math.max(1,PROG.H.dias[kk])):null;out[k]=o;});
  m0.setDate(m0.getDate()+7);}
 return (CST_CACHE[Y]=out);}
/* semanas del año: cumplida = 3 o más sesiones (o todas las planificadas si eran menos) */
function semanasAnio(Y){var D=diasAnio(Y),m0=lunes(new Date(Y,0,1)),fin=new Date(Y,11,31),S=[],act=+lunes(HOYC);
 while(+m0<=+fin){var dd=semDias(m0),he=0,pl=0;dd.forEach(function(d){var o=D[kdC(d)];if(!o)return;if(o.e==='ok')he++;if(o.e==='ok'||o.e==='fa')pl++;});
  var cerrada=+m0<act;S.push({m:new Date(m0),he:he,pl:pl,cerrada:cerrada,ok:cerrada&&pl>0&&he>=Math.min(3,pl)});m0.setDate(m0.getDate()+7);}
 return S;}
function rachasAnio(Y){var S=semanasAnio(Y),seg=[],cur=null;S.forEach(function(s,i){if(s.ok){if(!cur){cur={a:i,b:i};seg.push(cur);}else cur.b=i;}else cur=null;});
 var best=seg.reduce(function(m,s){return !m||s.b-s.a>m.b-m.a?s:m;},null),ultCer=-1;S.forEach(function(s,i){if(s.cerrada)ultCer=i;});
 var actual=seg.filter(function(s){return s.b===ultCer;})[0]||null;return {S:S,seg:seg,best:best,actual:actual};}
function resumenAnio(Y){var D=diasAnio(Y),he=0,pl=0,lim=new Date(HOYC);lim.setFullYear(Y);
 Object.keys(D).forEach(function(k){var o=D[k];if(o.d.getFullYear()!==Y||+o.d>+lim)return;if(o.e==='ok')he++;if(o.e==='ok'||o.e==='fa')pl++;});return {he:he,pl:pl,p:pl?he/pl:0};}
function constanciaHM(){CST_CACHE={};var Y=U.cstY||2026,D=diasAnio(Y),R=rachasAnio(Y),A=resumenAnio(Y),B=resumenAnio(Y-1),S=R.S;
 var cerr=S.filter(function(s){return s.cerrada&&s.m.getFullYear()<=Y;}),prom=cerr.length?cerr.reduce(function(a,s){return a+s.he;},0)/cerr.length:0;
 var ptos=Math.round((A.p-B.p)*100);
 var s='<section class="card hm"><div class="ct"><h3>Constancia</h3><div class="hmy">'+[2026,2025].map(function(y){return '<button type="button" data-a="cstY" data-v="'+y+'" aria-pressed="'+(y===Y)+'">'+y+'</button>';}).join('')+'</div></div>';
 [[0,5],[6,11]].forEach(function(r){var ini=new Date(Y,r[0],1),fin=new Date(Y,r[1]+1,0),m0=lunes(ini),cols=[];for(var m=new Date(m0);+m<=+fin;m.setDate(m.getDate()+7))cols.push(new Date(m));
  var N=cols.length,meses='',celdas='',barras='';
  for(var mm=r[0];mm<=r[1];mm++){var f1=new Date(Y,mm,1),c=Math.floor((+lunes(f1)-+m0)/(7*864e5));if(mm!==r[0]&&[0,5,6].indexOf(f1.getDay())>=0)c++;meses+='<span style="grid-column:'+(c+1)+' / span 4">'+MESES_L[mm].slice(0,3)+'</span>';}
  for(var fila=0;fila<7;fila++)cols.forEach(function(cm,ci){var d=new Date(cm);d.setDate(cm.getDate()+fila);var dentro=+d>=+ini&&+d<=+fin,o=D[kdC(d)];
   if(!dentro||!o){celdas+='<i class="hq nx"></i>';return;}
   var cl=o.e==='ok'?'l'+o.lv:o.e==='fa'?'fa':o.e==='au'?'au':o.e==='pl'?'pl':o.e==='hoy'?'hoy':'de';
   var txt=DIAS_C[d.getDay()]+' '+d.getDate()+' '+MESES_L[d.getMonth()].slice(0,3)+' · '+(o.e==='ok'?(o.cur?'en curso · ':'')+o.g+(o.ser?' · '+o.ser+' series':'')+' · '+['','liviano','moderado','duro'][o.lv]:o.e==='fa'?'faltó a '+o.g.toLowerCase():o.e==='au'?'viaje'+(o.o?' · '+o.o:''):o.e==='pl'?'planificado: '+o.g:o.e==='hoy'?'hoy toca '+o.g:'descanso');
   celdas+='<i class="hq '+cl+(+d===+HOYC?' hy':'')+'" data-t="'+txt+'" style="grid-row:'+(fila+1)+';grid-column:'+(ci+1)+';--d:'+(ci*14)+'ms"></i>';});
  var cOf=function(i){var sm=S[i].m;return Math.round((+sm-+m0)/(7*864e5));};
  R.seg.forEach(function(sg){var a=Math.max(0,cOf(sg.a)),b=Math.min(N-1,cOf(sg.b));if(b<0||a>N-1||b<a)return;var tipo=sg===R.best?'best':sg===R.actual?'act':'';
   barras+='<b class="'+tipo+'" style="left:calc('+(a/N*100)+'% + 1px);width:calc('+((b-a+1)/N*100)+'% - 3px)"></b>';});
  s+='<div class="hmb"><div class="hmm" style="grid-template-columns:repeat('+N+',1fr)">'+meses+'</div><div class="hmg" style="grid-template-columns:repeat('+N+',1fr)">'+celdas+'</div><div class="hmr">'+barras+'</div></div>';});
 s+='<div class="hml"><span><i class="fa"></i>Faltó</span><span class="sp"></span><i class="l1"></i>Liviano<i class="l2"></i>Moderado<i class="l3"></i>Duro</div>';
 s+='<p id="hqInfo" class="hqi">Tocá un día para ver qué hiciste.</p>';
 s+='<div class="hmt"><span class="lbl">Días entrenados</span><div class="hmn"><b data-cu="'+A.he+'">'+A.he+'</b><span>de '+A.pl+'<small>planificados</small></span><em>'+Math.round(A.p*100)+' %<small>'+(B.pl?(ptos>=0?'+':'')+ptos+' vs '+(Y-1):'')+'</small></em></div></div>';
 s+='<div class="hmk"><div><span class="lbl">Racha</span><b class="ra">'+(R.actual?R.actual.b-R.actual.a+1:0)+'<small>sem</small></b></div><div><span class="lbl">Mejor</span><b class="be">'+(R.best?R.best.b-R.best.a+1:0)+'<small>sem</small></b></div><div><span class="lbl">Promedio</span><b>'+co(r1C(prom))+'<small>días/sem</small></b></div></div>';
 s+='<p class="hqn">Racha = semanas seguidas con 3 o más sesiones. La línea <b class="be">amarilla</b> marca tu mejor racha del año y la <b class="ra">celeste</b>, la actual.</p></section>';
 return s;}
/* tocar un día (o cerca, porque son chicos): muestra el detalle */
document.addEventListener('click',function(e){var g=e.target.closest&&e.target.closest('.hmg');if(!g)return;var t=e.target.classList&&e.target.classList.contains('hq')&&e.target.dataset.t?e.target:null;
 if(!t){var best=null,bd=1e9;g.querySelectorAll('.hq[data-t]').forEach(function(q){var r=q.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),dd=dx*dx+dy*dy;if(dd<bd){bd=dd;best=q;}});if(bd<400)t=best;}
 if(!t)return;document.querySelectorAll('.hq.on').forEach(function(q){q.classList.remove('on');});t.classList.add('on');var inf=document.getElementById('hqInfo');if(inf){inf.textContent=t.dataset.t;inf.classList.add('vis');}});
