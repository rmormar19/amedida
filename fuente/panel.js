/* ================= Monitor → app: la app muestra lo que hay en la Base Panel =================
   AM_PANEL(cliente) recibe el cliente con el formato de la Base Panel (rutina, historial, medidas,
   observaciones) y rearma Hoy, la sesión, el calendario, el detalle de cada día y Medidas.
   Se llama al abrir la app y cada vez que el Monitor guarda un cambio. */
var PANEL=null;
function nrmP(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,' ').trim();}
function slugP(s){return nrmP(s).replace(/ /g,'_');}
function iDia(n){var x=nrmP(n);for(var i=0;i<7;i++)if(nrmP(DSEM[i])===x)return i;return -1;}
function numP(v){if(v==null||v==='')return null;var n=parseFloat(String(v).replace(',','.').replace(/[^0-9.\-]/g,''));return isFinite(n)?n:null;}
var GPAL=['var(--a1)','var(--cya)','var(--vio)','var(--yel)','var(--grn)','var(--red)'];
function gKey(g){var w=String(g||'').trim().split(/[\s,]+/)[0]||'Entreno';if(/^(tren|full|cuerpo)$/i.test(w))return String(g).trim();
 w=w.charAt(0).toUpperCase()+w.slice(1).toLowerCase();if(w==='Piernas')w='Pierna';return w;}
function imgG(g){var n=nrmP(g);return /pierna|cuadri|glute|femoral/.test(n)?'mapa_pierna':/espalda|dorsal/.test(n)?'mapa_espalda':/pecho|hombro/.test(n)?'mapa_pecho':'mapa_brazos';}
function uniP(p){p=String(p||'').toLowerCase();return /placa/.test(p)?'pl':/lb|libra/.test(p)?'lb':'kg';}
function seriesP(e){return (e.series||[]).filter(function(s){return s&&s.tipo!=='aprox';});}
function corto(n){n=String(n||'');return n.length>24?n.slice(0,22)+'…':n;}
function SES_TIT(){return PANEL&&PANEL.ses?gKey(PANEL.ses.grupo):'Brazos';}
function IMG_SES(){return PANEL&&PANEL.ses?imgG(PANEL.ses.grupo):'mapa_brazos';}
function HOY_TXT(){return HOYC.getDate()+' de '+MESES_L[HOYC.getMonth()];}
var MED_ULT='25 oct';
var MESC=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
function fCorta(iso){var d=new Date(String(iso).slice(0,10)+'T12:00:00');return isNaN(d)?String(iso):d.getDate()+' '+MESC[d.getMonth()];}
/* un ejercicio del panel → ejercicio de la sesión */
function ejP(x){var ss=seriesP(x),p=ss.map(function(s){return [numP(s.peso)||0,parseInt(s.reps,10)||0,parseInt(s.rir,10)||0];});
 if(!p.length)p=[[0,0,0]];var u=uniP((ss[0]||{}).peso),reps=p.map(function(q){return q[1];}),lo=Math.min.apply(null,reps),hi=Math.max.apply(null,reps);
 var drop=ss.some(function(s){return s.tipo==='drop'||(s.drops&&s.drops.length);});
 var v={lado:/uni/i.test(x.lateralidad||'')?'unilateral':'bilateral'};if(x.agarre)v.agarre=String(x.agarre).toLowerCase();
 return {id:slugP(x.nombre),n:x.nombre,lam:lamDe(x.nombre)||'',u:u,g:x.grupo||'',o:p.length+' × '+(lo===hi?lo:lo+'–'+hi)+' · RIR '+p[0][2]+(drop?' · drop en la última':''),p:p,v:v};}
