# Arma la app completa (bocetos/rediseno.html) a partir de la base del rediseño:
#  - mete Progreso v2 (gen_progreso2.py) adentro, en un módulo PROG
#  - reemplaza el Calendario por el rediseño (cal_nuevo.js)
import os, re, importlib.util
D = os.path.dirname(os.path.abspath(__file__))
def mod(n):
    sp = importlib.util.spec_from_file_location(n, os.path.join(D, n + '.py')); m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m); return m
gp = mod('gen_progreso'); gp2 = mod('gen_progreso2')
s = open(os.path.join(D, '_base_rediseno.html')).read()

def entre(txt, a, b, nuevo):
    i = txt.index(a); j = txt.index(b, i); return txt[:i] + nuevo + txt[j:]

# ---------- Progreso v2 como módulo ----------
HELP_PROG = r'''
var hd=function(ey,t,p){return '<div class="hd"><span class="ey">'+ey+'</span><h1>'+t+'</h1>'+(p?'<p>'+p+'</p>':'')+'</div>';};
var per=function(sel,a){return '<div class="per">'+['4 sem','6 sem','3 m','6 m','1 año'].map(function(x){return '<button type="button" data-a="'+(a||'per')+'" data-v="'+x+'" aria-pressed="'+(sel===x)+'">'+x+'</button>';}).join('')+'</div>';};
var zc=function(v){return v>=10?(v>20?'var(--vio)':'var(--grn)'):'var(--yel)';};
'''
js = HELP_PROG + gp2.JS
ACC = ['per', 'met', 'abre', 'gmode', 'gsem', 'gsel', 'tab', 'ejGm', 'ejSel', 'ejNav', 'ejv']
js = re.sub(r'data-a="(%s)"' % '|'.join(ACC), r'data-a="p_\1"', js)
js = js.replace("(a||'per')", "(a||'p_per')")
PROG = ('/* ================= Progreso (módulo) ================= */\nvar PROG=(function(){\nvar U={};\n' + js +
        '\nreturn {vista:vista,accion:accion,contar:contar,histEj:histEj,PLANX:PLANX,H:H};\n})();\n')
s = s.replace('/* ================= estado ================= */', PROG + '/* ================= estado ================= */', 1)
s = entre(s, 'function vPro(){', '/* ---------- Macros ---------- */', 'function vPro(){return PROG.vista();}\n')
s = s.replace(" if(b.id==='tMod')return;", " if(b.id==='tMod')return;\n if(a.indexOf('p_')===0){PROG.accion(a.slice(2),v);return;}", 1)
s = s.replace("function despues(){", "function despues(){\n if(U.tab==='pro'&&!U.pila.length)PROG.contar();", 1)
css_prog = gp.CSS + gp2.CSS
s = s.replace('</style></head>', '/* ---------- Progreso v2 ---------- */' + css_prog + '</style></head>', 1)

