# Arma la app instalable (PWA) a partir de la app nueva: /home/claude/pwa-out
import os, shutil, json, time, glob
D = '/home/claude/amedida-iphone'; P = os.path.join(D, 'pwa'); OUT = '/home/claude/pwa-out'
s = open(os.path.join(D, 'bocetos', 'rediseno.html')).read()
s = s.replace('"../cuerpo/', '"cuerpo/').replace('"../laminas/', '"laminas/').replace('"../laminas_mp4/', '"laminas_mp4/')
assert '"../' not in s
def rep(a, b):
    global s
    assert s.count(a) == 1, (s.count(a), a[:70]); s = s.replace(a, b, 1)
rep('<title>A medida · Entrenamiento integral</title>', '''<title>A medida · Entrenamiento integral</title>
<meta name="description" content="A medida · Entrenamiento integral. Tu entrenamiento, macros y medidas con Ricky.">
<link rel="manifest" href="manifest.webmanifest">
<meta name="theme-color" content="#0b1524" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#f3f5f9" media="(prefers-color-scheme: light)">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="A medida">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">''')
rep('/* ================= render ================= */', open(os.path.join(P, 'pwa.js')).read() + '\n/* ================= render ================= */')
rep(" case 'cerrar':U.hoja=null;break;", """ case 'cerrar':U.hoja=null;break;
 case 'instalar':if(PWA.evt){var ev=PWA.evt;PWA.evt=null;ev.prompt();ev.userChoice.then(function(){render();});return;}U.hoja={t:'inst'};break;
 case 'instNo':try{localStorage.setItem('am.inst.no','1');}catch(x){}break;""")
rep("if(h.t==='cola'||h.t==='notifs')s=HOJAS_EXTRA(h);", "if(h.t==='cola'||h.t==='notifs')s=HOJAS_EXTRA(h);\n if(h.t==='inst')s=hojaInstalar();")
rep('</style></head>', """
/* ---------- app instalada ---------- */
.inst{display:grid;grid-template-columns:44px 1fr;gap:12px;align-items:center;margin:0 0 14px;padding:14px;border-radius:20px;background:linear-gradient(135deg,rgba(var(--a1rgb),.18),rgba(79,209,230,.08));border:1px solid rgba(var(--a1rgb),.35);animation:entra .4s both}
.inst .ii{width:44px;height:44px;border-radius:12px;background:#0b1524;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px -6px rgba(0,0,0,.6)}
.inst .ii svg{width:30px;height:30px}
.inst b{display:block;font-size:15px}.inst .s{display:block;font-size:12.5px;color:var(--tx3);margin-top:2px;line-height:1.4}
.inst .ib2{grid-column:1/-1;display:flex;gap:8px}.inst .ib2 button{flex:1;height:42px}
.ipa{list-style:none;margin:12px 0 0;padding:0}
.ipa li{display:grid;grid-template-columns:28px 1fr;gap:10px;align-items:center;padding:10px 0;border-top:1px solid var(--line);font-size:14.5px;line-height:1.4}
.ipa li:first-child{border-top:0}
.ipa li>span{width:26px;height:26px;border-radius:9px;background:rgba(var(--a1rgb),.14);color:var(--a1);font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center}
.ipa svg{width:18px;height:18px;vertical-align:-4px;color:var(--a1)}
.nver{position:fixed;left:10px;right:10px;bottom:calc(var(--navh) + 14px + env(safe-area-inset-bottom,0px));z-index:55;display:flex;align-items:center;gap:10px;padding:10px 10px 10px 14px;border-radius:16px;background:var(--tx);color:var(--bg);box-shadow:var(--sh);animation:su .3s}
.nver span{flex:1;font-size:12.5px;line-height:1.35}.nver b{display:block;font-size:14px}
.nver button{height:38px;padding:0 14px;border:0;border-radius:11px;background:var(--a1);color:#fff;font:inherit;font-weight:700;font-size:13.5px}
.notifb{top:calc(8px + env(safe-area-inset-top,0px))}
@media (display-mode: standalone){html.claro body::before{background:#0e1a2b}}
</style></head>""")
if os.path.exists(OUT): shutil.rmtree(OUT)
os.makedirs(OUT + '/icons')
s = s.replace('AMedida', 'A medida')
open(OUT + '/index.html', 'w').write(s)
for d in ['cuerpo', 'laminas', 'laminas_mp4']:
    shutil.copytree(os.path.join(D, d), os.path.join(OUT, d), ignore=shutil.ignore_patterns('brazos.webp','espalda.webp','pecho.webp'))
ver = time.strftime('%Y%m%d%H%M')
extra = ['./cuerpo/' + os.path.basename(f) for f in sorted(glob.glob(OUT + '/cuerpo/*.webp'))] + ['./laminas/' + os.path.basename(f) for f in sorted(glob.glob(OUT + '/laminas/*.webp'))]
sw = open(os.path.join(P, 'sw.js')).read().replace('__VER__', ver).replace('__EXTRA__', json.dumps(extra))
open(OUT + '/sw.js', 'w').write(sw)
man = {"name": "A medida · Entrenamiento integral", "short_name": "A medida", "description": "Entrenamiento integral: tu entrenamiento, macros y medidas con Ricky.",
       "lang": "es", "dir": "ltr", "id": "./", "start_url": "./", "scope": "./", "display": "standalone", "orientation": "portrait",
       "background_color": "#0b1524", "theme_color": "#0b1524", "categories": ["health", "fitness", "sports"],
       "icons": [{"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
                 {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
                 {"src": "icons/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}],
       "shortcuts": [{"name": "Entreno de hoy", "url": "./?ir=hoy", "icons": [{"src": "icons/icon-192.png", "sizes": "192x192"}]},
                     {"name": "Macros", "url": "./?ir=mac", "icons": [{"src": "icons/icon-192.png", "sizes": "192x192"}]}]}
json.dump(man, open(OUT + '/manifest.webmanifest', 'w'), ensure_ascii=False, indent=1)
open(OUT + '/.nojekyll', 'w').write('')
print('ok', ver, len(s))
