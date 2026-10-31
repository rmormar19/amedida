# ---------- extras 30 oct: guardado, cola para el panel, notificaciones, sesión de gimnasio, Mis comidas, contraste claro ----------
import os
def aplicar(s, D):
    def rep(a, b):
        nonlocal s
        assert s.count(a) == 1, ('patrón', s.count(a), a[:80])
        s = s.replace(a, b, 1)
    EX = open(os.path.join(D, 'extras.js')).read()
    rep('/* ================= render ================= */', EX + '\n/* ================= render ================= */')
    # barra de arriba: nube con contador real, campana, avatar con el nombre
    rep("""<button type="button" class="ib sync" data-a="sync" aria-label="1 cambio sin mandar al panel">'+I.nube+'</button>'+modoBtn()+'<button type="button" class="yo" aria-label="Perfil de Ricky">R</button>';""",
        """<button type="button" class="ib'+(COLA.length?' sync':'')+'" data-a="sync" aria-label="'+(COLA.length?COLA.length+' cambios sin mandar al panel':'Sin cambios pendientes')+'">'+I.nube+'</button><button type="button" class="ib campb" data-a="notifs" aria-label="Notificaciones'+(noLeidas()?', '+noLeidas()+' sin leer':'')+'">'+I.campana+(noLeidas()?'<i class="bdg">'+noLeidas()+'</i>':'')+'</button>'+modoBtn()+'<button type="button" class="yo" aria-label="Perfil de '+NOMBRE+'">'+NOMBRE.charAt(0)+'</button>';""")
    # pantalla de rutina nueva
    rep("var tt={sesion:'Brazos',resumen:'Sesión terminada',toma:'Nueva toma'}[push];var vol={sesion:TITULO[U.tab],resumen:'',toma:'Medidas'}[push];",
        "var tt={sesion:'Brazos',resumen:'Sesión terminada',toma:'Nueva toma',rnueva:'Rutina nueva'}[push];var vol={sesion:TITULO[U.tab],resumen:'',toma:'Medidas',rnueva:TITULO[U.tab]}[push];")
    rep("({sesion:vSesion,resumen:vResumen,toma:vToma}[push])()", "({sesion:vSesion,resumen:vResumen,toma:vToma,rnueva:vRnueva}[push])()")
    # saludo y aviso en Hoy
    rep("""<h1>Hola, Ricky</h1></div>'+""", """<h1>Hola, '+NOMBRE+'</h1></div>'+avisoHoy()+""")
    # carga sugerida + botones de peso
    rep("""'+(e.u==='pl'?'placas':'kg')+'</span></div></div>';}).join('');""", """'+(e.u==='pl'?'placas':'kg')+'</span>'+chipSug(e)+'</div></div>';}).join('');""")
    rep("""placeholder="'+co(p[j])+'" value="'+(x?co(x[j]):'')+'">';""",
        """placeholder="'+co(j===0?sugerido(e,i):p[j])+'"'+(j===0?' data-inc="'+incDe(e)+'" data-u="'+e.u+'" data-ant="'+co(p[0])+'"':'')+' value="'+(x?co(x[j]):'')+'">';""")
    rep("Gris adentro de cada casilla: lo de la semana pasada. Tildá sin escribir y se copia.",
        "Gris adentro de cada casilla: lo que te toca hoy (si la semana pasada llegaste al tope, ya viene con el aumento). Tildá sin escribir y se copia. Al tocar el peso aparecen los botones − y +.")
    # fin de descanso, pantalla encendida
    rep("if(U.t.s<=0){U.t.on=false;clearInterval(iv);}", "if(U.t.s<=0){U.t.on=false;clearInterval(iv);finDescanso();}")
    rep(" case 'sesion':U.hoja=null;", " case 'sesion':U.hoja=null;pedirPantalla();")
    rep(" case 'terminar':", " case 'terminar':soltarPantalla();")
    # acciones nuevas
    rep(" case 'sync':toast('1 cambio en la cola para el panel');return;", " case 'sync':U.hoja={t:'cola'};break;")
    rep(" case 'cerrar':U.hoja=null;break;", """ case 'cerrar':U.hoja=null;break;
 case 'notifs':U.hoja={t:'notifs'};break;
 case 'rnOk':var nr=NOTIFS[U.rn||0];if(nr)nr.vista=true;U.pila=[];U.tab='hoy';irArriba();break;
 case 'abrirNotif':U.rn=+v;if(NOTIFS[+v])NOTIFS[+v].leida=true;U.hoja=null;U.pila=['rnueva'];irArriba();break;
 case 'comTab':U.hoja.tab=v;break;
 case 'sumarMis':U.hoja.okm=U.hoja.okm||{};if(U.hoja.okm[v])return;var mm=MISCOM[+v];NUT.com[U.hoja.i].it.push([mm[0],mm[1],mm[2],mm[3]]);U.hoja.okm[v]=true;break;
 case 'nuevaMis':var nm=['nmN','nmP','nmC','nmG'].map(function(id){return document.getElementById(id).value.trim();});if(!nm[0]){toast('Poné el nombre de la comida');return;}
  var nn=[nm[0],Math.round(num(nm[1]||'0'))||0,Math.round(num(nm[2]||'0'))||0,Math.round(num(nm[3]||'0'))||0];MISCOM.unshift(nn);U.hoja.okm={};cola('Comida nueva guardada · '+nn[0]);toast('Guardada en Mis comidas');break;""")
    # hoja de Agregar: pestañas reales (Recientes / Mis comidas)
    rep("""<div class="seg sm" style="margin-top:12px"><button type="button" aria-pressed="true">Recientes</button><button type="button" aria-pressed="false">Más usadas</button><button type="button" aria-pressed="false">Plantillas</button></div><div class="lista">'+""",
        """<div class="seg sm" style="margin-top:12px"><button type="button" data-a="comTab" data-v="rec" aria-pressed="'+(h.tab!=='mis')+'">Recientes</button><button type="button" data-a="comTab" data-v="mis" aria-pressed="'+(h.tab==='mis')+'">Mis comidas · '+MISCOM.length+'</button></div>'+(h.tab==='mis'?listaMis(h):'<div class="lista">'+""")
    rep(""".join('')+'</div>';\n  var f=Math.max""", """.join('')+'</div>');\n  var f=Math.max""")
    # hojas nuevas
    rep("""c.innerHTML='<div class="velo" data-a="cerrar">""", """if(h.t==='cola'||h.t==='notifs')s=HOJAS_EXTRA(h);\n c.innerHTML='<div class="velo" data-a="cerrar">""")
    # guarda en el celular después de cada cambio
    rep("function despues(){", "function despues(){\n guardar();")
    # arranque
    rep("BLQ[0].h[0]=[[7,12,1],[5,12,1]];\n", "BLQ[0].h[0]=[[7,12,1],[5,12,1]];\nextrasInit();\n")
    rep('</style></head>', CSS + '</style></head>')
    return s

