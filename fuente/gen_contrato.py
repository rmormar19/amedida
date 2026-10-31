# ---------- contrato con el Monitor: cola con datos del panel, rutina del panel y cardio ----------
import os
def aplicar(s, D):
    def rep(a, b):
        nonlocal s
        assert s.count(a) == 1, ('patrón', s.count(a), a[:80])
        s = s.replace(a, b, 1)
    rep('/* ================= render ================= */', open(os.path.join(D, 'contrato.js')).read() + '\n/* ================= render ================= */')
    rep("s+=bajoSesion(ult);", "if(ult)s+=bloqueCardio();s+=bajoSesion(ult);")
    rep(" case 'cerrar':U.hoja=null;break;", """ case 'cerrar':U.hoja=null;break;
 case 'cdOk':var cx=CARDIO[+v];if(cx.estado==='hecho'){cx.estado='';}else{cx.estado='hecho';if(!cx.minReal)cx.minReal=String(cx.cant);cola('Cardio · '+cx.tipo+' · '+cx.minReal+' min'+(cx.fc?' · FC '+cx.fc:''),paq('cardio',{dia:DIA_SES,tipo:cx.tipo,modo:cx.modo,cant:cx.cant,zona:cx.zona,minReal:cx.minReal,fc:cx.fc,estado:'hecho'}));if(!cx.fc)toast('Si tenés la FC promedio, anotala: tu entrenador ve la zona');}guardarCardio();break;""")
    # la rutina nueva muestra el cardio que mandó el panel
    rep("""'<p class="mu" style="font-size:12.5px;margin:10px 2px 0">Tocá un ejercicio para ver cómo se hace.""",
        """(n.cardio&&n.cardio.length?'<section class="card"><div class="ct"><h3>Cardio</h3></div>'+n.cardio.map(function(c){return '<div class="rnx"><span class="rnn">♥</span><span><b>'+c.tipo+' · '+c.cant+(c.modo==='km'?' km':' min')+'</b><span class="s">Zona '+c.zona+(c.cuando?' · '+c.cuando:'')+(c.inclinacion?' · inclinación '+c.inclinacion:'')+'</span></span></div>';}).join('')+'</section>':'')+'<p class="mu" style="font-size:12.5px;margin:10px 2px 0">Tocá un ejercicio para ver cómo se hace.""")
    rep('</style></head>', CSS + '</style></head>')
    return s

CSS = """
/* ---------- cardio ---------- */
.cdx{padding:12px;border-radius:18px;background:var(--surf);border:1px solid var(--line)}
.cdx.h{border-color:rgba(var(--grnrgb),.45)}
.cdt b{display:block;font-size:15px}.cdt span{display:block;margin-top:2px;font-size:12.5px;color:var(--tx3)}
.cdi{display:grid;grid-template-columns:1fr 1fr 52px;gap:8px;align-items:end;margin-top:10px}
.cdi label{display:flex;flex-direction:column;gap:4px;font-size:11.5px;font-weight:600;color:var(--tx3)}
.cdi input{height:48px;border-radius:13px;border:1px solid var(--line2);background:var(--surf2);color:var(--tx);text-align:center;font:inherit;font-size:17px!important;font-weight:700;width:100%;min-width:0}
.cdi .ok{height:48px;border-radius:13px;border:1px solid var(--line2);background:var(--surf2);color:var(--tx3);display:flex;align-items:center;justify-content:center}
.cdx.h .cdi .ok{background:var(--grn);border-color:var(--grn);color:#fff}
.cdi .ok svg{width:20px;height:20px}
.cdn{margin:8px 0 0;font-size:11.5px;color:var(--tx4)}
"""
