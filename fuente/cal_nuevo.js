/* ---------- Calendario (rediseño 30 oct) ---------- */
var GCOL={Pecho:'var(--a1)',Espalda:'var(--cya)',Brazos:'var(--vio)',Pierna:'var(--yel)'};
var GRP={1:'Pecho',2:'Espalda',5:'Brazos',6:'Pierna'};
var GFULL={Pecho:'Pecho, hombro y tríceps',Espalda:'Espalda, bíceps y abdomen',Brazos:'Brazos',Pierna:'Pierna y abdomen'};
var GSER={Pecho:18,Espalda:18,Brazos:18,Pierna:22},GMIN={Pecho:58,Espalda:55,Brazos:52,Pierna:64};
var MESES_L=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
var DSEM=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
var HOYC=new Date(2026,9,30);
var kd=function(d){return d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate();};
var dk=function(k){var p=k.split('-');return new Date(+p[0],+p[1],+p[2]);};
var CALX={'2026-8-25':{e:'au',o:'Viaje a Punta del Este'},'2026-8-26':{e:'au',o:'Viaje a Punta del Este'},'2026-8-29':{e:'fa',o:'Reunión de trabajo, no llegó'},'2026-9-3':{e:'fa',o:'Cumpleaños familiar'}};
var MOVS={};
var DESC0=+new Date(2026,10,9),DESC1=+new Date(2026,10,15);
function diaInfo(d){var k=kd(d),m=MOVS[k],g=GRP[d.getDay()]||null,x=CALX[k];
 if(m&&m.libre)g=null;if(m&&m.g)g=m.g;
 if(!g)return {g:null,e:'de',libre:!!(m&&m.libre)};
 var t=+d,h=+HOYC,e=t<h?(x?x.e:'ok'):t===h?(U.ses.on?'cur':'hoy'):'pl';
 return {g:g,e:e,o:x&&x.o,desc:t>=DESC0&&t<=DESC1,mov:m&&m.g?m:null};}
function lunes(d){var x=new Date(d);x.setDate(d.getDate()-((d.getDay()+6)%7));return x;}
function semIdx(d){return 51+Math.round((lunes(d)-new Date(2026,9,19))/864e5/7);}
function semDias(mon){var o=[];for(var i=0;i<7;i++){var x=new Date(mon);x.setDate(mon.getDate()+i);o.push(x);}return o;}
function ringMini(a,b,col){var C=2*Math.PI*7;return '<svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true"><circle cx="9" cy="9" r="7" fill="none" stroke="var(--line2)" stroke-width="2.6"/><circle cx="9" cy="9" r="7" fill="none" stroke="'+col+'" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="'+(C*Math.min(1,a/Math.max(1,b))).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 9 9)"/></svg>';}
function sesDe(g,d){var k=Math.min(51,semIdx(d)),lst=PROG.PLANX.filter(function(x){return x[0]===g;})[0][1];
 return lst.map(function(e){var h=PROG.histEj(e[0]),o=h[k],pv=null;for(var j=k-1;j>=0;j--)if(h[j]&&!h[j].de){pv=h[j];break;}return {n:e[1],u:e[3]==='pl'?'pl':'kg',o:o,sube:o&&pv&&o.w>pv.w,plan:[e[4],e[5],e[6],e[7]]};});}
