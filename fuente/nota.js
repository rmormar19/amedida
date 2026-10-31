/* ================= nota por ejercicio para el entrenador ================= */
var NTAGS=[['dolor','Me dolió'],['pesado','Mucho peso'],['liviano','Poco peso'],['tecnica','Me costó la técnica'],['maquina','Cambié de máquina'],['bien','Me sentí muy bien']];
var NZONAS=['Hombro','Codo','Muñeca','Espalda baja','Cuello','Rodilla','Otra'],NINT=['Leve','Moderado','Fuerte'];
var NOTAS={},CLAVEN='amedida-notas-v1';
try{if(GUARDA)NOTAS=JSON.parse(localStorage.getItem(CLAVEN)||'{}')||{};}catch(e){}
function guardarNotas(){if(!GUARDA)return;try{localStorage.setItem(CLAVEN,JSON.stringify(NOTAS));}catch(e){}}
var ntag=function(k){for(var i=0;i<NTAGS.length;i++)if(NTAGS[i][0]===k)return NTAGS[i][1];return k;};
function resNota(n){return n.tags.map(function(k){return k==='dolor'?'Me dolió'+(n.zona||n.int?' ('+[n.zona,n.int].filter(Boolean).join(', ').toLowerCase()+')':''):ntag(k);}).join(' · ')||'Nota';}
var ICNOTA='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5z"/></svg>';
/* en la tarjeta del ejercicio */
function notaChip(e,ref){var n=NOTAS[e.id];
 if(!n)return '<button type="button" class="nadd" data-a="nota" data-v="'+ref+'">'+ICNOTA+'Nota para tu entrenador</button>';
 return '<button type="button" class="nchip'+(n.tags.indexOf('dolor')>=0?' dolor':n.tags.indexOf('bien')>=0?' bien':'')+'" data-a="nota" data-v="'+ref+'">'+ICNOTA+'<span>'+resNota(n)+(n.txt?' · “'+n.txt+'”':'')+'</span><small>enviada '+hhmm(n.t)+'</small></button>';}
/* hoja para escribir la nota */
function hojaNota(h){var e=BLQ[h.b].ej[h.k],dol=!!h.tags.dolor,ya=NOTAS[e.id];
 var s='<h2>Nota para tu entrenador</h2><p class="sub">'+e.n+' · le llega al instante</p>';
 s+='<span class="lbl fl">¿Qué pasó?</span><div class="ntg">'+NTAGS.map(function(t){return '<button type="button" class="'+t[0]+'" data-a="ntag" data-v="'+t[0]+'" aria-pressed="'+!!h.tags[t[0]]+'">'+t[1]+'</button>';}).join('')+'</div>';
 if(dol){s+='<div class="ndol"><span class="lbl">¿Dónde?</span><div class="ntg sm">'+NZONAS.map(function(z){return '<button type="button" data-a="nzona" data-v="'+z+'" aria-pressed="'+(h.zona===z)+'">'+z+'</button>';}).join('')+'</div>'+
  '<span class="lbl" style="margin-top:10px;display:block">¿Cuánto?</span><div class="seg sm nint">'+NINT.map(function(z){return '<button type="button" data-a="nint" data-v="'+z+'" aria-pressed="'+(h.int===z)+'">'+z+'</button>';}).join('')+'</div>'+
  (h.int==='Fuerte'?'<div class="al" style="margin-top:10px"><b>No sigas con este ejercicio.</b> Si el dolor es fuerte o punzante, dejalo hasta hablarlo con tu entrenador.</div>':'')+'</div>';}
 s+='<span class="lbl fl">Contale más <span style="text-transform:none;letter-spacing:0;font-weight:500">(opcional)</span></span><textarea id="ntxt" rows="3" placeholder="En qué serie, qué sentiste, si cambiaste algo…">'+(h.txt||'')+'</textarea>';
 s+='<button type="button" class="pri full" style="margin-top:12px" data-a="nmandar">'+ICNOTA+(ya?'Actualizar nota':'Mandar a tu entrenador')+'</button>'+(ya?'<button type="button" class="sec full" style="margin-top:8px" data-a="nborrar">Borrar nota</button>':'');
 return s;}