# ---------- Calendario nuevo ----------
cal = open(os.path.join(D, 'cal_nuevo.js')).read() + '\n' + open(os.path.join(D, 'cal_bocetos.js')).read()
s = entre(s, '/* ---------- Calendario ---------- */\nfunction vCal(){', '/* ---------- Progreso ---------- */', cal + '\n')
s = s.replace("cal:{sel:30},", "cal:{sel:'2026-9-30',mes:9,w:0,mx:9},", 1)
HOJA_MOVER = r''' if(h.t==='mover'){var fm=diaInfo(dk(h.k)),O=opcionesMover(h.k),rec=fm.e==='fa';
  s='<h2>'+(rec?'Recuperar ':'Mover ')+GFULL[fm.g]+'</h2><p class="sub">'+(rec?'Faltó el ':'Planificado para el ')+DSEM[dk(h.k).getDay()].toLowerCase()+' '+dk(h.k).getDate()+'. ¿A qué día lo pasás?</p>'+O.map(function(o,j){return '<button type="button" class="op2" data-a="destino" data-v="'+j+'" aria-pressed="'+(h.sel===j)+'"><span class="d">'+DSEM[o.d.getDay()].slice(0,3)+'<b>'+o.d.getDate()+'</b></span><span><b class="t">'+DSEM[o.d.getDay()]+' '+o.d.getDate()+'</b><span class="s">'+o.txt+'</span></span><span class="'+o.est[0]+'">'+o.est[1]+'</span></button>';}).join('')+
  (rec?'':'<p class="sub" style="margin-top:10px">El día que queda libre no cuenta como falta.</p>')+'<button type="button" class="pri full" style="margin-top:12px" data-a="confMover"'+(O.length?'':' disabled')+'>'+(O.length?(rec?'Recuperar el ':'Mover al ')+DSEM[O[h.sel].d.getDay()].toLowerCase()+' '+O[h.sel].d.getDate():'Sin días libres cerca')+'</button>';}
 if(h.t==='dia'){s=detalleDia(dk(h.k)).replace('<div class="sh">','<div class="sh" style="margin-top:0">');}
 if(h.t==='ses'){var dd=dk(h.k),fi=diaInfo(dd),ss=sesDe(fi.g,dd);s='<h2>'+GFULL[fi.g]+'</h2><p class="sub">'+DSEM[dd.getDay()]+' '+dd.getDate()+' de '+MESES_L[dd.getMonth()]+' · '+GSER[fi.g]+' series</p><div class="lista" style="margin-top:8px">'+ss.map(function(x){return '<div class="sx"><span>'+x.n+'</span><b>'+(x.o?co(x.o.w)+' '+x.u+' × '+x.o.r.join(' · '):'—')+'</b>'+(x.sube?'<span class="chip ok">subió</span>':'<span></span>')+'</div>';}).join('')+'</div><button type="button" class="pri full" style="margin-top:14px" data-a="cerrar">Listo</button>';}
'''
s = entre(s, " if(h.t==='mover'){", " if(h.t==='var'){", HOJA_MOVER)
ACC_CAL = r''' case 'dia':U.cal.sel=v;var dd0=dk(v);if(dd0.getMonth()!==U.cal.mes)U.cal.mes=dd0.getMonth();break;
 case 'calMes':U.cal.mes=Math.max(8,Math.min(10,U.cal.mes+(+v)));break;
 case 'mover':U.hoja={t:'mover',k:v||U.cal.sel,sel:0};break;
 case 'destino':U.hoja.sel=+v;break;
 case 'confMover':var hm=U.hoja,om=opcionesMover(hm.k)[hm.sel],fm0=diaInfo(dk(hm.k));if(!om)break;if(fm0.e==='fa')MOVS[om.k]={g:fm0.g,rec:true,de:hm.k};else{MOVS[hm.k]={libre:true};MOVS[om.k]={g:fm0.g,de:hm.k};}U.hoja=null;U.cal.sel=om.k;U.cal.mes=om.d.getMonth();toast(GFULL[fm0.g]+(fm0.e==='fa'?' recuperado el ':' movido al ')+DSEM[om.d.getDay()].toLowerCase()+' '+om.d.getDate());break;
 case 'libre':MOVS[v]={libre:true};toast('Listo: ese día queda libre y no cuenta como falta');break;
 case 'verSes':U.hoja={t:'ses',k:v};break;
 case 'diaH':U.cal.sel=v;U.hoja={t:'dia',k:v};break;
 case 'calW':U.cal.w=Math.max(-8,Math.min(2,(U.cal.w||0)+(+v)));window.__forzar=true;break;
 case 'calMx':U.cal.mx=U.cal.mx===+v?-1:+v;break;
 case 'calMet':U.cal.met=v;window.__forzar=true;break;
 case 'hvLog':toast('Acá vas a poder cargar un entreno de ese día');return;
'''
s = entre(s, " case 'dia':", " case 'proV':", ACC_CAL)
CSS_CAL = r'''
/* ---------- Calendario (rediseño) ---------- */
/* calendario como la app actual */
.calhd{display:flex;align-items:center;gap:8px}
.calhd h2{flex:1;margin:0;font-size:18px;text-transform:capitalize;text-align:center}
.calhd .xb{width:44px;height:44px;border-radius:12px;border:1px solid var(--line2);background:transparent;color:var(--tx2);display:flex;align-items:center;justify-content:center}
.calhd .xb svg{width:18px;height:18px}
.calhd .xb:disabled{opacity:.3}
.kgr{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:12px}
.kpa{padding:10px 12px;border-radius:14px;background:var(--surf2);border:1px solid var(--line)}
.kpa small{display:block;font-size:12px;color:var(--tx3);font-weight:600}
.kpa b{font-size:22px;letter-spacing:-.03em}
.kpa em{font-style:normal;font-size:13px;color:var(--tx3);font-weight:500;margin-left:3px}
.calx{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;margin-top:12px}
.calx .dow{font-size:12px;color:var(--tx3);text-align:center;font-weight:600;padding-bottom:2px}
.cd{position:relative;min-height:58px;border-radius:12px;border:1px solid var(--line);background:rgba(var(--fg),.02);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:6px 2px 4px;gap:1px;min-width:0;color:var(--tx2)}
.entra .cd{animation:pop .3s cubic-bezier(.3,1.4,.5,1) both}
.cd b{font-size:14px;font-weight:700;color:var(--tx)}
.cd small{font-size:9.5px;letter-spacing:-.2px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;color:var(--tx3)}
.cd.ok{background:rgba(var(--grnrgb),.11);border-color:rgba(var(--grnrgb),.32)}
.cd.ok small{color:var(--grn)}
.cd.no{background:rgba(229,96,74,.09);border-color:rgba(229,96,74,.32)}
.cd.no small{color:var(--red)}
.cd.vac small{color:var(--cya)}
.cd.plan{border-style:dashed;border-color:var(--line2)}
.cd.plan small{color:var(--a1)}
.cd.fut b{color:var(--tx3)}
.cd.hoy{box-shadow:inset 0 0 0 1.5px var(--a1)}
.cd.sel{box-shadow:0 0 0 2px var(--a1),0 10px 22px -12px rgba(var(--a1rgb),.9);z-index:1}
.cd.pad{visibility:hidden}
.legend{display:flex;gap:6px 14px;flex-wrap:wrap;margin-top:12px;font-size:12.5px;color:var(--tx3)}
.legend span{display:inline-flex;align-items:center;gap:6px}
.legend i{display:inline-block;width:10px;height:10px;border-radius:3px}
#calDet h3{margin:0;font-size:17px}
.ph2{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
.dex{display:flex;flex-direction:column;margin-top:10px}
.dex>div{display:grid;grid-template-columns:1fr auto;gap:2px 10px;padding:10px 0;border-top:1px solid var(--line)}
.dex b{font-size:14px}
.dex span{font-size:13.5px;font-weight:700;text-align:right}
.dex small{grid-column:1/-1;font-size:12px;color:var(--tx3)}

/* bocetos inspirados en apps de deporte */
.hvk{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.hvk>div{display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:10px;align-items:center;padding:12px 14px;border-radius:18px;background:var(--surf);border:1px solid var(--line)}
.hvi{grid-row:1/3;font-size:22px}
.hvk b{font-size:24px;letter-spacing:-.03em;line-height:1}
.hvk span:last-child{font-size:11.5px;color:var(--tx3);line-height:1.3}
.hvm{margin-bottom:12px}
.hvg{display:grid;grid-template-columns:repeat(7,1fr);gap:6px 4px;margin-top:10px}
.hvg .dw{font-size:11px;font-weight:700;color:var(--tx4);text-align:center}
.hvd{justify-self:center;width:36px;height:36px;border-radius:50%;border:0;background:transparent;font-size:14px;font-weight:600;color:var(--tx3);animation:pop .3s cubic-bezier(.3,1.4,.5,1) both}
.hvd.ok{background:var(--a1);color:var(--ink);font-weight:700;box-shadow:0 6px 14px -8px rgba(var(--a1rgb),.9)}
.hvd.cur{background:rgba(var(--a1rgb),.55)}
.hvd.pl{box-shadow:inset 0 0 0 1.5px rgba(var(--a1rgb),.55);color:var(--tx)}
.hvd.hoyc{outline:2px solid var(--tx);outline-offset:2px}
.tl{padding:12px 10px}
.tlh,.tlr{display:grid;grid-template-columns:40px repeat(7,1fr) 50px;align-items:center}
.tlh span{font-size:10.5px;font-weight:700;color:var(--tx4);text-align:center}
.tlh .r,.tlr .r{text-align:right}
.tlr{min-height:48px;border-top:1px solid var(--line)}
.tlr.cur{background:rgba(var(--a1rgb),.07);border-radius:12px;border-top-color:transparent}
.tlw{display:flex;flex-direction:column;align-items:center;font-size:13px;font-weight:700;line-height:1.1}
.tlw small{font-size:9.5px;color:var(--tx4);font-weight:600}
.tc{display:flex;align-items:center;justify-content:center;height:46px}
.bub2{width:var(--s);height:var(--s);border-radius:50%;border:0;padding:0;background:var(--g);box-shadow:0 0 0 3px color-mix(in srgb,var(--g) 22%,transparent);font-size:9px;color:#fff;animation:pop .45s cubic-bezier(.3,1.5,.5,1) both}
.bub2.pl,.bub2.hoy{background:transparent;box-shadow:inset 0 0 0 1.5px var(--g)}
.bub2.fa{background:rgba(229,96,74,.18);box-shadow:none;color:var(--red);font-weight:800}
.bub2.au{background:transparent;box-shadow:none;color:var(--cya)}
.bub2.cur{opacity:.7}
.tlt{display:flex;flex-direction:column;align-items:flex-end;line-height:1.1}
.tlt b{font-size:14px}
.tlt small{font-size:9.5px;color:var(--tx4)}
.tpk{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.tpk div{padding:9px 10px;border-radius:13px;background:var(--surf2);border:1px solid var(--line)}
.tpk b{display:block;font-size:19px;letter-spacing:-.02em}
.tpk small{font-size:12px;color:var(--tx3);font-weight:500}
.tpb{height:8px;border-radius:4px;background:var(--surf3);margin-top:12px;overflow:hidden}
.tpb i{display:block;height:100%;background:linear-gradient(90deg,var(--grn),var(--a1));border-radius:4px;transform-origin:left;animation:crecex .9s cubic-bezier(.2,.8,.2,1) both}
.tpd{display:grid;grid-template-columns:44px 1fr;gap:10px;align-items:stretch;margin-bottom:8px}
.tpd .libre{align-self:center;font-size:12.5px;color:var(--tx4)}
.tpc{position:relative;display:flex;flex-direction:column;gap:6px;padding:11px 12px 11px 16px;border-radius:16px;border:1px solid var(--line);background:var(--surf);text-align:left;overflow:hidden;animation:entraDer .45s cubic-bezier(.2,.8,.2,1) both}
.tpc::before{content:"";position:absolute;left:0;top:0;bottom:0;width:5px;background:var(--line2)}
.tpc.v::before{background:var(--grn)}.tpc.a::before{background:var(--yel)}.tpc.n::before{background:#ef8d45}.tpc.r::before{background:#e5604a}
.tpc.pl,.tpc.hoy,.tpc.cur{border-style:dashed;background:transparent}
.tpc.pl::before,.tpc.hoy::before,.tpc.cur::before{background:var(--g);opacity:.6}
.tpc.au::before{background:var(--cya)}
.tpt{display:flex;justify-content:space-between;gap:8px;align-items:center}
.tpt b{font-size:14px}
.tpe{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:rgba(var(--fg),.07);color:var(--tx2);white-space:nowrap}
.tpc.v .tpe{background:rgba(var(--grnrgb),.15);color:var(--grn)}.tpc.a .tpe{background:rgba(var(--yelrgb),.16);color:var(--yel)}.tpc.r .tpe{background:rgba(229,96,74,.15);color:var(--red)}
.tpe.pl{background:rgba(var(--a1rgb),.14);color:var(--a1)}
.tpm{display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11.5px;color:var(--tx3)}
.tpm b{display:block;font-size:12.5px;color:var(--tx);font-weight:600}
.tpbar{height:5px;border-radius:3px;background:var(--surf3);overflow:hidden}
.tpbar i{display:block;height:100%;background:var(--g);transform-origin:left;animation:crecex .8s cubic-bezier(.2,.8,.2,1) .2s both}
.afd{display:grid;grid-template-columns:120px 1fr;gap:16px;align-items:center}
.afr svg{width:120px;height:120px}
.afl{display:flex;flex-direction:column;gap:6px;font-size:12.5px;color:var(--tx3)}
.afl>b{font-size:17px;color:var(--tx)}
.afl span{display:flex;align-items:center;gap:6px}
.afl span b{margin-left:auto;color:var(--tx);font-size:13px}
.afl i{width:9px;height:9px;border-radius:50%;display:inline-block}
.afm{display:grid;grid-template-columns:repeat(7,1fr);gap:6px 4px}
.afm .dw{font-size:11px;font-weight:700;color:var(--tx4);text-align:center}
.afc{display:flex;flex-direction:column;align-items:center;gap:1px;border:0;background:transparent;padding:3px 0;border-radius:12px;animation:pop .35s cubic-bezier(.3,1.4,.5,1) both}
.afc .n{position:relative;font-size:11.5px;font-weight:700;color:var(--tx2)}
.afc .n i{position:absolute;top:1px;right:-7px;width:5px;height:5px;border-radius:50%;background:var(--grn)}
.afc .n.hoyc{color:var(--a1)}
.afc svg{width:100%;max-width:40px}
.afc.sel{background:rgba(var(--a1rgb),.14)}
.gpb{display:flex;gap:4px;margin-top:14px}
.gpb i{flex:1;height:10px;border-radius:5px;background:var(--surf3);animation:pop .4s both}
.gpb i.ok{background:var(--grn)}.gpb i.cur{background:linear-gradient(90deg,var(--a1) 55%,var(--surf3) 55%)}.gpb i.des{flex:.7}
.gpbl{display:flex;gap:4px;margin-top:4px}
.gpbl span{flex:1;font-size:10.5px;color:var(--tx4);text-align:center;font-weight:600}
.gpbl span:last-child{flex:.7}
.gw.cur{border-color:rgba(var(--a1rgb),.55);box-shadow:0 0 0 1px rgba(var(--a1rgb),.25)}
.gw.des{background:repeating-linear-gradient(135deg,rgba(79,209,230,.06) 0 6px,transparent 6px 12px),var(--surf)}
.gwh{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px}
.gfase{font-size:12px;font-weight:700;color:var(--a1)}
.gw.des .gfase{color:var(--cya)}
.gwh b{font-size:13px}
.gwd{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.gd2{display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 0;border-radius:11px;border:1px solid var(--line);background:var(--surf2);min-width:0;animation:pop .3s both}
.gd2 small{font-size:9.5px;color:var(--tx4);font-weight:700;white-space:nowrap}
.gd2 span{font-size:10.5px;font-weight:700;color:var(--g);min-height:14px}
.gd2.ok{background:color-mix(in srgb,var(--g) 18%,var(--surf2));border-color:color-mix(in srgb,var(--g) 45%,transparent)}
.gd2.fa{background:rgba(229,96,74,.12)}.gd2.fa span{color:var(--red)}
.gd2.pl,.gd2.hoy,.gd2.cur{border-style:dashed;border-color:color-mix(in srgb,var(--g) 60%,transparent);background:transparent}
.gd2.de{border-color:transparent;background:transparent}

/* bocetos de calendario */
.ag .agt{display:flex;align-items:center;gap:10px}
.agd{flex:1;display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.agd span{display:flex;flex-direction:column;align-items:center;padding:5px 0;border-radius:10px;font-size:13px}
.agd small{font-size:9.5px;color:var(--tx4);font-weight:700}
.agd b{font-size:13px}
.agd .ok{background:color-mix(in srgb,var(--g) 22%,transparent)}
.agd .fa{background:rgba(229,96,74,.14);color:var(--red)}
.agd .au{background:repeating-linear-gradient(135deg,rgba(79,209,230,.18) 0 3px,transparent 3px 6px)}
.agd .pl,.agd .hoy{box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--g) 70%,transparent)}
.agd .cur{background:color-mix(in srgb,var(--g) 30%,transparent)}
.agd .hoyc b{color:var(--a1)}
.agp{display:flex;flex-direction:column;align-items:flex-end;flex:0 0 auto;min-width:52px}
.agp b{font-size:20px;letter-spacing:-.02em}
.agp small{font-size:11px;color:var(--tx3)}
.ag.cur{border-color:rgba(var(--a1rgb),.5);box-shadow:0 0 0 1px rgba(var(--a1rgb),.25)}
.ag .lista{margin-top:8px}
.agr{grid-template-columns:40px 1fr auto}
.rgs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px}
.rg3{position:relative;display:flex;flex-direction:column;align-items:center}
.rg3 svg{width:78px;height:78px}
.rg3 b{position:absolute;top:27px;font-size:17px;letter-spacing:-.02em}
.rg3 span{font-size:11.5px;color:var(--tx3);font-weight:600;margin-top:2px}
.entra .arc,.arc{animation:arco 1.1s cubic-bezier(.3,.7,.3,1) both}
@keyframes arco{from{stroke-dasharray:0 var(--c)}}
.anm{display:grid;grid-template-columns:repeat(7,1fr);gap:2px 4px}
.anm .dw{font-size:11px;font-weight:700;color:var(--tx4);text-align:center}
.an{display:flex;flex-direction:column;align-items:center;border:0;background:transparent;padding:2px 0;border-radius:12px;animation:pop .35s cubic-bezier(.3,1.4,.5,1) both}
.an svg{width:100%;max-width:40px}
.an .ag{font-size:8.5px;font-weight:700;line-height:1;margin-top:-1px}
.an.sel{background:rgba(var(--a1rgb),.14)}
.wcol{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}
.wc{display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 0 7px;border-radius:14px;border:1px solid var(--line);background:var(--surf2);animation:sube .45s cubic-bezier(.2,.8,.2,1) both}
.wc small{font-size:10px;font-weight:700;color:var(--tx4)}
.wc b{font-size:16px}
.wc .col{display:flex;align-items:flex-end;width:14px;height:64px;border-radius:7px;background:var(--surf3);overflow:hidden}
.wc .col i{display:block;width:100%;height:var(--h);background:var(--g);border-radius:7px;transform-origin:bottom;animation:crece .7s cubic-bezier(.2,.8,.2,1) .2s both}
.wc.pl .col i,.wc.hoy .col i{background:transparent;box-shadow:inset 0 0 0 1.5px var(--g)}
.wc.fa .col i{background:var(--red);opacity:.6}
.wc.de .col i{height:0}
.wc .lb{font-size:9.5px;font-weight:700;color:var(--g);min-height:12px}
.wc.sel{border-color:var(--a1);box-shadow:0 0 0 1px var(--a1);background:rgba(var(--a1rgb),.08)}
.wc.hoyc b{color:var(--a1)}
.wres{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:12px}
.wres div{padding:9px 10px;border-radius:13px;background:var(--surf2);border:1px solid var(--line)}
.wres b{display:block;font-size:19px;letter-spacing:-.02em}
.wres small{font-size:12px;color:var(--tx3);font-weight:500}
.hmy{display:grid;grid-template-columns:14px repeat(var(--n),1fr);grid-template-rows:14px repeat(7,auto);gap:2px;margin-top:12px}
.hmy>span{font-size:9.5px;font-weight:600;color:var(--tx4);line-height:14px;white-space:nowrap}
.hmy .dl{grid-column:1;line-height:1;align-self:center}
.hmd{display:block;aspect-ratio:1;border:0;padding:0;border-radius:2.5px;background:var(--surf3);animation:pop .3s cubic-bezier(.3,1.4,.5,1) both}
.hmd.l1{background:rgba(var(--a1rgb),.28)}.hmd.l2{background:rgba(var(--a1rgb),.5)}.hmd.l3{background:rgba(var(--a1rgb),.75)}.hmd.l4{background:var(--a1)}
.hmd.hoy{box-shadow:inset 0 0 0 1.5px var(--a1)}
.hmd.fut{background:transparent;box-shadow:inset 0 0 0 1px rgba(var(--a1rgb),.35)}
.mrow{display:grid;grid-template-columns:84px 1fr 66px 16px;gap:10px;align-items:center;width:100%;padding:12px 0;border:0;background:transparent;text-align:left;font-size:14px}
.mrow .mn{font-weight:600}
.mrow .mbar{display:flex;height:10px;border-radius:5px;background:var(--surf3);overflow:hidden}
.mrow .mbar i{display:block;height:100%;transform-origin:left;animation:crecex .8s cubic-bezier(.2,.8,.2,1) both}
.mrow b{text-align:right;font-size:13px}
.mrow svg{width:16px;height:16px;color:var(--tx4);transition:transform .2s}
.mrow[aria-expanded="true"] svg{transform:rotate(90deg)}
.mmini{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:8px}
.mmini .dw{font-size:10.5px;font-weight:700;color:var(--tx4);text-align:center}
.mm{aspect-ratio:1;border-radius:9px;border:0;background:transparent;font-size:12.5px;font-weight:600;color:var(--tx3)}
.mm.ok{background:color-mix(in srgb,var(--g) 24%,transparent);color:var(--tx)}
.mm.fa{background:rgba(229,96,74,.15);color:var(--red)}
.mm.au{background:repeating-linear-gradient(135deg,rgba(79,209,230,.18) 0 3px,transparent 3px 6px);color:var(--tx)}
.mm.pl,.mm.hoy,.mm.cur{box-shadow:inset 0 0 0 1.5px var(--g);color:var(--tx)}
.tbh{display:flex;align-items:center;gap:14px}
.tbh b{font-size:17px}
.tbh .ib{width:34px;height:34px}
.tab{padding:6px 12px}
.ln{display:grid;grid-template-columns:44px 1fr auto;gap:10px;align-items:center;padding:7px 0;border-top:1px dashed var(--line)}
.ln:first-child{border-top:0}
.ln.hoyl .lday b{color:var(--a1)}
.lday{display:flex;flex-direction:column;align-items:center;line-height:1.1}
.lday small{font-size:10.5px;font-weight:700;color:var(--tx4);text-transform:uppercase}
.lday b{font-size:17px}
.ses{position:relative;display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:50px;padding:8px 12px 8px 14px;border-radius:14px;border:1px solid color-mix(in srgb,var(--g) 45%,transparent);background:color-mix(in srgb,var(--g) 16%,var(--surf2));text-align:left;animation:entraDer .45s cubic-bezier(.2,.8,.2,1) both;overflow:hidden}
.ses::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--g)}
.ses b{display:block;font-size:13.5px;line-height:1.25}
.ses small{font-size:11.5px;color:var(--tx3)}
.ses em{color:var(--g)}
.ses em svg{width:18px;height:18px}
.ses.pl,.ses.hoy{background:transparent;border-style:dashed}
.ses.fa{border-color:rgba(229,96,74,.45);background:rgba(229,96,74,.1)}
.ses.au{background:repeating-linear-gradient(135deg,rgba(79,209,230,.14) 0 4px,transparent 4px 8px)}
.ln .libre{font-size:12.5px;color:var(--tx4);padding:12px 0}
.mv{display:flex;flex-direction:column;gap:4px}
.mv .ib{width:30px;height:24px;border-radius:8px}
.mv .ib svg{width:14px;height:14px}

.cs{display:grid;grid-template-columns:repeat(18,14px);justify-content:space-between;row-gap:4px;margin-top:14px}
.cq.fut{background:transparent;box-shadow:inset 0 0 0 1px rgba(var(--fg),.14)}
html.claro .cq.fut{background:transparent;box-shadow:inset 0 0 0 1px #d5dce6}
.cq{display:block;width:14px;height:14px;border:0;padding:0;border-radius:3.5px;background:rgba(var(--fg),.07);transition:transform .15s}
.entra .cq{animation:cqIn .4s cubic-bezier(.2,.8,.2,1) both;animation-delay:var(--d)}
@keyframes cqIn{from{transform:scale(.4);opacity:0}}
.cq.l1,.hml i.l1{background:#1c355f}
.cq.l2,.hml i.l2{background:#2a52a3}
.cq.l3,.hml i.l3{background:#3e6fd6}
.cq.l4,.hml i.l4{background:#6e9bff}
html.claro .cq{background:#e7ecf3}
html.claro .cq.l1,html.claro .hml i.l1{background:#c5d6f6}
html.claro .cq.l2,html.claro .hml i.l2{background:#86a8ec}
html.claro .cq.l3,html.claro .hml i.l3{background:#4371dc}
html.claro .cq.l4,html.claro .hml i.l4{background:#1c46c4}
.cq.act{background:transparent;box-shadow:inset 0 0 0 1.5px var(--a1)}
.cq:hover{transform:scale(1.15)}
.cq.on{transform:scale(1.2);box-shadow:0 0 0 1.5px var(--bg),0 0 0 3px var(--tx);position:relative;z-index:1}
.csb{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:10px;font-size:12px}
.csb #cstInfo{flex:1;min-width:0;line-height:1.35}
.hml{display:flex;align-items:center;gap:3px;font-size:10.5px;color:var(--tx4);flex:0 0 auto}
.hml i{width:11px;height:11px;border-radius:3px;background:rgba(var(--fg),.06)}
.hml span{margin:0 2px}
/* efectos al entrar a cada sección */
.main.entra>*{animation:entra .55s cubic-bezier(.2,.8,.2,1) both}
.main.entra>*:nth-child(2){animation-delay:.06s}.main.entra>*:nth-child(3){animation-delay:.12s}.main.entra>*:nth-child(4){animation-delay:.18s}.main.entra>*:nth-child(5){animation-delay:.24s}.main.entra>*:nth-child(6){animation-delay:.3s}.main.entra>*:nth-child(n+7){animation-delay:.34s}
.main.entra.der>*{animation-name:entraDer}
.main.entra.izq>*{animation-name:entraIzq}
@keyframes entra{from{opacity:0;transform:translateY(16px)}}
@keyframes entraDer{from{opacity:0;transform:translateX(34px)}}
@keyframes entraIzq{from{opacity:0;transform:translateX(-34px)}}
.main.entra .hd h1{animation:titulo .6s cubic-bezier(.2,.8,.2,1) both .05s}
@keyframes titulo{from{opacity:0;letter-spacing:.02em;filter:blur(4px)}}
.bnav.salta .nv.on svg{animation:salto .5s cubic-bezier(.3,1.6,.5,1)}
.bnav.salta .nv.on::before{animation:raya .4s cubic-bezier(.2,.8,.2,1)}
@keyframes salto{0%{transform:scale(.6) translateY(4px)}60%{transform:scale(1.18)}100%{transform:none}}
@keyframes raya{from{transform:scaleX(0)}}
.cel{animation:none}
.entra .cel{animation:pop .3s cubic-bezier(.3,1.4,.5,1) both}


.cst{display:grid;grid-template-columns:repeat(12,1fr);gap:4px;margin-top:12px}
.cst-c{display:flex;flex-direction:column;align-items:center;gap:3px;animation:sube .4s cubic-bezier(.2,.8,.2,1) both}
.cst-c i{width:100%;max-width:18px;aspect-ratio:1;border-radius:4px;background:var(--surf3)}
.cst-c i.ok{background:var(--g)}
.cst-c i.fa{background:var(--red);opacity:.85}
.cst-c i.au{background:repeating-linear-gradient(135deg,var(--cya) 0 2px,transparent 2px 4px);opacity:.8}
.cst-c i.pl,.cst-c i.hoy{background:transparent;box-shadow:inset 0 0 0 1.5px var(--g)}
.cst-c i.cur{background:var(--g);opacity:.55}
.cst-c span{font-size:9.5px;color:var(--tx4);font-weight:600;margin-top:2px}
.kp4{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.kp4 div{padding:9px 8px;border-radius:13px;background:var(--surf2);border:1px solid var(--line)}
.kp4 .lbl{font-size:10.5px}
.kp4 b{display:block;font-size:19px;letter-spacing:-.02em;line-height:1.2}
.kp4 b small{font-size:11px;color:var(--tx3);font-weight:500}
.kp4>div>small{font-size:10.5px;color:var(--tx3)}
.cgrid{display:grid;grid-template-columns:30px repeat(7,1fr);gap:4px;margin-top:12px}
.cgrid .dw{font-size:11px;font-weight:700;color:var(--tx4);text-align:center;padding-bottom:2px}
.cgrid .dw.sm{font-size:9.5px}
.sem{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:10px;color:var(--tx4)}
.sem b{font-weight:700}
.sem.desc{border-radius:8px;background:rgba(79,209,230,.1)}
.sem i{font-style:normal;font-size:11px}
.cel{position:relative;aspect-ratio:1/1.18;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;border-radius:11px;border:1px solid var(--line);background:var(--surf2);padding:0;min-width:0;color:var(--tx);animation:pop .3s cubic-bezier(.3,1.4,.5,1) both;transition:transform .15s}
.cel:active{transform:scale(.94)}
.cel .nd{font-size:14.5px;font-weight:700;line-height:1}
.cel .lb{font-size:8px;font-weight:700;letter-spacing:-.15px;margin-top:3px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 2px;color:var(--g)}
.cel em{position:absolute;top:3px;right:3px;font-style:normal;font-size:9px;line-height:1}
.cel em svg{width:10px;height:10px}
.cel.ok{background:color-mix(in srgb,var(--g) 20%,var(--surf2));border-color:color-mix(in srgb,var(--g) 50%,transparent)}
.cel.ok em{color:var(--g)}
.cel.fa{background:rgba(229,96,74,.12);border-color:rgba(229,96,74,.45)}
.cel.fa .lb,.cel.fa em{color:var(--red)}
.cel.au{background:repeating-linear-gradient(135deg,rgba(79,209,230,.16) 0 4px,transparent 4px 8px),var(--surf2);border-color:rgba(79,209,230,.45)}
.cel.au .lb{color:var(--cya)}
.cel.pl{background:transparent;border:1.5px dashed color-mix(in srgb,var(--g) 70%,transparent)}
.cel.hoy,.cel.cur{background:color-mix(in srgb,var(--g) 14%,var(--surf2));border:1.5px solid var(--g)}
.cel.cur::after{content:"";position:absolute;bottom:4px;width:5px;height:5px;border-radius:50%;background:var(--grn);animation:pul 1.8s ease-out infinite}
.cel.de{background:transparent;border-color:transparent}
.cel.de .nd{color:var(--tx3);font-weight:600}
.cel.hoyc .nd{color:var(--a1)}
.cel.sel{box-shadow:0 0 0 2px var(--tx);z-index:1}
.cel.movido::before{content:"↺";position:absolute;top:2px;left:4px;font-size:9px;color:var(--tx3)}
.cel.fuera{background:transparent;border-color:transparent;color:var(--tx4);opacity:.35;font-size:12px;animation:none}
.lrayas{background:repeating-linear-gradient(135deg,var(--cya) 0 2px,transparent 2px 4px)}
.sx{display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center;padding:9px 0;font-size:13.5px}
.sx span:first-child{color:var(--tx2)}
.sx b{font-size:13px;text-align:right}
.dchip{display:flex;flex-direction:column;align-items:center;justify-content:center;width:40px;height:40px;border-radius:12px;background:color-mix(in srgb,var(--g) 18%,transparent);color:var(--g)}
.dchip small{font-size:9.5px;font-weight:700;text-transform:uppercase;line-height:1}
.dchip b{font-size:15px;line-height:1.1}
.mhd .ib:disabled{opacity:.35}
'''
s = s.replace('/* ---------- Progreso v2 ---------- */', CSS_CAL + '/* ---------- Progreso v2 ---------- */', 1)
ENTRA = r"""
 var clave=(push||'')+'|'+U.tab,prev=window.__pant;if(clave!==prev||window.__forzar){var pp=prev?prev.split('|')[0]:'';var dir=window.__forzar?'':(push&&!pp?'der':(!push&&pp?'izq':''));window.__pant=clave;window.__forzar=false;
  v.classList.remove('entra','der','izq');nav.classList.remove('salta');void v.offsetWidth;v.classList.add('entra');if(dir)v.classList.add(dir);if(!push&&(!pp||dir===''))nav.classList.add('salta');
  clearTimeout(window.__entT);window.__entT=setTimeout(function(){v.classList.remove('entra','der','izq');nav.classList.remove('salta');},1300);}"""
