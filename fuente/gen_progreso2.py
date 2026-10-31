# Progreso v2 (29 oct 2026): carga de trabajo primero, volumen por grupo abajo, sin medidas,
# gráficos animados con globo al tocar, y todo responde al período (4 sem · 6 sem · 3 m · 6 m · 1 año).
import os, importlib.util
D = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('gp', os.path.join(D, 'gen_progreso.py'))
gp = importlib.util.module_from_spec(spec); spec.loader.exec_module(gp)

CSS = r'''

.ejtop{display:grid;grid-template-columns:38px 1fr 38px;gap:8px;align-items:center}
.ejtop .ib:disabled{opacity:.35}
.ejtt{text-align:center;min-width:0}
.ejtt h3{margin:2px 0 0;font-size:17px;line-height:1.2}
.ejvh{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:12px 0 4px}
.glbl{display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:var(--tx3)}
.glbl i{display:inline-block;width:9px;height:9px;border-radius:3px}
.ejseg{display:flex;gap:3px;padding:3px;border-radius:10px;background:var(--surf2);border:1px solid var(--line)}
.ejseg button{display:inline-flex;align-items:center;gap:5px;height:28px;padding:0 9px;border:0;border-radius:7px;background:transparent;font-size:12px;font-weight:600;color:var(--tx3)}
.ejseg button[aria-pressed="true"]{background:var(--surf3);color:var(--tx);box-shadow:inset 0 -2px 0 var(--a1)}
.ejch{position:relative;touch-action:pan-y}
.ejch .hit{cursor:crosshair}
.ttp{position:absolute;z-index:5;pointer-events:none;background:rgba(9,11,18,.96);border:1px solid rgba(255,255,255,.12);border-radius:11px;padding:8px 11px;font-size:12px;color:#eef1f7;box-shadow:0 14px 40px rgba(0,0,0,.6);min-width:170px;transition:top .08s,left .08s}
.ttp[hidden]{display:none}
.ttp .h{font-size:10px;text-transform:uppercase;letter-spacing:.7px;color:#8d96ab;font-weight:800;margin-bottom:5px}
.ttp .r{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:2px 0}
.ttp .r span{display:flex;align-items:center;gap:6px;color:#b8c0d0}
.ttp .r i{width:8px;height:8px;border-radius:2px;display:inline-block}
.ttp .rn{margin-top:5px;padding-top:5px;border-top:1px solid rgba(255,255,255,.12);font-weight:700}
.animando .chl{stroke-dasharray:1;stroke-dashoffset:1;animation:traza 1.1s .15s linear forwards}
.animando .cha{animation:fadein .9s .35s ease-out both}
.animando .pt{animation:pop .32s cubic-bezier(.3,1.6,.5,1) both;animation-delay:var(--dl,0ms);transform-box:fill-box;transform-origin:50% 50%}
.animando .chlab{animation:fadein .35s ease-out both;animation-delay:var(--dl,0ms)}
@keyframes fadein{from{opacity:0}}
.chpulse{opacity:0;pointer-events:none}
.animando .chpulse{animation:pulso 1.1s ease-out 2 forwards;animation-delay:var(--dl,1250ms);transform-box:fill-box;transform-origin:50% 50%}
@keyframes pulso{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(3.2)}}
.pt{transition:r .12s}
.ejt2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.ejt2>div{padding:10px 12px;border-radius:14px;background:var(--surf2);border:1px solid var(--line)}
.ejt2 b{display:block;font-size:19px;letter-spacing:-.02em;margin:2px 0}
.ejt2 .s{font-size:12px}
.ejrows>div{display:grid;grid-template-columns:1fr auto;gap:2px 10px;padding:10px 0;border-bottom:1px solid var(--line);font-size:13.5px}
.ejrows span{color:var(--tx3)}
.ejrows em{grid-column:1/-1;font-style:normal;font-size:12px;color:var(--tx4)}
.ejnext{margin-top:12px;padding:12px;border-radius:14px;background:rgba(var(--a1rgb),.1);border:1px solid rgba(var(--a1rgb),.25)}
.ejnext b{display:block;font-size:15.5px;margin:3px 0 2px}
.ejnext .s{font-size:12.5px;color:var(--tx3)}
.dc{display:inline-block;font-size:11.5px;font-weight:700;padding:1px 6px;border-radius:999px;margin-right:3px}
.dc.up{background:rgba(var(--grnrgb),.15);color:var(--grn)}
.dc.wa{background:rgba(var(--yelrgb),.16);color:var(--yel)}
.dc.eq{background:rgba(var(--fg),.07);color:var(--tx3)}
.eth{display:grid;grid-template-columns:1fr 112px 64px;gap:8px;padding:8px 0 6px;font-size:11px;font-weight:700;color:var(--tx4);text-transform:uppercase;letter-spacing:.5px}
.eth span:nth-child(2){text-align:right}
.etd{font-size:11.5px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--a1);padding:12px 0 4px;border-top:1px solid var(--line)}
.etr{display:grid;grid-template-columns:1fr 112px 64px;gap:8px;align-items:center;width:100%;padding:9px 6px;margin:0 -6px;border:0;border-radius:10px;background:transparent;text-align:left;width:calc(100% + 12px)}
.etr.sel{background:rgba(var(--a1rgb),.1)}
.etr .nm{font-size:13.5px;font-weight:600;line-height:1.25}
.etr .nm .chip{display:table;margin-top:3px;font-size:10.5px;padding:1px 7px}
.etr .v{text-align:right;font-size:13px}
.etr .v b{display:block}
.etr .v small{color:var(--tx3)}
.etr .tr svg{display:block}
.stk{position:sticky;top:calc(env(safe-area-inset-top,0px) + 56px);z-index:15;margin:0 -16px 6px;padding:8px 16px 10px;background:var(--glass2);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
html.enmarco .stk{top:110px}
.stk .per{margin:0}
.per button{transition:background .2s,color .2s,border-color .2s}
.kps{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.kps .tile b{display:block;font-size:23px;letter-spacing:-.03em;margin-top:2px}
.kps .tile b small{font-size:12px;font-weight:500;color:var(--tx3);margin-left:3px;letter-spacing:0}
.kps .tile em{font-style:normal;font-size:11.5px;font-weight:700}
.kcap{margin:0 2px 10px;font-size:12.5px;color:var(--tx3)}
.cw{position:relative;margin-top:10px}
.cw svg{display:block;width:100%;height:auto;touch-action:pan-y;cursor:crosshair;overflow:visible}
.b{transform-box:fill-box;transform-origin:50% 100%;animation:crece .75s cubic-bezier(.2,.8,.2,1) both;transition:filter .15s,opacity .15s}
@keyframes crece{from{transform:scaleY(0)}}
.b.hi{filter:brightness(1.25) drop-shadow(0 0 6px rgba(var(--a1rgb),.75))}
.cw.act .b:not(.hi){opacity:.55}
.ln{stroke-dasharray:1;stroke-dashoffset:1;animation:traza 1.1s cubic-bezier(.4,0,.2,1) .2s forwards}
@keyframes traza{to{stroke-dashoffset:0}}
.ar{opacity:0;animation:fade .9s ease .5s forwards}
@keyframes fade{to{opacity:1}}
.dot{transform-box:fill-box;transform-origin:center;animation:pop .35s cubic-bezier(.3,1.6,.5,1) both}
@keyframes pop{from{transform:scale(0)}}
.guia{stroke:var(--tx3);stroke-dasharray:3 3;opacity:0;transition:opacity .15s}
.guia.on{opacity:.8}
.foco{opacity:0;transition:opacity .15s}
.foco.on{opacity:1}
.bub{position:absolute;z-index:3;transform:translate(-50%,calc(-100% - 12px));padding:7px 10px;border-radius:11px;background:var(--tx);color:var(--bg);font-size:12px;line-height:1.35;white-space:nowrap;pointer-events:none;box-shadow:var(--sh);transition:left .12s ease,top .12s ease,opacity .15s}
.bub b{font-size:13.5px}
.bub[hidden]{display:block;opacity:0}
.sube{animation:sube .45s cubic-bezier(.2,.8,.2,1) both}
@keyframes sube{from{opacity:0;transform:translateY(10px)}}
.gx{border-top:1px solid var(--line)}
.gx:first-child{border-top:0}
.gr{display:grid;grid-template-columns:88px 1fr 36px 16px;gap:8px;align-items:center;width:100%;padding:9px 0;border:0;background:transparent;text-align:left;font-size:13.5px}
.gr i{position:relative;display:flex;height:11px;border-radius:6px;background:var(--line2);overflow:hidden}
.gr i::after{content:"";position:absolute;left:50%;top:0;bottom:0;width:1.5px;background:var(--bg);opacity:.9}
.gr i u{display:block;height:100%;transform-origin:left;animation:crecex .8s cubic-bezier(.2,.8,.2,1) both}
@keyframes crecex{from{transform:scaleX(0)}}
.gr b{text-align:right}
.gr svg{width:16px;height:16px;color:var(--tx4);transition:transform .2s}
.gr[aria-expanded="true"] svg{transform:rotate(90deg)}
.gd{padding:0 0 12px}
.gd .r{display:flex;justify-content:space-between;font-size:13px;padding:5px 0;color:var(--tx2)}
.gd .r span.s{color:var(--tx3);font-size:12px}
.wks{display:flex;gap:6px;overflow-x:auto;margin:12px -16px 6px;padding:0 16px;scrollbar-width:none}
.wks::-webkit-scrollbar{display:none}
.wks button{flex:0 0 auto;height:32px;padding:0 11px;border-radius:10px;border:1px solid var(--line);background:transparent;font-size:12.5px;font-weight:600;color:var(--tx3);transition:background .2s,color .2s}
.wks button[aria-pressed="true"]{background:var(--a1);border-color:var(--a1);color:var(--ink)}
.ejc+.ejc{margin-top:12px}
.ejc .hd2{display:grid;grid-template-columns:64px 1fr auto;gap:12px;align-items:center}
.ejc .lam{border-radius:10px}
.ejc b.n{display:block;font-size:14.5px;line-height:1.25}
.ejc .s{display:block;font-size:12.5px;color:var(--tx3);margin-top:2px}
.ejc .v{text-align:right}
.ejc .v b{display:block;font-size:20px;letter-spacing:-.03em}
.ejc .v em{font-style:normal;font-size:11.5px;font-weight:700}
'''