document.addEventListener('input',function(ev){if(ev.target.id==='ntxt'&&U.hoja&&U.hoja.t==='nota')U.hoja.txt=ev.target.value;});
function mandarNota(){var h=U.hoja,e=BLQ[h.b].ej[h.k],tags=NTAGS.map(function(t){return t[0];}).filter(function(k){return h.tags[k];}),txt=(h.txt||'').trim();
 if(!tags.length&&!txt){toast('Elegí qué pasó o escribí algo');return false;}
 if(h.tags.dolor&&!h.zona){toast('Contanos dónde te dolió');return false;}
 var n={tags:tags,zona:h.tags.dolor?h.zona:'',int:h.tags.dolor?(h.int||''):'',txt:txt,t:Date.now(),serie:hechasEj(h.b,h.k)};NOTAS[e.id]=n;guardarNotas();
 cola('Nota · '+e.n+' · '+resNota(n),paq('nota',{dia:DIA_SES,ejercicio:ejRef(e),tags:n.tags,zona:n.zona||null,intensidad:n.int||null,texto:n.txt||'',serie:n.serie}));toast('Nota enviada a tu entrenador');
 var rut={quien:NOMBRE,dia:'Brazos',ej:[]};BLQ.forEach(function(bb){bb.ej.forEach(function(x){rut.ej.push({id:x.id,n:x.n,pauta:(/(\d+ × \d+)/.exec(x.o)||['',''])[1]+' · '+co(x.p[0][0])+(x.u==='pl'?' pl':' kg')});});});
 var hist=null;try{var hx=PROG.histEj(e.id),lu=lunes(new Date());hist=[];for(var k=45;k<=51;k++){var o=hx[k],dd=new Date(lu.getTime()-(52-k)*7*864e5);hist.push({lab:dd.getDate()+'/'+(dd.getMonth()+1),w:o?o.w:null,r:o?o.r[0]:null,no:!o||!!o.de});}var sa=semActual(e.id);hist.push({lab:'Hoy',w:sa.w,r:sa.r[0],no:false});}catch(x){}
 try{window.parent.postMessage({am:'nota',id:e.id,uni:e.u==='pl'?'placas':'kg',rutina:rut,hist:hist,quien:NOMBRE,ej:e.n,res:resNota(n),txt:txt,dolor:tags.indexOf('dolor')>=0,fuerte:n.int==='Fuerte',serie:n.serie,t:n.t},'*');}catch(x){}
 return true;}
function hechasEj(b,k){var c=0;BLQ[b].h.forEach(function(r){if(r[k])c++;});return c;}

function semNota(t){return 52-Math.round((lunes(new Date()).getTime()-lunes(new Date(t)).getTime())/(7*864e5));}
function notaEnSemana(id,ks){var n=NOTAS[id]||NOTAS[String(id).replace(/^d(?=[A-Z])/,'')];if(!n||!ks)return null;if(ks.indexOf(semNota(n.t))<0)return null;var d=n.tags.indexOf('dolor')>=0;
 return {col:d?'var(--red)':'var(--a1)',ic:d?'⚠':'💬',et:resNota(n)+(n.txt?' · “'+n.txt+'”':'')};}
/* la semana en curso (todavía no cerrada): lo hecho hoy en la sesión, o lo pautado si aún no hizo series */
function semActual(id){var best=null,reps=[];BLQ.forEach(function(b){b.ej.forEach(function(e,k){if(e.id!==id)return;b.h.forEach(function(r,i){var x=r[k];if(x){reps.push(x[1]);if(!best||x[0]>best.w)best={w:x[0]};}});if(!best){best={w:e.p[0][0]};reps=e.p.map(function(s){return s[1];});}});});
 return {w:best?best.w:0,r:reps.length?reps:[0]};}
/* si el ejercicio tiene una nota de esta semana, su gráfico suma la semana en curso como última columna */
function conHoy(id,r){var n=NOTAS[id];if(!n||semNota(n.t)!==52)return r;return {pts:r.pts.slice(1).concat([semActual(id)]),lab:r.lab.slice(1).concat(['Hoy']),tip:r.tip.slice(1).concat(['Esta semana · en curso']),ks:r.ks.slice(1).concat([[52]])};}
