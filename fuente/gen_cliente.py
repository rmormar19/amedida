# ---------- mejoras desde el uso de un cliente ----------
import os, re
def aplicar(s, D):
    def rep(a, b, n=1):
        nonlocal s
        assert s.count(a) == n, ('patrón', s.count(a), a[:80])
        s = s.replace(a, b)
    rep('/* ================= render ================= */', open(os.path.join(D, 'cliente.js')).read() + '\n/* ================= render ================= */')
    # sesión: ayuda única arriba, sin el párrafo fijo; "Siguiente: bloque" como botón principal
    rep("""s+='<p class="mu" style="font-size:12.5px;margin:10px 2px 0">Gris adentro de cada casilla: lo que te toca hoy (si la semana pasada llegaste al tope, ya viene con el aumento). Tocá la lámina o el nombre para ver cómo se hace. Tildá sin escribir y se copia. Al tocar el peso aparecen los botones − y +.</p>';""", "")
    rep("""s+='<div class="bajo">'+(ult?'':'<button type="button" class="sec" data-a="blq" data-v="'+(U.ses.b+1)+'">Siguiente '+I.der+'</button>')+'<button type="button" class="pri" data-a="terminar">Terminar sesión</button></div>';""", "s+=bajoSesion(ult);")
    rep("""var s='<div class="prog">""", """var s=tipSesion()+'<div class="prog">""")
    # terminar con series pendientes: pregunta antes
    rep("case 'terminar':soltarPantalla();", "case 'terminar':var hp=hechas();if(hp[0]<hp[1]&&v!=='1'){U.hoja={t:'term',f:hp[1]-hp[0]};break;}U.hoja=null;soltarPantalla();")
    rep("case 'sesion':U.hoja=null;pedirPantalla();", "case 'sesion':U.hoja=null;pedirPantalla();if(!U.ses.on){U.esf=null;}if(!U.ses.on||!U.ses.t0)U.ses.t0=Date.now();")
    # descanso por reloj: sigue bien aunque bloquees el celular o cambies de app
    rep("U.t={on:true,s:T,T:T,txt:txt};clearInterval(iv);iv=setInterval(function(){U.t.s--;", "U.t={on:true,s:T,T:T,txt:txt,fin:Date.now()+T*1000};clearInterval(iv);iv=setInterval(function(){U.t.s=Math.max(0,Math.ceil((U.t.fin-Date.now())/1000));")
    rep("case 'mas15':U.t.s+=15;", "case 'mas15':U.t.fin+=15000;U.t.s+=15;")
    # resumen real
    rep("resumen:vResumen,toma", "resumen:vResumen2,toma")
    # comidas: buscador de verdad, repetir de ayer y copiar el día
    rep("""<div class="srch">'+I.buscar+'Buscar o escribir una comida nueva</div>""", """<label class="srch">'+I.buscar+'<input id="cBus" type="search" placeholder="Buscar comida…" autocomplete="off" enterkeyhint="search"></label>""")
    rep("""<button type="button">'+I.rep+'Repetir '+m.n.toLowerCase()+' de ayer</button><button type="button">'+I.rep+'Copiar todo el día de ayer</button>""",
        """<button type="button" data-a="repAyer"'+(AYER[h.i]?'':' disabled')+'>'+I.rep+'Repetir '+m.n.toLowerCase()+' de ayer</button><button type="button" data-a="copiaDia">'+I.rep+'Copiar todo el día de ayer</button>""")
    rep("""(h.tab==='mis'?listaMis(h):'<div class="lista">'+""", """(h.tab==='mis'?listaMis(h):'<p class="sub" id="cNo" hidden style="margin:12px 0 0">No encontramos «<b></b>». <button type="button" class="lnk" data-a="comTab" data-v="mis">Guardala en Mis comidas</button></p><div class="lista">'+""")
    # Medidas: el cliente anota su peso; la toma completa es con el entrenador
    rep("""s+='<button type="button" class="pri full" data-a="toma" style="margin-bottom:14px">'+I.regla+'Nueva toma guiada</button>';""",
        """s+='<div class="bajo" style="margin:0 0 14px"><button type="button" class="pri" data-a="pesoHoy">'+I.mas+'Mi peso</button><button type="button" class="sec" data-a="toma">'+I.regla+'Toma completa</button></div>';""")
    # botones que no hacían nada
    rep("""<button type="button" class="yo" aria-label="Perfil de '+NOMBRE+'">""", """<button type="button" class="yo" data-a="perfil" aria-label="Tu perfil">""")
    rep("""<button type="button" class="sec" style="min-height:38px;font-size:13px">'+I.edit+'Objetivos</button>""", """<button type="button" class="sec" data-a="objetivos" style="min-height:38px;font-size:13px">'+I.edit+'Objetivos</button>""")
    rep("""aviso('flecha','','Curl en banco inclinado: subí a 14 kg',""", """aviso('flecha','','Curl en banco inclinado: subí a 14 kg',""")
    rep("""'La semana pasada hiciste 12 kg × 10 en las 3 series con RIR 2.')""", """'La semana pasada hiciste 12 kg × 10 en las 3 series con RIR 2.','b3')""")
    rep("""'4 placas × 12. Probá sumar una rep por serie antes de subir peso.')""", """'4 placas × 12. Probá sumar una rep por serie antes de subir peso.','b2')""")
    rep("""function aviso(ic,cl,t,s,tab){return '<button type="button" class="fila"'+(tab?' data-a="tab" data-v="'+tab+'"':'')+'>""",
        """function aviso(ic,cl,t,s,tab){return '<button type="button" class="fila"'+(tab&&tab.charAt(0)==='b'?' data-a="irBlq" data-v="'+tab.slice(1)+'"':tab?' data-a="tab" data-v="'+tab+'"':'')+'>""")
    rep("""if(h.t==='nota')s=hojaNota(h);""", """if(h.t==='nota')s=hojaNota(h);\n if(/^(term|peso|obj|perfil)$/.test(h.t))s=hojasCliente(h);""")
    rep(" case 'cerrar':U.hoja=null;break;", """ case 'cerrar':U.hoja=null;break;
 case 'tipOk':ponLS('am.tip.ses','1');break;
 case 'tipRe':ponLS('am.tip.ses','0');U.hoja=null;toast('La ayuda aparece al empezar la sesión');break;
 case 'volverSes':U.pila=['sesion'];irArriba();break;
 case 'irBlq':if(!U.ses.on){U.ses.on=true;U.ses.t0=Date.now();}U.ses.b=+v;U.tab='hoy';U.pila=['sesion'];U.hoja=null;pedirPantalla();irArriba();break;
 case 'repAyer':var ay=AYER[U.hoja.i];if(ay){NUT.com[U.hoja.i].it.push(ay.slice());cola('Comida · '+ay[0]);toast('Agregado: '+ay[0]);}U.hoja=null;break;
 case 'copiaDia':var nc=0;AYER.forEach(function(ay,i){if(ay&&!NUT.com[i].it.length){NUT.com[i].it.push(ay.slice());nc++;}});cola('Copió el día de ayer · '+nc+' comidas');toast(nc?'Copiado: '+nc+' comidas de ayer':'Ya tenés esas comidas anotadas');U.hoja=null;break;
 case 'pesoHoy':U.hoja={t:'peso',v:78.5};break;
 case 'pesoD':var pi=document.getElementById('pIn'),pv=num(pi.value)||U.hoja.v;U.hoja.v=Math.round((pv+(+v)*0.1)*10)/10;break;
 case 'pesoOk':var pv2=num(document.getElementById('pIn').value);if(!(pv2>30&&pv2<300)){toast('Revisá el peso');return;}cola('Peso · '+co(pv2)+' kg');toast('Peso anotado: '+co(pv2)+' kg');U.hoja=null;break;
 case 'objetivos':U.hoja={t:'obj'};break;
 case 'perfil':U.hoja={t:'perfil'};break;
 case 'modo':U.hoja=null;var tm=document.getElementById('tMod');if(tm)tm.click();break;""")
    rep("function despues(){", "function despues(){\n guardarSes2();")
    rep("case 'esf':U.esf=+v;break;", "case 'esf':U.esf=v;break;")
    rep("case 'guardarSes':U.pila=[];", "case 'guardarSes':if(!U.esf){toast('Elegí cómo sentiste el entrenamiento');return;}U.ses.on=false;U.ses.fin=true;U.t.on=false;clearInterval(iv);soltarPantalla();mandarSesionMonitor();U.pila=[];")
    rep("var btn=U.ses.on?(h[0]===h[1]?'Ver resumen':'Seguir sesión · '+h[0]+'/'+h[1]):'Empezar sesión';", "var btn=U.ses.fin?I.chk+'Hecha · esfuerzo '+U.esf:U.ses.on?(h[0]===h[1]?'Ver resumen':'Seguir sesión · '+h[0]+'/'+h[1]):'Empezar sesión';")
    rep("data-a=\"'+(U.ses.on&&h[0]===h[1]?'resumen':'sesion')+'\"", "data-a=\"'+(U.ses.fin||(U.ses.on&&h[0]===h[1])?'resumen':'sesion')+'\"")
    rep('</style></head>', CSS + '</style></head>')
    return s

