/* ---------- 5 bocetos de Calendario inspirados en apps de deporte (30 oct) ---------- */
function vCal(){var f={a:vCalA,b:vCalB,c:vCalC,d:vCalD,e:vCalE}[U.calV];return f?f():vCalBase();}
var hdCal=function(p){return '<div class="hd"><span class="ey">Tu asistencia</span><h1>Calendario</h1>'+(p?'<p>'+p+'</p>':'')+'</div>';};
var abrev=function(d){return DSEM[d.getDay()].slice(0,3);};
var MayM=function(m){return MESES_L[m].charAt(0).toUpperCase()+MESES_L[m].slice(1);};
function estTxt(f){return {ok:'Hecho',fa:'Faltó',au:'Viaje',pl:'Planificado',hoy:'Hoy',cur:'En curso',de:'Descanso'}[f.e];}
function semanaDe(off){var m=lunes(HOYC);m.setDate(m.getDate()+7*off);return m;}
function rangoSem(m){var d=semDias(m);return d[0].getDate()+' '+MESES_L[d[0].getMonth()].slice(0,3)+' – '+d[6].getDate()+' '+MESES_L[d[6].getMonth()].slice(0,3);}
function rnd(k){var x=Math.sin(k*91.7+3.1)*43758.5453;return x-Math.floor(x);}
/* series hechas en un día (las planificadas ajustadas por cómo vino esa semana) */
function serDia(d,f){if(f.e!=='ok')return 0;var k=Math.min(51,semIdx(d)),fac=PROG.H.ser[k]/76;return Math.max(6,Math.round(GSER[f.g]*Math.min(1.1,fac)+(rnd(+d/864e5)-.5)*3));}
function volDia(d,f){if(f.e!=='ok')return 0;return sesDe(f.g,d).reduce(function(a,x){return a+(x.o&&x.u==='kg'?x.o.w*x.o.r.reduce(function(p,q){return p+q;},0):0);},0);}
function minDia(d,f){return f.e==='ok'?GMIN[f.g]+Math.round((rnd(+d/864e5+7)-.5)*14):0;}

/* A · Como Hevy: meses en scroll, días entrenados en círculos azules, racha en semanas */
function vCalA(){var s=hdCal(),ult=null,d=new Date(HOYC);for(var i=0;i<30;i++){d.setDate(d.getDate()-1);var f=diaInfo(d);if(f.e==='ok'){ult=new Date(d);break;}}
 var desc=ult?Math.round((HOYC-ult)/864e5)-1:0,sem=0,m=lunes(HOYC);m.setDate(m.getDate()-7);for(var w=0;w<60;w++){var ds=semDias(m).map(diaInfo);if(!ds.some(function(x){return x.e==='ok';}))break;sem++;m.setDate(m.getDate()-7);}
 s+='<div class="hvk"><div><span class="hvi">🔥</span><b>'+sem+'</b><span>semanas seguidas<br>entrenando</span></div><div><span class="hvi">🌙</span><b>'+desc+'</b><span>días de descanso<br>desde el último</span></div></div>';
 [10,9,8,7,6].forEach(function(mes,mi){var pri=new Date(2026,mes,1),ul=new Date(2026,mes+1,0).getDate(),st=0,g='';
  for(var j=0;j<(pri.getDay()+6)%7;j++)g+='<span></span>';
  for(var dd=1;dd<=ul;dd++){var x=new Date(2026,mes,dd),f=diaInfo(x),k=kd(x),cls=f.e==='ok'?'ok':f.e==='cur'?'ok cur':(f.e==='pl'||f.e==='hoy')?'pl':'';if(f.e==='ok')st++;
   g+='<button type="button" class="hvd '+cls+(+x===+HOYC?' hoyc':'')+'" data-a="'+(f.e==='ok'||f.g?'diaH':'hvLog')+'" data-v="'+k+'" style="animation-delay:'+(mi*60+dd*8)+'ms" aria-label="'+dd+' de '+MESES_L[mes]+(f.e==='ok'?', entrenaste':'')+'">'+dd+'</button>';}
  s+='<section class="card hvm"><div class="ct"><h3>'+MayM(mes)+' 2026</h3><span class="mu" style="font-size:13px">'+(st?st+' entrenos':mes===10?'planificado':'')+'</span></div><div class="hvg">'+'LMMJVSD'.split('').map(function(x){return '<span class="dw">'+x+'</span>';}).join('')+g+'</div></section>';});
 return s;}

