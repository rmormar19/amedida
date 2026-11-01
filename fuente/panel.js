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
function imgG(g){var n=nrmP(g);return /pierna|cuadri|glute|femoral|lower|inferior|gemel|aductor/.test(n)?'mapa_pierna':/espalda|dorsal/.test(n)?'mapa_espalda':/pecho|hombro/.test(n)?'mapa_pecho':'mapa_brazos';}
/* músculo por el nombre del ejercicio, cuando el panel no lo trae */
function musculoP(n){n=nrmP(n);var R=[[/aductor/,'Aductor'],[/abductor/,'Glúteo'],[/gemel|pantorr/,'Pantorrilla'],[/femoral|peso muerto|rumano|isquio/,'Femoral'],[/hip thrust|glute|patada/,'Glúteo'],[/sentadilla|prensa|extension de cuadri|camilla de cuadri|bulgara|zancada|estocada|hack|sissy/,'Cuádriceps'],[/tricep|frances|fondos/,'Tríceps'],[/curl/,'Bíceps'],[/press militar|vuelo|lateral|frontal|face ?pull|hombro/,'Hombro'],[/press|apertura|pec ?deck|cruce|pecho|flexion/,'Pecho'],[/remo|jalon|dorsal|dominada|pullover/,'Espalda'],[/abdom|crunch|plancha|elevacion de piernas/,'Core']];
 for(var i=0;i<R.length;i++)if(R[i][0].test(n))return R[i][1];return 'Otros';}
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
 if(!p.length)p=[[0,0,0]];var conPeso=ss.some(function(s){return numP(s.peso)!=null;}),conRir=ss.some(function(s){return numP(s.rir)!=null;});
 var u=conPeso?uniP((ss.filter(function(s){return numP(s.peso)!=null;})[0]||{}).peso):(/polea|aductor|abductor|extensi[oó]n de cu|femoral|m[aá]quina|camilla|jal[oó]n|remo bajo|pec ?deck/i.test(x.nombre)?'pl':'kg');
 var rr=ss.map(function(s){return String(s.reps||'').trim().replace(/\s*-\s*/,'–');}),gr=[];rr.forEach(function(r){var g=gr[gr.length-1];if(g&&g.r===r)g.n++;else gr.push({n:1,r:r||'—'});});
 var drop=ss.some(function(s){return s.tipo==='drop'||(s.drops&&s.drops.length);});
 var v={lado:/uni/i.test(x.lateralidad||'')?'unilateral':'bilateral'};if(x.agarre)v.agarre=String(x.agarre).toLowerCase();
 return {id:slugP(x.nombre),n:x.nombre,lam:lamDe(x.nombre)||'',u:u,g:x.grupo||musculoP(x.nombre),rr:rr,sinPeso:!conPeso,o:gr.map(function(g){return g.n+' × '+g.r;}).join(' + ')+(conRir?' · RIR '+p[0][2]:'')+(drop?' · drop en la última':''),p:p,v:v};}
function phSer(e,i,j){var p=e.p[i]||e.p[e.p.length-1];if(j===1)return e.rr&&e.rr[i]?e.rr[i]:co(p[1]);if(j===0){var w=e.sinPeso?0:sugerido(e,i);return w?co(w):'—';}return e.sinPeso&&!p[2]?'—':co(p[2]);}
(function(){var c0=chipSug;chipSug=function(e){return e&&e.sinPeso?'':c0(e);};})();
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
/* la semana del panel cierra el domingo 06:00: desde ese momento la rutina cargada es la de la semana que empieza el lunes */
function lunesOp(d){var x=new Date(d);if(x.getDay()===0&&x.getHours()>=6)x.setDate(x.getDate()+1);var m=lunes(x);return new Date(m.getFullYear(),m.getMonth(),m.getDate());}
function LUNH(){return PANEL&&PANEL.lun?PANEL.lun:lunesOp(new Date());}
function fechaDia(d,lun){var i=iDia(d.dia),f=new Date(lun);f.setDate(lun.getDate()+((i+6)%7));return f;}
function diaSesion(c){var lun=lunesOp(new Date()),r=(c.rutina||[]).filter(function(d){return (d.ejercicios||[]).some(function(e){return e.nombre;})&&!d.libre&&iDia(d.dia)>=0;});
 var hoy=r.filter(function(d){return +fechaDia(d,lun)===+HOYC;})[0];if(hoy)return {d:hoy,hoy:true};
 var prox=r.filter(function(d){return +fechaDia(d,lun)>+HOYC&&d.estado!=='verde'&&d.estado!=='rojo';}).sort(function(a,b){return fechaDia(a,lun)-fechaDia(b,lun);})[0];
 return prox?{d:prox,hoy:false}:null;}

