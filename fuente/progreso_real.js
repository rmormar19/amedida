/* ================= Progreso y Medidas completos con los datos del panel =================
   Todo sale de lo registrado (rutina de la semana + semanas cerradas del historial). */
var PP={tab:'carga',ej:null,cg:'series'},PM={sel:null};
function semanasP(){if(!PANEL)return [];var c=PANEL.c,L=(c.historial||[]).slice().sort(function(a,b){return String(a.fecha).localeCompare(String(b.fecha));}).map(function(h){return {m:lunesOp(new Date(h.fecha)),r:h.rutina||[]};});
 var vis={},out=[];L.forEach(function(w){vis[+w.m]=w;});Object.keys(vis).sort(function(a,b){return a-b;}).forEach(function(k){out.push(vis[k]);});
 var lh=LUNH();out=out.filter(function(w){return +w.m!==+lh;});out.push({m:lh,r:c.rutina||[],hoy:true});
 return out.map(function(w){var pl=0,he=0,fa=0,ser=0,rirS=0,rirN=0,esf=[],grp={},car=[];
  w.r.forEach(function(d){var tiene=(d.ejercicios||[]).some(function(e){return e&&e.nombre;});if(!tiene||d.libre)return;pl++;
   var hecho=d.estado==='verde'||(!w.hoy&&!Object.prototype.hasOwnProperty.call(d,'estado'));
   if(d.estado==='rojo'){fa++;return;}if(!hecho)return;he++;if(d.esfuerzo)esf.push(d.esfuerzo);
   (d.ejercicios||[]).forEach(function(e){var ss=seriesP(e).filter(function(s){return s.reps||s.peso;});ser+=ss.length;var g=e.grupo||musculoP(e.nombre);grp[g]=(grp[g]||0)+ss.length;
    ss.forEach(function(s){var r=numP(s.rir);if(r!=null){rirS+=r;rirN++;}});});
   (d.cardio||[]).forEach(function(z){if(z&&(z.estado==='hecho'||z.minReal))car.push({t:z.tipo,min:numP(z.minReal)||numP(z.cant),fc:numP(z.fc),dia:d.dia});});});
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
function ppTabs(){return '<div class="seg" role="tablist" style="margin:2px 0 14px">'+[['carga','Semanas'],['ej','Ejercicios'],['grp','Músculos']].map(function(t){return '<button type="button" role="tab" data-pp="tab:'+t[0]+'" aria-pressed="'+(PP.tab===t[0])+'">'+t[1]+'</button>';}).join('')+'</div>';}
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
  var car=[];S.forEach(function(w){w.car.forEach(function(z){car.push({lab:w.hoy?'Esta':w.lab,z:z});});});
  if(car.length)s+='<section class="card" style="margin-top:12px"><div class="ct"><h3>Cardio</h3></div><div class="lista">'+car.slice(-8).reverse().map(function(x){return '<div class="fila" style="padding:8px 0"><span class="ico">♥</span><span><b>'+x.z.t+' · '+(x.z.min||'—')+' min</b><span class="s">'+x.lab+' · '+x.z.dia+(x.z.fc?' · FC '+x.z.fc+' lpm':'')+'</span></span><span></span></div>';}).join('')+'</div></section>';
 }
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