/* un día del panel → bloques de la sesión (los ejercicios seguidos con la misma superserie van juntos) */
function blqP(dd){var ej=(dd.ejercicios||[]).filter(function(e){return e&&e.nombre&&String(e.nombre).trim();}),out=[],L=0;
 for(var i=0;i<ej.length;i++){var g=[ej[i]];if(ej[i].ss)while(i+1<ej.length&&ej[i+1].ss&&String(ej[i+1].ss)===String(ej[i].ss))g.push(ej[++i]);
  var k=String.fromCharCode(65+L++),es=g.map(ejP),ss=es.length>1,pesado=es.some(function(e){return e.u==='kg'&&e.p[0][0]>=40&&e.p[0][1]<=8;});
  var ns=Math.max.apply(null,es.map(function(e){return e.p.length;}));es.forEach(function(e){while(e.p.length<ns)e.p.push(e.p[e.p.length-1].slice());});
  out.push({k:k,n:ss?'Superserie '+k:corto(es[0].n),ss:ss,d:ss?90:(pesado?150:75),drop:es.some(function(e){return /drop/.test(e.o);}),ej:es});}
 out.forEach(function(b){b.h=b.ej[0].p.map(function(){return b.ej.map(function(){return null;});});});
 return out;}
function firmaDia(dd){return dd?JSON.stringify([dd.grupo,(dd.ejercicios||[]).map(function(e){return [e.nombre,e.ss||'',seriesP(e).map(function(s){return [s.peso,s.reps,s.rir];})];})]):'';}

/* el día de la sesión: hoy si toca; si no, el próximo de la semana que esté pendiente */
function diaSesion(c){var r=(c.rutina||[]).filter(function(d){return (d.ejercicios||[]).some(function(e){return e.nombre;})&&!d.libre;}),h=HOYC.getDay();
 var hoy=r.filter(function(d){return iDia(d.dia)===h;})[0];if(hoy)return {d:hoy,hoy:true};
 var ord=function(d){var i=iDia(d.dia);return (i+6)%7;},hi=(h+6)%7;
 var prox=r.filter(function(d){return ord(d)>hi&&d.estado!=='verde'&&d.estado!=='rojo';}).sort(function(a,b){return ord(a)-ord(b);})[0];
 return prox?{d:prox,hoy:false}:null;}

window.AM_PANEL=function(c,opt){opt=opt||{};if(!c)return;var primera=!PANEL;
 var t=new Date();HOYC=new Date(t.getFullYear(),t.getMonth(),t.getDate());if(window.CST_CACHE)for(var kc in CST_CACHE)delete CST_CACHE[kc];
 var antes=PANEL?PANEL.firmas:{};
 /* grupos del panel */
 var dias=(c.rutina||[]).filter(function(d){return (d.ejercicios||[]).some(function(e){return e.nombre;});}),gi=0;
 GRP={};var firmas={};
 dias.forEach(function(d){var k=gKey(d.grupo),i=iDia(d.dia);firmas[nrmP(d.dia)]=firmaDia(d);
  if(!GCOL[k])GCOL[k]=GPAL[(gi++)%GPAL.length];GFULL[k]=d.grupo||k;
  var ns=0;(d.ejercicios||[]).forEach(function(e){ns+=seriesP(e).length;});GSER[k]=ns||GSER[k]||12;GMIN[k]=Math.round((ns||12)*3);
  if(i>=0&&!d.libre)GRP[i]=k;});
 /* calendario: faltas, días libres y días que pasaron sin registrar */
 CALX={};MOVS={};DESC0=0;DESC1=0;
 var lunH=lunes(HOYC);
 var marcar=function(mon,lista,actual){(lista||[]).forEach(function(d){var i=iDia(d.dia);if(i<0)return;var f=new Date(mon);f.setDate(mon.getDate()+((i+6)%7));var k=kd(f);
   if(d.libre){MOVS[k]={libre:true};return;}
   if(d.estado==='rojo')CALX[k]={e:'fa',o:'Faltó'};
   else if(actual&&d.estado!=='verde'&&+f<+HOYC&&(d.ejercicios||[]).length)CALX[k]={e:'fa',o:'Sin registrar en la app'};});};
 (c.historial||[]).forEach(function(h){var m=lunes(new Date(h.fecha));m=new Date(m.getFullYear(),m.getMonth(),m.getDate());if(+m!==+lunH)marcar(m,h.rutina,false);});
 marcar(lunH,c.rutina,true);
 (c.observaciones||[]).forEach(function(o){var m=String(o.texto||'').match(/viaje|vacacion/i);if(!m||!/^\d{4}-\d{2}-\d{2}/.test(o.fecha||''))return;});
 /* la sesión */
 var ds=diaSesion(c),ses=ds?ds.d:null,nuevo=ses?blqP(ses):[],viejo=BLQ;
 var guard=null;try{guard=JSON.parse(localStorage.getItem('amedida-panel-h')||'null');}catch(e){}
 if(ses&&guard&&guard.fecha===hoyISO()&&nrmP(guard.dia)===nrmP(ses.dia))nuevo.forEach(function(b){b.ej.forEach(function(e,k){var g=guard.h[e.id];if(g)b.h.forEach(function(r,s){if(g[s])r[k]=g[s];});});});
 if(ses&&U.ses&&U.ses.on){
  nuevo.forEach(function(b){b.ej.forEach(function(e,k){viejo.forEach(function(bo){bo.ej.forEach(function(eo,ko){if(eo.id===e.id)b.h.forEach(function(r,s){if(bo.h[s]&&bo.h[s][ko])r[k]=bo.h[s][ko];});});});});});}
 if(ses){BLQ.length=0;nuevo.forEach(function(b){BLQ.push(b);});if(U.ses&&U.ses.b>=BLQ.length)U.ses.b=0;DIA_SES=ses.dia;}
 PANEL={c:c,ses:ses,hoy:ds&&ds.hoy,firmas:firmas};
 /* medidas */
 medP(c.medidas);
 /* aviso de rutina cambiada (no en la primera carga ni en días que ya pasaron) */
 if(!primera&&!opt.silencio){dias.forEach(function(d){var k=nrmP(d.dia),i=iDia(d.dia);if(antes[k]===firmas[k])return;
  var f=new Date(lunH);f.setDate(lunH.getDate()+((i+6)%7));if(+f<+HOYC||d.estado==='verde')return;
  try{AM_NOTIF({quien:'tu entrenador',grupo:d.grupo,dia:+f===+HOYC?'hoy':d.dia.toLowerCase(),cambio:!!antes[k],ejercicios:JSON.parse(JSON.stringify(d.ejercicios)),cardio:d.cardio||[]});}catch(e){}});}
 try{render();}catch(e){}};