window.AM_PANEL=function(c,opt){opt=opt||{};if(!c)return;var primera=!PANEL;
 var t=new Date();HOYC=new Date(t.getFullYear(),t.getMonth(),t.getDate());if(window.CST_CACHE)for(var kc in CST_CACHE)delete CST_CACHE[kc];
 var antes=PANEL?PANEL.firmas:{};
 /* grupos del panel */
 var dias=(c.rutina||[]).filter(function(d){return (d.ejercicios||[]).some(function(e){return e.nombre;});}),gi=0;
 GRP={};var firmas={};
 (c.historial||[]).forEach(function(h){(h.rutina||[]).forEach(function(d){var k=gKey(d.grupo);if((d.ejercicios||[]).length&&!GCOL[k]){GCOL[k]=GPAL[(gi++)%GPAL.length];GFULL[k]=d.grupo||k;GSER[k]=GSER[k]||12;GMIN[k]=GMIN[k]||40;}});});
 dias.forEach(function(d){var k=gKey(d.grupo),i=iDia(d.dia);firmas[nrmP(d.dia)]=firmaDia(d);
  if(!GCOL[k])GCOL[k]=GPAL[(gi++)%GPAL.length];GFULL[k]=d.grupo||k;
  var ns=0;(d.ejercicios||[]).forEach(function(e){ns+=seriesP(e).length;});GSER[k]=ns||GSER[k]||12;GMIN[k]=Math.round((ns||12)*3);
  if(i>=0&&!d.libre)GRP[i]=k;});
 /* calendario: faltas, días libres y días que pasaron sin registrar */
 CALX={};MOVS={};DESC0=0;DESC1=0;
 var lunH=lunesOp(new Date());
 var marcar=function(mon,lista,actual){(lista||[]).forEach(function(d){var i=iDia(d.dia);if(i<0)return;var f=new Date(mon);f.setDate(mon.getDate()+((i+6)%7));var k=kd(f);
   if(d.libre){MOVS[k]={libre:true};return;}
   if(d.estado==='rojo')CALX[k]={e:'fa',o:'Faltó'};
   else if(actual&&d.estado!=='verde'&&+f<+HOYC&&(d.ejercicios||[]).length)CALX[k]={e:'fa',o:'Sin registrar en la app'};});};
 (c.historial||[]).forEach(function(h){var m=lunesOp(new Date(h.fecha));if(+m!==+lunH)marcar(m,h.rutina,false);});
 marcar(lunH,c.rutina,true);
 (c.observaciones||[]).forEach(function(o){var m=String(o.texto||'').match(/viaje|vacacion/i);if(!m||!/^\d{4}-\d{2}-\d{2}/.test(o.fecha||''))return;});
 /* la sesión */
 var ds=diaSesion(c),ses=ds?ds.d:null,nuevo=ses?blqP(ses):[],viejo=BLQ;
 var guard=null;try{guard=JSON.parse(localStorage.getItem('amedida-panel-h')||'null');}catch(e){}
 if(ses&&guard&&guard.fecha===hoyISO()&&nrmP(guard.dia)===nrmP(ses.dia))nuevo.forEach(function(b){b.ej.forEach(function(e,k){var g=guard.h[e.id];if(g)b.h.forEach(function(r,s){if(g[s])r[k]=g[s];});});});
 if(ses&&U.ses&&U.ses.on){
  nuevo.forEach(function(b){b.ej.forEach(function(e,k){viejo.forEach(function(bo){bo.ej.forEach(function(eo,ko){if(eo.id===e.id)b.h.forEach(function(r,s){if(bo.h[s]&&bo.h[s][ko])r[k]=bo.h[s][ko];});});});});});}
 BLQ.length=0;nuevo.forEach(function(b){BLQ.push(b);});if(U.ses&&U.ses.b>=BLQ.length)U.ses.b=0;DIA_SES=ses?ses.dia:'';
 /* cardio del día, tal como lo cargó el panel */
 if(window.CARDIO){CARDIO.length=0;(ses&&ses.cardio||[]).forEach(function(z){if(z&&z.tipo)CARDIO.push({tipo:z.tipo,modo:z.modo||'min',cant:z.cant||'',zona:z.zona||'',inclinacion:z.inclinacion||'',velocidad:z.velocidad||'',cuando:z.cuando||'al final',minReal:z.minReal||'',fc:z.fc||'',estado:z.estado||''});});}
 PANEL={c:c,ses:ses,hoy:ds&&ds.hoy,firmas:firmas,lun:lunH};
 try{setModelo((c.datos&&c.datos.sexo)||(window.REAL&&REAL.g)||'');}catch(e){}
 if(primera&&U.cal){U.cal.sel=kd(HOYC);U.cal.mes=HOYC.getMonth();U.cal.mx=Math.max(U.cal.mx||0,HOYC.getMonth());}
 /* medidas */
 medP(c.medidas);
 /* aviso de rutina cambiada (no en la primera carga ni en días que ya pasaron) */
 if(!primera&&!opt.silencio){dias.forEach(function(d){var k=nrmP(d.dia),i=iDia(d.dia);if(antes[k]===firmas[k])return;
  var f=fechaDia(d,lunH);if(+f<+HOYC||d.estado==='verde')return;
  try{AM_NOTIF({quien:'tu entrenador',grupo:d.grupo,dia:+f===+HOYC?'hoy':d.dia.toLowerCase(),cambio:!!antes[k],ejercicios:JSON.parse(JSON.stringify(d.ejercicios)),cardio:d.cardio||[]});}catch(e){}});}
 try{render();}catch(e){}};