CSS = """
/* ---------- mejoras de cliente ---------- */
.tip{margin:0 0 12px;padding:12px 14px;border-radius:16px;background:rgba(var(--a1rgb),.10);border:1px solid rgba(var(--a1rgb),.3);font-size:13.5px;animation:entra .35s both}
.tip ul{margin:6px 0 0;padding-left:18px;line-height:1.5;color:var(--tx2)}
.tip button{margin-top:8px;height:36px;padding:0 14px;border:0;border-radius:10px;background:var(--a1);color:var(--ink);font:inherit;font-weight:700;font-size:13px}
.bajo .pri svg,.pri.full svg{width:17px;height:17px;margin-right:6px;vertical-align:-3px}
.bajo .sec{flex:0 0 auto;padding:0 16px}
.cmp b.dn{color:var(--red)}
.esf3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}
.esf3 button{display:flex;flex-direction:column;align-items:center;gap:3px;padding:12px 6px 11px;border-radius:16px;border:1.5px solid var(--line2);background:var(--surf2);color:var(--tx);font:inherit;text-align:center;transition:transform .15s,border-color .2s,background .2s}
.esf3 button:active{transform:scale(.96)}
.esf3 i svg{width:26px;height:26px;fill:currentColor}
.esf3 b{font-size:15px}.esf3 span{font-size:11px;font-weight:500;color:var(--tx3);line-height:1.25}
.esf3 i{color:var(--a1)}
.esf3 button[aria-pressed="true"]{border-color:var(--a1);background:rgba(var(--a1rgb),.16)}
.srch input{flex:1;min-width:0;height:100%;border:0;background:transparent;color:var(--tx);font:inherit;outline:none;-webkit-appearance:none;appearance:none}
.srch input::-webkit-search-cancel-button{-webkit-appearance:none}
.fast button[disabled]{opacity:.45}
.sheet .lista .it[hidden]{display:none}
.lnk{border:0;background:none;padding:0;color:var(--a1);font:inherit;font-weight:700;text-decoration:underline}
.pesoin{display:grid;grid-template-columns:64px 1fr 64px;gap:10px;align-items:center;margin:16px 0 10px}
.pesoin>button{height:64px;border-radius:18px;border:1px solid var(--line2);background:var(--surf2);color:var(--a1);font:inherit;font-size:28px;font-weight:700}
.pesoin label{display:flex;align-items:baseline;justify-content:center;gap:6px;height:72px;border-radius:18px;border:2px solid var(--a1);background:var(--surf)}
.pesoin input{width:120px;height:68px;border:0;background:transparent;color:var(--tx);text-align:center;font:inherit;font-size:36px!important;font-weight:700;outline:none}
.pesoin span{color:var(--tx3);font-weight:600}
.pf{display:flex;align-items:center;gap:14px;margin-top:4px}
.pf h2{margin:0}.pf .sub{margin:2px 0 0}
.yo.grande{width:56px;height:56px;font-size:22px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:var(--grad);color:var(--ink);font-weight:700}
a.fila{color:inherit;text-decoration:none}
.ico.ok{background:rgba(var(--grnrgb),.14);color:var(--grn)}
.wab{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:14px;text-decoration:none;min-height:46px}
.wab svg{width:18px;height:18px}
"""