/* B · Como el Training Log de Strava: semanas en filas, una burbuja por sesión, tamaño = series / minutos / volumen */
function vCalB(){var met=U.cal.met||'ser',s=hdCal();
 s+='<div class="seg sm" style="margin-bottom:12px">'+[['ser','Series'],['min','Minutos'],['vol','Volumen']].map(function(x){return '<button type="button" data-a="calMet" data-v="'+x[0]+'" aria-pressed="'+(met===x[0])+'">'+x[1]+'</button>';}).join('')+'</div>';
 s+='<section class="card tl"><div class="tlh"><span></span>'+'LMMJVSD'.split('').map(function(x){return '<span>'+x+'</span>';}).join('')+'<span class="r">Total</span></div>';
 var MX={};MX[met]=1;for(var o2=1;o2>=-9;o2--){semDias(semanaDe(o2)).forEach(function(d){var f=diaInfo(d),v=met==='ser'?serDia(d,f):met==='min'?minDia(d,f):volDia(d,f);if(v>MX[met])MX[met]=v;});}
 for(var off=1;off>=-9;off--){var m=semanaDe(off),ds=semDias(m),tot=0,cur=off===0;
  var cel=ds.map(function(d,i){var f=diaInfo(d),v=met==='ser'?serDia(d,f):met==='min'?minDia(d,f):volDia(d,f);tot+=v;
   if(!f.g)return '<span class="tc"></span>';
   if(f.e==='ok'){var q=Math.max(0,Math.min(1,v/MX[met])),r=Math.round(8+Math.pow(q,2.2)*26);return '<span class="tc"><button type="button" class="bub2" data-a="diaH" data-v="'+kd(d)+'" style="--g:'+GCOL[f.g]+';--s:'+r+'px;animation-delay:'+((1-off)*60+i*20)+'ms" aria-label="'+GFULL[f.g]+'"></button></span>';}
   return '<span class="tc"><button type="button" class="bub2 '+f.e+'" data-a="diaH" data-v="'+kd(d)+'" style="--g:'+(f.e==='fa'?'var(--red)':GCOL[f.g])+';--s:14px" aria-label="'+GFULL[f.g]+', '+estTxt(f)+'">'+(f.e==='fa'?'✕':f.e==='au'?'✈':'')+'</button></span>';}).join('');
  s+='<div class="tlr'+(cur?' cur':'')+'"><span class="tlw">'+ds[0].getDate()+'<small>'+MESES_L[ds[0].getMonth()].slice(0,3)+'</small></span>'+cel+'<span class="r tlt"><b>'+(met==='vol'?(tot/1000).toFixed(1).replace('.',',')+'k':tot||'—')+'</b><small>'+(met==='ser'?'series':met==='min'?'min':'kg')+'</small></span></div>';}
 s+='<div class="leg">'+Object.keys(GCOL).map(function(g){return '<span><i style="background:'+GCOL[g]+';border-radius:50%"></i>'+g+'</span>';}).join('')+'<span>◌ planificado</span></div><p class="sub" style="margin-top:6px">El tamaño de cada burbuja es '+(met==='ser'?'la cantidad de series':met==='min'?'la duración':'el volumen (kg × reps)')+' de esa sesión.</p></section>';
 return s;}