/* medidas del panel: tabla, tarjetas, gráficos y valores previos de la toma guiada */
var MEDT=null;
function medP(m){var vacio=function(){MEDT=null;TOMAS=[];SERIE={s6:[],peso:[],cint:[],brazo:[]};};if(!m||!m.fechas||!m.fechas.length||!m.filas){vacio();return;}
 var F=m.filas.map(function(f){return {n:f.nombre,u:f.unidad||'',v:(f.valores||[]).map(numP)};});
 var col=m.fechas.map(function(_,i){return F.some(function(f){return f.v[i]!=null;});}),idx=[];col.forEach(function(ok,i){if(ok)idx.push(i);});
 if(!idx.length){vacio();return;}
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
 var s='<div class="hd"><span class="ey">'+DSEM[HOYC.getDay()]+' '+HOY_TXT()+'</span><h1>Hola, '+NOMBRE+'</h1></div>'+avisoHoy()+(window.pushCard?pushCard():'');
 if(ses){var mus={},nej=0,ns=0;(ses.ejercicios||[]).forEach(function(e){if(!e.nombre)return;nej++;var n=seriesP(e).length;ns+=n;var g=e.grupo||musculoP(e.nombre);mus[g]=(mus[g]||0)+n;});
  var top=Object.keys(mus).sort(function(a,b){return mus[b]-mus[a];}).slice(0,2);
  var btn=U.ses.fin?I.chk+'Hecha · esfuerzo '+U.esf:U.ses.on?(h[0]===h[1]?'Ver resumen':'Seguir sesión · '+h[0]+'/'+h[1]):(PANEL.hoy?'Empezar sesión':'Adelantar sesión');
  s+='<section class="card ent"><div class="img"><img src="../cuerpo/'+imgG(ses.grupo)+'.webp" alt="Músculos de la sesión resaltados en azul"><span class="chip">'+(PANEL.hoy?'Entreno de hoy':'Próximo · '+ses.dia)+'</span></div><div class="in"><h2>'+(ses.grupo||'Entreno')+'</h2><div class="meta">'+
   top.map(function(g){return '<span class="chip ac">'+g+' · '+mus[g]+'</span>';}).join('')+'<span class="chip">'+nej+' ejercicio'+(nej===1?'':'s')+'</span><span class="chip">~'+Math.round(ns*3)+' min</span></div>'+
   '<div class="lista hoyl">'+(ses.ejercicios||[]).filter(function(e){return e.nombre;}).map(function(e){var ep=ejP(e);return '<div class="sx"><span>'+e.nombre+'</span><b>'+ep.o.replace(/ · drop en la última/,'')+'</b><span></span></div>';}).join('')+'</div>'+
   '<button type="button" class="pri full" data-a="'+(U.ses.fin||(U.ses.on&&h[0]===h[1])?'resumen':'sesion')+'">'+btn+'</button></div></section>';}
 else s+='<section class="card"><div class="fila" style="padding:0"><span class="ico">'+I.reloj+'</span><span><b>Hoy descansás</b><span class="s">No tenés más entrenos pendientes esta semana.</span></span><span></span></div></section>';
 /* semana */
 var lun=LUNH(),dots=[],pl=0,he=0;for(var i=0;i<7;i++){var f=new Date(lun);f.setDate(lun.getDate()+i);var di=diaInfo(f),cls='';
  if(di.g){pl++;if(di.e==='ok'&&+f<+HOYC){cls='ok';he++;}else if(+f===+HOYC)cls=U.ses.fin?'ok':'hoy';else if(+f>+HOYC)cls='pl';}
  if(+f===+HOYC&&U.ses.fin)he++;dots.push(['LMMJVSD'[i],cls]);}
 var sp=function(a){return a.filter(function(x){return x!=null;});},pesoS=sp(SERIE.peso),cinS=sp(SERIE.cint);
 var dlt=function(a,u){if(a.length<2)return '<span class="chip">sin comparar</span>';var d=Math.round((a[a.length-1]-a[0])*10)/10;return '<span class="'+(d<=0?'up':'')+'">'+(d>0?'+':d<0?'−':'')+co(Math.abs(d))+' '+u+'</span> desde '+TOMAS[0];};
 s+='<div class="sh"><h2>Tu día</h2></div><div class="gr2">'+
  (PANEL.macros?'<button type="button" class="tile" data-a="tab" data-v="mac"><span class="lbl">Macros</span><div class="ringw"><svg viewBox="0 0 100 100">'+ring(t.k/OBJK,'var(--a1)',11,40)+'<text x="50" y="57" text-anchor="middle" font-size="21" font-weight="700" fill="var(--tx)">'+Math.round(t.k/OBJK*100)+'%</text></svg><div><div class="big" style="font-size:20px">'+kf(t.k)+'</div><div class="s">de '+kf(OBJK)+' kcal</div></div></div></button>':'')+
  '<button type="button" class="tile" data-a="tab" data-v="cal"><span class="lbl">Semana</span><div class="big">'+he+'<small>de '+pl+' días</small></div><div class="dots">'+dots.map(function(d){return '<span class="'+d[1]+'"><i></i>'+d[0]+'</span>';}).join('')+'</div></button>'+
  (pesoS.length?'<button type="button" class="tile" data-a="tab" data-v="med"><span class="lbl">Peso</span><div class="big">'+co(pesoS[pesoS.length-1])+'<small>kg</small></div><div class="s">'+dlt(pesoS,'kg')+'</div>'+spark(pesoS,'var(--vio)',130,30)+'</button>':'')+
  (cinS.length?'<button type="button" class="tile" data-a="tab" data-v="med"><span class="lbl">Cintura</span><div class="big">'+co(cinS[cinS.length-1])+'<small>cm</small></div><div class="s">'+dlt(cinS,'cm')+'</div>'+spark(cinS,'var(--cya)',130,30)+'</button>':'')+'</div>';
 if(PANEL.macros||MEDT)s+='<div class="sh"><h2>Para hoy</h2></div><section class="card lista" style="padding:2px 16px">'+
  (PANEL.macros?aviso('gota','cy','Proteína: te faltan '+fal.p+' g','Llevás '+t.p+' de '+NUT.obj.p+' g.','mac'):'')+
  (MEDT?aviso('regla','ok','Próxima toma de medidas: '+MEDT.prox,'Cada 4 semanas. La última fue el '+MED_ULT+'.','med'):'')+'</section>';
 return s;};

