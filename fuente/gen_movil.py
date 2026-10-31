# ---------- 100 % celular: desborde lateral, toques, hojas, teclado, atrás ----------
import os
def aplicar(s, D):
    def rep(a, b):
        nonlocal s
        assert s.count(a) == 1, ('patrón', s.count(a), a[:80])
        s = s.replace(a, b, 1)
    rep('/* ================= render ================= */', open(os.path.join(D, 'movil.js')).read() + '\n/* ================= render ================= */')
    # hoja: cabecera fija con la barrita y un botón para cerrar siempre a mano
    rep("""'" role="dialog" aria-modal="true"><div class="grab"></div>'+s+'</div>';""",
        """'" role="dialog" aria-modal="true"><div class="shd"><div class="grab"></div><button type="button" class="shx" data-a="cerrar" aria-label="Cerrar">'+I.x+'</button></div>'+s+'</div>';""")
    rep("function pintarHoja(){var c=document.getElementById('capa'),h=U.hoja;", "function pintarHoja(){var c=document.getElementById('capa'),h=U.hoja;document.documentElement.classList.toggle('bloq',!!h);")
    rep("function despues(){", "function despues(){\n sincHist();")
    rep("var I={", "var I={x:P('<path d=\"M6 6l12 12M18 6 6 18\"/>',2.4),")
    rep('</style></head>', CSS + '</style></head>')
    return s

CSS = """
/* ---------- celular ---------- */
body{overflow-x:hidden}
.main{overflow-x:clip}
button,[data-a],a,input,label{touch-action:manipulation}
button{-webkit-user-select:none;user-select:none}
img,svg{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;-webkit-user-drag:none}
.lamb img,.fv img,.rnl img,.ent img{pointer-events:none}
input,textarea,select{font-size:16px!important}
.sr input{font-size:17px!important}.tm input{font-size:23px!important}
html.bloq,html.bloq body{overflow:hidden;overscroll-behavior:none}
.velo{touch-action:none}
.sheet{overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding-top:0;will-change:transform}
.shd{position:sticky;top:0;z-index:3;margin:0 -16px 4px;padding:8px 16px 6px;background:var(--surf);border-radius:26px 26px 0 0}
.shd .grab{margin:0 auto}
.shx{position:absolute;right:10px;top:6px;width:36px;height:36px;border-radius:50%;border:0;background:var(--surf2);color:var(--tx2);display:flex;align-items:center;justify-content:center}
.shx svg{width:16px;height:16px}
.sheet>h2:first-of-type,.sheet .vsheet>h2:first-child{padding-right:44px}
.vl{min-height:34px;padding:2px 0}
.ejn{min-height:30px}
.nadd,.nchip{min-height:36px}
.seg.sm button,[data-a^="p_"]{min-height:36px}
[data-a="medT"]{min-height:36px;display:inline-flex;align-items:center}
.cs{padding:4px 0}
"""