/* C · Como TrainingPeaks: planificado contra hecho, con color de cumplimiento */
function cumpl(d,f){if(f.e==='fa')return {c:'r',t:'No hecho'};if(f.e!=='ok')return null;var p=serDia(d,f)/GSER[f.g];
 return p>=.8&&p<=1.2?{c:'v',t:'Cumplido'}:(p>=.5&&p<=1.5)?{c:'a',t:'Parcial'}:{c:'n',t:'Muy distinto'};}
function vCalC(){var off=U.cal.w||0,m=semanaDe(off),ds=semDias(m),inf=ds.map(diaInfo),s=hdCal();
 var pl=0,he=0,sp=0,sh=0,spH=0;ds.forEach(function(d,i){var f=inf[i];if(!f.g||f.e==='au')return;pl++;sp+=GSER[f.g];if(+d<+HOYC)spH+=GSER[f.g];if(f.e==='ok'){he++;sh+=serDia(d,f);}});
 var pc=spH?Math.round(sh/spH*100):0,past=off<0||off===0;
 s+='<section class="card"><div class="mhd"><button type="button" class="ib" data-a="calW" data-v="-1" aria-label="Semana anterior">'+I.atras+'</button><div style="text-align:center"><b>'+(off===0?'Esta semana':off===1?'Semana que viene':off===-1?'Semana pasada':'Semana '+(semIdx(m)+1))+'</b><div class="mu" style="font-size:12.5px">'+rangoSem(m)+'</div></div><button type="button" class="ib" data-a="calW" data-v="1"'+(off>=2?' disabled':'')+' aria-label="Semana siguiente">'+I.der+'</button></div>';
 s+='<div class="tpk"><div><span class="lbl">Sesiones</span><b>'+he+'<small> / '+pl+'</small></b></div><div><span class="lbl">Series</span><b>'+sh+'<small> / '+sp+'</small></b></div><div><span class="lbl">Cumplimiento</span><b class="'+(pc>=80?'up':pc>=50?'wa':'')+'">'+(off>0||!spH?'—':pc+'<small> %</small>')+'</b><small>'+(off===0?'hasta hoy':'')+'</small></div></div><div class="tpb"><i style="width:'+Math.min(100,pc)+'%"></i></div></section>';
 s+='<div class="sh"><h2>Día por día</h2><span class="mu" style="font-size:12.5px">planificado → hecho</span></div>';
 ds.forEach(function(d,i){var f=inf[i],k=kd(d),cu=f.g?cumpl(d,f):null;
  s+='<div class="tpd"><span class="lday"><small>'+abrev(d)+'</small><b'+(+d===+HOYC?' style="color:var(--a1)"':'')+'>'+d.getDate()+'</b></span>';
  if(!f.g){s+='<span class="libre">Descanso</span></div>';return;}
  var hecho=f.e==='ok'?serDia(d,f):0;
  s+='<button type="button" class="tpc '+(cu?cu.c:f.e)+'" data-a="diaH" data-v="'+k+'" style="--g:'+GCOL[f.g]+';animation-delay:'+(i*50)+'ms"><span class="tpt"><b>'+GFULL[f.g]+'</b>'+(cu?'<span class="tpe">'+cu.t+'</span>':f.e==='au'?'<span class="tpe">Viaje</span>':'<span class="tpe pl">'+(f.e==='cur'?'En curso':'Planificado')+'</span>')+'</span>'+
   '<span class="tpm"><span>Plan <b>'+GSER[f.g]+' series · ~'+GMIN[f.g]+' min</b></span><span>Hecho <b>'+(f.e==='ok'?hecho+' series · '+minDia(d,f)+' min':f.e==='cur'?hechas()[0]+' series hasta ahora':'—')+'</b></span></span>'+
   (f.e==='ok'?'<span class="tpbar"><i style="width:'+Math.min(100,hecho/GSER[f.g]*100)+'%"></i></span>':'')+'</button></div>';});
 s+='<div class="leg"><span><i style="background:var(--grn)"></i>Cumplido (±20 %)</span><span><i style="background:var(--yel)"></i>Parcial</span><span><i style="background:#e5604a"></i>No hecho</span><span><i style="border:1.5px dashed var(--tx3)"></i>Planificado</span></div>';
 return s;}

