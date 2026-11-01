# ---------- Monitor → app: la app arma Hoy, sesión, calendario y medidas con los datos del panel ----------
import os
def aplicar(s, D):
    def rep(a, b, n=1):
        nonlocal s
        assert s.count(a) == n, ('patrón', s.count(a), a[:80])
        s = s.replace(a, b)
    rep("\nrender();\n(function(){var sp=", "\n"+open(os.path.join(D,'panel.js')).read()+"\n"+open(os.path.join(D,'real.js')).read()+"\nrender();\n(function(){var sp=")
    rep("{sesion:'Brazos',", "{sesion:SES_TIT(),")
    rep("<b>Brazos en curso · '", "<b>'+SES_TIT()+' en curso · '")
    rep("<p class=\"sub\">Brazos · '+hp[0]", "<p class=\"sub\">'+SES_TIT()+' · '+hp[0]")
    rep("<p class=\"sub\">Brazos · '+h[0]", "<p class=\"sub\">'+SES_TIT()+' · '+h[0]")
    rep("var rut={quien:NOMBRE,dia:'Brazos'", "var rut={quien:NOMBRE,dia:DIA_SES", 2)
    rep("postMessage({am:'sesion',quien:NOMBRE,dia:'Brazos'", "postMessage({am:'sesion',quien:NOMBRE,dia:DIA_SES")
    rep("../cuerpo/mapa_brazos.webp\" alt=\"Músculos trabajados", "../cuerpo/'+IMG_SES()+'.webp\" alt=\"Músculos trabajados", 2)
    rep("'Sesión de Brazos terminada · esfuerzo: '", "'Sesión de '+SES_TIT()+' terminada · esfuerzo: '")
    rep("<th>25 oct</th>", "<th>'+MED_ULT+'</th>", 2)
    rep("Toma anterior · 25 oct", "Toma anterior · '+MED_ULT+'", 2)
    rep("Toma del 30 de octubre", "Toma del '+HOY_TXT()+'", 2)
    rep("<td class=\"mu\">90,5</td>", "<td class=\"mu\">'+co(sumaPrev())+'</td>")
    rep("Viernes 30 de octubre", "'+DSEM[HOYC.getDay()]+' '+HOY_TXT()+'", 2)
    rep('</style></head>', CSS + '</style></head>')
    return s

CSS = '''
/* ---------- conectar la app con el link del entrenador ---------- */
.conx{position:fixed;inset:0;z-index:9999;background:var(--bg);display:flex;align-items:center;justify-content:center;padding:24px;padding-top:max(24px,env(safe-area-inset-top))}
.conx-in{width:100%;max-width:380px;display:flex;flex-direction:column;gap:12px}
.conx-lg b{display:block;font-size:22px;font-weight:800;letter-spacing:-.02em}.conx-lg small{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--tx3)}
.conx h1{margin:18px 0 0;font-size:28px;letter-spacing:-.02em}.conx p{margin:0;color:var(--tx3);font-size:15px}
.conx input{height:52px;border-radius:14px;border:1px solid var(--line2);background:var(--surf2);color:var(--tx);padding:0 14px;font:inherit;font-size:16px!important}
.conx .conx-e{color:var(--red);font-size:14px;min-height:20px}
'''