function vCalBase(){var c=U.cal,mes=c.mes,pri=new Date(2026,mes,1),ult=new Date(2026,mes+1,0).getDate(),hechos=0,plan=0,ser=0;
 var cells='LMMJVSD'.split('').map(function(x){return '<div class="dow" aria-hidden="true">'+x+'</div>';}).join('');
 for(var i=0;i<(pri.getDay()+6)%7;i++)cells+='<div class="cd pad" aria-hidden="true"></div>';
 for(var dn=1;dn<=ult;dn++){var dt=new Date(2026,mes,dn),f=diaInfo(dt),k=kd(dt),cls=['cd'],lab='',fut=+dt>+HOYC;
  if(f.g){if(f.e==='ok'){cls.push('ok');lab=f.g;hechos++;plan++;ser+=GSER[f.g];}else if(f.e==='fa'){cls.push('no');lab='Faltó';plan++;}else if(f.e==='au'){cls.push('vac');lab='Vacac.';}else if(f.e==='cur'){cls.push('ok');lab=f.g;}else{cls.push('plan');lab=f.g;}}
  if(fut)cls.push('fut');if(+dt===+HOYC)cls.push('hoy');if(c.sel===k)cls.push('sel');
  cells+='<button type="button" class="'+cls.join(' ')+'" data-a="dia" data-v="'+k+'" aria-pressed="'+(c.sel===k)+'" aria-label="'+dn+' de '+MESES_L[mes]+(lab?', '+lab:'')+'"><b>'+dn+'</b><small>'+lab+'</small></button>';}
 var adh=plan?Math.round(hechos/plan*100):null;
 var s='<div class="hd"><span class="ey">Tu asistencia</span><h1>Calendario</h1></div>';
 s+='<section class="card"><div class="calhd"><button type="button" class="xb" data-a="calMes" data-v="-1" aria-label="Mes anterior"'+(mes<=8?' disabled':'')+'>'+I.atras+'</button><h2>'+MESES_L[mes]+' 2026</h2><button type="button" class="xb" data-a="calMes" data-v="1" aria-label="Mes siguiente"'+(mes>=10?' disabled':'')+'>'+I.der+'</button></div>'+
  '<div class="kgr"><div class="kpa"><small>Entrenaste</small><b>'+hechos+'<em>/ '+(plan||'—')+'</em></b></div><div class="kpa"><small>Asistencia</small><b>'+(adh!=null?adh+'<em>%</em>':'—')+'</b></div><div class="kpa"><small>Series</small><b>'+ser+'</b></div></div>'+
  '<div class="calx">'+cells+'</div>'+
  '<div class="legend"><span><i style="background:rgba(var(--grnrgb),.5)"></i>Entrenado</span><span><i style="background:rgba(229,96,74,.5)"></i>Faltó</span><span><i style="border:1px dashed var(--a1)"></i>Planificado</span><span><i style="background:rgba(79,209,230,.4)"></i>Vacaciones</span></div></section>';
 s+=constancia(rachaSem());
 s+='<section class="card" id="calDet">'+detalleActual(dk(c.sel))+'</section>';
 return s;}
/* detalle del día, como en la app actual */
function detalleActual(dt){var f=diaInfo(dt),tit=DSEM[dt.getDay()]+' '+dt.getDate()+' de '+MESES_L[dt.getMonth()],enSemana=+lunes(dt)===+lunes(HOYC);
 if(!f.g)return '<h3>'+tit+'</h3><p class="sub">'+(f.libre?'Día libre: el entreno se movió y no cuenta como falta.':'Día de descanso.')+'</p>';
 if(f.e==='au')return '<h3>'+tit+'</h3><p class="sub">Vacaciones: no cuenta como falta.</p>';
 if(f.e==='fa')return '<h3>'+tit+'</h3><p class="sub">'+GFULL[f.g]+' · no entrenaste.'+(f.o?' '+f.o+'.':'')+'</p>';
 if(f.e==='pl')return '<h3>'+tit+'</h3><p class="sub">Planificado: '+GFULL[f.g]+(f.desc?' · semana de descarga':'')+'.</p>';
 if(f.e==='hoy'||f.e==='cur')return '<h3>'+tit+'</h3><p class="sub">'+GFULL[f.g]+' · '+(f.e==='cur'?'en curso ('+hechas()[0]+'/'+hechas()[1]+' series)':'pendiente')+'.</p><p style="margin-top:12px"><button type="button" class="pri" data-a="sesion">'+(f.e==='cur'?'Seguir sesión':'Registrar este día')+'</button></p>';
 var ses=sesDe(f.g,dt),ton=ses.reduce(function(a,x){return a+(x.o&&x.u==='kg'?x.o.w*x.o.r.reduce(function(p,q){return p+q;},0):0);},0);
 return '<div class="ph2"><div><h3>'+tit+'</h3><p class="sub">'+GFULL[f.g]+'</p></div>'+(enSemana?'<button type="button" class="sec" style="min-height:38px;font-size:13px" data-a="verSes" data-v="'+kd(dt)+'">Abrir</button>':'')+'</div>'+
  '<div class="kgr"><div class="kpa"><small>Series</small><b>'+GSER[f.g]+'</b></div><div class="kpa"><small>Tonelaje</small><b>'+co((ton/1000).toFixed(1))+'<em>t</em></b></div><div class="kpa"><small>RIR prom.</small><b>'+co(1.2+(dt.getDate()%4)/10)+'</b></div></div>'+
  '<div class="dex">'+ses.map(function(x){return '<div><b>'+x.n+'</b><span>'+(x.o?co(x.o.w)+' '+(x.u==='pl'?'placas':'kg')+' × '+x.o.r[0]:'—')+'</span><small>'+(x.o?x.o.r.length:x.plan[2])+' series efectivas</small></div>';}).join('')+'</div><p class="sub" style="margin-top:6px;font-size:12px">Se muestra la serie más pesada de cada ejercicio.</p>';}
