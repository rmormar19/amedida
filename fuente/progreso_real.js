/* ================= Progreso y Medidas completos con los datos del panel =================
   Todo sale de lo registrado (rutina de la semana + semanas cerradas del historial). */
var PP={tab:'carga',ej:null,cg:'series'},PM={sel:null};
function semanasP(){if(!PANEL)return [];var c=PANEL.c,L=(c.historial||[]).slice().sort(function(a,b){return String(a.fecha).localeCompare(String(b.fecha));}).map(function(h){return {m:lunesOp(new Date(h.fecha)),r:h.rutina||[]};});
 var vis={},out=[];L.forEach(function(w){vis[+w.m]=w;});Object.keys(vis).sort(function(a,b){return a-b;}).forEach(function(k){out.push(vis[k]);});
 var lh=LUNH();out=out.filter(function(w){return +w.m!==+lh;});out.push({m:lh,r:c.rutina||[],hoy:true});
 return out.map(function(w){var pl=0,he=0,fa=0,ser=0,rirS=0,rirN=0,esf=[],grp={},car=[];
  w.r.forEach(function(d){if(!d.libre&&d.estado!=='rojo')(d.cardio||[]).forEach(function(z){if(z&&z.tipo&&(z.estado==='hecho'||z.minReal||z.fc)){var mn=numP(z.minReal);if(mn==null&&z.modo!=='km')mn=numP(z.cant);car.push({t:String(z.tipo).toLowerCase(),min:mn,fc:numP(z.fc),dia:d.dia,zona:z.zona});}});
   var tiene=(d.ejercicios||[]).some(function(e){return e&&e.nombre;});if(!tiene||d.libre)return;pl++;
   var hecho=d.estado==='verde'||(!w.hoy&&!Object.prototype.hasOwnProperty.call(d,'estado'));
   if(d.estado==='rojo'){fa++;return;}if(!hecho)return;he++;if(d.esfuerzo)esf.push(d.esfuerzo);
   (d.ejercicios||[]).forEach(function(e){var ss=seriesP(e).filter(function(s){return s.reps||s.peso;});ser+=ss.length;var g=e.grupo||musculoP(e.nombre);grp[g]=(grp[g]||0)+ss.length;
    ss.forEach(function(s){var r=numP(s.rir);if(r!=null){rirS+=r;rirN++;}});});
   });
  return {m:w.m,lab:w.m.getDate()+' '+MESC[w.m.getMonth()],hoy:!!w.hoy,r:w.r,pl:pl,he:he,fa:fa,ser:ser,rir:rirN?Math.round(rirS/rirN*10)/10:null,esf:esf,grp:grp,car:car};});}
