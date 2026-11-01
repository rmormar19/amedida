# ---------- Monitor → app: la app arma Hoy, sesión, calendario y medidas con los datos del panel ----------
import os
def aplicar(s, D):
    def rep(a, b, n=1):
        nonlocal s
        assert s.count(a) == n, ('patrón', s.count(a), a[:80])
        s = s.replace(a, b)
    rep("\nrender();\n(function(){var sp=", "\n"+open(os.path.join(D,'panel.js')).read()+"\nrender();\n(function(){var sp=")
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
    return s