/* ---------- detalle de un día del calendario con lo que está en el panel ---------- */
var sesDe0=sesDe;
function diaDeFecha(d){if(!PANEL)return null;var c=PANEL.c,m=lunes(d),i=d.getDay(),lista=null;m=new Date(m.getFullYear(),m.getMonth(),m.getDate());
 if(+m===+LUNH())lista=c.rutina;else (c.historial||[]).slice().sort(function(a,b){return String(a.fecha).localeCompare(String(b.fecha));}).forEach(function(h){if(+lunesOp(new Date(h.fecha))===+m)lista=h.rutina;});
 return lista?(lista.filter(function(x){return iDia(x.dia)===i;})[0]||null):null;}
sesDe=function(g,d){if(!PANEL)return sesDe0(g,d);var dd=diaDeFecha(d);
 if(!dd){var i=d.getDay();dd=(PANEL.c.rutina||[]).filter(function(x){return iDia(x.dia)===i;})[0];if(!dd)return [];dd={ejercicios:dd.ejercicios,estado:''};}
 var pd=new Date(d);pd.setDate(pd.getDate()-7);var prev=diaDeFecha(pd),hecho=dd.estado==='verde'||(dd.estado===undefined&&+d<+HOYC);
 return (dd.ejercicios||[]).filter(function(e){return e.nombre;}).map(function(e){var ss=seriesP(e),u=uniP((ss[0]||{}).peso),w=Math.max.apply(null,[0].concat(ss.map(function(s){return numP(s.peso)||0;}))),r=ss.map(function(s){return parseInt(s.reps,10)||0;});
  var pv=null;if(prev)(prev.ejercicios||[]).forEach(function(x){if(nrmP(x.nombre)===nrmP(e.nombre))pv=Math.max.apply(null,[0].concat(seriesP(x).map(function(s){return numP(s.peso)||0;})));});
  var ep=ejP(e);return {n:e.nombre,u:ep.u==='pl'?'pl':'kg',o:hecho?{w:w,r:r}:null,sube:hecho&&pv!=null&&w>pv,plan:[w,r[0]||0,ss.length,parseInt((ss[0]||{}).rir,10)||0],txt:ep.o.replace(/ · drop en la última/,''),sinPeso:ep.sinPeso};});};

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