s = s.replace("({hoy:vHoy,cal:vCal,pro:vPro,mac:vMac,med:vMed}[U.tab])();", "({hoy:vHoy,cal:vCal,pro:vPro,mac:vMac,med:vMed}[U.tab])();" + ENTRA, 1)
s = s.replace(" case 'calMes':", " case 'cst':document.querySelectorAll('.cq.on').forEach(function(q){q.classList.remove('on');});b.classList.add('on');document.getElementById('cstInfo').textContent=v;return;\n case 'calMes':window.__forzar=true;", 1)
s = s.replace(" case 'sesion':", " case 'sesion':U.hoja=null;", 1)
s = s.replace("BLQ[0].h[0]=[[7,12,1],[5,12,1]];\nrender();", "BLQ[0].h[0]=[[7,12,1],[5,12,1]];\n(function(){var q=new URLSearchParams(location.search).get('cal');if(q){U.calV=q;U.tab='cal';}})();\nrender();", 1)
s = s.replace('<title>AMedida · rediseño completo</title>', '<title>AMedida · app completa</title>')

# ---------- presentación al abrir (igual que la app actual) ----------
CSS_SPLASH = r"""
.splash{position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 40%,rgba(var(--a1rgb),.16),transparent 55%),var(--bg);cursor:pointer;transition:opacity .45s ease,visibility .45s}
.splash.out{opacity:0;visibility:hidden}
.splash .in{display:flex;flex-direction:column;align-items:center;gap:14px}
.sp-tile{width:96px;height:96px;border-radius:29px;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,var(--surf3),var(--surf));border:1px solid var(--line2);box-shadow:inset 0 1px 0 rgba(var(--fg),.06),0 0 64px rgba(var(--a1rgb),.4);animation:spPop .6s cubic-bezier(.2,.9,.25,1.2) both}
.sp-tile svg{width:56px;height:56px}
.sp-draw{stroke-dasharray:240;stroke-dashoffset:240;animation:spTrazo 1s .25s cubic-bezier(.6,.1,.2,1) forwards}
.sp-wm b{display:block;font-family:var(--f);font-weight:800;font-size:52px;line-height:1;letter-spacing:-1.5px;text-align:center;background:linear-gradient(90deg,var(--a1),var(--cya));-webkit-background-clip:text;background-clip:text;color:transparent;animation:spSube .7s .35s cubic-bezier(.2,.8,.2,1) both}
.sp-wm span{display:block;margin-top:6px;font-family:var(--f);font-weight:700;font-size:12px;letter-spacing:6px;padding-left:6px;text-align:center;color:var(--tx3);animation:spSube .7s .5s cubic-bezier(.2,.8,.2,1) both}
@keyframes spPop{from{transform:scale(.6);opacity:0}to{transform:none;opacity:1}}
@keyframes spTrazo{to{stroke-dashoffset:0}}
@keyframes spSube{from{opacity:.001;transform:translateY(14px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.splash{display:none}}
"""
HTML_SPLASH = """<div class="splash" id="splash" aria-hidden="true"><div class="in"><div class="sp-tile"><svg viewBox="0 0 100 100"><defs><linearGradient id="gSp" x1="0" y1="1" x2="1" y2="0"><stop offset="0" style="stop-color:var(--a1)"/><stop offset="1" style="stop-color:var(--cya)"/></linearGradient></defs><path class="sp-draw" d="M20 80 L50 22 L80 80 M32 63 L44 56 L54 61 L68 51" fill="none" stroke="url(#gSp)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="sp-wm"><b>AMedida</b><span>REGISTRO DE ENTRENAMIENTO</span></div></div></div>
"""
s = s.replace('</style></head>', CSS_SPLASH + '</style></head>', 1)
s = s.replace('</style></head><body>', '</style></head><body>\n' + HTML_SPLASH, 1)
s = s.replace("\nrender();\n</script>", "\nrender();\n(function(){var sp=document.getElementById('splash');if(!sp)return;var ya=false,salir=function(){if(ya)return;ya=true;sp.classList.add('out');window.__forzar=true;render();};sp.addEventListener('click',salir);setTimeout(salir,1700);})();\n</script>", 1)


