/* ================= modelos mujer para las clientas =================
   Si la clienta es mujer, todas las imágenes de personas (láminas, animaciones, mapas de músculos)
   salen de la versión mujer. Las láminas que ya tienen una mujer se usan tal cual; para las demás
   se busca  <carpeta>/mujer/<archivo>  y, si todavía no existe, no se muestra ninguna (nunca un hombre). */
var MUJER=false;
var FEM_OK={};['bulgara','curl','curlinclinado','gen_adu','gen_apc','gen_cma','gen_eta','gen_etb','hack','hipthrust','pressinclinado','rumano','smith','tricmanc','vuelosmanc'].forEach(function(k){FEM_OK['laminas/'+k]=1;FEM_OK['laminas_mp4/'+k]=1;});
function rutaFem(src){var m=String(src).match(/^(.*?)(laminas_mp4|laminas|cuerpo|fichas)\/([^\/?#]+?)(\.\w+)([?#].*)?$/);if(!m||/\/mujer\//.test(src))return null;
 if(FEM_OK[m[2]+'/'+m[3]])return null;return m[1]+m[2]+'/mujer/'+m[3]+m[4]+(m[5]||'');}
function fixMedia(root){if(!MUJER||!root||root.nodeType!==1)return;var L=[].slice.call(root.querySelectorAll('img[src],video[src],source[src],video[poster]'));if(root.matches&&root.matches('img[src],video[src],source[src],video[poster]'))L.push(root);
 L.forEach(function(el){['src','poster'].forEach(function(at){var v=el.getAttribute(at);if(!v)return;var n=rutaFem(v);if(n){el.setAttribute(at,n);if(el.tagName==='SOURCE'&&el.parentNode&&el.parentNode.load)el.parentNode.load();}});});}
new MutationObserver(function(ms){if(!MUJER)return;ms.forEach(function(m){if(m.type==='attributes')fixMedia(m.target);else m.addedNodes.forEach(function(n){fixMedia(n);});});}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src','poster']});
document.addEventListener('error',function(e){var t=e.target;if(!MUJER||!t||!t.getAttribute)return;var v=t.getAttribute('src')||t.getAttribute('poster')||'';if(v.indexOf('/mujer/')<0)return;
 t.classList.add('sin-modelo');if(t.tagName==='SOURCE'&&t.parentNode)t.parentNode.classList.add('sin-modelo');},true);
function setModelo(sx){var m=/^f/i.test(String(sx||''));if(m!==MUJER){MUJER=m;fixMedia(document.body);try{render();}catch(e){}}}