/* medidas del panel: tabla, tarjetas, gráficos y valores previos de la toma guiada */
var MEDT=null;
function medP(m){if(!m||!m.fechas||!m.fechas.length||!m.filas){MEDT=null;return;}
 var F=m.filas.map(function(f){return {n:f.nombre,u:f.unidad||'',v:(f.valores||[]).map(numP)};});
 var col=m.fechas.map(function(_,i){return F.some(function(f){return f.v[i]!=null;});}),idx=[];col.forEach(function(ok,i){if(ok)idx.push(i);});
 if(!idx.length){MEDT=null;return;}
 var fila=function(re){return F.filter(function(f){return re.test(nrmP(f.n));})[0];};
 var mm=F.filter(function(f){return f.u==='mm';}),sum=idx.map(function(i){var v=mm.map(function(f){return f.v[i];}).filter(function(x){return x!=null;});return v.length?Math.round(v.reduce(function(a,b){return a+b;},0)*10)/10:null;});
 var ser=function(f){return f?idx.map(function(i){return f.v[i];}):idx.map(function(){return null;});};
 TOMAS=idx.map(function(i){return fCorta(m.fechas[i]);});
 SERIE={s6:sum,peso:ser(fila(/^masa corporal|^peso/)),cint:ser(fila(/^cintura/)),brazo:ser(fila(/^brazo relajado|^brazo$/))};
 MED_ULT=TOMAS[TOMAS.length-1];
 var ult=idx[idx.length-1];SITIOS.forEach(function(s){var f=F.filter(function(x){return nrmP(x.n)===nrmP(s.n);})[0];if(f&&f.v[ult]!=null)s.prev=f.v[ult];});
 var prox=new Date(String(m.fechas[ult]).slice(0,10)+'T12:00:00');prox.setDate(prox.getDate()+28);
 MEDT={F:F,idx:idx,fechas:m.fechas,sum:sum,prox:fCorta(prox.toISOString()),n:idx.length};}
function sumaPrev(){return MEDT?MEDT.sum[MEDT.sum.length-1]:90.5;}

