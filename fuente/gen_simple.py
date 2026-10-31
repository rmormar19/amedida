# ---------- Progreso y Medidas más simples para el cliente ----------
import os
def aplicar(s, D):
    def rep(a, b):
        nonlocal s
        assert s.count(a) == 1, ('patrón', s.count(a), a[:80])
        s = s.replace(a, b, 1)
    # Progreso: pestaña "Mi progreso" primero; Carga y Ejercicios quedan como detalle (igual al panel)
    rep("function vista(){\n var s=hd('Tu evolución','Progreso');", open(os.path.join(D, 'simple_pro.js')).read() + "function vista(){\n var s=hd('Tu evolución','Progreso');")
    rep("""s+='<div class="seg" style="margin-bottom:10px"><button type="button" data-a="p_tab" data-v="carga" aria-pressed="'+(U.tab==='carga')+'">Carga de trabajo</button>""",
        """s+='<div class="seg" style="margin-bottom:10px"><button type="button" data-a="p_tab" data-v="yo" aria-pressed="'+(U.tab==='yo')+'">Mi progreso</button><button type="button" data-a="p_tab" data-v="carga" aria-pressed="'+(U.tab==='carga')+'">Carga</button>""")
    rep(""">Por ejercicio</button></div>';""", """>Ejercicios</button></div>';""")
    rep("if(U.tab==='ej')return s+'<div id=\"sEj\">'+ejercicios()+'</div>';", "if(U.tab==='yo')return s+miProgreso();\n if(U.tab==='ej')return s+'<div id=\"sEj\">'+ejercicios()+'</div>';")
    rep("U={tab:'carga',per:'6 sem'", "U={tab:'yo',per:'6 sem'")
    rep(" if(a==='tab'){U.tab=v;pintar();return;}", " if(a==='tab'){U.tab=v;pintar();window.scrollTo(0,0);return;}\n if(a==='mpEj'){U.tab='ej';U.ejSel=v;pintar();window.scrollTo(0,0);return;}")
    # Medidas: peso primero, pliegues en palabras simples, sin la estimación de kilos de grasa
    rep("var T=[['Σ 6 pliegues','70,5','mm','−1,5','s6'],['Peso','78,5','kg','0','peso'],['Cintura','83,5','cm','−0,5','cint'],['Brazo','35,5','cm','0','brazo']];",
        "var T=[['Peso','78,5','kg','0','peso'],['Cintura','83,5','cm','−0,5','cint'],['Brazo','35,5','cm','0','brazo'],['Pliegues','70,5','mm','−1,5','s6']];")
    rep("var nom={s6:'Σ 6 pliegues',", "var nom={s6:'Pliegues (suma de 6)',")
    rep("""(m.graf==='s6'?'<p class="sub">En 6 meses: <b class="up">−8 mm</b> ≈ 1,6 kg de grasa menos (estimación de campo: 5 mm de Σ6 ≈ 1 kg).</p>':'')""",
        """(m.graf==='s6'?'<p class="sub">Los pliegues miden la grasa debajo de la piel. Bajaron <b class="up">8 mm</b> en 6 meses: estás perdiendo grasa. Los toma tu entrenador.</p>':m.graf==='peso'?'<p class="sub">El peso sube y baja día a día. Mirá la tendencia de varias semanas, no un día solo.</p>':'')""")
    rep("med:{graf:'s6',", "med:{graf:'peso',")
    rep("""<span class="ey">Antropometría</span><h1>Medidas</h1>""", """<span class="ey">Tu cuerpo</span><h1>Medidas</h1>""")
    # Hoy: la cintura en lugar de la suma de pliegues
    rep("""'<button type="button" class="tile" data-a="tab" data-v="med"><span class="lbl">Σ 6 pliegues</span><div class="big">70,5<small>mm</small></div><div class="s"><span class="up">−8 mm</span> desde junio</div>'+spark(SERIE.s6,'var(--cya)',130,30)+'</button>""",
        """'<button type="button" class="tile" data-a="tab" data-v="med"><span class="lbl">Cintura</span><div class="big">83,5<small>cm</small></div><div class="s"><span class="up">−1 cm</span> desde junio</div>'+spark(SERIE.cint,'var(--cya)',130,30)+'</button>""")
    rep('</style></head>', CSS + '</style></head>')
    return s

CSS = """
/* ---------- Mi progreso ---------- */
.mp1 .mpk{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px}
.mpk div{padding:12px 6px;border-radius:14px;background:var(--surf2);text-align:center}
.mpk b{display:block;font-size:28px;line-height:1.05;letter-spacing:-.02em}
.mpk span{display:block;margin-top:4px;font-size:11.5px;color:var(--tx3);line-height:1.25}
.mpt{margin:12px 0 0;font-size:14.5px;font-weight:600;line-height:1.4}
.mpr{display:grid;grid-template-columns:1fr 70px auto;gap:10px;align-items:center;width:100%;padding:12px 0;border:0;border-top:1px solid var(--line);background:transparent;color:inherit;font:inherit;text-align:left}
.mpr:first-child{border-top:0}
.mpr b{display:block;font-size:14.5px;line-height:1.3}.mpr .s{display:block;font-size:12.5px;color:var(--tx3);margin-top:2px}
.mpr svg{width:70px;height:26px}
.mpn{margin:6px 4px 0;font-size:12px;color:var(--tx4)}
.mpc{display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:end}
.mpc b{display:block;font-size:32px;line-height:1}.mpc span{display:block;font-size:12px;color:var(--tx3);margin-top:4px}
.mpb{display:flex;align-items:flex-end;gap:4px;height:52px}
.mpb i{flex:1;border-radius:4px 4px 2px 2px;background:var(--a1);opacity:.8;animation:crece .6s both}
.mpb i.ok{background:var(--grn);opacity:1}.mpb i.lo{background:var(--line2)}
"""