/* ---------- calendario y constancia con lo registrado de verdad (no con el esquema semanal) ---------- */
var diaInfo0=diaInfo;
diaInfo=function(d){if(!PANEL)return diaInfo0(d);var k=kd(d),m=MOVS[k],t=+d,h=+HOYC,dd=diaDeFecha(d);
 if(m&&m.libre)return {g:null,e:'de',libre:true};
 if(!dd||dd.libre||!(dd.ejercicios||[]).some(function(e){return e&&e.nombre;}))return {g:null,e:'de',libre:!!(dd&&dd.libre)};
 var g=gKey(dd.grupo),e;
 if(t===h)e=dd.estado==='verde'?'ok':(U.ses.on?'cur':'hoy');
 else if(t>h)e=dd.estado==='rojo'?'fa':'pl';
 else e=dd.estado==='rojo'?'fa':(dd.estado==='verde'||!Object.prototype.hasOwnProperty.call(dd,'estado')?'ok':'fa');
 return {g:g,e:e,o:e==='fa'?(dd.estado==='rojo'?'Faltó':'Sin registrar en la app'):'',desc:false,mov:null};};
var diasAnio0=diasAnio;
diasAnio=function(Y){if(!PANEL)return diasAnio0(Y);if(CST_CACHE[Y])return CST_CACHE[Y];var out={},hoy=+HOYC,m0=lunes(new Date(Y,0,1)),fin=new Date(Y,11,31);
 while(+m0<=+fin){semDias(m0).forEach(function(d){var t=+d,x=diaInfo(d),k=kdC(d),o;
   if(t>hoy)o={e:x.g?'pl':'de',g:x.g};
   else if(t===hoy){var hz=U.ses.on||U.ses.fin||x.e==='ok';o={e:hz?'ok':(x.g?'hoy':'de'),g:x.g,lv:hz?(ESF_LV[U.esf]||2):0,cur:U.ses.on};}
   else if(!x.g)o={e:'de'};
   else{o={e:x.e==='ok'?'ok':'fa',g:x.g,o:x.o};if(o.e==='ok'){var dd=diaDeFecha(d),n=0;if(dd)(dd.ejercicios||[]).forEach(function(e){n+=seriesP(e).length;});o.lv=(dd&&ESF_LV[dd.esfuerzo])||2;o.ser=n||null;}}
   o.d=new Date(d);out[k]=o;});m0.setDate(m0.getDate()+7);}
 return (CST_CACHE[Y]=out);};