/* ---------- Hoy con los datos del panel ---------- */
var vHoy0=vHoy;
vHoy=function(){if(!PANEL)return vHoy0();
 var t=tot(),h=hechas(),fal={p:NUT.obj.p-t.p},ses=PANEL.ses,c=PANEL.c;
 var s='<div class="hd"><span class="ey">'+DSEM[HOYC.getDay()]+' '+HOY_TXT()+'</span><h1>Hola, '+NOMBRE+'</h1></div>'+avisoHoy();
 if(ses){var mus={},nej=0,ns=0;(ses.ejercicios||[]).forEach(function(e){if(!e.nombre)return;nej++;var n=seriesP(e).length;ns+=n;var g=e.grupo||'Otros';mus[g]=(mus[g]||0)+n;});
  var top=Object.keys(mus).sort(function(a,b){return mus[b]-mus[a];}).slice(0,2);
  var btn=U.ses.fin?I.chk+'Hecha · esfuerzo '+U.esf:U.ses.on?(h[0]===h[1]?'Ver resumen':'Seguir sesión · '+h[0]+'/'+h[1]):(PANEL.hoy?'Empezar sesión':'Adelantar sesión');
  s+='<section class="card ent"><div class="img"><img src="../cuerpo/'+imgG(ses.grupo)+'.webp" alt="Músculos de la sesión resaltados en azul"><span class="chip">'+(PANEL.hoy?'Entreno de hoy':'Próximo · '+ses.dia)+'</span></div><div class="in"><h2>'+(ses.grupo||'Entreno')+'</h2><div class="meta">'+
   top.map(function(g){return '<span class="chip ac">'+g+' · '+mus[g]+'</span>';}).join('')+'<span class="chip">'+nej+' ejercicio'+(nej===1?'':'s')+'</span><span class="chip">~'+Math.round(ns*3)+' min</span></div>'+
   '<button type="button" class="pri full" data-a="'+(U.ses.fin||(U.ses.on&&h[0]===h[1])?'resumen':'sesion')+'">'+btn+'</button></div></section>';}
 else s+='<section class="card"><div class="fila" style="padding:0"><span class="ico">'+I.reloj+'</span><span><b>Hoy descansás</b><span class="s">No tenés más entrenos pendientes esta semana.</span></span><span></span></div></section>';
 /* semana */
 var lun=lunes(HOYC),dots=[],pl=0,he=0;for(var i=0;i<7;i++){var f=new Date(lun);f.setDate(lun.getDate()+i);var di=diaInfo(f),cls='';
  if(di.g){pl++;if(di.e==='ok'&&+f<+HOYC){cls='ok';he++;}else if(+f===+HOYC)cls=U.ses.fin?'ok':'hoy';else if(+f>+HOYC)cls='pl';}
  if(+f===+HOYC&&U.ses.fin)he++;dots.push(['LMMJVSD'[i],cls]);}
 var sp=function(a){return a.filter(function(x){return x!=null;});},pesoS=sp(SERIE.peso),cinS=sp(SERIE.cint);
 var dlt=function(a,u){if(a.length<2)return '<span class="chip">sin comparar</span>';var d=Math.round((a[a.length-1]-a[0])*10)/10;return '<span class="'+(d<=0?'up':'')+'">'+(d>0?'+':d<0?'−':'')+co(Math.abs(d))+' '+u+'</span> desde '+TOMAS[0];};
 s+='<div class="sh"><h2>Tu día</h2></div><div class="gr2">'+
  '<button type="button" class="tile" data-a="tab" data-v="mac"><span class="lbl">Macros</span><div class="ringw"><svg viewBox="0 0 100 100">'+ring(t.k/OBJK,'var(--a1)',11,40)+'<text x="50" y="57" text-anchor="middle" font-size="21" font-weight="700" fill="var(--tx)">'+Math.round(t.k/OBJK*100)+'%</text></svg><div><div class="big" style="font-size:20px">'+kf(t.k)+'</div><div class="s">de '+kf(OBJK)+' kcal</div></div></div></button>'+
  '<button type="button" class="tile" data-a="tab" data-v="cal"><span class="lbl">Semana</span><div class="big">'+he+'<small>de '+pl+' días</small></div><div class="dots">'+dots.map(function(d){return '<span class="'+d[1]+'"><i></i>'+d[0]+'</span>';}).join('')+'</div></button>'+
  (pesoS.length?'<button type="button" class="tile" data-a="tab" data-v="med"><span class="lbl">Peso</span><div class="big">'+co(pesoS[pesoS.length-1])+'<small>kg</small></div><div class="s">'+dlt(pesoS,'kg')+'</div>'+spark(pesoS,'var(--vio)',130,30)+'</button>':'')+
  (cinS.length?'<button type="button" class="tile" data-a="tab" data-v="med"><span class="lbl">Cintura</span><div class="big">'+co(cinS[cinS.length-1])+'<small>cm</small></div><div class="s">'+dlt(cinS,'cm')+'</div>'+spark(cinS,'var(--cya)',130,30)+'</button>':'')+'</div>';
 s+='<div class="sh"><h2>Para hoy</h2></div><section class="card lista" style="padding:2px 16px">'+
  aviso('gota','cy','Proteína: te faltan '+fal.p+' g','Llevás '+t.p+' de '+NUT.obj.p+' g.','mac')+
  (MEDT?aviso('regla','ok','Próxima toma de medidas: '+MEDT.prox,'Cada 4 semanas. La última fue el '+MED_ULT+'.','med'):'')+'</section>';
 return s;};