# ---------- barra de abajo: Progreso donde estaba Hoy, Hoy al medio y un poco más grande ----------
s = s.replace("[['hoy','Hoy'],['cal','Calendario'],['pro','Progreso'],['mac','Macros'],['med','Medidas']]", "[['pro','Progreso'],['cal','Calendario'],['hoy','Hoy'],['mac','Macros'],['med','Medidas']]", 1)
s = s.replace('</style></head>', """
.nv[data-v="hoy"]{font-size:12px;font-weight:700}
.nv[data-v="hoy"] svg{width:29px;height:29px}
.nv[data-v="hoy"].on::before{left:24%;right:24%}
</style></head>""", 1)

import gen_extras
s = gen_extras.aplicar(s, D)
import gen_ficha
s = gen_ficha.aplicar(s, D)
import gen_nota
s = gen_nota.aplicar(s, D)
import gen_cliente
s = gen_cliente.aplicar(s, D)
import gen_contrato
s = gen_contrato.aplicar(s, D)
import gen_heat
s = gen_heat.aplicar(s, D)
import gen_isak
s = gen_isak.aplicar(s, D)
import gen_simple
s = gen_simple.aplicar(s, D)
import gen_movil
s = gen_movil.aplicar(s, D)
import gen_sigma8
s = gen_sigma8.aplicar(s, D)

