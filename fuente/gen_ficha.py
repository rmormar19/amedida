# ---------- ficha animada al tocar un ejercicio de la rutina ----------
import os
def aplicar(s, D):
    def rep(a, b):
        nonlocal s
        assert s.count(a) == 1, ('patrón', s.count(a), a[:80])
        s = s.replace(a, b, 1)
    rep('/* ================= render ================= */', open(os.path.join(D, 'ficha.js')).read() + '\n/* ================= render ================= */')
    # sesión: lámina y nombre abren la ficha
    rep("""'<div class="ej">'+lamina(e.lam,e.n)+'<div><h4>'+(b.ss?'<span class="tg">'+b.k+(k+1)+'</span>':'')+e.n+'</h4>""",
        """'<div class="ej">'+lamBtn(e.lam,e.n,U.ses.b+'-'+k)+'<div><h4><button type="button" class="ejn" data-a="ficha" data-v="'+e.lam+'|s'+U.ses.b+'-'+k+'">'+(b.ss?'<span class="tg">'+b.k+(k+1)+'</span>':'')+e.n+'</button></h4>""")
    # rutina nueva: cada ejercicio con su lámina, tocable
    rep("""return '<div class="rnx" style="animation-delay:'+(i*70)+'ms"><span class="rnn">'+(i+1)+'</span><span><b>'+e.n+'</b><span class="s">'+e.s+' × '+e.r+' · '+co(e.kg)+' '+(e.u||'kg')+' · RIR '+e.rir+'</span></span></div>';""",
        """var lf=lamDe(e.n),nk=NOTIFS.indexOf(n);return '<'+(lf?'button type="button" data-a="ficha" data-v="'+lf+'|n'+nk+'-'+i+'"':'div')+' class="rnx'+(lf?' tq':'')+'" style="animation-delay:'+(i*70)+'ms">'+(lf?'<span class="rnl">'+lamina(lf,e.n)+(esAnim(lf)?'<i>'+ICPLAY+'</i>':'')+'</span>':'<span class="rnn">'+(i+1)+'</span>')+'<span><b>'+e.n+'</b><span class="s">'+e.s+' × '+e.r+' · '+co(e.kg)+' '+(e.u||'kg')+' · RIR '+e.rir+'</span></span>'+(lf?I.der:'')+'</'+(lf?'button':'div')+'>';""")
    rep("""Ya quedó cargada en tu calendario.""", """Tocá un ejercicio para ver cómo se hace. Ya quedó cargada en tu calendario.""")
    rep("""if(h.t==='cola'||h.t==='notifs')s=HOJAS_EXTRA(h);""", """if(h.t==='cola'||h.t==='notifs')s=HOJAS_EXTRA(h);\n if(h.t==='ficha')s=FICHA(h);""")
    rep("""'<div class="velo" data-a="cerrar"></div><div class="sheet" role="dialog\"""", """'<div class="velo" data-a="cerrar"></div><div class="sheet'+(h.t==='ficha'?' fsh':'')+'" role="dialog\"""")
    rep(" case 'notifs':U.hoja={t:'notifs'};break;", " case 'notifs':U.hoja={t:'notifs'};break;\n case 'ficha':U.hoja={t:'ficha',v:v};break;")
    rep("Tildá sin escribir y se copia.", "Tocá la lámina o el nombre para ver cómo se hace. Tildá sin escribir y se copia.")
    rep('</style></head>', CSS + '</style></head>')
    return s

CSS = """
/* ---------- ficha animada ---------- */
.lamb{position:relative;display:block;padding:0;border:0;background:none;border-radius:14px;cursor:pointer}
.lamb:active{transform:scale(.97)}
.lpb{position:absolute;right:5px;bottom:5px;width:24px;height:24px;border-radius:50%;background:rgba(8,18,35,.78);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.3)}
.lpb svg{width:13px;height:13px;margin-left:1px}.lpb b{font-size:12px;font-family:Georgia,serif;font-style:italic}
.ejn{padding:0;border:0;background:none;font:inherit;color:inherit;text-align:left;letter-spacing:inherit;cursor:pointer}
.rnx.tq{grid-template-columns:58px 1fr 18px;width:100%;border-left:0;border-right:0;border-bottom:0;background:none;font:inherit;color:inherit;text-align:left;cursor:pointer}
.rnx.tq>svg{width:18px;height:18px;color:var(--tx4)}
.rnl{position:relative;display:block}.rnl .lam{border-radius:10px}
.rnl i{position:absolute;right:3px;bottom:3px;width:18px;height:18px;border-radius:50%;background:rgba(8,18,35,.78);color:#fff;display:flex;align-items:center;justify-content:center}
.rnl i svg{width:10px;height:10px;margin-left:1px}
.sheet.fsh{max-height:92%}
.fv{position:relative;margin:4px 0 0;aspect-ratio:4/3;border-radius:18px;overflow:hidden;background:var(--cream)}
.fv video,.fv img{display:block;width:100%;height:100%;object-fit:cover}
.fvt{position:absolute;left:10px;top:10px;display:inline-flex;align-items:center;gap:6px;padding:4px 9px;border-radius:999px;background:rgba(8,18,35,.72);color:#fff;font-size:11.5px;font-weight:600}
.fvt i{width:7px;height:7px;border-radius:50%;background:#ef5a46;animation:rec 1.4s infinite}
@keyframes rec{50%{opacity:.25}}
.fvc{position:absolute;left:8px;right:8px;bottom:8px;display:flex;align-items:center;gap:8px;padding:6px;border-radius:14px;background:rgba(8,18,35,.66);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.fvb{flex:0 0 36px;width:36px;height:36px;border-radius:50%;border:0;background:#fff;color:#081223;display:flex;align-items:center;justify-content:center}
.fvb svg{width:16px;height:16px}
.fvp{flex:1;height:4px;border-radius:2px;background:rgba(255,255,255,.25);overflow:hidden}
.fvp i{display:block;height:100%;width:0;background:#fff;border-radius:2px}
.fvl{height:32px;padding:0 10px;border-radius:10px;border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff;font:inherit;font-size:12px;font-weight:600}
.fvl[aria-pressed="true"]{background:#fff;color:#081223}
.fh{margin:14px 0 0;font-size:21px;letter-spacing:-.02em}
.fm{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.fna{margin:10px 0 0;font-size:12.5px;color:var(--tx3)}
.fl{display:block;margin-top:16px}
.fp{display:grid;gap:6px;margin-top:6px}
.fp div{padding:10px 6px;border-radius:13px;background:var(--surf2);border:1px solid var(--line);text-align:center}
.fp b{display:block;font-size:15px}.fp span{display:block;font-size:11px;color:var(--tx3);margin-top:2px}
.fpa{list-style:none;margin:6px 0 0;padding:0}
.fpa li{display:grid;grid-template-columns:26px 1fr;gap:10px;padding:8px 0;font-size:14px;line-height:1.4;animation:entra .35s both}
.fpa li span{width:24px;height:24px;border-radius:8px;background:rgba(var(--a1rgb),.14);color:var(--a1);font-weight:700;font-size:12.5px;display:flex;align-items:center;justify-content:center}
.fx{list-style:none;margin:6px 0 0;padding:0}
.fx li{display:grid;grid-template-columns:26px 1fr;gap:10px;padding:6px 0;font-size:13.5px;line-height:1.4;color:var(--tx2)}
.fx li span{width:22px;height:22px;border-radius:50%;background:rgba(229,96,74,.14);color:var(--red);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center}
"""