function detalleDia(d){var f=diaInfo(d),k=kd(d),tit=DSEM[d.getDay()]+' '+d.getDate()+' de '+MESES_L[d.getMonth()];
 var head='<div class="sh"><h2>'+tit+'</h2>'+(f.g?'<span class="chip" style="background:color-mix(in srgb,'+GCOL[f.g]+' 18%,transparent);color:'+GCOL[f.g]+'">'+f.g+'</span>':'')+'</div>';
 if(!f.g)return head+'<section class="card"><div class="fila" style="padding:0"><span class="ico">'+I.reloj+'</span><span><b>'+(f.libre?'Día libre':'Descanso')+'</b><span class="s">'+(f.libre?'El entreno de este día se movió: no cuenta como falta.':'Sin entreno planificado.')+'</span></span><span></span></div></section>';
 if(f.e==='au')return head+'<section class="card"><div class="fila" style="padding:0"><span class="ico cy">✈</span><span><b>De viaje · rutina en pausa</b><span class="s">'+f.o+'. No cuenta como falta.</span></span><span></span></div></section>';
 if(f.e==='fa')return head+'<section class="card"><div class="fila" style="padding:0"><span class="ico wa">'+I.info+'</span><span><b>Faltó · '+GFULL[f.g]+'</b><span class="s">Observación: '+f.o+'</span></span><span></span></div><button type="button" class="sec" style="width:100%;margin-top:12px" data-a="mover" data-v="'+k+'">'+I.rep+'Recuperar en otro día</button></section>';
 var ses=sesDe(f.g,d);
 if(f.e==='ok'){var vol=ses.reduce(function(a,x){return a+(x.o&&x.u==='kg'?x.o.w*x.o.r.reduce(function(p,q){return p+q;},0):0);},0),subas=ses.filter(function(x){return x.sube;}).length;
  return head+'<section class="card"><div class="ct"><div><h3>'+GFULL[f.g]+'</h3><p class="sub">Hecha'+(f.mov?' · movida':'')+'</p></div><span class="chip ok">'+I.chk.replace('<svg','<svg width="12" height="12"')+' Entrenó</span></div>'+
   '<div class="k4" style="margin-top:12px"><div><b>'+GSER[f.g]+'</b><span>series</span></div><div><b>~'+GMIN[f.g]+'</b><span>min</span></div><div><b>'+co(1.2+(d.getDate()%4)/10)+'</b><span>RIR medio</span></div><div><b>'+(subas?'+'+subas:'0')+'</b><span>subas</span></div></div>'+
   '<div class="lista" style="margin-top:6px">'+ses.slice(0,4).map(function(x){return '<div class="sx"><span>'+x.n+'</span><b>'+(x.o?co(x.o.w)+' '+x.u+' × '+x.o.r.join(' · '):'—')+'</b>'+(x.sube?'<span class="chip ok">subió</span>':'<span></span>')+'</div>';}).join('')+'</div>'+
   '<button type="button" class="sec" style="width:100%;margin-top:12px" data-a="verSes" data-v="'+k+'">Ver sesión completa · '+ses.length+' ejercicios</button></section>';}
 if(f.e==='cur'||f.e==='hoy'){var h=hechas();return head+'<section class="card"><h3>'+GFULL[f.g]+'</h3><p class="sub">'+(f.e==='cur'?'En curso · '+h[0]+' de '+h[1]+' series':'Hoy · '+GSER[f.g]+' series · ~'+GMIN[f.g]+' min')+'</p><button type="button" class="pri full" style="margin-top:12px" data-a="sesion">'+(f.e==='cur'?'Seguir sesión':'Empezar sesión')+'</button></section>';}
 return head+'<section class="card"><div class="ct"><div><h3>'+GFULL[f.g]+'</h3><p class="sub">'+(f.desc?'Descarga · mitad de las series, RIR 3':'Planificado · '+GSER[f.g]+' series · ~'+GMIN[f.g]+' min')+(f.mov?' · '+(f.mov.rec?'recupera el '+dk(f.mov.de).getDate():'movido'):'')+'</p></div><span class="chip ac">Planificado</span></div>'+
  '<div class="lista" style="margin-top:6px">'+ses.map(function(x){var o=x.o;return '<div class="sx"><span>'+x.n+'</span><b>'+(f.desc?Math.max(1,Math.round(x.plan[2]/2))+' × '+x.plan[1]:x.plan[2]+' × '+x.plan[1])+' · '+(o?co(o.w)+' '+x.u:'')+'</b><span></span></div>';}).join('')+'</div>'+
  '<div style="display:flex;gap:8px;margin-top:12px"><button type="button" class="sec" style="flex:1" data-a="mover" data-v="'+k+'">Mover a otro día</button><button type="button" class="sec" style="flex:1" data-a="libre" data-v="'+k+'">No voy</button></div></section>';}