/* ---------- Progreso: cada ejercicio de su rutina, semana a semana, con lo registrado ---------- */
var vPro0=vPro;
vPro=function(){if(!PANEL)return vPro0();var c=PANEL.c,sem=(c.historial||[]).slice().sort(function(a,b){return String(a.fecha).localeCompare(String(b.fecha));}).map(function(h){return {f:h.fecha,r:h.rutina||[]};});
 sem.push({f:new Date().toISOString(),r:c.rutina||[],hoy:true});
 var lista=[];(c.rutina||[]).forEach(function(d){(d.ejercicios||[]).forEach(function(e){if(e&&e.nombre&&!lista.some(function(x){return nrmP(x.n)===nrmP(e.nombre);}))lista.push({n:e.nombre,g:e.grupo||'',dia:d.dia});});});
 var hechos=0;sem.slice(0,-1).forEach(function(w){w.r.forEach(function(d){if((d.ejercicios||[]).length&&(d.estado==='verde'||!Object.prototype.hasOwnProperty.call(d,'estado')))hechos++;});});
 var s='<div class="hd"><span class="ey">Tu progreso</span><h1>Progreso</h1><p>'+(sem.length>1?hechos+' sesiones registradas en las últimas '+(sem.length-1)+' semanas.':'Todavía no hay semanas cerradas: tu progreso aparece acá a medida que entrenes.')+'</p></div>';
 if(!lista.length)return s+'<section class="card"><p class="sub">Cuando tu entrenador te cargue la rutina, acá vas a ver cómo evoluciona cada ejercicio.</p></section>';
 s+='<section class="card lista" style="padding:2px 16px">'+lista.map(function(x){var u='kg',pts=sem.map(function(w){var best=null;w.r.forEach(function(d){if(!w.hoy&&d.estado==='rojo')return;(d.ejercicios||[]).forEach(function(e){if(nrmP(e.nombre)!==nrmP(x.n))return;seriesP(e).forEach(function(q){var v=numP(q.peso);if(v!=null&&(best==null||v>best)){best=v;u=uniP(q.peso);}});});});return best;});
   var v=pts.filter(function(p){return p!=null;}),ini=v[0],ult=v[v.length-1],d=v.length>1?Math.round((ult-ini)*10)/10:0,un=u==='pl'?' pl':' '+u;
   return '<div style="display:grid;grid-template-columns:minmax(0,1fr) auto 70px;gap:10px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)"><span style="min-width:0"><b style="display:block">'+x.n+'</b><span class="s" style="display:block;font-size:12.5px;color:var(--tx3)">'+(x.g?x.g+' · ':'')+(v.length>1?'de '+co(ini)+un+' a '+co(ult)+un:(ult!=null?co(ult)+un:'sin peso cargado'))+'</span></span>'+(v.length>1?'<span class="chip'+(d>0?' ok':'')+'">'+(d>0?'+':d<0?'−':'')+(d?co(Math.abs(d))+un:'igual')+'</span>'+spark(v,'var(--a1)',70,26):'<span></span><span></span>')+'</div>';}).join('')+'</section>';
 s+='<p class="mu" style="font-size:12.5px;margin:10px 2px 0">El peso más alto de cada semana, de lo que quedó registrado.</p>';
 return s;};
var vMac0=vMac;
vMac=function(){if(!PANEL||PANEL.macros)return vMac0();
 return '<div class="hd"><span class="ey">Nutrición</span><h1>Macros</h1></div><section class="card"><div class="fila" style="padding:0"><span class="ico">'+I.info+'</span><span><b>Todavía no está conectado</b><span class="s">Cuando tu entrenador cargue tu plan de comidas, vas a ver acá tus objetivos y lo que llevás en el día.</span></span><span></span></div></section>';};