/* ---------- detalle de un día del calendario con lo que está en el panel ---------- */
var sesDe0=sesDe;
function diaDeFecha(d){if(!PANEL)return null;var c=PANEL.c,m=lunes(d),i=d.getDay(),lista=null;m=new Date(m.getFullYear(),m.getMonth(),m.getDate());
 if(+m===+lunes(HOYC))lista=c.rutina;else (c.historial||[]).forEach(function(h){var x=lunes(new Date(h.fecha));x=new Date(x.getFullYear(),x.getMonth(),x.getDate());if(+x===+m)lista=h.rutina;});
 return lista?(lista.filter(function(x){return iDia(x.dia)===i;})[0]||null):null;}
sesDe=function(g,d){if(!PANEL)return sesDe0(g,d);var dd=diaDeFecha(d);
 if(!dd){var i=d.getDay();dd=(PANEL.c.rutina||[]).filter(function(x){return iDia(x.dia)===i;})[0];if(!dd)return [];dd={ejercicios:dd.ejercicios,estado:''};}
 var pd=new Date(d);pd.setDate(pd.getDate()-7);var prev=diaDeFecha(pd),hecho=dd.estado==='verde'||(dd.estado===undefined&&+d<+HOYC);
 return (dd.ejercicios||[]).filter(function(e){return e.nombre;}).map(function(e){var ss=seriesP(e),u=uniP((ss[0]||{}).peso),w=Math.max.apply(null,[0].concat(ss.map(function(s){return numP(s.peso)||0;}))),r=ss.map(function(s){return parseInt(s.reps,10)||0;});
  var pv=null;if(prev)(prev.ejercicios||[]).forEach(function(x){if(nrmP(x.nombre)===nrmP(e.nombre))pv=Math.max.apply(null,[0].concat(seriesP(x).map(function(s){return numP(s.peso)||0;})));});
  return {n:e.nombre,u:u==='pl'?'pl':'kg',o:hecho?{w:w,r:r}:null,sube:hecho&&pv!=null&&w>pv,plan:[w,r[0]||0,ss.length,parseInt((ss[0]||{}).rir,10)||0]};});};