/* D · Como Apple Fitness: cada día con tres anillos — entreno, proteína y calorías */
function macrosDia(d){var t=+d===+HOYC?tot():null,r1x=rnd(+d/864e5+11),r2=rnd(+d/864e5+29);if(+d>+HOYC)return null;
 return t?{p:t.p/160,k:t.k/OBJK}:{p:Math.min(1.15,.72+r1x*.4),k:Math.min(1.15,.8+r2*.3)};}
function anillos3(d,f,big){var R=[15,11,7],W=big?3.4:3.2,ent=f.e==='ok'?Math.min(1.05,serDia(d,f)/GSER[f.g]):f.e==='cur'?hechas()[0]/hechas()[1]:0,mc=macrosDia(d),v=[f.g?ent:0,mc?mc.p:0,mc?mc.k:0],col=['var(--a1)','var(--cya)','var(--vio)'],s='';
 R.forEach(function(r,i){var C=2*Math.PI*r;s+='<circle cx="18" cy="18" r="'+r+'" fill="none" stroke="color-mix(in srgb,'+col[i]+' 22%,transparent)" stroke-width="'+W+'"/>';if(v[i]>0)s+='<circle class="arc" cx="18" cy="18" r="'+r+'" fill="none" stroke="'+col[i]+'" stroke-width="'+W+'" stroke-linecap="round" stroke-dasharray="'+(C*Math.min(1,v[i])).toFixed(1)+' '+C.toFixed(1)+'" transform="rotate(-90 18 18)" style="--c:'+C.toFixed(1)+'"/>';});
 return '<svg viewBox="0 0 36 36" aria-hidden="true">'+s+'</svg>';}
function vCalD(){var c=U.cal,mes=c.mes,pri=new Date(2026,mes,1),ult=new Date(2026,mes+1,0),s=hdCal(),sel=dk(c.sel);
 var fs=diaInfo(sel),mc=macrosDia(sel),ent=fs.e==='ok'?serDia(sel,fs):fs.e==='cur'?hechas()[0]:0;
 s+='<section class="card"><div class="afd"><div class="afr">'+anillos3(sel,fs,true)+'</div><div class="afl"><b>'+DSEM[sel.getDay()]+' '+sel.getDate()+'</b>'+
  '<span><i style="background:var(--a1)"></i>Entreno <b>'+(fs.g?ent+'/'+GSER[fs.g]+' series':'descanso')+'</b></span><span><i style="background:var(--cya)"></i>Proteína <b>'+(mc?Math.round(mc.p*160)+'/160 g':'—')+'</b></span><span><i style="background:var(--vio)"></i>Calorías <b>'+(mc?kf(mc.k*OBJK)+'/'+kf(OBJK):'—')+'</b></span></div></div></section>';
 s+='<section class="card"><div class="mhd"><button type="button" class="ib" data-a="calMes" data-v="-1"'+(mes<=8?' disabled':'')+' aria-label="Mes anterior">'+I.atras+'</button><b>'+MayM(mes)+'</b><button type="button" class="ib" data-a="calMes" data-v="1"'+(mes>=10?' disabled':'')+' aria-label="Mes siguiente">'+I.der+'</button></div>';
 s+='<div class="afm">'+'LMMJVSD'.split('').map(function(x){return '<span class="dw">'+x+'</span>';}).join('');
 for(var i=0;i<(pri.getDay()+6)%7;i++)s+='<span></span>';
 for(var d=1;d<=ult.getDate();d++){var dd=new Date(2026,mes,d),f=diaInfo(dd),k=kd(dd);s+='<button type="button" class="afc'+(c.sel===k?' sel':'')+'" data-a="dia" data-v="'+k+'" style="animation-delay:'+(d*14)+'ms"><span class="n'+(+dd===+HOYC?' hoyc':'')+'">'+d+(f.e==='ok'?'<i></i>':'')+'</span>'+anillos3(dd,f)+'</button>';}
 s+='</div><div class="leg"><span><i style="background:var(--a1);border-radius:50%"></i>Entreno</span><span><i style="background:var(--cya);border-radius:50%"></i>Proteína</span><span><i style="background:var(--vio);border-radius:50%"></i>Calorías</span><span><i style="background:var(--grn);border-radius:50%"></i>Entrenó</span></div></section>';
 s+='<div id="calDia">'+detalleDia(sel)+'</div>';
 return s;}