/* barras simples con etiqueta y valor */
function barP(vals,labs,o){o=o||{};var W=330,H=150,L=8,R=8,T=18,B=24,n=vals.length,mx=Math.max.apply(null,vals.map(function(v){return v||0;}).concat([o.max||1])),dx=(W-L-R)/Math.max(1,n),w=Math.min(26,dx*.62),g='';
 vals.forEach(function(v,i){var x=L+i*dx+dx/2,h=v?(H-T-B)*v/mx:0,y=H-B-h,col=(o.cols&&o.cols[i])||(i===n-1&&o.ultimo?o.ultimo:(o.col||'var(--a1)'));
  g+='<rect x="'+(x-w/2).toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+Math.max(h,v?2:0).toFixed(1)+'" rx="5" fill="'+col+'" opacity="'+(o.op&&o.op[i]!=null?o.op[i]:1)+'"/>';
  if(v!=null)g+='<text x="'+x.toFixed(1)+'" y="'+(y-5).toFixed(1)+'" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--tx2)">'+(o.fmt?o.fmt(v):co(v))+'</text>';
  if(labs[i]&&(n<=8||i%Math.ceil(n/8)===0||i===n-1))g+='<text x="'+x.toFixed(1)+'" y="'+(H-7)+'" text-anchor="middle" font-size="10" fill="var(--tx4)">'+labs[i]+'</text>';});
 return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="'+(o.aria||'Gráfico')+'">'+g+'</svg>';}
function lineaP(vals,labs,o){var v=[],l=[];vals.forEach(function(x,i){if(x!=null){v.push(x);l.push(labs[i]);}});
 if(v.length<2)return '<p class="sub" style="margin:10px 0">'+(v.length?'Una sola semana con dato: el gráfico aparece desde la segunda.':'Todavía sin datos.')+'</p>';return linea(v,l,o);}
var ESFC={liviano:'var(--grn)',moderado:'var(--yel)',duro:'var(--red)'};
function ppTabs(){return '<div class="seg" role="tablist" style="margin:2px 0 14px">'+[['carga','Semanas'],['ej','Ejercicios'],['grp','Músculos'],['cz','Cardio']].map(function(t){return '<button type="button" role="tab" data-pp="tab:'+t[0]+'" aria-pressed="'+(PP.tab===t[0])+'">'+t[1]+'</button>';}).join('')+'</div>';}
/* ---------- Progreso ---------- */
vPro=function(){if(!PANEL)return vPro0();var S=semanasP(),cer=S.filter(function(w){return !w.hoy;}),pl=0,he=0;cer.forEach(function(w){pl+=w.pl;he+=w.he;});
 var s='<div class="hd"><span class="ey">Tu progreso</span><h1>Progreso</h1><p>'+(cer.length?he+' de '+pl+' sesiones hechas en '+cer.length+' semana'+(cer.length===1?'':'s')+(pl?' · '+Math.round(he/pl*100)+' % de asistencia':''):'Tu progreso aparece acá a medida que entrenes.')+'</p></div>'+ppTabs();
 var lab=S.map(function(w){return w.hoy?'Esta':w.lab;});
 if(PP.tab==='carga'){
  s+='<section class="card"><div class="ct"><h3>Sesiones por semana</h3></div><p class="sub">Hechas sobre las que tenías planificadas.</p>'+barP(S.map(function(w){return w.he;}),lab,{max:Math.max.apply(null,S.map(function(w){return w.pl;})),fmt:function(v){return String(v);},ultimo:'var(--a2)',aria:'Sesiones hechas por semana'})+
   '<p class="mu" style="font-size:12.5px;margin:4px 0 0">'+S.map(function(w){return w.fa?(w.hoy?'esta semana':w.lab)+': '+w.fa+' falta'+(w.fa>1?'s':''):'';}).filter(String).join(' · ')+'</p></section>';
  s+='<section class="card" style="margin-top:12px"><div class="ct"><h3>Series efectivas</h3></div><p class="sub">Cuánto trabajo hiciste cada semana (las de calentamiento no cuentan).</p>'+barP(S.map(function(w){return w.ser;}),lab,{fmt:function(v){return String(v);},ultimo:'var(--a2)',aria:'Series efectivas por semana'})+'</section>';
  s+='<section class="card" style="margin-top:12px"><div class="ct"><h3>Qué tan cerca del fallo</h3></div><p class="sub">Repeticiones que te sobraban en promedio (RIR). Más bajo = más exigente.</p>'+lineaP(S.map(function(w){return w.rir;}),lab,{col:'var(--vio)',aria:'RIR promedio por semana'})+'</section>';
  var hayE=S.some(function(w){return w.esf.length;});
  if(hayE)s+='<section class="card" style="margin-top:12px"><div class="ct"><h3>Cómo te sentiste</h3></div><p class="sub">Lo que marcaste al terminar cada sesión.</p><div class="esfw">'+S.map(function(w){return '<div class="esfc"><div class="esfd">'+w.esf.map(function(e){return '<i title="'+e+'" style="background:'+ESFC[e]+'"></i>';}).join('')+'</div><small>'+(w.hoy?'Esta':w.lab)+'</small></div>';}).join('')+'</div><p class="mu" style="font-size:12px;margin:8px 0 0"><i class="esfl" style="background:var(--grn)"></i>liviano <i class="esfl" style="background:var(--yel)"></i>moderado <i class="esfl" style="background:var(--red)"></i>duro</p></section>';
  var ncz=0;S.forEach(function(w){ncz+=w.car.length;});
  if(ncz)s+='<button type="button" class="card czlink" data-pp="tab:cz"><span class="ico">♥</span><span><b>Cardio</b><span class="s">'+ncz+' sesi'+(ncz===1?'ón':'ones')+' anotadas · minutos, tipos y zonas</span></span>'+I.der+'</button>';
 }
 if(PP.tab==='cz')s+=cardioPro(S,lab);
 if(PP.tab==='grp'){var cerr=cer.slice(-4),G={};cerr.forEach(function(w){Object.keys(w.grp).forEach(function(g){G[g]=(G[g]||0)+w.grp[g];});});
  var ult=cer[cer.length-1],keys=Object.keys(G).sort(function(a,b){return G[b]-G[a];});
  s+='<section class="card"><div class="ct"><h3>Series por músculo</h3></div><p class="sub">Promedio por semana'+(cerr.length?' de las últimas '+cerr.length:'')+'. Entre 10 y 20 es donde progresa la mayoría.</p>'+
   (keys.length?'<div class="gbar">'+keys.map(function(g){var v=Math.round(G[g]/cerr.length*10)/10,u=ult&&ult.grp[g]||0;return '<div class="gb"><span>'+g+'</span><div class="gt"><i style="width:'+Math.min(100,v/20*100)+'%;background:'+(v<10?'var(--yel)':v>20?'var(--red)':'var(--grn)')+'"></i><b style="left:50%"></b></div><em>'+co(v)+'</em></div>';}).join('')+'</div><p class="mu" style="font-size:12px;margin:8px 0 0">La rayita marca 10 series.</p>':'<p class="sub">Todavía no hay semanas cerradas.</p>')+'</section>';}
 if(PP.tab==='ej'){var lista=[];S.slice().reverse().forEach(function(w){w.r.forEach(function(d){(d.ejercicios||[]).forEach(function(e){if(e&&e.nombre&&!lista.some(function(x){return nrmP(x.n)===nrmP(e.nombre);}))lista.push({n:e.nombre,g:e.grupo||''});});});});
  if(PP.ej){var nom=PP.ej,u='kg',W=[],R=[],det=[];S.forEach(function(w){var best=null,reps=null,txt=[];w.r.forEach(function(d){if(d.estado==='rojo')return;(d.ejercicios||[]).forEach(function(e){if(nrmP(e.nombre)!==nrmP(nom))return;seriesP(e).forEach(function(q){var v=numP(q.peso),rp=numP(q.reps);if(v!=null){u=uniP(q.peso);if(best==null||v>best||(v===best&&rp>reps)){best=v;reps=rp;}}if(q.peso||q.reps)txt.push((q.peso?co(numP(q.peso)):'—')+'×'+(q.reps||'—'));});});});W.push(best);R.push(reps);det.push({lab:w.hoy?'Esta semana':'Semana del '+w.lab,t:txt.join(' · ')});});
   var un=u==='pl'?'placas':u,v=W.filter(function(x){return x!=null;});
   s+='<button type="button" class="sec" data-pp="ej:" style="margin-bottom:10px">'+I.atras+' Todos los ejercicios</button><section class="card"><h3>'+nom+'</h3><p class="sub">'+(v.length>1?'De '+co(v[0])+' a '+co(v[v.length-1])+' '+un+' en '+v.length+' semanas':'Peso más alto de cada semana')+'</p>'+
    '<span class="lbl" style="display:block;margin-top:10px">Peso ('+un+')</span>'+lineaP(W,lab,{col:'var(--vio)',aria:'Peso por semana'})+
    '<span class="lbl" style="display:block;margin-top:10px">Repeticiones de esa serie</span>'+lineaP(R,lab,{col:'var(--red)',aria:'Repeticiones por semana'})+'</section>'+
    '<section class="card" style="margin-top:12px"><h3>Semana a semana</h3><div class="lista">'+det.slice().reverse().filter(function(x){return x.t;}).map(function(x){return '<div class="fila" style="padding:8px 0;grid-template-columns:1fr"><span><b>'+x.lab+'</b><span class="s">'+x.t+' '+un+'</span></span></div>';}).join('')+'</div></section>';}
  else s+='<section class="card lista" style="padding:2px 16px">'+lista.map(function(x){var w=[],u='kg';S.forEach(function(sw){var best=null;sw.r.forEach(function(d){if(d.estado==='rojo')return;(d.ejercicios||[]).forEach(function(e){if(nrmP(e.nombre)!==nrmP(x.n))return;seriesP(e).forEach(function(q){var v=numP(q.peso);if(v!=null&&(best==null||v>best)){best=v;u=uniP(q.peso);}});});});if(best!=null)w.push(best);});
    var d=w.length>1?Math.round((w[w.length-1]-w[0])*10)/10:0,un=u==='pl'?' pl':' '+u;
    return '<button type="button" class="ppx" data-pp="ej:'+x.n.replace(/"/g,'&quot;')+'"><span><b>'+x.n+'</b><span class="s">'+(x.g?x.g+' · ':'')+(w.length?co(w[w.length-1])+un:'sin peso')+'</span></span>'+(w.length>1?'<span class="chip'+(d>0?' ok':'')+'">'+(d>0?'+':d<0?'−':'')+(d?co(Math.abs(d))+un:'igual')+'</span>'+spark(w,'var(--a1)',64,24):'<span></span><span></span>')+'</button>';}).join('')+'</section>';}
 return s;};
/* ---------- Medidas: todas, con gráfico de cada una y la tabla entera ---------- */
var GMED=[['Básicas',function(f){return /^(masa corporal|peso|talla)/.test(nrmP(f.n));}],['Pliegues (mm)',function(f){return f.u==='mm';}],['Perímetros (cm)',function(f){return f.u==='cm'&&!/humero|biestiloideo|femur|talla/.test(nrmP(f.n));}],['Diámetros (cm)',function(f){return /humero|biestiloideo|femur/.test(nrmP(f.n));}],['Otras',function(){return true;}]];
vMed=function(){if(!MEDT&&PANEL)return '<div class="hd"><span class="ey">Tu cuerpo</span><h1>Medidas</h1></div><div class="bajo" style="margin:0 0 14px"><button type="button" class="pri" data-a="pesoHoy">'+I.mas+'Anotar mi peso</button></div><section class="card"><p class="sub">Todavía no hay medidas cargadas. Cuando tu entrenador te tome las medidas, vas a ver acá cada una con su gráfico.</p></section>';if(!MEDT)return vMed0();var T=MEDT,lab=T.idx.map(function(i){return fCorta(T.fechas[i]);}),filas=T.F.map(function(f){return {n:f.n,u:f.u,v:T.idx.map(function(i){return f.v[i];})};});
 if(T.sum.some(function(x){return x!=null;}))filas.push({n:'Σ 8 pliegues',u:'mm',v:T.sum,sum:true});
 if(!PM.sel||!filas.some(function(f){return f.n===PM.sel;})){var p=filas.filter(function(f){return /masa corporal|^peso/.test(nrmP(f.n));})[0]||filas[0];PM.sel=p&&p.n;}
 var sel=filas.filter(function(f){return f.n===PM.sel;})[0],uv=function(a){a=a.filter(function(x){return x!=null;});return a;};
 var s='<div class="hd"><span class="ey">Tu cuerpo</span><h1>Medidas</h1><p>'+T.n+' toma'+(T.n===1?'':'s')+' · última el '+MED_ULT+' · próxima el '+T.prox+'</p></div>';
 s+='<div class="bajo" style="margin:0 0 14px"><button type="button" class="pri" data-a="pesoHoy">'+I.mas+'Anotar mi peso</button>'+(window.REAL?'':'<button type="button" class="sec" data-a="toma">'+I.regla+'Toma completa</button>')+'</div>';
 if(sel){var a=uv(sel.v),d1=a.length>1?Math.round((a[a.length-1]-a[a.length-2])*10)/10:null,d0=a.length>1?Math.round((a[a.length-1]-a[0])*10)/10:null,un=sel.u||'';
  s+='<section class="card"><div class="ct"><div><h3>'+sel.n+'</h3><p class="sub">'+(a.length?co(a[a.length-1])+' '+un:'sin dato')+(d1!=null?' · '+(d1>0?'+':d1<0?'−':'')+co(Math.abs(d1))+' vs. la anterior':'')+(d0!=null&&a.length>2?' · '+(d0>0?'+':d0<0?'−':'')+co(Math.abs(d0))+' desde '+lab[0]:'')+'</p></div></div>'+lineaP(sel.v,lab,{col:sel.u==='mm'?'var(--cya)':'var(--a1)',aria:'Evolución de '+sel.n})+(sel.sum?'<p class="sub">La suma de los pliegues sigue la grasa debajo de la piel.</p>':'')+'</section>';}
 var usados={};s+='<div class="sh"><h2>Todas tus medidas</h2></div>';
 GMED.forEach(function(g){var L=filas.filter(function(f){return !usados[f.n]&&(f.sum?g[0]==='Pliegues (mm)':g[1](f));});if(!L.length)return;L.forEach(function(f){usados[f.n]=1;});
  s+='<section class="card lista" style="padding:2px 16px;margin-bottom:10px"><span class="lbl" style="display:block;padding:12px 0 2px">'+g[0]+'</span>'+L.map(function(f){var a=uv(f.v),d=a.length>1?Math.round((a[a.length-1]-a[a.length-2])*10)/10:null;
   return '<button type="button" class="ppx'+(f.n===PM.sel?' on':'')+'" data-pm="'+f.n.replace(/"/g,'&quot;')+'"><span><b>'+f.n+'</b><span class="s">'+(a.length?co(a[a.length-1])+' '+(f.u||''):'—')+'</span></span>'+(d!=null?'<span class="chip">'+(d>0?'+':d<0?'−':'')+co(Math.abs(d))+'</span>':'<span></span>')+(a.length>1?spark(a,f.u==='mm'?'var(--cya)':'var(--a1)',64,24):'<span></span>')+'</button>';}).join('')+'</section>';});
 s+='<div class="sh"><h2>Tabla completa</h2><button type="button" data-a="medT">'+(U.med.tabla?'Ocultar':'Ver')+'</button></div>';
 if(U.med.tabla)s+='<section class="card" style="padding:6px 0 10px"><div style="overflow-x:auto;padding:0 16px"><table class="tabla" style="min-width:'+(140+lab.length*64)+'px"><thead><tr><th>Medida</th>'+lab.map(function(c){return '<th>'+c+'</th>';}).join('')+'</tr></thead><tbody>'+filas.map(function(f){return '<tr'+(f.sum?' class="t"':'')+'><td>'+f.n+'</td>'+f.v.map(function(v){return '<td>'+(v==null?'—':co(v))+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div></section>';
 return s;};
function pesoUlt(){var a=(SERIE.peso||[]).filter(function(x){return x!=null;});return a.length?a[a.length-1]:70;}
document.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('[data-pp],[data-pm]');if(!b)return;
 if(b.dataset.pm!=null){PM.sel=b.dataset.pm;render();try{document.querySelector('#view').scrollIntoView({block:'start'});}catch(e){}return;}
 var p=b.dataset.pp.split(':'),k=p.shift(),v=p.join(':');if(k==='tab'){PP.tab=v;PP.ej=null;}if(k==='ej')PP.ej=v||null;render();try{irArriba();}catch(e){}});

/* ================= Cardio: minutos por semana, tipos y zonas (mismos colores y zonas que el Monitor) ================= */
var CZT={caminata:'#6e9bff',cinta:'#5fb0ff',bici:'#4fd1e6','elíptica':'#7ef7c0',eliptica:'#7ef7c0',escalador:'#ffc069',remo:'#a99ad6',trote:'#ff9fb8',natación:'#8fe0c8'};
function colT(t,i){return CZT[t]||['#6e9bff','#4fd1e6','#7ef7c0','#ffc069','#a99ad6','#ff9fb8'][i%6];}
function cap1(t){t=String(t||'');return t.charAt(0).toUpperCase()+t.slice(1);}
function cardioPro(S,lab){var all=[],tipos=[];S.forEach(function(w,wi){w.car.forEach(function(z){all.push({w:wi,lab:lab[wi],z:z});if(tipos.indexOf(z.t)<0)tipos.push(z.t);});});
 if(!all.length)return '<section class="card"><h3>Cardio</h3><p class="sub">Todavía no anotaste cardio. Cuando tu entrenador te cargue cardio, al terminarlo anotá los minutos y la FC promedio: acá vas a ver cuánto hiciste por semana y en qué zona trabajaste.</p></section>';
 var Z=zonasP(),beta=betaP(),s='';
 /* resumen */
 var est=S[S.length-1],minE=est.car.reduce(function(a,z){return a+(z.min||0);},0),ult4=S.slice(-4),min4=0,n4=0;ult4.forEach(function(w){w.car.forEach(function(z){min4+=z.min||0;n4++;});});
 var conFC=all.filter(function(x){return x.z.fc;}),obj=conFC.length?zIdx(conFC[conFC.length-1].z.zona):1,enz=Z?conFC.filter(function(x){return zonaFC(Z,x.z.fc)===zIdx(x.z.zona);}).length:null;
 s+='<div class="czk"><div><small>Esta semana</small><b>'+minE+'<em> min</em></b><span>'+est.car.length+' sesi'+(est.car.length===1?'ón':'ones')+'</span></div><div><small>Últimas 4 semanas</small><b>'+Math.round(min4/Math.max(1,ult4.length))+'<em> min</em></b><span>promedio por semana · '+n4+' sesiones</span></div><div><small>En tu zona</small><b>'+(enz==null||!conFC.length?'—':enz+'<em> de '+conFC.length+'</em>')+'</b><span>'+(Z?'sesiones con FC dentro de la zona pedida':(conFC.length?'falta tu edad en la ficha':'anotá la FC al terminar'))+'</span></div></div>';
 /* minutos por semana, apilado por tipo */
 var W=330,H=170,L=8,R=8,T=20,B=26,n=S.length,tot=S.map(function(w){return w.car.reduce(function(a,z){return a+(z.min||0);},0);}),mx=Math.max.apply(null,tot.concat([30])),dx=(W-L-R)/Math.max(1,n),bw=Math.min(24,dx*.62),g='';
 S.forEach(function(w,i){var x=L+i*dx+dx/2,y0=H-B;tipos.forEach(function(t,ti){var m=w.car.filter(function(z){return z.t===t;}).reduce(function(a,z){return a+(z.min||0);},0);if(!m)return;var h=(H-T-B)*m/mx;g+='<rect class="czbar" style="animation-delay:'+(i*40)+'ms" x="'+(x-bw/2).toFixed(1)+'" y="'+(y0-h).toFixed(1)+'" width="'+bw.toFixed(1)+'" height="'+h.toFixed(1)+'" rx="4" fill="'+colT(t,ti)+'"/>';y0-=h;});
  if(tot[i])g+='<text x="'+x.toFixed(1)+'" y="'+(y0-5).toFixed(1)+'" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--tx2)">'+tot[i]+'</text>';
  if(n<=8||i%Math.ceil(n/8)===0||i===n-1)g+='<text x="'+x.toFixed(1)+'" y="'+(H-8)+'" text-anchor="middle" font-size="10" fill="'+(w.hoy?'var(--cya)':'var(--tx4)')+'">'+lab[i]+'</text>';});
 s+='<section class="card" style="margin-top:12px"><div class="ct"><h3>Minutos por semana</h3></div><p class="sub">Cuánto cardio hiciste cada semana, por tipo.</p><svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="Minutos de cardio por semana">'+g+'</svg><div class="czleg">'+tipos.map(function(t,ti){return '<span><i style="background:'+colT(t,ti)+'"></i>'+cap1(t)+'</span>';}).join('')+'</div></section>';
 /* tipos de cardio */
 var porT=tipos.map(function(t,ti){var m=0,k=0;all.forEach(function(x){if(x.z.t===t){m+=x.z.min||0;k++;}});return {t:t,m:m,k:k,c:colT(t,ti)};}).sort(function(a,b){return b.m-a.m;}),mt=Math.max.apply(null,porT.map(function(x){return x.m;}).concat([1]));
 s+='<section class="card" style="margin-top:12px"><div class="ct"><h3>Tipo de cardio</h3></div><p class="sub">Minutos totales de cada uno.</p><div class="gbar">'+porT.map(function(x){return '<div class="gb czgb"><span>'+cap1(x.t)+'</span><div class="gt"><i style="width:'+Math.max(4,x.m/mt*100)+'%;background:'+x.c+'"></i></div><em>'+x.m+' min</em></div>';}).join('')+'</div><p class="mu" style="font-size:12px;margin:8px 0 0">'+porT.map(function(x){return cap1(x.t)+': '+x.k+' sesi'+(x.k===1?'ón':'ones');}).join(' · ')+'</p></section>';
 /* zonas */
 s+='<section class="card" style="margin-top:12px"><div class="ct"><h3>Zonas de frecuencia cardíaca</h3></div>';
 if(!conFC.length)s+='<p class="sub">Para ver tus zonas, anotá la FC promedio (lpm) al terminar el cardio: la ves en el reloj o en la máquina.</p>';
 else{var P=conFC.slice(-12),fcs=P.map(function(x){return x.z.fc;}),lo,hi;
  if(Z){lo=Math.min(Math.round(Z.mx*.45),Math.min.apply(null,fcs)-6);hi=Math.max(Math.round(Z.mx*.92),Math.max.apply(null,fcs)+8);}else{lo=Math.min.apply(null,fcs)-15;hi=Math.max.apply(null,fcs)+15;}
  var W2=330,H2=210,L2=34,R2=30,T2=14,B2=30,X=function(i){return L2+14+(P.length===1?(W2-L2-R2-28)/2:i*(W2-L2-R2-28)/(P.length-1));},Y=function(v){return T2+(H2-T2-B2)*(1-(v-lo)/(hi-lo));},q='';
  q+='<defs><linearGradient id="czl" x1="0" x2="1"><stop offset="0" stop-color="#6e9bff"/><stop offset="1" stop-color="#4fd1e6"/></linearGradient><filter id="czgl" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="2.4"/></filter></defs>';
  if(Z){Z.z.forEach(function(z,zi){var a=Math.max(lo,zi===0?lo:z.lo),b=Math.min(hi,z.hi==null?hi:z.hi);if(b<=a)return;var on=zi===obj;
    q+='<rect x="'+L2+'" y="'+Y(b).toFixed(1)+'" width="'+(W2-L2-R2)+'" height="'+(Y(a)-Y(b)).toFixed(1)+'" fill="'+z.c+'" opacity="'+(on?.20:.07)+'"/><text x="'+(W2-R2+4)+'" y="'+((Y(a)+Y(b))/2+3.5).toFixed(1)+'" font-size="10" font-weight="800" fill="'+z.c+'">'+z.k+'</text>';
    if(zi>0&&z.lo>lo&&z.lo<hi)q+='<line x1="'+L2+'" x2="'+(W2-R2)+'" y1="'+Y(z.lo).toFixed(1)+'" y2="'+Y(z.lo).toFixed(1)+'" stroke="'+z.c+'" stroke-opacity=".35" stroke-dasharray="3 4"/><text x="'+(L2-5)+'" y="'+(Y(z.lo)+3.5).toFixed(1)+'" text-anchor="end" font-size="9.5" fill="var(--tx4)">'+z.lo+'</text>';});
   q+='<rect x="'+L2+'" y="'+Y(Z.pico[1]).toFixed(1)+'" width="'+(W2-L2-R2)+'" height="'+(Y(Z.pico[0])-Y(Z.pico[1])).toFixed(1)+'" fill="'+COL_PICO+'" opacity=".16"/>';}
  var pts=P.map(function(x,i){return X(i).toFixed(1)+','+Y(x.z.fc).toFixed(1);}).join(' ');
  if(P.length>1)q+='<polyline points="'+pts+'" fill="none" stroke="url(#czl)" stroke-width="6" opacity=".35" filter="url(#czgl)"/><polyline class="czline" pathLength="1" points="'+pts+'" fill="none" stroke="url(#czl)" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>';
  P.forEach(function(x,i){var zi=Z?zonaFC(Z,x.z.fc):null,col=Z?Z.z[zi].c:'#6e9bff',last=i===P.length-1,cx=X(i).toFixed(1),cy=Y(x.z.fc).toFixed(1);
   if(last)q+='<circle cx="'+cx+'" cy="'+cy+'" r="11" fill="'+col+'" opacity=".22"/>';
   q+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(last?5.5:4)+'" fill="'+(last?'#e8eef7':col)+'" stroke="'+(last?col:'var(--bg)')+'" stroke-width="'+(last?3:1.5)+'"/>';
   if(last||P.length<=6)q+='<text x="'+cx+'" y="'+(Y(x.z.fc)-11).toFixed(1)+'" text-anchor="middle" font-size="10.5" font-weight="800" fill="var(--tx)">'+x.z.fc+'</text>';
   if(P.length<=7||i%2===0||last)q+='<text x="'+cx+'" y="'+(H2-14)+'" text-anchor="middle" font-size="9.5" fill="var(--tx4)">'+x.lab+'</text><text x="'+cx+'" y="'+(H2-3)+'" text-anchor="middle" font-size="9" fill="var(--tx4)">'+cap1(x.z.t).slice(0,6)+'</text>';});
  q+='<text x="'+(L2-5)+'" y="'+(T2+4)+'" text-anchor="end" font-size="9" fill="var(--tx4)">lpm</text>';
  var u=P[P.length-1],uz=Z?zonaFC(Z,u.z.fc):null,oz=zIdx(u.z.zona);
  s+='<p class="sub">'+(Z?'Tu FC máx estimada es '+Z.mx+' lpm (a los '+Z.edad+' años). La franja más marcada es la zona que te pidió tu entrenador.':'Falta tu edad en la ficha para calcular tus zonas: pedísela a tu entrenador.')+'</p>';
  s+='<svg viewBox="0 0 '+W2+' '+H2+'" width="100%" role="img" aria-label="Frecuencia cardíaca de cada sesión de cardio sobre las zonas">'+q+'</svg>';
  if(Z)s+='<div class="czleg">'+Z.z.map(function(z){return '<span><i style="background:'+z.c+'"></i>'+z.k+' '+(z.hi?(z.lo?z.lo+'–':'<')+z.hi:z.lo+'+')+'</span>';}).join('')+'<span><i style="background:'+COL_PICO+'"></i>quema de grasa '+Z.pico[0]+'–'+Z.pico[1]+'</span></div>';
  if(beta)s+='<p class="czn">Con tu medicación la FC queda más baja de lo normal: guiate también por cómo respirás ('+ZCAR[oz].f+').</p>';
  else if(Z&&uz!=null){var r=Z.z[oz];s+='<p class="czn" style="border-color:'+Z.z[uz].c+'">Última sesión: <b>'+u.z.fc+' lpm</b>, '+Z.z[uz].k+' · '+Z.z[uz].t.toLowerCase()+'. '+(uz===oz?'Justo en la zona que te pidió tu entrenador.':(uz<oz?'Quedaste por debajo: para entrar en '+r.k+' tenés que llegar a '+r.lo+' lpm ('+ZCAR[oz].f+').':'Quedaste por encima: bajá un poco el ritmo, en '+r.k+' es hasta '+r.hi+' lpm.'))+'</p>';}}
 s+='</section>';
 /* cada sesión */
 s+='<section class="card" style="margin-top:12px"><h3>Cada sesión</h3><div class="lista">'+all.slice(-10).reverse().map(function(x){var zi=Z&&x.z.fc?zonaFC(Z,x.z.fc):null;return '<div class="fila" style="padding:8px 0"><span class="ico" style="color:'+(zi!=null?Z.z[zi].c:'var(--cya)')+'">♥</span><span><b>'+cap1(x.z.t)+' · '+(x.z.min!=null?x.z.min+' min':'—')+'</b><span class="s">'+(x.lab==='Esta'?'Esta semana':'Semana del '+x.lab)+' · '+String(x.z.dia||'').toLowerCase()+(x.z.fc?' · '+x.z.fc+' lpm':'')+'</span></span>'+(zi!=null?'<span class="chip" style="color:'+Z.z[zi].c+';border-color:'+Z.z[zi].c+'55">'+Z.z[zi].k+'</span>':'<span></span>')+'</div>';}).join('')+'</div></section>';
 return s;}
