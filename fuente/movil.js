/* ================= celular: atrás del sistema, hojas que se cierran deslizando, teclado ================= */
/* botón/gesto "atrás" de Android: cierra la hoja o vuelve de la pantalla, en vez de salir de la app */
var HG={on:false,skip:false};
function hayCapa(){return !!U.hoja||U.pila.length>0;}
function sincHist(){try{if(hayCapa()&&!HG.on){history.pushState({am:1},'');HG.on=true;}else if(!hayCapa()&&HG.on){HG.on=false;HG.skip=true;history.back();}}catch(e){}}
window.addEventListener('popstate',function(){if(HG.skip){HG.skip=false;return;}HG.on=false;if(U.hoja)U.hoja=null;else if(U.pila.length)U.pila.pop();render();});
/* hoja abierta: el fondo no se mueve; se cierra deslizando hacia abajo desde arriba */
var SW=null;
document.addEventListener('touchstart',function(e){var sh=e.target.closest&&e.target.closest('.sheet');if(!sh||e.touches.length>1){SW=null;return;}
 var desdeArriba=e.target.closest('.shd')||sh.scrollTop<=0;SW=desdeArriba?{sh:sh,y:e.touches[0].clientY,dy:0,t:Date.now()}:null;},{passive:true});
document.addEventListener('touchmove',function(e){if(!SW)return;var dy=e.touches[0].clientY-SW.y;if(dy<=0||SW.sh.scrollTop>0){if(SW.dy){SW.sh.style.transform='';}SW.dy=0;return;}
 SW.dy=dy;SW.sh.style.transition='none';SW.sh.style.transform='translateY('+dy+'px)';},{passive:true});
document.addEventListener('touchend',function(){if(!SW)return;var s=SW;SW=null;if(!s.dy)return;var rapido=s.dy>40&&Date.now()-s.t<250;
 if(s.dy>110||rapido){s.sh.style.transition='transform .2s ease';s.sh.style.transform='translateY(100%)';setTimeout(function(){U.hoja=null;render();},180);}
 else{s.sh.style.transition='transform .2s ease';s.sh.style.transform='';}},{passive:true});
/* teclado abierto: la barra de − / + del peso queda arriba del teclado */
if(window.visualViewport){(function(){var vv=window.visualViewport;function aj(){var a=document.getElementById('acc');if(!a)return;var off=window.innerHeight-vv.height-vv.offsetTop;a.style.transform=off>60?'translateY('+(-off+10)+'px)':'';}
 vv.addEventListener('resize',aj);vv.addEventListener('scroll',aj);})();}