JS = r'''
U={tab:'carga',per:'6 sem',met:'ser',gmode:'sem',gsem:51,gsel:null,abre:{},ejGm:'Todos',ejSel:'PPB',ejv:'juntas'};
var PER={'4 sem':4,'6 sem':6,'3 m':13,'6 m':26,'1 año':52};
var MESES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
/* 52 semanas de historia de ejemplo: las últimas 6 son las reales del panel */
var H=(function(){function r(i){var x=Math.sin((i+1)*12.9898)*43758.5453;return x-Math.floor(x);}
 var o={ser:[],vol:[],inten:[],rir:[],dias:[]};
 for(var i=0;i<46;i++){var de=(i%6===5),ho=(i===7||i===8),s=50+i*.45+(r(i)-.5)*8;if(de)s*=.55;if(ho)s*=.45;s=Math.round(s);
  o.ser.push(s);o.vol.push(Math.round(s*.33*(1+i*.004)*10)/10);o.inten.push(de?58:Math.round(66+i*.1+(r(i+50)-.5)*4));
  o.rir.push(Math.round((de?3:2.1-i*.014+(r(i+99)-.5)*.3)*10)/10);o.dias.push(ho?2:(r(i+7)>.85?3:4));}
 o.ser=o.ser.concat([62,30,28,48,70,76]);o.vol=o.vol.concat([24,10.6,11,15,26,26.8]);o.inten=o.inten.concat([71,71,71,62,71,71]);
 o.rir=o.rir.concat([1.6,1.5,1.4,1.8,1.4,1.3]);o.dias=o.dias.concat([4,2,2,3,4,4]);
 o.fin=[];for(var k=0;k<52;k++){var f=new Date(2026,9,25);f.setDate(f.getDate()-(51-k)*7);o.fin.push(f);}
 return o;})();
function rango(k){var f=H.fin[k],i=new Date(f);i.setDate(i.getDate()-6);return i.getDate()+(i.getMonth()!==f.getMonth()?' '+MESES[i.getMonth()]:'')+'–'+f.getDate()+' '+MESES[f.getMonth()];}
var avg=function(a){return a.reduce(function(x,y){return x+y;},0)/a.length;};
var r1=function(v){return Math.round(v*10)/10;};
/* datos del período: semanal hasta 6 m, mensual (promedio por semana) en 1 año */
function datos(){var n=PER[U.per],ini=52-n,o={sem:[],lab:[],tip:[],mensual:n===52};
 if(!o.mensual){for(var k=ini;k<52;k++){o.sem.push(k);o.lab.push('S'+(k+1));o.tip.push('Semana '+(k+1)+' · '+rango(k));}
  ['ser','vol','inten','rir','dias'].forEach(function(m){o[m]=o.sem.map(function(k){return H[m][k];});});return o;}
 var g={};var ord=[];for(var k2=0;k2<52;k2++){var f=H.fin[k2],key=f.getFullYear()+'-'+f.getMonth();if(!g[key]){g[key]=[];ord.push(key);}g[key].push(k2);}
 ['ser','vol','inten','rir','dias'].forEach(function(m){o[m]=ord.map(function(key){return r1(avg(g[key].map(function(k){return H[m][k];})));});});
 ord.forEach(function(key){var p=key.split('-');o.lab.push(MESES[+p[1]]);o.tip.push(MESES[+p[1]].charAt(0).toUpperCase()+MESES[+p[1]].slice(1)+' '+p[0]+' · '+g[key].length+' semanas');o.sem.push(g[key]);});
 return o;}

/* ---------- gráficos con efectos ---------- */
var CH={},W=340,HH=190;
function ejes(L,R,T,B,mn,mx,fmt,der){var g='',st=nice(mn,mx,5).step;for(var v=Math.ceil(mn/st-1e-9)*st;v<=mx+1e-9;v+=st){var y=T+(1-(v-mn)/(mx-mn))*(HH-T-B);g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y+'" y2="'+y+'" stroke="var(--line)"/><text x="'+(L-6)+'" y="'+(y+3.5)+'" text-anchor="end" font-size="10" fill="var(--tx4)">'+fmt(v)+'</text>';}return g;}
function etiquetas(lab,X,B,rojo){var st=Math.ceil(lab.length/7),g='';lab.forEach(function(l,i){var ult=i===lab.length-1;if(!ult&&(i%st||lab.length-1-i<st*.75))return;g+='<text x="'+X(i)+'" y="'+(HH-8)+'" text-anchor="middle" font-size="10.5" fill="'+(rojo&&rojo[i]?'var(--red)':'var(--tx3)')+'">'+l+'</text>';});return g;}
/* barras (+ línea opcional en eje derecho) */
function barras(id,vals,lab,o){var L=34,R=o.linea?34:10,T=18,B=26,n=vals.length,dx=(W-L-R)/n,w=Math.max(2.5,dx*(n>13?.7:.62)),mx=nice(0,Math.max.apply(null,vals)*1.08,4,true).hi,g='';
 var X=function(i){return L+i*dx+dx/2;},Y=function(v){return T+(1-v/mx)*(HH-T-B);};
 g+='<defs><linearGradient id="gb'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--a2)"/><stop offset="1" stop-color="var(--a1)"/></linearGradient><linearGradient id="gv'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--vio)" stop-opacity=".95"/><stop offset="1" stop-color="var(--vio)" stop-opacity=".55"/></linearGradient></defs>';
 g+=ejes(L,R,T,B,0,mx,o.fmt||function(v){return Math.round(v);});
 var m=avg(vals),ym=Y(m);
 vals.forEach(function(v,i){var y=Y(v),h=HH-B-y,last=i===n-1;g+='<rect class="b" data-i="'+i+'" x="'+(X(i)-w/2)+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+Math.min(6,w/2)+'" fill="url(#'+(last?'gb':'gv')+id+')" opacity="'+(o.rojo&&o.rojo[i]?.5:1)+'" style="animation-delay:'+Math.round(i*(500/n))+'ms"/>';});
 g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+ym+'" y2="'+ym+'" stroke="var(--tx3)" stroke-dasharray="4 4" class="ar"/><text x="'+(L+4)+'" y="'+(ym-5)+'" text-anchor="start" font-size="10" font-weight="700" fill="var(--tx3)" class="ar">media '+(o.fmt?o.fmt(m):Math.round(m))+'</text>';
 var ys=vals.map(Y);
 if(o.linea){var lv=o.linea,lmn=40,lmx=90,Y2=function(v){return T+(1-(v-lmn)/(lmx-lmn))*(HH-T-B);};
  for(var k=0;k<4;k++){var vv=lmn+(lmx-lmn)*k/3;g+='<text x="'+(W-R+6)+'" y="'+(T+(1-k/3)*(HH-T-B)+3.5)+'" font-size="10" fill="var(--grn)">'+Math.round(vv)+'%</text>';}
  var d=lv.map(function(v,i){return (i?'L':'M')+X(i).toFixed(1)+' '+Y2(v).toFixed(1);}).join(' ');
  g+='<path class="ln" pathLength="1" d="'+d+'" fill="none" stroke="var(--grn)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>';
  if(n<=13)lv.forEach(function(v,i){g+='<circle class="dot" cx="'+X(i)+'" cy="'+Y2(v)+'" r="3.4" fill="var(--surf)" stroke="var(--grn)" stroke-width="2" style="animation-delay:'+(600+i*(500/n))+'ms"/>';});}
 g+=etiquetas(lab,X,B,o.rojo);
 g+='<line class="guia" x1="0" x2="0" y1="'+T+'" y2="'+(HH-B)+'"/>';
 CH[id]={n:n,X:X,ys:ys,L:L,R:R,dx:dx,tip:o.tip};
 return '<div class="cw" data-ch="'+id+'"><svg viewBox="0 0 '+W+' '+HH+'" role="img" aria-label="'+o.aria+'">'+g+'</svg><div class="bub" hidden></div></div>';}
/* línea con área y franja objetivo opcional */
function lineaFx(id,vals,lab,o){var L=34,R=10,T=18,B=26,n=vals.length,dx=(W-L-R)/Math.max(1,n-1),mn=o.min!=null?o.min:Math.min.apply(null,vals),mx=o.max!=null?o.max:Math.max.apply(null,vals),pad=(mx-mn)*.18||1;
 if(o.min==null)mn-=pad;if(o.max==null)mx+=pad;var tN=nice(mn,mx,4,o.int);if(o.min==null||o.max==null){mn=tN.lo;mx=tN.hi;}var X=function(i){return L+i*dx;},Y=function(v){return T+(1-(v-mn)/(mx-mn))*(HH-T-B);},col=o.col||'var(--a1)',g='';
 g+='<defs><linearGradient id="ga'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+col+'" stop-opacity=".32"/><stop offset="1" stop-color="'+col+'" stop-opacity="0"/></linearGradient></defs>';
 g+=ejes(L,R,T,B,mn,mx,o.fmt||function(v){return co(r1(v));});
 if(o.banda){var y1=Y(o.banda[1]),y0=Y(o.banda[0]);g+='<rect x="'+L+'" y="'+y1+'" width="'+(W-L-R)+'" height="'+(y0-y1)+'" fill="var(--grn)" fill-opacity=".12" class="ar"/><text x="'+(W-R-4)+'" y="'+(y1+12)+'" text-anchor="end" font-size="10" font-weight="700" fill="var(--grn)" class="ar">'+o.bandaTxt+'</text>';}
 var d=vals.map(function(v,i){return (i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1);}).join(' ');
 g+='<path class="ar" d="'+d+' L'+X(n-1)+' '+(HH-B)+' L'+L+' '+(HH-B)+'Z" fill="url(#ga'+id+')"/><path class="ln" pathLength="1" d="'+d+'" fill="none" stroke="'+col+'" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>';
 if(n<=13)vals.forEach(function(v,i){g+='<circle class="dot" cx="'+X(i)+'" cy="'+Y(v)+'" r="3.6" fill="var(--surf)" stroke="'+col+'" stroke-width="2" style="animation-delay:'+(500+i*(600/n))+'ms"/>';});
 g+='<circle class="dot" cx="'+X(n-1)+'" cy="'+Y(vals[n-1])+'" r="5" fill="'+col+'" style="animation-delay:1.2s"/>';
 g+=etiquetas(lab,X,B);
 g+='<line class="guia" x1="0" x2="0" y1="'+T+'" y2="'+(HH-B)+'"/><circle class="foco" r="6" fill="'+col+'" stroke="var(--surf)" stroke-width="2.5"/>';
 CH[id]={n:n,X:X,ys:vals.map(Y),L:L,R:R,dx:dx,tip:o.tip,linea:true};
 return '<div class="cw" data-ch="'+id+'"><svg viewBox="0 0 '+W+' '+HH+'" role="img" aria-label="'+o.aria+'">'+g+'</svg><div class="bub" hidden></div></div>';}
/* globo al tocar o pasar el dedo */
function marcar(cw,i,globo){var c=CH[cw.dataset.ch];if(!c)return;var svg=cw.querySelector('svg'),r=svg.getBoundingClientRect(),x=c.X(i),y=c.ys[i];
 var gu=svg.querySelector('.guia');gu.setAttribute('x1',x);gu.setAttribute('x2',x);gu.classList.add('on');cw.classList.add('act');
 svg.querySelectorAll('.b').forEach(function(b){b.classList.toggle('hi',+b.dataset.i===i);});
 var fo=svg.querySelector('.foco');if(fo){if(y!=null){fo.setAttribute('cx',x);fo.setAttribute('cy',y);fo.classList.add('on');}else fo.classList.remove('on');}
 var bub=cw.querySelector('.bub');if(!globo){bub.hidden=true;return;}bub.hidden=false;bub.innerHTML=c.tip(i);var left=x/W*r.width,bw=bub.offsetWidth/2+4;left=Math.max(bw,Math.min(r.width-bw,left));bub.style.left=left+'px';bub.style.top=((y!=null?y:HH*.45)/HH*r.height)+'px';}
function mover(cw,ev){var c=CH[cw.dataset.ch];if(!c)return;var svg=cw.querySelector('svg'),r=svg.getBoundingClientRect(),px=(ev.clientX-r.left)*W/r.width;
 var i=c.linea?Math.round((px-c.L)/c.dx):Math.floor((px-c.L)/c.dx);i=Math.max(0,Math.min(c.n-1,i));
 marcar(cw,i,true);var sy=cw.dataset.sync;if(sy)document.querySelectorAll('.cw[data-sync="'+sy+'"]').forEach(function(o){if(o!==cw)marcar(o,i,false);});}
function soltar(cw){var svg=cw.querySelector('svg');cw.classList.remove('act');svg.querySelector('.guia').classList.remove('on');svg.querySelectorAll('.b.hi').forEach(function(b){b.classList.remove('hi');});var fo=svg.querySelector('.foco');if(fo)fo.classList.remove('on');cw.querySelector('.bub').hidden=true;}
document.addEventListener('pointermove',function(ev){var cw=ev.target.closest('.cw');document.querySelectorAll('.cw.act').forEach(function(x){if(x!==cw&&!(cw&&cw.dataset.sync&&x.dataset.sync===cw.dataset.sync))soltar(x);});if(cw)mover(cw,ev);});
document.addEventListener('pointerdown',function(ev){var cw=ev.target.closest('.cw');if(cw)mover(cw,ev);});
/* números que cuentan hasta su valor */
function contar(){document.querySelectorAll('[data-cu]').forEach(function(el){var to=+el.dataset.cu,dec=+el.dataset.dec||0,t0=performance.now(),suf=el.dataset.suf||'';
 (function paso(t){var p=Math.min(1,(t-t0)/700),e=1-Math.pow(1-p,3),v=to*e;el.textContent=co(v.toFixed(dec))+suf;if(p<1)requestAnimationFrame(paso);})(t0);});}

/* ---------- secciones ---------- */
function kpis(){var d=datos(),n=PER[U.per],ini=52-n,prev=ini-n>=0;
 var a={dias:avg(H.dias.slice(ini)),ser:avg(H.ser.slice(ini)),vol:avg(H.vol.slice(ini)),rir:avg(H.rir.slice(ini))};
 var b=prev?{dias:avg(H.dias.slice(ini-n,ini)),ser:avg(H.ser.slice(ini-n,ini)),vol:avg(H.vol.slice(ini-n,ini)),rir:avg(H.rir.slice(ini-n,ini))}:null;
 var dl=function(k,inv){if(!b)return '<em class="mu">sin período anterior</em>';var p=(a[k]-b[k])/b[k]*100,bien=inv?p<=0:p>=0;return '<em class="'+(Math.abs(p)<2?'mu':bien?'up':'wa')+'">'+(p>=0?'+':'')+co(p.toFixed(0))+' % vs. período anterior</em>';};
 var spk=function(k,col){return spark(d[k].length>1?d[k]:[d[k][0],d[k][0]],col,130,26);};
 return '<p class="kcap">Promedio por semana · '+(n===52?'último año':'últimas '+n+' semanas')+'</p><div class="kps">'+
  '<div class="tile"><span class="lbl">Sesiones</span><b><span data-cu="'+r1(a.dias)+'" data-dec="1">0</span><small>de 4</small></b>'+dl('dias')+spk('dias','var(--grn)')+'</div>'+
  '<div class="tile"><span class="lbl">Series efectivas</span><b><span data-cu="'+Math.round(a.ser)+'">0</span></b>'+dl('ser')+spk('ser','var(--a1)')+'</div>'+
  '<div class="tile"><span class="lbl">Volumen</span><b><span data-cu="'+r1(a.vol)+'" data-dec="1">0</span><small>mil kg</small></b>'+dl('vol')+spk('vol','var(--vio)')+'</div>'+
  '<div class="tile"><span class="lbl">RIR promedio</span><b><span data-cu="'+r1(a.rir)+'" data-dec="1">0</span></b><em class="mu">objetivo 1 a 3</em>'+spk('rir','var(--cya)')+'</div></div>';}
function carga(){var d=datos(),m=U.met,falt=d.mensual?null:d.dias.map(function(x){return x<4;});
 var TIT={ser:['Series efectivas','Series por semana que cuentan: la aproximación no cuenta y el drop set vale una. La línea punteada es tu media del período.'],vol:['Volumen × intensidad','Barras: kilos totales. Línea verde: intensidad relativa. Las dos suben: semana exigente. Barras abajo y línea arriba: más pesado con menos trabajo. Las dos abajo: descarga o faltas.'],rir:['Esfuerzo','RIR medio por semana. La franja verde es tu objetivo de 1 a 3.']};
 var s='<div class="seg sm">'+[['ser','Series'],['vol','Volumen × int.'],['rir','Esfuerzo']].map(function(x){return '<button type="button" data-a="met" data-v="'+x[0]+'" aria-pressed="'+(m===x[0])+'">'+x[1]+'</button>';}).join('')+'</div>';
 s+='<div class="ct" style="margin-top:12px"><div><h3>'+TIT[m][0]+'</h3><p class="sub">'+(d.mensual?'Promedio semanal de cada mes':'Semana '+(d.sem[0]+1)+' a '+(d.sem[d.sem.length-1]+1))+'</p></div><button type="button" class="qi" data-a="abre" data-v="x1" aria-expanded="'+!!U.abre.x1+'">'+I.info+'¿Para qué sirve?</button></div>'+(U.abre.x1?'<div class="exp sube">'+TIT[m][1]+'</div>':'');
 var id='c'+Date.now()%100000;
 if(m==='ser')s+=barras(id,d.ser,d.lab,{rojo:falt,aria:'Series efectivas por semana',tip:function(i){return d.tip[i]+'<br><b>'+co(d.ser[i])+' series</b> · '+co(d.dias[i])+' días';}});
 if(m==='vol')s+=barras(id,d.vol,d.lab,{linea:d.inten,rojo:falt,fmt:function(v){return Math.round(v)+'k';},aria:'Volumen e intensidad por semana',tip:function(i){return d.tip[i]+'<br><b>'+co(d.vol[i])+' mil kg</b> · intensidad '+Math.round(d.inten[i])+' %';}});
 if(m==='rir')s+=lineaFx(id,d.rir,d.lab,{col:'var(--cya)',min:0,max:3.5,banda:[1,3],bandaTxt:'objetivo 1–3',aria:'RIR medio por semana',tip:function(i){return d.tip[i]+'<br><b>RIR '+co(d.rir[i])+'</b>';}});
 s+='<div class="leg">'+(m==='vol'?'<span><i style="background:var(--vio)"></i>Volumen</span><span><i style="background:var(--grn)"></i>Intensidad</span>':'')+(falt?'<span><i style="background:var(--red);opacity:.6"></i>Semana con faltas</span>':'')+'<span><i style="background:var(--a1)"></i>Última cerrada</span></div>';
 s+='<p class="sub" style="margin-top:8px">Tocá o deslizá el dedo sobre el gráfico para ver cada semana.'+(d.mensual?'':' Semana 53 en curso: 36 series hasta hoy.')+'</p>';
 return s;}
var DIR={Tríceps:12,Bíceps:15,Cuádriceps:10,Pecho:9,Espalda:9,Hombro:6,Core:6,Femoral:3,Aductor:3,Pantorrilla:3},IND={Tríceps:4.5};
var EJM={Pecho:[['Press plano con barra',3],['Press inclinado con mancuernas',3],['Aperturas en polea',3]],Tríceps:[['Extensión en polea (cuerda y barra)',6],['Ext. unilateral y abajo-arriba',6],['Press plano e inclinado (indirecto ×0,5)',4.5]],Bíceps:[['Curl en polea (2 días)',6],['Curl inclinado (2 días)',6],['Curl martillo',3]],Espalda:[['Dorsal abierto',3],['Remo bajo',3],['Dorsal estrecho',3]],Hombro:[['Press militar',3],['Vuelos laterales',3]],Cuádriceps:[['Sentadilla',4],['Prensa 45°',3],['Extensión',3]],Core:[['Abdominales en polea (2 días)',6]],Femoral:[['Curl femoral',3]],Aductor:[['Aductores',3]],Pantorrilla:[['Pantorrilla',3]]};
var hs=function(v){return Math.round(v*2)/2;};
function grupos(){var n=PER[U.per],ini=52-n,f,tit;
 var chips=[];for(var k=Math.max(ini,46);k<52;k++)chips.push(k);
 if(chips.indexOf(U.gsem)<0)U.gsem=51;
 if(U.gmode==='sem'){f=H.ser[U.gsem]/76;tit='Semana '+(U.gsem+1)+' · '+rango(U.gsem);}else{f=avg(H.ser.slice(ini))/76;tit='Promedio por semana · '+(n===52?'último año':'últimas '+n+' semanas');}
 var s='<div class="seg sm"><button type="button" data-a="gmode" data-v="sem" aria-pressed="'+(U.gmode==='sem')+'">Una semana</button><button type="button" data-a="gmode" data-v="prom" aria-pressed="'+(U.gmode==='prom')+'">Promedio del período</button></div>';
 if(U.gmode==='sem')s+='<div class="wks">'+chips.map(function(k){return '<button type="button" data-a="gsem" data-v="'+k+'" aria-pressed="'+(U.gsem===k)+'">Sem '+(k+1)+(H.dias[k]<4?' ✕':'')+'</button>';}).join('')+'</div>';
 s+='<div class="ct" style="margin-top:10px"><div><h3>'+tit+'</h3><p class="sub">Series sobre 20 por semana. La rayita marca 10.</p></div><button type="button" class="qi" data-a="abre" data-v="x2" aria-expanded="'+!!U.abre.x2+'">'+I.info+'Zonas</button></div>'+(U.abre.x2?'<div class="exp sube"><b class="wa">&lt; 10</b> series: por debajo de lo que suele dar hipertrofia clara. <b class="up">10–20</b>: donde progresa la mayoría. <b>&gt; 20</b>: más costo de recuperación por poco extra.</div>':'');
 var G=Object.keys(DIR).map(function(g){var d=hs(DIR[g]*f),i=hs((IND[g]||0)*f);return [g,d,i,d+i];});
 var bajos=G.filter(function(g){return g[3]<10;}).length;
 s+='<div style="margin-top:6px">'+G.map(function(g,j){var c=zc(g[3]),ab=U.gsel===g[0];
  var row='<button type="button" class="gr" data-a="gsel" data-v="'+g[0]+'" aria-expanded="'+ab+'"><span>'+g[0]+'</span><i><u style="width:'+Math.min(100,g[1]/20*100)+'%;background:'+c+';animation-delay:'+(j*45)+'ms"></u><u style="width:'+Math.min(100,g[2]/20*100)+'%;background:'+c+';opacity:.45;animation-delay:'+(j*45+200)+'ms"></u></i><b>'+co(g[3])+'</b>'+I.der+'</button>';
  if(ab){var hist=H.ser.slice(ini).map(function(x){return hs(DIR[g[0]]*x/76+(IND[g[0]]||0)*x/76);});
   row+='<div class="gd sube">'+(EJM[g[0]]||[]).map(function(e){return '<div class="r"><span>'+e[0]+'</span><b>'+co(hs(e[1]*f))+'</b></div>';}).join('')+lineaFx('g'+j,hist.length>1?hist:[hist[0],hist[0]],(n===52?H.ser.slice(ini):H.ser.slice(ini)).map(function(_,k){return 'S'+(ini+k+1);}),{col:c,banda:[10,20],bandaTxt:'zona 10–20',min:0,max:24,aria:'Series de '+g[0]+' por semana',tip:function(k){return 'Semana '+(ini+k+1)+'<br><b>'+co(hist[k])+' series</b>';}})+'</div>';}
  return '<div class="gx">'+row+'</div>';}).join('')+'</div>';
 s+='<div class="leg"><span><i style="background:var(--grn)"></i>Directas</span><span><i style="background:var(--grn);opacity:.45"></i>Indirectas (×0,5)</span><span><i style="background:var(--yel)"></i>Menos de 10</span></div>';
 s+='<div class="av sube" style="margin-top:12px;padding:10px 12px;border-radius:12px;background:rgba(var(--yelrgb),.12);font-size:13px;color:var(--tx2)"><b class="wa">'+bajos+' de 10 grupos</b> por debajo de 10 series '+(U.gmode==='sem'?'esa semana':'en promedio')+'.</div>';
 return s;}
/* ---------- ejercicio por ejercicio: peso y repeticiones ---------- */
var PLANX=[
 ['Pecho',[['PPB','Press plano con barra','gen_ppb','kg',72.5,8,3,2,2.5,[8,8,7]],['PIM','Press inclinado con mancuernas','pressinclinado','kg',26,10,3,2,2,[10,9,9]],['APC','Aperturas en polea','gen_apc','pl',5,12,3,1,1,[12,12,11]],['PMM','Press militar con mancuernas','pressmilitar','kg',20,10,3,2,2,[10,9,8]],['VLP','Vuelos laterales en polea','vuelospolea','pl',2,15,3,1,1,[15,14,13]],['ETP','Extensión de tríceps en polea','gen_etp','pl',6,12,3,1,1,[12,11,11]]]],
 ['Espalda',[['DPA','Dorsal al pecho abierto','jalon','pl',11,10,3,2,1,[10,10,9]],['RBP','Remo bajo en polea','remopolea','pl',10,10,3,2,1,[10,9,9]],['DPE','Dorsal al pecho estrecho','jalon','pl',10,10,3,2,1,[9,9,8]],['CBP','Curl de bíceps en polea','gen_cbp','pl',5,12,3,1,1,[12,11,10]],['CBI','Curl en banco inclinado','curlinclinado','kg',12,10,3,1,2,[10,10,10]],['ABP','Abdominales en polea','gen_abp','pl',6,15,3,2,1,[15,15,14]]]],
 ['Brazos',[['ETB','Ext. de tríceps en polea con barra','gen_etb','pl',7,12,3,1,1,[12,12,11]],['CBP','Curl de bíceps en polea','gen_cbp','pl',5,12,3,1,1,[12,11,10]],['ETU','Ext. de tríceps unilateral','gen_etu','pl',2,12,3,1,1,[12,12,11]],['CMA','Curl martillo','gen_cma','kg',14,10,3,1,2,[10,10,10]],['ETA','Ext. de tríceps abajo-arriba','gen_eta','pl',4,12,3,1,1,[12,12,11]],['CBI','Curl en banco inclinado','curlinclinado','kg',12,10,3,1,2,[10,10,10]]]],
 ['Pierna',[['SEN','Sentadilla','sentadilla','kg',92.5,6,4,2,2.5,[6,6,6,5]],['PRE','Prensa 45°','prensa45','kg',180,10,3,2,5,[10,10,9]],['EXC','Extensión de cuádriceps','extension','pl',8,12,3,1,1,[12,12,11]],['CFE','Curl femoral','curl','pl',7,12,3,1,1,[12,11,10]],['ADU','Aductores','gen_adu','pl',9,12,3,2,1,[12,12,12]],['PAN','Pantorrilla','gen_pan','kg',70,15,3,1,5,[15,15,14]]]]];
var DIAIDX={Pecho:0,Espalda:1,Brazos:2,Pierna:3};
function buscarEj(id){for(var a=0;a<PLANX.length;a++)for(var b=0;b<PLANX[a][1].length;b++)if(PLANX[a][1][b][0]===id)return {e:PLANX[a][1][b],dia:PLANX[a][0]};}
var HX={};
/* doble progresión simulada: sube reps dentro del rango y, al llegar al tope en todas las series, sube peso */
function histEj(id){if(HX[id])return HX[id];var f=buscarEj(id),e=f.e,dia=DIAIDX[f.dia],u=e[3],w=e[4],top=e[5],lo=top-2,ns=e[6],inc=e[8];
 var seed=0;for(var c=0;c<id.length;c++)seed+=id.charCodeAt(c)*(c+3);function rr(k){var x=Math.sin((k+1)*seed*.913)*43758.5453;return x-Math.floor(x);}
 var p=u==='pl'?.33:.42,cw=0,reps=[];for(var s=0;s<ns;s++)reps.push(lo);var out=[];
 for(var k=0;k<52;k++){var falta=H.dias[k]<=dia,de=k<46&&k%6===5;
  if(falta){out.push(null);continue;}
  if(de){out.push({w:cw,r:reps.slice(0,2).map(function(){return lo;}),de:true});continue;}
  for(var s2=0;s2<ns;s2++){if(rr(k*7+s2)<p-s2*.06)reps[s2]=Math.min(top,reps[s2]+1);if(s2>0&&reps[s2]>reps[s2-1])reps[s2]=reps[s2-1];}
  out.push({w:cw,r:reps.slice()});
  if(reps.every(function(x){return x>=top;})){cw+=inc;for(var s3=0;s3<ns;s3++)reps[s3]=lo+(s3===0?1:0);}}
 /* último dato = lo registrado en el panel; corre toda la curva para que termine en el peso actual */
 var ult=null;for(var k2=51;k2>=0;k2--)if(out[k2]&&!out[k2].de){ult=out[k2];break;}
 var dw=w-(ult?ult.w:0);out.forEach(function(o){if(o)o.w=Math.max(inc,u==='pl'?Math.round(o.w+dw):r1(o.w+dw));});
 if(!out[51]){out[51]={w:w,r:e[9].slice()};}else{out[51].w=w;out[51].r=e[9].slice();delete out[51].de;}
 HX[id]=out;return out;}
function datosEj(id){var d=datos(),h=histEj(id),n=PER[U.per],ini=52-n;
 if(!d.mensual)return {pts:h.slice(ini),lab:d.lab,tip:d.tip};
 return {pts:d.sem.map(function(ks){var best=null;ks.forEach(function(k){var o=h[k];if(o&&!o.de&&(!best||o.w>best.w||(o.w===best.w&&k>best.k)))best={w:o.w,r:o.r,k:k};});return best;}),lab:d.lab,tip:d.tip};}
/* ---------- Por ejercicio: mismo diseño que el panel (línea + área, Peso y Repeticiones, Juntas / Separadas) ---------- */
var EJC={peso:'var(--vio)',reps:'var(--red)'};
var MUSC={PPB:'Pecho',PIM:'Pecho',APC:'Pecho',PMM:'Hombro',VLP:'Hombro',ETP:'Tríceps',ETB:'Tríceps',ETU:'Tríceps',ETA:'Tríceps',DPA:'Espalda',RBP:'Espalda',DPE:'Espalda',CBP:'Bíceps',CBI:'Bíceps',CMA:'Bíceps',ABP:'Core',SEN:'Cuádriceps',PRE:'Cuádriceps',EXC:'Cuádriceps',CFE:'Femoral',ADU:'Aductor',PAN:'Pantorrilla'};
var GMAC={Pierna:['Cuádriceps','Femoral','Aductor','Pantorrilla'],Pecho:['Pecho'],Espalda:['Espalda'],Hombro:['Hombro'],Brazo:['Bíceps','Tríceps'],'Zona media':['Core']};
var macroG=function(g){return Object.keys(GMAC).filter(function(k){return GMAC[k].indexOf(g)>=0;})[0]||'Otros';};
/* lista sin repetidos, en el orden del plan, con el día donde aparece primero */
var EJLIST=(function(){var o=[],vis={};PLANX.forEach(function(d){d[1].forEach(function(e){if(vis[e[0]])return;vis[e[0]]=1;o.push({id:e[0],e:e,dia:d[0],m:MUSC[e[0]]});});});return o;})();
var fmt=function(v){return co(r1(v));};
function resumenEj(x){var h=histEj(x.id),L=null,P=null;for(var k=51;k>=0;k--){if(h[k]&&!h[k].de){if(L==null)L=k;else{P=k;break;}}}
 var tk=function(k){return h[k].w;},tr=function(k){return h[k].r[0];},bk=tk,br=function(k){return h[k].r[h[k].r.length-1];};
 var sum=function(o){return o.r.reduce(function(a,b){return a+b;},0);};
 var igual=0;if(L!=null){var pv=null;for(var k2=L;k2>=0;k2--){var o=h[k2];if(!o||o.de)continue;if(pv&&!(pv.w===o.w&&sum(pv)<=sum(o)))break;igual++;pv=o;}}
 var est=L==null?{c:'',t:'Sin registros'}:P==null?{c:'ac',t:'Nuevo'}:tk(L)>tk(P)||(tk(L)===tk(P)&&sum(h[L])>sum(h[P]))?{c:'ok',t:'Progresa'}:tk(L)<tk(P)?{c:'wa',t:'Bajó'}:igual>=3?{c:'wa',t:'Estancado'}:{c:'',t:'Igual'};
 return {h:h,L:L,P:P,tk:tk,tr:tr,bk:bk,br:br,est:est,igual:igual};}
function dc(v,u,dec){if(!v)return '';var c=v>0?'up':'wa';return '<span class="dc '+c+'">'+(v>0?'+':'−')+co(Math.abs(dec?r1(v):Math.round(v)))+u+'</span>';}
function dcomb(dk,dr){var p=[];if(dk)p.push(dc(dk,' kg',1));if(dr)p.push(dc(dr,Math.abs(dr)===1?' rep':' reps',0));return p.length?p.join(' '):'<span class="dc eq">= igual</span>';}
/* el gráfico doble del panel: paneles con línea + área, número sólo donde cambia, banda en descargas y faltas */
var EJG={};
function ejDual(id,de,e,juntas){var p=de.pts,n=p.length,labels=de.lab,uni=e[3]==='pl'?'placas':'kg';
 var PS={k:'peso',corto:'Peso ('+uni+')',titulo:'Peso ('+uni+'), semana a semana',data:p.map(function(o){return o?o.w:null;}),int:false,u:' '+uni};
 var RS={k:'reps',corto:'Repeticiones',titulo:'Repeticiones por semana',data:p.map(function(o){return o?o.r[0]:null;}),int:true,u:' reps'};
 var notas=p.map(function(o){return !o?{col:'var(--red)',ic:'✕',et:'No entrenó'}:o.de?{col:'var(--cya)',ic:'📉',et:'Descarga'}:null;});
 function svgEj(panels,W,hP,conTit){var mg={t:conTit?34:16,r:10,l:40,gap:50,b:44},iw=W-mg.l-mg.r,paso=iw/n,X=function(i){return mg.l+paso*(i+.5);};
  panels.forEach(function(q,pi){q.y0=mg.t+pi*(hP+mg.gap);var all=q.data.filter(function(v){return v!=null;}),mn=Math.min.apply(null,all),mx=Math.max.apply(null,all),pad=(mx-mn)*.15||Math.max(Math.abs(mx)*.1,1);
   mn=Math.max(0,mn-pad);mx+=pad;if(q.int&&mx-mn<4){var c0=(mx+mn)/2;mn=Math.max(0,c0-2);mx=mn+4;}var t=nice(mn,mx,4,q.int);q.lo=t.lo;q.hi=t.hi;q.step=t.step;});
  var top=mg.t,bot=panels[panels.length-1].y0+hP,H=bot+mg.b,uid=id+panels.map(function(q){return q.k;}).join(''),s='';
  s+='<defs>'+panels.map(function(q){return '<linearGradient id="g'+q.k+uid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+EJC[q.k]+'" stop-opacity=".32"/><stop offset="1" stop-color="'+EJC[q.k]+'" stop-opacity="0"/></linearGradient>';}).join('')+'</defs>';
  notas.forEach(function(no,i){if(!no)return;var w0=n>13?Math.max(3,paso*.9):Math.min(paso*.68,40);s+='<g class="ar"><rect x="'+(X(i)-w0/2)+'" y="'+(top-4)+'" width="'+w0+'" height="'+(bot-top+8)+'" fill="'+no.col+'" fill-opacity=".11" rx="7"/><line x1="'+X(i)+'" x2="'+X(i)+'" y1="'+top+'" y2="'+bot+'" stroke="'+no.col+'" stroke-dasharray="3 4" stroke-opacity=".5"/></g>';});
  panels.forEach(function(q){var Y=function(v){return q.y0+hP-(v-q.lo)/(q.hi-q.lo)*hP;},col=EJC[q.k];
   if(conTit)s+='<text x="0" y="'+(q.y0-16)+'" fill="var(--tx3)" font-size="12.5" font-weight="600">'+q.corto+'</text>';
   for(var v=q.lo;v<=q.hi+1e-9;v+=q.step){s+='<line x1="'+mg.l+'" x2="'+(W-mg.r)+'" y1="'+Y(v)+'" y2="'+Y(v)+'" stroke="var(--line)"/><text x="'+(mg.l-8)+'" y="'+(Y(v)+4)+'" fill="var(--tx4)" font-size="11" text-anchor="end">'+tick(v,q.step)+'</text>';}
   var idx=[];q.data.forEach(function(v,i){if(v!=null)idx.push(i);});if(!idx.length)return;var p0=idx[0],p1=idx[idx.length-1];
   var segs=[],cur=null;q.data.forEach(function(v,i){if(v==null){return;}if(!cur||i-cur.u>1){cur={pts:[],u:i};segs.push(cur);}cur.pts.push(i);cur.u=i;});
   var d=idx.map(function(i,j){return (j?'L':'M')+X(i).toFixed(1)+' '+Y(q.data[i]).toFixed(1);}).join(' ');
   var dl=function(i){return Math.round(150+(p1>p0?(i-p0)/(p1-p0):1)*1100);};
   s+='<path class="cha" d="'+d+' L'+X(p1)+' '+(q.y0+hP)+' L'+X(p0)+' '+(q.y0+hP)+'Z" fill="url(#g'+q.k+uid+')"/><path class="chl" pathLength="1" d="'+d+'" fill="none" stroke="'+col+'" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>';
   var prev=null;idx.forEach(function(i){var v=q.data[i];var muchos=n>13,camb=i===p0||i===p1||q.data[i]!==q.data[i-1]||q.data[i]!==q.data[i+1];if(!muchos||camb)s+='<circle class="pt p'+i+'" style="--dl:'+dl(i)+'ms" cx="'+X(i)+'" cy="'+Y(v)+'" r="3.8" fill="var(--surf)" stroke="'+col+'" stroke-width="2.4"/>';
    if(i===p1)s+='<circle class="chpulse" style="--dl:'+(dl(i)+120)+'ms" cx="'+X(i)+'" cy="'+Y(v)+'" r="4" fill="none" stroke="'+col+'" stroke-width="2"/>';
    var cambia=prev===null||v!==prev;prev=v;if((cambia&&n<=13)||i===p1||(n>13&&i===p0))s+='<text class="chlab" style="--dl:'+(dl(i)+80)+'ms" x="'+Math.min(W-mg.r-6,X(i))+'" y="'+(Y(v)-11)+'" fill="var(--tx)" font-size="11.5" font-weight="700" text-anchor="'+(i===p1&&X(i)>W-mg.r-14?'end':'middle')+'">'+(q.int?Math.round(v):fmt(v))+'</text>';});});
  var anchoEtq=Math.max.apply(null,labels.map(function(l){return String(l).length;}))*6.6+12,pasoEtq=Math.max(1,Math.ceil(anchoEtq/paso));
  labels.forEach(function(l,i){if(pasoEtq>1&&i!==n-1&&(i%pasoEtq||(n-1-i)*paso<anchoEtq))return;s+='<text x="'+X(i)+'" y="'+(bot+20)+'" fill="'+(p[i]?'var(--tx3)':'var(--tx4)')+'" font-size="11" text-anchor="middle">'+l+'</text>';});
  if(n<=13)notas.forEach(function(no,i){if(no)s+='<text class="chlab" style="--dl:900ms" x="'+X(i)+'" y="'+(bot+38)+'" font-size="11.5" text-anchor="middle" fill="'+no.col+'">'+no.ic+'</text>';});
  s+='<line class="ch" x1="0" x2="0" y1="'+top+'" y2="'+bot+'" stroke="var(--vio)" stroke-dasharray="4 4" opacity="0"/>';
  for(var i=0;i<n;i++)s+='<rect class="hit" data-g="'+id+'" data-i="'+i+'" x="'+(X(i)-paso/2)+'" y="'+(top-10)+'" width="'+paso+'" height="'+(bot-top+20)+'" fill="transparent"/>';
  return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="display:block;overflow:visible" role="img" aria-label="'+panels.map(function(q){return q.titulo;}).join(' y ')+'">'+s+'</svg>';}
 EJG[id]={X:null,tip:function(i){var o=p[i],no=notas[i];var h='<div class="h">'+de.tip[i]+'</div>';
  h+='<div class="r"><span><i style="background:'+EJC.peso+'"></i>Peso</span><b>'+(o?fmt(o.w)+PS.u:'—')+'</b></div><div class="r"><span><i style="background:'+EJC.reps+'"></i>Repeticiones</span><b>'+(o?o.r[0]+' reps':'—')+'</b></div>';
  if(o)h+='<div class="r"><span style="padding-left:14px">Todas las series</span><b>'+o.r.join(' · ')+'</b></div>';
  if(no)h+='<div class="rn" style="color:'+no.col+'">'+no.ic+' '+no.et+'</div>';return h;}};
 var W=340;
 if(juntas)return '<div class="ejch" data-g="'+id+'">'+svgEj([PS,RS],W,112,true)+'<div class="ttp" hidden></div></div>';
 return '<div class="ejch" data-g="'+id+'"><div class="glbl"><i style="background:'+EJC.peso+'"></i>'+PS.titulo+'</div>'+svgEj([PS],W,140,false)+'<div class="glbl" style="margin-top:10px"><i style="background:'+EJC.reps+'"></i>'+RS.titulo+'</div>'+svgEj([RS],W,140,false)+'<div class="ttp" hidden></div></div>';}
function nice(min,max,n,ent){var span=(max-min)||Math.abs(max)||1,raw=span/Math.max(1,n-1),mag=Math.pow(10,Math.floor(Math.log10(raw))),f=raw/mag,step=(f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*mag;if(ent)step=Math.max(1,Math.round(step));return {lo:Math.floor(min/step+1e-9)*step,hi:Math.ceil(max/step-1e-9)*step,step:step};}
function tick(v,step){var dec=step>=1?0:(step>=.1?1:2);return (Math.round(v*100)/100).toFixed(dec).replace('.',',');}
/* globo y cruz sincronizados entre los dos gráficos */
function ejHover(hit,ev){var g=hit.dataset.g,i=+hit.dataset.i,box=hit.closest('.ejch'),x=+hit.getAttribute('x')+(+hit.getAttribute('width'))/2;
 box.querySelectorAll('svg').forEach(function(svg){var ch=svg.querySelector('.ch');ch.setAttribute('x1',x);ch.setAttribute('x2',x);ch.setAttribute('opacity','.65');svg.querySelectorAll('.pt').forEach(function(c){c.setAttribute('r','3.8');});svg.querySelectorAll('.p'+i).forEach(function(c){c.setAttribute('r','6');});});
 var tt=box.querySelector('.ttp'),r=box.getBoundingClientRect();tt.hidden=false;tt.innerHTML=EJG[g].tip(i);var svg=hit.ownerSVGElement,sr=svg.getBoundingClientRect(),px=sr.left-r.left+x/340*sr.width,w=tt.offsetWidth;
 var left=px+14;if(left+w>r.width)left=px-w-14;tt.style.left=Math.max(0,left)+'px';tt.style.top=Math.max(0,(ev.clientY-r.top)-tt.offsetHeight/2)+'px';}
function ejOff(box){box.querySelectorAll('.ch').forEach(function(c){c.setAttribute('opacity','0');});box.querySelectorAll('.pt').forEach(function(c){c.setAttribute('r','3.8');});var t=box.querySelector('.ttp');if(t)t.hidden=true;}
document.addEventListener('pointermove',function(ev){var hit=ev.target.closest&&ev.target.closest('.ejch .hit');document.querySelectorAll('.ejch').forEach(function(b){if(!hit||!b.contains(hit))ejOff(b);});if(hit)ejHover(hit,ev);});
document.addEventListener('pointerdown',function(ev){var hit=ev.target.closest&&ev.target.closest('.ejch .hit');if(hit)ejHover(hit,ev);});
function animar(el){if(!el)return;el.classList.remove('animando');void el.offsetWidth;el.classList.add('animando');}

function ejercicios(){var gm=U.ejGm||'Todos',grupos=Object.keys(GMAC).filter(function(g){return EJLIST.some(function(x){return macroG(x.m)===g;});});
 var lista=gm==='Todos'?EJLIST:EJLIST.filter(function(x){return macroG(x.m)===gm;});if(!lista.some(function(x){return x.id===U.ejSel;}))U.ejSel=lista[0].id;
 var pos=lista.map(function(x){return x.id;}).indexOf(U.ejSel),x=lista[pos],e=x.e,R=resumenEj(x),de=datosEj(x.id),juntas=true;
 var s='<div class="wks" style="margin-top:2px">'+['Todos'].concat(grupos).map(function(g){var c=g==='Todos'?EJLIST.length:EJLIST.filter(function(y){return macroG(y.m)===g;}).length;return '<button type="button" data-a="ejGm" data-v="'+g+'" aria-pressed="'+(gm===g)+'">'+(g==='Todos'?'Todos':g)+' · '+c+'</button>';}).join('')+'</div>';
 /* 1. progresión: el gráfico del panel */
 s+='<section class="card"><div class="ejtop"><button type="button" class="ib" data-a="ejNav" data-v="'+(pos-1)+'" aria-label="Ejercicio anterior"'+(pos>0?'':' disabled')+'>'+I.atras+'</button><div class="ejtt"><span class="ey">Progresión · '+(pos+1)+' de '+lista.length+(gm!=='Todos'?' · '+gm.toLowerCase():'')+'</span><h3>'+e[1]+'</h3><span class="sub" style="display:block">'+x.m+' · '+x.dia+' · serie más pesada de cada semana</span></div><button type="button" class="ib" data-a="ejNav" data-v="'+(pos+1)+'" aria-label="Ejercicio siguiente"'+(pos<lista.length-1?'':' disabled')+'>'+I.der+'</button></div>';
 s+='<div class="ejvh">'+'<div class="glbl"><i style="background:'+EJC.peso+'"></i>Peso <i style="background:'+EJC.reps+';margin-left:10px"></i>Repeticiones</div>'+'</div>';
 s+='<div id="ejGraf" class="animando">'+ejDual('d'+x.id,de,e,juntas)+'</div><div class="leg" style="margin-top:2px"><span><i style="background:var(--red);opacity:.45"></i>No entrenó</span><span><i style="background:var(--cya);opacity:.45"></i>Descarga</span></div><p class="sub" style="margin-top:6px">Tocá o deslizá sobre el gráfico para ver cada semana.</p></section>';
 /* 2. ficha del ejercicio, como la tarjeta del panel */
 var L=R.L,P=R.P,val=de.pts.filter(Boolean),f=val.length?val[0].w:null,lo=e[5]-2,top=e[5],ult=R.h[L],listo=ult&&ult.r.every(function(v){return v>=top;});
 var nx=listo?{t:'Subí a '+fmt(ult.w+e[8])+' '+(e[3]==='pl'?'placas':'kg'),s:'Llegó al tope ('+top+' reps) en todas las series. Empezá en '+lo+'–'+(lo+1)+' reps con el peso nuevo.'}:{t:'Mantené '+fmt(ult.w)+' '+(e[3]==='pl'?'placas':'kg'),s:'Buscá '+top+' reps en todas las series antes de subir.'};
 if(R.est.t==='Estancado')nx={t:'Probá un drop set en la última serie',s:R.igual+' semanas igual con '+fmt(ult.w)+'. Sumá una rep por serie antes de cambiar el peso.'};
 s+='<section class="card ejf"><div class="ct"><div><h3>'+e[1]+'</h3><p class="sub">'+x.m+' · '+e[6]+' series · RIR '+e[7]+'</p></div><span class="chip '+R.est.c+'">'+R.est.t+'</span></div>';
 s+='<div class="ejt2"><div><span class="lbl">Serie más pesada</span><b>'+fmt(R.tk(L))+' × '+R.tr(L)+'</b><span class="s">'+(P!=null?dcomb(R.tk(L)-R.tk(P),R.tr(L)-R.tr(P)):'primera semana')+'</span></div><div><span class="lbl">Última serie</span><b>'+fmt(R.bk(L))+' × '+R.br(L)+'</b><span class="s">'+(P!=null?dcomb(R.bk(L)-R.bk(P),R.br(L)-R.br(P)):'—')+'</span></div></div>';
 s+='<div class="ejrows"><div><span>Cambio en el período</span><b class="'+(ult.w>f?'up':'')+'">'+(ult.w-f>0?'+':'')+fmt(ult.w-f)+' '+(e[3]==='pl'?'pl':'kg')+'</b><em>'+(f?((ult.w-f)/f*100>=0?'+':'')+Math.round((ult.w-f)/f*100)+' % · '+val.length+' semanas con registro':'')+'</em></div><div><span>Rango de repeticiones</span><b>'+lo+'–'+top+'</b><em>doble progresión</em></div></div>';
 s+='<div class="ejnext"><span class="lbl">Próxima sesión · sugerencia</span><b>'+nx.t+'</b><span class="s">'+nx.s+'</span></div></section>';
 /* 3. ejercicio por ejercicio: la tabla del panel hecha lista */
 var dias=gm==='Todos'?PLANX.map(function(d){return d[0];}):[null];
 s+='<div class="sh"><h2>'+(gm==='Todos'?'Ejercicio por ejercicio':gm+' · todos sus ejercicios')+'</h2><span class="mu" style="font-size:12.5px">vs la sesión anterior</span></div><section class="card ejtab" style="padding:4px 14px 8px">';
 s+='<div class="eth"><span>Ejercicio</span><span>Serie más pesada</span><span>Tendencia</span></div>';
 dias.forEach(function(d){var items=lista.filter(function(y){return d==null||y.dia===d;});if(!items.length)return;if(d)s+='<div class="etd">'+d+'</div>';
  s+=items.map(function(y){var Q=resumenEj(y),dd=datosEj(y.id).pts.filter(Boolean).map(function(o){return o.w;});
   return '<button type="button" class="etr'+(y.id===U.ejSel?' sel':'')+'" data-a="ejSel" data-v="'+y.id+'"><span class="nm">'+y.e[1]+(Q.est.t!=='Igual'?'<span class="chip '+Q.est.c+'">'+Q.est.t+'</span>':'')+'</span><span class="v"><b>'+fmt(Q.tk(Q.L))+' <small>×</small> '+Q.tr(Q.L)+'</b>'+(Q.P!=null?dcomb(Q.tk(Q.L)-Q.tk(Q.P),Q.tr(Q.L)-Q.tr(Q.P)):'')+'</span><span class="tr">'+spark(dd.length>1?dd:[dd[0],dd[0]],'var(--vio)',64,24)+'</span></button>';}).join('');});
 s+='</section>';
 return s;}

function vista(){
 var s=hd('Tu evolución','Progreso');
 s+='<div class="seg" style="margin-bottom:10px"><button type="button" data-a="tab" data-v="carga" aria-pressed="'+(U.tab==='carga')+'">Carga de trabajo</button><button type="button" data-a="tab" data-v="ej" aria-pressed="'+(U.tab==='ej')+'">Por ejercicio</button></div>';
 s+='<div class="stk">'+per(U.per)+'</div>';
 if(U.tab==='ej')return s+'<div id="sEj">'+ejercicios()+'</div>';
 s+='<div id="sKpi" class="sube">'+kpis()+'</div>';
 s+='<div class="sh"><h2>Carga de trabajo · semana a semana</h2></div><section class="card sube" id="sCarga">'+carga()+'</section>';
 s+='<div class="sh"><h2>Volumen por grupo muscular</h2></div><section class="card sube" id="sGr">'+grupos()+'</section>';
 return s;}
function pintar(){document.getElementById('view').innerHTML=vista();contar();}
function parcial(id,fn){var el=document.getElementById(id);if(el){el.innerHTML=fn();}}
function accion(a,v){
 if(a==='per'){U.per=v;pintar();return;}
 if(a==='tab'){U.tab=v;pintar();return;}
 if(a==='met'){U.met=v;parcial('sCarga',carga);return;}
 if(a==='abre'){U.abre[v]=!U.abre[v];if(v==='x1')parcial('sCarga',carga);else parcial('sGr',grupos);return;}
 if(a==='gmode'){U.gmode=v;parcial('sGr',grupos);return;}
 if(a==='gsem'){U.gsem=+v;parcial('sGr',grupos);return;}
 if(a==='gsel'){U.gsel=U.gsel===v?null:v;parcial('sGr',grupos);return;}
 if(a==='ejGm'){U.ejGm=v;parcial('sEj',ejercicios);return;}
 if(a==='ejSel'){U.ejSel=v;parcial('sEj',ejercicios);var t=document.getElementById('sEj');if(t)window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-130,behavior:'smooth'});return;}
 if(a==='ejNav'){var gm=U.ejGm||'Todos',l=gm==='Todos'?EJLIST:EJLIST.filter(function(x){return macroG(x.m)===gm;});if(l[+v])U.ejSel=l[+v].id;parcial('sEj',ejercicios);return;}
 if(a==='ejv'){U.ejv=v;parcial('sEj',ejercicios);return;}}
'''

html = gp.pagina('', 'Progreso v2', CSS, JS + "\nmarco();pintar();\nsetTimeout(function(){if(getComputedStyle(document.body).paddingTop==='54px')document.documentElement.classList.add('enmarco');},60);")
# el pintar() común re-dibuja todo en cada clic: acá cada acción decide qué sección re-dibujar
html = html.replace("document.addEventListener('click',function(ev){var b=ev.target.closest('[data-a]');if(!b||b.id==='tMod')return;accion(b.dataset.a,b.dataset.v,b);pintar();});",
                    "document.addEventListener('click',function(ev){var b=ev.target.closest('[data-a]');if(!b||b.id==='tMod')return;accion(b.dataset.a,b.dataset.v,b);});")
html = html.replace('<title>Progreso  · Progreso v2</title>', '<title>Progreso · versión 2</title>')
open(os.path.join(D, 'bocetos', 'progreso.html'), 'w').write(html)
print('ok progreso v2', len(html))
