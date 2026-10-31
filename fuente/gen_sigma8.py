# Σ8 como suma principal: es la que usa el Monitor (suma de los 8 pliegues ISAK)
def rep(s,a,b,n=1):
    c=s.count(a); assert c==n,(a[:60],c); return s.replace(a,b)
def aplicar(s,D=None):
    s=rep(s,"s6:[78.5,74,75,73.5,72,70.5]","s6:[100.5,95,96,94.5,92.5,90.5]")
    s=rep(s,"['Pliegues','70,5','mm','−1,5','s6']","['Pliegues','90,5','mm','−2','s6']")
    s=rep(s,"s6:'Pliegues (suma de 6)'","s6:'Pliegues (suma de 8)'")
    s=rep(s,'Bajaron <b class="up">8 mm</b> en 6 meses','Bajaron <b class="up">10 mm</b> en 6 meses')
    s=rep(s,"['t','Σ 6',[73.5,72,70.5]],","")
    s=rep(s,"""<tr class="t"><td>Σ 6 pliegues</td><td>'+(s6==null?'—':co(s6))+'</td><td class="mu">70,5</td></tr>""","")
    s=rep(s,"Σ 6: tríceps, subescapular, supraespinal, abdominal, muslo frontal y pantorrilla medial. Σ 8 suma bíceps y cresta ilíaca.","Σ 8: la suma de los 8 pliegues del perfil ISAK. Es la misma que mira tu entrenador para seguir la grasa.")
    s=rep(s,"Toma ISAK · Σ6 '+(sumaPl(true)==null?'incompleta':co(sumaPl(true))+' mm')","Toma ISAK · Σ8 '+(sumaPl(false)==null?'incompleta':co(sumaPl(false))+' mm')")
    s=rep(s,"Toma guardada · Σ6 y Σ8 recalculadas","Toma guardada · Σ8 recalculada")
    return s
