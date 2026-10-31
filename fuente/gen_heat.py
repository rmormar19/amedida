# ---------- Constancia como mapa de calor diario ----------
import os
def aplicar(s, D):
    def rep(a, b):
        nonlocal s
        assert s.count(a) == 1, ('patrón', s.count(a), a[:80])
        s = s.replace(a, b, 1)
    rep('/* ================= render ================= */', open(os.path.join(D, 'heatmap.js')).read() + '\n/* ================= render ================= */')
    rep(" s+=constancia(rachaSem());", " s+=constanciaHM();")
    rep(" case 'cerrar':U.hoja=null;break;", " case 'cerrar':U.hoja=null;break;\n case 'cstY':U.cstY=+v;break;")
    rep('</style></head>', CSS + '</style></head>')
    return s

CSS = """
/* ---------- Constancia: mapa de calor ---------- */
.hm .ct{align-items:center}
.hmy{display:flex;gap:4px;padding:3px;border-radius:11px;background:rgba(var(--fg),.06)}
.hmy button{height:30px;padding:0 11px;border:0;border-radius:8px;background:transparent;color:var(--tx3);font:inherit;font-size:13px;font-weight:700}
.hmy button[aria-pressed="true"]{background:var(--a1);color:var(--ink)}
.hmb{margin-top:14px}
.hmm,.hmg{display:grid;column-gap:2.5px}
.hmm{margin-bottom:5px;font-size:11px;font-weight:600;color:var(--tx3);text-transform:capitalize}
.hmm span{white-space:nowrap}
.hmg{grid-template-rows:repeat(7,auto);row-gap:2.5px}
.hq{display:block;aspect-ratio:1;border-radius:2.5px;background:rgba(var(--fg),.07);animation:cqIn .35s cubic-bezier(.2,.8,.2,1) both;animation-delay:var(--d)}
.hq.nx{background:transparent;animation:none}
.hq.de{background:rgba(var(--fg),.05)}
.hq.fa{background:rgba(229,96,74,.32)}
.hq.au{background:rgba(79,209,230,.28)}
.hq.pl{background:transparent;box-shadow:inset 0 0 0 1px rgba(var(--fg),.16)}
.hq.hoy{background:transparent;box-shadow:inset 0 0 0 1.5px var(--a1)}
.hq.l1{background:#22477e}.hq.l2{background:#3a80e0}.hq.l3{background:#6fbcff}
html.claro .hq.l1{background:#a9c3f2}html.claro .hq.l2{background:#4a7be0}html.claro .hq.l3{background:#1a3fb8}
.hq.hy{box-shadow:0 0 0 1.5px var(--bg),0 0 0 3px var(--a1)}
.hq.on{box-shadow:0 0 0 1.5px var(--bg),0 0 0 3px var(--tx);position:relative;z-index:1}
.hmr{position:relative;height:3px;margin-top:8px;border-radius:2px;background:rgba(var(--fg),.08)}
.hmr b{position:absolute;top:0;height:3px;border-radius:2px;background:#3a80e0;opacity:.75;animation:crecex .8s .3s both;transform-origin:left}
.hmr b.act{background:#5fb0ff;opacity:1;box-shadow:0 0 8px rgba(95,176,255,.55)}
.hmr b.best{background:#e8c25a;opacity:1}
html.claro .hmr b.best{background:#c99a1e}
.hml{display:flex;align-items:center;gap:4px;margin-top:14px;font-size:11px;font-weight:600;color:var(--tx3);text-transform:uppercase;letter-spacing:.03em;flex-wrap:wrap}
.hml span{display:inline-flex;align-items:center;gap:5px;margin-right:8px}
.hml span b{display:inline-block;width:14px;height:3px;border-radius:2px;background:#5fb0ff}.hml span b.best{background:#e8c25a}
.hml .sp{flex:1;margin:0}
.hml i{width:10px;height:10px;border-radius:2.5px}
.hml i.fa{background:rgba(229,96,74,.32)}
.hml i{margin-left:6px}.hml i.l1{background:#22477e}.hml i.l2{background:#3a80e0}.hml i.l3{background:#6fbcff}
html.claro .hml i.l1{background:#a9c3f2}html.claro .hml i.l2{background:#4a7be0}html.claro .hml i.l3{background:#1a3fb8}
.hqi{min-height:18px;margin:10px 0 0;font-size:12.5px;color:var(--tx3)}.hqi.vis{color:var(--tx);font-weight:600}
.hmt{margin-top:16px;padding-top:14px;border-top:1px solid var(--line)}
.hmn{display:flex;align-items:baseline;gap:8px;margin-top:4px}
.hmn>b{font-size:40px;line-height:1;letter-spacing:-.03em}
.hmn>span{color:var(--tx3);font-weight:600;font-size:15px;line-height:1.1}
.hmn>span small{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.03em}
.hmn em{margin-left:auto;text-align:right;font-style:normal;font-size:24px;white-space:nowrap;font-weight:700;color:var(--a1)}
.hmn em small{display:block;font-size:11px;font-weight:600;color:var(--tx3);text-transform:uppercase;letter-spacing:.03em}
.hmk{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px}
.hmk div{padding:10px 12px;border-radius:14px;background:var(--surf2);border:1px solid var(--line)}
.hmk .lbl{white-space:nowrap}
.hmk b{display:block;margin-top:2px;font-size:24px;line-height:1.1;white-space:nowrap}.hmk b.ra,.hqn b.ra{color:#5fb0ff}.hmk b.be,.hqn b.be{color:#e8c25a}
html.claro .hmk b.ra,html.claro .hqn b.ra{color:#1d6fd8}html.claro .hmk b.be,html.claro .hqn b.be{color:#b08310}
.hmk small{font-size:12px;font-weight:600;color:var(--tx3);margin-left:3px}
.hqn{margin:10px 0 0;font-size:11.5px;color:var(--tx4)}
"""