/* más ejercicios con lámina, y sin lámina no se muestra una imagen rota */
LAMDE.unshift([/aductor/i,'aductores'],[/extensi[oó]n de cu[aá]driceps|camilla de cu[aá]driceps/i,'extension'],[/femoral/i,'curl'],[/vuelos? laterales? con mancuernas/i,'vuelosmanc'],[/vuelos? laterales?/i,'vuelospolea'],[/curl martillo/i,'gen_cma'],[/curl.*predicador|scott/i,'curlpred'],[/tr[ií]ceps.*barra/i,'gen_etb'],[/tr[ií]ceps.*unilateral/i,'gen_etu'],[/tr[ií]ceps.*(cuerda|polea)/i,'gen_etp'],[/press (plano|de banca)/i,'gen_ppb'],[/patada/i,'patada'],[/abdominal.*polea|crunch.*polea/i,'gen_abp'],[/^(?!.*prensa).*(gemelo|pantorrilla)/i,'gen_pan']);
lamina=(function(l0){return function(f,a){return f?l0(f,a):'<div class="lam lam0" aria-hidden="true"></div>';};})(lamina);
/* sin lámina: no se abre una ficha vacía */
lamBtn=(function(l0){return function(f,n,ref){return f?l0(f,n,ref):'<span class="lamb">'+lamina('',n)+'</span>';};})(lamBtn);
document.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('[data-a="ficha"]');if(b&&/^\|/.test(b.dataset.v||'')){ev.stopImmediatePropagation();ev.preventDefault();}},true);
/* gemelos en prensa: lámina propia (no es la prensa 45°) */
LAMDE.unshift([/(gemelo|pantorrilla).*prensa|prensa.*(gemelo|pantorrilla)/i,'gemelosprensa']);
if(ANIM.indexOf('gemelosprensa')<0)ANIM.push('gemelosprensa');
FICHAS.gemelosprensa={m:['Gemelos','Sóleo'],p:['Espalda apoyada y piernas casi estiradas, sin trabar las rodillas.','Apoyá sólo la parte delantera de los pies en el borde de abajo de la plataforma; los talones quedan en el aire.','Bajá los talones hasta sentir el estiramiento y empujá con la punta de los pies lo más alto que puedas. Las rodillas no se mueven.'],x:['Doblar las rodillas para ayudarte: el movimiento es sólo del tobillo.','Rebotar abajo: frená un instante en el estiramiento.']};

/* rutina que llega del panel (pantalla «Rutina nueva»): series y repeticiones tal como las cargó el entrenador */
rutinaDesdePanel=(function(r0){return function(d){var o=r0(d);(o.ejercicios||[]).forEach(function(e,i){var x=(d.ejercicios||[])[i];if(!x)return;var ep=ejP(x);e.txt=ep.o.replace(/ · drop en la última/,'')+(ep.sinPeso?'':' · '+co(ep.p[0][0])+' '+(ep.u==='pl'?'placas':ep.u));e.u=ep.u==='pl'?'placas':ep.u;});return o;};})(rutinaDesdePanel);
/* lista de ejercicios de un día planificado (calendario) */
function planLista(dt){if(!PANEL)return '';var L=sesDe(null,dt);if(!L.length)return '';return '<div class="lista" style="margin-top:6px">'+L.map(function(x){return '<div class="sx"><span>'+x.n+'</span><b>'+(x.txt||x.plan[2]+' × '+x.plan[1])+'</b><span></span></div>';}).join('')+'</div>';}
/* aductores: lámina animada propia (antes mostraba la de abductores) */
if(ANIM.indexOf('aductores')<0)ANIM.push('aductores');
FICHAS.aductores={m:['Aductores'],p:['Sentado con la espalda apoyada; las almohadillas por dentro de las rodillas.','Arrancá con las piernas abiertas hasta donde te resulte cómodo y sostené 2 segundos.','Cerrá las piernas juntando las almohadillas, sostené 2 segundos y volvé despacio.'],x:['Soltar el peso de golpe al abrir.','Despegar la espalda o la cadera del asiento para ayudarte.']};
/* texto series × reps de un ejercicio de un aviso guardado: si el aviso es viejo (sin txt) se busca en la rutina del panel */
function txtEj(e){if(e.txt)return e.txt;if(!PANEL)return '';var n=nrmP(e.n||e.nombre||''),r='';
 (PANEL.c.rutina||[]).forEach(function(d){(d.ejercicios||[]).forEach(function(x){if(!r&&x.nombre&&nrmP(x.nombre)===n){var ep=ejP(x);r=ep.o.replace(/ · drop en la última/,'')+(ep.sinPeso||!(numP((seriesP(x)[0]||{}).peso)>0)?'':' · '+co(ep.p[0][0])+' '+(ep.u==='pl'?'placas':ep.u));}});});
 return r;}
