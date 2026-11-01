# ---------- Monitor → app: la app arma Hoy, sesión, calendario y medidas con los datos del panel ----------
import os
def aplicar(s, D):
    def rep(a, b, n=1):
        nonlocal s
        assert s.count(a) == n, ('patrón', s.count(a), a[:80])
        s = s.replace(a, b)
    rep("\nrender();\n(function(){var sp=", "\n"+open(os.path.join(D,'modelo.js')).read()+"\n"+open(os.path.join(D,'panel.js')).read()+"\n"+open(os.path.join(D,'progreso_real.js')).read()+"\n"+open(os.path.join(D,'real.js')).read()+"\nrender();\n(function(){var sp=")
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
    rep("case 'pesoHoy':U.hoja={t:'peso',v:78.5};", "case 'pesoHoy':U.hoja={t:'peso',v:PANEL?pesoUlt():78.5};")
    rep("s+=[0,1,2].map(function(i){var todas=b.h[i].every(Boolean);", "s+=b.h.map(function(_r,i){var todas=b.h[i].every(Boolean);")
    rep("(b.drop&&i===2?", "(b.drop&&i===b.h.length-1?")
    rep("placeholder=\"'+co(j===0?sugerido(e,i):p[j])+'\"", "placeholder=\"'+phSer(e,i,j)+'\"")
    rep("bl.h[i][k]=[].map.call(ins,function(n){return num(n.value!==''?n.value:n.placeholder);});", "var vv=[].map.call(ins,function(n){return num(n.value!==''?n.value:n.placeholder);});if(isNaN(vv[0])){toast('Anotá el peso que usaste');return;}if(isNaN(vv[1])){toast('Anotá las repeticiones que hiciste');return;}if(isNaN(vv[2]))vv[2]='';bl.h[i][k]=vv;")
    rep("var nx=i<2?", "var nx=i<bl.h.length-1?")
    rep("value=\"'+(x?co(x[j]):'')+'\"", "value=\"'+(x&&x[j]!==''?co(x[j]):'')+'\"")
    rep("' · RIR '+x[2],paq('serie'", "(x[2]!==''?' · RIR '+x[2]:''),paq('serie'")
    rep("if(x)rr.push(x[2])", "if(x&&x[2]!=='')rr.push(+x[2])")
    rep("if(x)rirs.push(x[2])", "if(x&&x[2]!=='')rirs.push(+x[2])")
    rep("pres=[[m?m[1]+' × '+m[2]:e.o,'series × reps'],[co(sugerido(e,0)),", "pres=[[e.rr?e.o.split(' · ')[0]:(m?m[1]+' × '+m[2]:e.o),'series × reps'],[e.sinPeso?'—':co(sugerido(e,0)),")
    rep('</style></head>', CSS + '</style></head>')
    return s

CSS = '''
/* ---------- modelos mujer: lo que todavía no tiene versión mujer no se muestra ---------- */
.sin-modelo{visibility:hidden!important}
.lam0{background:var(--surf2)}
.ent .img:has(img.sin-modelo),.mapa:has(img.sin-modelo){display:none}
/* ---------- progreso y medidas del cliente ---------- */
.ppx{display:grid;grid-template-columns:minmax(0,1fr) auto 64px;gap:10px;align-items:center;width:100%;padding:11px 0;border:0;border-bottom:1px solid var(--line);background:none;color:inherit;text-align:left;font:inherit;cursor:pointer}
.ppx:last-child{border-bottom:0}.ppx b{display:block;font-size:15px}.ppx .s{display:block;font-size:12.5px;color:var(--tx3);margin-top:1px}
.ppx.on b{color:var(--a1)}
.esfw{display:flex;gap:6px;align-items:flex-end;overflow-x:auto;padding:8px 0 2px}.esfc{flex:1;min-width:34px;display:flex;flex-direction:column;align-items:center;gap:5px}
.esfd{display:flex;flex-direction:column-reverse;gap:3px;min-height:46px;justify-content:flex-start}.esfd i{width:14px;height:14px;border-radius:50%;display:block}
.esfc small{font-size:10px;color:var(--tx4);white-space:nowrap}.esfl{display:inline-block;width:9px;height:9px;border-radius:50%;margin:0 3px 0 8px;vertical-align:0}
.gbar{display:flex;flex-direction:column;gap:9px;margin-top:10px}.gb{display:grid;grid-template-columns:88px 1fr 38px;gap:10px;align-items:center;font-size:13.5px}
.gt{position:relative;height:10px;border-radius:6px;background:var(--surf2)}.gt i{position:absolute;left:0;top:0;bottom:0;border-radius:6px}.gt b{position:absolute;top:-3px;bottom:-3px;width:2px;background:var(--tx3);opacity:.6}
.gb em{font-style:normal;font-weight:700;text-align:right}
/* ---------- conectar la app con el link del entrenador ---------- */
.conx{position:fixed;inset:0;z-index:9999;background:var(--bg);display:flex;align-items:center;justify-content:center;padding:24px;padding-top:max(24px,env(safe-area-inset-top))}
.conx-in{width:100%;max-width:380px;display:flex;flex-direction:column;gap:12px}
.conx-lg b{display:block;font-size:22px;font-weight:800;letter-spacing:-.02em}.conx-lg small{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--tx3)}
.conx h1{margin:18px 0 0;font-size:28px;letter-spacing:-.02em}.conx p{margin:0;color:var(--tx3);font-size:15px}
.conx input{height:52px;border-radius:14px;border:1px solid var(--line2);background:var(--surf2);color:var(--tx);padding:0 14px;font:inherit;font-size:16px!important}
.conx .conx-e{color:var(--red);font-size:14px;min-height:20px}
'''