/* E · Como el plan de Garmin: el bloque en semanas, con fase, plan y lo hecho */
var BLOQUE=[{s:51,f:'Semana 1',t:'acu'},{s:52,f:'Semana 2',t:'acu'},{s:53,f:'Semana 3',t:'acu'},{s:54,f:'Semana 4',t:'int'},{s:55,f:'Descarga',t:'des'}];
function vCalE(){var s=hdCal(),m0=semanaDe(-2),act=2;
 s+='<section class="card gpl"><div class="ct"><div><span class="ey">Plan activo</span><h3>Bloque 3 · Hipertrofia</h3><p class="sub">12 oct – 15 nov · 4 días por semana</p></div><span class="chip ac">Semana 3 de 5</span></div>'+
  '<div class="gpb">'+BLOQUE.map(function(b,i){return '<i class="'+(i<act?'ok':i===act?'cur':'')+(b.t==='des'?' des':'')+'" style="animation-delay:'+(i*90)+'ms"></i>';}).join('')+'</div><div class="gpbl">'+BLOQUE.map(function(b){return '<span>'+(b.t==='des'?'Desc.':'S'+(BLOQUE.indexOf(b)+1))+'</span>';}).join('')+'</div></section>';
 BLOQUE.forEach(function(b,i){var m=new Date(m0);m.setDate(m.getDate()+7*i);var ds=semDias(m),inf=ds.map(diaInfo),pl=inf.filter(function(x){return x.g&&x.e!=='au';}).length,he=inf.filter(function(x){return x.e==='ok';}).length;
  s+='<div class="sh"><h2>'+b.f+(i===act?' · esta semana':'')+'</h2><span class="mu" style="font-size:12.5px">'+rangoSem(m)+'</span></div>';
  s+='<section class="card gw '+b.t+(i===act?' cur':'')+'"><div class="gwh"><span class="gfase">'+(b.t==='acu'?'Acumulación · RIR '+['2','1,5','1'][i]:b.t==='int'?'Intensificación · RIR 1':'Descarga · mitad de series · RIR 3')+'</span><b>'+(i<act?he+'/'+pl+' hechas':i===act?he+'/'+pl+' en curso':pl+' sesiones')+'</b></div><div class="gwd">'+
   ds.map(function(d,j){var f=inf[j];return '<button type="button" class="gd2 '+(f.g?f.e:'de')+'" '+(f.g?'data-a="diaH" data-v="'+kd(d)+'"':'disabled')+' style="--g:'+(f.g?GCOL[f.g]:'transparent')+';animation-delay:'+(i*70+j*25)+'ms"><small>'+'LMMJVSD'[j]+' '+d.getDate()+'</small><span>'+(f.g?(f.e==='fa'?'✕ ':f.e==='ok'?'✓ ':'')+f.g.slice(0,3):'')+'</span></button>';}).join('')+'</div></section>';});
 s+='<div class="sh"><h2>Después</h2></div><section class="card"><div class="fila" style="padding:0"><span class="ico">'+I.flecha+'</span><span><b>Bloque 4 · Fuerza</b><span class="s">Empieza el 16 nov · lo armás vos en Rutinas</span></span><span></span></div></section>';
 return s;}
