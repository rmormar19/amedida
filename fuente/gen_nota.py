# ---------- nota por ejercicio para el entrenador ----------
import os
def aplicar(s, D):
    def rep(a, b):
        nonlocal s
        assert s.count(a) == 1, ('patrón', s.count(a), a[:80])
        s = s.replace(a, b, 1)
    rep('/* ================= render ================= */', open(os.path.join(D, 'nota.js')).read() + '\n/* ================= render ================= */')
    rep("""'</span>'+chipSug(e)+'</div></div>';}).join('');""", """'</span>'+chipSug(e)+notaChip(e,U.ses.b+'-'+k)+'</div></div>';}).join('');""")
    rep("""if(h.t==='ficha')s=FICHA(h);""", """if(h.t==='ficha')s=FICHA(h);\n if(h.t==='nota')s=hojaNota(h);""")
    rep(" case 'ficha':U.hoja={t:'ficha',v:v};break;", """ case 'ficha':U.hoja={t:'ficha',v:v};break;
 case 'nota':var nr=v.split('-'),ne=BLQ[+nr[0]].ej[+nr[1]],nx=NOTAS[ne.id],nt={};if(nx)nx.tags.forEach(function(k){nt[k]=true;});U.hoja={t:'nota',b:+nr[0],k:+nr[1],tags:nt,zona:nx?nx.zona:'',int:nx?nx.int:'',txt:nx?nx.txt:''};break;
 case 'ntag':U.hoja.tags[v]=!U.hoja.tags[v];if(v==='pesado'&&U.hoja.tags.pesado)U.hoja.tags.liviano=false;if(v==='liviano'&&U.hoja.tags.liviano)U.hoja.tags.pesado=false;break;
 case 'nzona':U.hoja.zona=v;break;
 case 'nint':U.hoja.int=v;break;
 case 'nmandar':if(!mandarNota())return;U.hoja=null;break;
 case 'nborrar':delete NOTAS[BLQ[U.hoja.b].ej[U.hoja.k].id];guardarNotas();U.hoja=null;toast('Nota borrada');break;""")
    rep("if(!d.mensual)return {pts:h.slice(ini),lab:d.lab,tip:d.tip};", "if(!d.mensual)return conHoy(id,{pts:h.slice(ini),lab:d.lab,tip:d.tip,ks:h.slice(ini).map(function(_,j){return [ini+j];})});")
    rep("return best;}),lab:d.lab,tip:d.tip};}", "return best;}),lab:d.lab,tip:d.tip,ks:d.sem.map(function(g,i,a){return i===a.length-1?g.concat([52]):g;})};}")
    rep("var notas=p.map(function(o){return !o?", "var notas=p.map(function(o,i){var nn=notaEnSemana(id,de.ks&&de.ks[i]);if(nn)return nn;return !o?")
    rep('</style></head>', CSS + '</style></head>')
    return s

CSS = """
/* ---------- nota por ejercicio ---------- */
.nadd,.nchip{display:flex;align-items:center;gap:6px;margin-top:7px;padding:5px 9px;border-radius:10px;border:1px dashed var(--line2);background:transparent;color:var(--tx3);font:inherit;font-size:12px;font-weight:600;text-align:left}
.nadd svg,.nchip svg{flex:0 0 14px;width:14px;height:14px}
.nchip{border-style:solid;border-color:rgba(var(--a1rgb),.35);background:rgba(var(--a1rgb),.10);color:var(--tx);flex-wrap:wrap;animation:pop .35s both}
.nchip span{flex:1;min-width:0;line-height:1.35}
.nchip small{width:100%;padding-left:20px;font-size:11px;font-weight:500;color:var(--tx3)}
.nchip.dolor{border-color:rgba(229,96,74,.45);background:rgba(229,96,74,.12)}.nchip.dolor svg{color:var(--red)}
.nchip.bien{border-color:rgba(var(--grnrgb),.45);background:rgba(var(--grnrgb),.12)}.nchip.bien svg{color:var(--grn)}
.ntg{display:flex;flex-wrap:wrap;gap:7px;margin-top:6px}
.ntg button{min-height:38px;padding:0 12px;border-radius:12px;border:1px solid var(--line2);background:var(--surf2);color:var(--tx2);font:inherit;font-size:13.5px;font-weight:600}
.ntg.sm button{min-height:34px;font-size:13px;padding:0 11px}
.ntg button[aria-pressed="true"]{border-color:var(--a1);background:rgba(var(--a1rgb),.16);color:var(--tx)}
.ntg button.dolor[aria-pressed="true"]{border-color:var(--red);background:rgba(229,96,74,.16)}
.ntg button.bien[aria-pressed="true"]{border-color:var(--grn);background:rgba(var(--grnrgb),.16)}
.ndol{margin-top:12px;padding:12px;border-radius:14px;background:rgba(229,96,74,.06);border:1px solid rgba(229,96,74,.25);animation:entra .3s both}
.nint{margin-top:6px}
#ntxt{display:block;width:100%;margin-top:6px;padding:10px 12px;border-radius:13px;border:1px solid var(--line2);background:var(--surf2);color:var(--tx);font:inherit;font-size:14px;line-height:1.4;resize:none}
#ntxt:focus{outline:none;border-color:var(--a1)}
.pri.full svg{width:17px;height:17px;margin-right:6px;vertical-align:-3px}
"""