/* opciones para mover o recuperar: los próximos días libres, con aviso si queda pegado al mismo grupo */
function opcionesMover(k){var f=diaInfo(dk(k)),g=f.g,base=new Date(Math.max(+HOYC,+dk(k)));var o=[];var d=new Date(base);d.setDate(d.getDate()+1);
 for(var i=0;i<14&&o.length<3;i++){var fi=diaInfo(d);if(!fi.g){var a=new Date(d);a.setDate(a.getDate()-1);var b=new Date(d);b.setDate(b.getDate()+1);var ga=diaInfo(a).g,gb=diaInfo(b).g;
   var choca=(ga===g&&kd(a)!==k)||(gb===g&&kd(b)!==k);var na=kd(a)===k?'queda libre':(ga||'descanso'),nb=kd(b)===k?'queda libre':(gb||'descanso');o.push({k:kd(d),d:new Date(d),txt:'Antes: '+na+' · después: '+nb,est:choca?['chip wa','Mismo grupo cerca']:['chip ok','Sin choque']});}
  d.setDate(d.getDate()+1);}
 return o;}

function rachaSem(){
 /* racha: semanas cerradas seguidas con todas las sesiones hechas */
 var racha=0,mon=lunes(HOYC);mon.setDate(mon.getDate()-7);for(var w=0;w<20;w++){var ds=semDias(mon).map(diaInfo).filter(function(x){return x.g;});if(!ds.length||ds.some(function(x){return x.e!=='ok';}))break;racha++;mon.setDate(mon.getDate()-7);}
 return racha;}
function constancia(racha){
 /* constancia: el año 2026 entero, un cuadradito por semana (de enero a diciembre, 3 filas), las que faltan vacías */
 var m0=lunes(new Date(2026,0,1)),fin=new Date(2026,11,31),SEP1=+new Date(2026,8,1),hechT=0,planT=0,cu='',w=0;
 while(+m0<=+fin){var dd=semDias(m0),kk=semIdx(m0),inf=dd.map(diaInfo),pl=inf.filter(function(x){return x.g&&x.e!=='au';}).length,he=inf.filter(function(x){return x.e==='ok';}).length;
  if(+m0<SEP1&&kk>=0&&kk<=51)he=Math.min(pl,PROG.H.dias[kk]);var actual=kk===52,fut=kk>52;if(!actual&&!fut){hechT+=he;planT+=pl;}
  var lv=actual||fut?0:pl?Math.round(he/pl*4):0,au=inf.some(function(x){return x.e==='au';});
  var info=dd[0].getDate()+' '+MESES_L[dd[0].getMonth()].slice(0,3)+' – '+dd[6].getDate()+' '+MESES_L[dd[6].getMonth()].slice(0,3)+' · '+(fut?'por venir':actual?'en curso: '+inf.filter(function(x){return x.e==='ok'||x.e==='cur';}).length+' de '+pl+' sesiones':he+' de '+pl+' sesiones'+(au?' · viaje':'')+(kk>=0&&kk<=51?' · '+PROG.H.ser[kk]+' series':''));
  cu+='<button type="button" class="cq l'+lv+(actual?' act':'')+(fut?' fut':'')+'" data-a="cst" data-v="'+info+'" style="--d:'+((w%18)*18+Math.floor(w/18)*60)+'ms" aria-label="'+info+'"></button>';
  m0.setDate(m0.getDate()+7);w++;}
 return '<section class="card"><div class="ct"><div><h3>Constancia</h3><p class="sub">2026 · '+hechT+' de '+planT+' sesiones</p></div><span class="chip ac">'+racha+' sem. completas seguidas</span></div>'+
  '<div class="cs">'+cu+'</div><p id="cstInfo" class="sub" style="margin-top:10px;font-size:12px"></p></section>';
}