# ---------- marca: «A medida» · Entrenamiento integral ----------
s = s.replace("""<span class="logo"><i>'+LOGO+'</i>AMedida</span>""", """<span class="logo"><i>'+LOGO+'</i><span class="lg2"><b>A medida</b><small>Entrenamiento integral</small></span></span>""", 1)
s = s.replace('<b>AMedida</b><span>REGISTRO DE ENTRENAMIENTO</span>', '<b>A medida</b><span>ENTRENAMIENTO INTEGRAL</span>', 1)
s = s.replace(""">AMedida</p>';}""", """>A medida · Entrenamiento integral</p>';}""", 1)
s = s.replace('<title>AMedida · app completa</title>', '<title>A medida · Entrenamiento integral</title>', 1)
s = s.replace('AMedida', 'A medida')
s = s.replace('</style></head>', """
.logo .lg2{display:flex;flex-direction:column;line-height:1.05}
.logo .lg2 b{font-size:16px;font-weight:700;letter-spacing:-.01em}
.logo .lg2 small{font-size:10.5px;font-weight:600;color:var(--tx3);letter-spacing:.01em;margin-top:2px;white-space:nowrap}
.top #tMod{display:none}
.top{gap:6px}
.sp-wm span{letter-spacing:3.5px;padding-left:3.5px;font-size:11.5px;white-space:nowrap}
@media (max-width:360px){.logo .lg2 small{font-size:9.5px}.top .ib{width:36px;height:36px}}
</style></head>""", 1)
open(os.path.join(D, 'bocetos', 'rediseno.html'), 'w').write(s)
print('ok app', len(s))