/* ---------- Medidas con los datos del panel ---------- */
var vMed0=vMed;
vMed=function(){if(!MEDT)return vMed0();var m=U.med,s='<div class="hd"><div class="row"><div><span class="ey">Tu cuerpo</span><h1>Medidas</h1></div></div><p>Protocolo ISAK · '+MEDT.n+' toma'+(MEDT.n===1?'':'s')+' · última el '+MED_ULT+' · próxima el '+MEDT.prox+'</p></div>';
 s+='<div class="bajo" style="margin:0 0 14px"><button type="button" class="pri" data-a="pesoHoy">'+I.mas+'Mi peso</button><button type="button" class="sec" data-a="toma">'+I.regla+'Toma completa</button></div>';
 var ult=function(a){a=a.filter(function(x){return x!=null;});return a.length?a[a.length-1]:null;},dif=function(a){a=a.filter(function(x){return x!=null;});if(a.length<2)return 0;return Math.round((a[a.length-1]-a[a.length-2])*10)/10;};
 var T=[['Peso','peso','kg'],['Cintura','cint','cm'],['Brazo','brazo','cm'],['Pliegues','s6','mm']].filter(function(t){return ult(SERIE[t[1]])!=null;});
 if(T.length&&!SERIE[m.graf].some(function(x){return x!=null;}))m.graf=T[0][1];
 s+='<div class="tk">'+T.map(function(t){var d=dif(SERIE[t[1]]);return '<button type="button" class="tile" data-a="medG" data-v="'+t[1]+'" style="'+(m.graf===t[1]?'border-color:var(--a1)':'')+'"><span class="lbl">'+t[0]+'</span><b>'+co(ult(SERIE[t[1]]))+'<small>'+t[2]+'</small></b><div class="s">'+(!d?'<span class="chip">estable</span>':'<span class="chip'+(d<0?' ok':'')+'">'+(d>0?'+':'−')+co(Math.abs(d))+'</span>')+' vs. anterior</div></button>';}).join('')+'</div>';
 var nom={s6:'Pliegues (suma de 8)',peso:'Peso',cint:'Cintura',brazo:'Brazo'}[m.graf],u={s6:'mm',peso:'kg',cint:'cm',brazo:'cm'}[m.graf];
 s+='<div class="sh"><h2>Evolución</h2></div><section class="card"><h3>'+nom+'</h3><p class="sub">Toma a toma, en '+u+'.</p><div style="margin-top:8px">'+linea(SERIE[m.graf],TOMAS,{col:m.graf==='s6'?'var(--cya)':'var(--a1)',aria:'Evolución de '+nom})+'</div>'+(m.graf==='s6'?'<p class="sub">Los pliegues miden la grasa debajo de la piel. Los toma tu entrenador.</p>':'')+'</section>';
 s+='<div class="sh"><h2>Todas las medidas</h2><button type="button" data-a="medT">'+(m.tabla?'Ocultar':'Ver tabla')+'</button></div>';
 if(m.tabla){var ix=MEDT.idx.slice(-3),cols=ix.map(function(i){return fCorta(MEDT.fechas[i]);}),G=[['Básicas',function(f){return /^(masa corporal|peso|talla)/.test(nrmP(f.n));}],['Pliegues (mm)',function(f){return f.u==='mm';}],['Perímetros (cm)',function(f){return f.u==='cm'&&!/humero|biestiloideo|femur|talla/.test(nrmP(f.n));}],['Diámetros (cm)',function(f){return /humero|biestiloideo|femur/.test(nrmP(f.n));}]];
  var usados={},filas='';G.forEach(function(g){var L=MEDT.F.filter(function(f){return !usados[f.n]&&g[1](f);});if(!L.length)return;filas+='<tr class="g"><td colspan="'+(cols.length+1)+'">'+g[0]+'</td></tr>';
   L.forEach(function(f){usados[f.n]=1;filas+='<tr><td>'+f.n+'</td>'+ix.map(function(i){return '<td>'+(f.v[i]==null?'—':co(f.v[i]))+'</td>';}).join('')+'</tr>';});
   if(g[0]==='Pliegues (mm)')filas+='<tr class="t"><td>Σ 8</td>'+ix.map(function(i){return '<td>'+(MEDT.sum[MEDT.idx.indexOf(i)]==null?'—':co(MEDT.sum[MEDT.idx.indexOf(i)]))+'</td>';}).join('')+'</tr>';});
  s+='<section class="card" style="padding:6px 16px 10px"><table class="tabla"><thead><tr><th>Medida</th>'+cols.map(function(c){return '<th>'+c+'</th>';}).join('')+'</tr></thead><tbody>'+filas+'</tbody></table></section>';}
 return s;};

/* guarda las series hechas de la sesión del panel (por ejercicio), para no perderlas al recargar */
(function(){var g0=window.guardar;if(typeof g0!=='function')return;window.guardar=function(){var r=g0.apply(this,arguments);if(PANEL&&PANEL.ses){var h={};BLQ.forEach(function(b){b.ej.forEach(function(e,k){h[e.id]=b.h.map(function(row){return row[k]||null;});});});
 try{localStorage.setItem('amedida-panel-h',JSON.stringify({fecha:hoyISO(),dia:PANEL.ses.dia,h:h}));}catch(e){}}return r;};})();
