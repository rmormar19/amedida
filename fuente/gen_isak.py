# ---------- toma de medidas con el perfil restringido ISAK nivel 1 ----------
import os, re
def aplicar(s, D):
    def rep(a, b):
        nonlocal s
        assert s.count(a) == 1, ('patrón', s.count(a), a[:80])
        s = s.replace(a, b, 1)
    i = s.index('var SITIOS=['); j = s.index('SITIOS.forEach(function(s){s.v=[null,null,null];});', i) + len('SITIOS.forEach(function(s){s.v=[null,null,null];});')
    s = s[:i] + open(os.path.join(D, 'isak.js')).read() + s[j:]
    rep("({sesion:vSesion,resumen:vResumen2,toma:vToma,", "({sesion:vSesion,resumen:vResumen2,toma:vToma2,")
    rep("var x=SITIOS[U.toma.i];x.v[+t.dataset.t]=", "var x=sitioActual();x.v[+t.dataset.t]=")
    rep("var bars=document.querySelectorAll('.pr i');if(bars[U.toma.i])bars[U.toma.i].className='on';", "")
    rep("case 'guardarToma':U.pila=[];toast('Toma guardada · Σ6 recalculada');", "case 'guardarToma':U.pila=[];cola('Toma ISAK · Σ6 '+(sumaPl(true)==null?'incompleta':co(sumaPl(true))+' mm'),paq('medidas',{protocolo:'ISAK restringido',filas:SITIOS.map(function(x){var e=evalSitio(x);return {nombre:x.n,valor:e.m==null?'':co(e.m),u:x.u};}).filter(function(f){return f.valor!=='';})}));toast('Toma guardada · Σ6 y Σ8 recalculadas');")
    # tabla de todas las medidas con los sitios ISAK
    a = s.index("var F=[['g','Pliegues (mm)']"); b = s.index("]]];", a) + 4
    s = s[:a] + """var F=[['g','Básicas'],['','Masa corporal (kg)',[79,78.5,78.5]],['','Talla (cm)',[176,176,176]],['g','Pliegues (mm)'],['','Tríceps',[10.5,10,10]],['','Subescapular',[12.5,12,12]],['','Bíceps',[5,5,5]],['','Cresta ilíaca',[16,15.5,15]],['','Supraespinal',[13,13,12.5]],['','Abdominal',[16.5,16.5,16]],['','Muslo frontal',[13.5,13.5,13]],['','Pantorrilla medial',[7.5,7,7]],['t','Σ 6',[73.5,72,70.5]],['t','Σ 8',[94.5,92.5,90.5]],['g','Perímetros (cm)'],['','Brazo relajado',[35.5,35.5,35.5]],['','Brazo flexionado',[37.5,37.5,38]],['','Cintura',[84,83.5,83.5]],['','Cadera',[98,98,98]],['','Pantorrilla',[38,38,38]],['g','Diámetros (cm)'],['','Húmero',[7.1,7.1,7.1]],['','Biestiloideo',[5.6,5.6,5.6]],['','Fémur',[9.9,9.9,9.9]]];""" + s[b:]
    rep("<p>14 tomas · última el 25 oct · próxima el 22 nov</p>", "<p>Protocolo ISAK · 14 tomas · última el 25 oct · próxima el 22 nov</p>")
    rep('</style></head>', CSS + '</style></head>')
    return s

CSS = """
/* ---------- toma ISAK ---------- */
.prb{height:6px;border-radius:3px;background:var(--line2);overflow:hidden}
.prb i{display:block;height:100%;border-radius:3px;background:var(--grad);transition:width .3s}
.vtx{margin:8px 0 10px;font-size:13px;color:var(--tx3)}.vtx b{color:var(--tx)}
.vprev{margin:8px 2px 0;font-size:13.5px;color:var(--tx3)}.vprev b{color:var(--tx)}
.tabla tr.g td{padding-top:12px}
"""