CSS = """
/* ---------- extras 30 oct ---------- */
html.claro{--tx2:#3d4a60;--tx3:#525e75;--tx4:#6b778c;--line:#dce2ea;--line2:#c9d2de}
.campb{position:relative}
.bdg{position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--red);color:#fff;font-size:11px;font-weight:700;font-style:normal;line-height:18px;text-align:center;box-shadow:0 0 0 2px var(--bg);animation:bdgIn .35s cubic-bezier(.3,1.6,.5,1)}
@keyframes bdgIn{from{transform:scale(0)}to{transform:scale(1)}}
.top .ib svg{width:20px;height:20px}
.ndot{width:9px;height:9px;border-radius:50%;background:var(--a1)}
/* banner tipo iPhone */
.notifb{position:fixed;left:8px;right:8px;top:8px;z-index:60;display:flex;gap:11px;align-items:flex-start;text-align:left;padding:11px 13px;border-radius:20px;border:1px solid rgba(var(--fg),.08);background:var(--glass);backdrop-filter:blur(22px) saturate(1.4);-webkit-backdrop-filter:blur(22px) saturate(1.4);color:var(--tx);box-shadow:0 18px 40px -14px rgba(0,0,0,.55);transform:translateY(-140%);opacity:0;transition:transform .5s cubic-bezier(.2,1.25,.4,1),opacity .3s;font:inherit}
html.enmarco .notifb{top:52px}
.notifb.on{transform:none;opacity:1}
.nbi{flex:0 0 38px;width:38px;height:38px;border-radius:10px;background:#0b1524;display:flex;align-items:center;justify-content:center}
.nbi svg{width:28px;height:28px}
.nbt{display:flex;flex-direction:column;gap:1px;font-size:13.5px;line-height:1.3;min-width:0;flex:1}
.nbt .nbh{display:flex;justify-content:space-between;font-size:12px;color:var(--tx3);text-transform:uppercase;letter-spacing:.03em}
.nbt .nbh b{font-weight:600}.nbt .nbh small{font-size:12px;text-transform:none}
.nbt>span:last-child{color:var(--tx2)}
/* aviso en Hoy y pantalla de rutina nueva */
.aviso{display:flex;gap:12px;align-items:center;width:100%;margin:0 0 14px;padding:12px 14px;border-radius:18px;border:1px solid rgba(var(--a1rgb),.35);background:linear-gradient(135deg,rgba(var(--a1rgb),.16),rgba(var(--a1rgb),.05));text-align:left;color:var(--tx);font:inherit;animation:entra .4s both}
.aviso .ico{position:relative}
.aviso .ico::after{content:"";position:absolute;top:-2px;right:-2px;width:10px;height:10px;border-radius:50%;background:var(--red);box-shadow:0 0 0 2px var(--surf)}
.aviso b{display:block;font-size:14.5px}.aviso .s{font-size:12.5px;color:var(--tx3)}
.aviso .ir{margin-left:auto;font-size:13px;font-weight:700;color:var(--a1);white-space:nowrap}
.rnx{display:grid;grid-template-columns:30px 1fr;gap:10px;align-items:center;padding:11px 0;border-top:1px solid var(--line);animation:entra .35s both}
.rnx:first-child{border-top:0}
.rnn{width:28px;height:28px;border-radius:9px;background:rgba(var(--a1rgb),.14);color:var(--a1);font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center}
.rnx b{display:block;font-size:14.5px}.rnx .s{font-size:12.5px;color:var(--tx3)}
/* sesión: carga sugerida, botones de peso, fin de descanso */
.sugc{display:inline-block;margin-top:6px;padding:4px 9px;border-radius:9px;background:rgba(var(--grnrgb),.14);color:var(--grn);font-size:12px;font-weight:600;line-height:1.35}
.acc{position:fixed;left:8px;right:8px;bottom:calc(10px + env(safe-area-inset-bottom,0px));z-index:45;display:grid;grid-template-columns:64px 1fr 64px auto;gap:6px;align-items:center;padding:7px;border-radius:18px;background:var(--glass);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid var(--line2);box-shadow:var(--sh);animation:su .2s}
.acc[hidden]{display:none}
html.enmarco .acc{bottom:30px}
.acc button{height:44px;border:0;border-radius:12px;background:rgba(var(--a1rgb),.14);color:var(--a1);font:inherit;font-weight:700;font-size:14px}
.acc .ant{padding:0 10px;background:var(--surf2);color:var(--tx2);font-size:12.5px}
.acc span{text-align:center;font-weight:700;font-size:15px}
body.flash::after{content:"";position:fixed;inset:0;z-index:70;pointer-events:none;box-shadow:inset 0 0 0 4px var(--grn);animation:fl 1s ease-out}
@keyframes fl{0%,40%{opacity:1}100%{opacity:0}}
/* Mis comidas */
.nmf{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:10px}
.nmf input{width:100%;height:42px;padding:0 10px;border-radius:12px;border:1px solid var(--line2);background:var(--surf2);color:var(--tx);font:inherit;font-size:14px}
.nmf input#nmN{grid-column:1/-1}
.nmf .sec{grid-column:1/-1;height:44px}
/* Hoy: botón central destacado */
.nv[data-v="hoy"] svg{width:26px;height:26px;padding:11px;box-sizing:content-box;margin-top:-26px;border-radius:50%;background:linear-gradient(135deg,#6e9bff,#4fd1e6);color:#fff!important;box-shadow:0 10px 22px -8px rgba(var(--a1rgb),.8),0 0 0 5px var(--bg);transition:transform .25s cubic-bezier(.3,1.6,.5,1)}
.nv[data-v="hoy"].on svg{transform:scale(1.07)}
.nv[data-v="hoy"]:active svg{transform:scale(.94)}
.nv[data-v="hoy"].on::before{display:none}
.nv[data-v="hoy"] .pt{top:-18px;right:calc(50% - 26px)}
"""
