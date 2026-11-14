# Musik + Effekte zur Geschichte (selbst erzeugt, keine fremden Rechte). Zeiten = M aus ad.html
import numpy as np, wave, sys
sr=44100; D=28.6; n=int(sr*D); L_=np.zeros(n); R_=np.zeros(n); rng=np.random.default_rng(11)
M=dict(swipe=2.01,type0=2.26,type1=3.72,res=3.92,km=5.62,tap1=7.78,old=8.34,das=8.84,zoom0=9.75,backT=11.11,tap2=12.45,sad=13.51,lost=15.57,rw0=17.28,rw1=18.26,tap3=18.97,neu=19.66,sc0=20.99,tap4=22.99,q=24.49,end=26.24)
def add(s,x,g=1.0,pan=0.0):
    s=int(s*sr); L=min(len(x),n-s)
    if L>0 and s>=0: L_[s:s+L]+=x[:L]*g*(1-max(0,pan)); R_[s:s+L]+=x[:L]*g*(1+min(0,pan))
def tone(f,d,dec,h=(1,)): t=np.arange(int(d*sr))/sr; return sum(a*np.sin(2*np.pi*f*(i+1)*t) for i,a in enumerate(h))*np.exp(-t*dec)
def hp(x,k=30): return x-np.convolve(x,np.ones(k)/k,'same')
def noise(d): return rng.standard_normal(int(d*sr))
def kick(): t=np.arange(int(.3*sr))/sr; return np.sin(2*np.pi*(48+100*np.exp(-t*34))*t)*np.exp(-t*12)
def impact(): t=np.arange(int(1.2*sr))/sr; return np.sin(2*np.pi*(38+70*np.exp(-t*9))*t)*np.exp(-t*3)+hp(noise(1.2),8)*np.exp(-t*7)*.3
def whoosh(d=.4): L=int(d*sr); t=np.arange(L)/sr; return hp(noise(d),50)*np.sin(np.pi*t/d)**2*(.3+.7*t/d)
def pad(fs,d,a=.5,r=.6): t=np.arange(int(d*sr))/sr; x=sum(np.sin(2*np.pi*(f+dt)*t) for f in fs for dt in(-.4,.4)); return x*np.minimum(1,t/a)*np.minimum(1,(d-t)/r)
def tap(): return tone(1500,.04,120)+hp(noise(.04),3)*np.exp(-np.arange(int(.04*sr))/sr*200)*.5
bpm=104; beat=60/bpm
# Akt 1 (0 - old): leichter Morgen, Zupfer in Dur
ch1=[[261.63,329.63,392.0],[220.0,261.63,329.63],[174.61,220.0,261.63],[196.0,246.94,293.66]]
i=0
for b in np.arange(0,M['old'],beat/2):
    c=ch1[(i//8)%4]; add(b,tone(c[i%3]*2,.4,8,(1,.3,.1)),.10,pan=(.4 if i%2 else -.4))
    if i%8==0: add(b,pad([c[0]/2,c[0]],beat*4+.2),.05)
    if i%2==0 and b>M['res']: add(b,kick(),.35)
    i+=1
add(.35,tone(1318.5,.5,7,(1,.4)),.12); add(.47,tone(1760,.6,6,(1,.4)),.12)          # Nachricht
add(M['swipe']-.1,whoosh(.4),.12)
for k in range(16): add(M['type0']+k*(M['type1']-M['type0'])/16,tap(),.07)
for t_ in (M['tap1'],M['tap2'],M['tap3'],M['tap4']): add(t_,tap(),.22)
# "und sieht DAS": Bruch
add(M['das']-.5,whoosh(.5),.18); add(M['das'],impact(),.85)
# Akt 2 (old - rw0): Spannung, dann traurig (Moll, langsam, tief)
for b in np.arange(M['old']+.6,M['sad'],beat): add(b,tone(55,.3,10),.28); add(b+beat/2,hp(noise(.03),4)*np.exp(-np.arange(int(.03*sr))/sr*150),.04)
add(M['backT'],whoosh(.35),.14)
add(M['sad']-.2,pad([110,130.81,164.81],M['rw0']-M['sad']+.2,1.0,.4),.075); add(M['sad']-.2,pad([55],M['rw0']-M['sad']+.2,1.0,.4),.12)
for k,f in enumerate([659.25,523.25,440.0,329.63]): add(M['sad']+.5+k*.75,tone(f,1.4,2.2,(1,.3)),.09,pan=(-.3 if k%2 else .3))
add(M['lost'],tone(196,.9,3,(1,.5)),.16)
# Zurückspulen
Lr=int((M['rw1']-M['rw0'])*sr); t=np.arange(Lr)/sr; d=M['rw1']-M['rw0']
add(M['rw0'],(np.sin(2*np.pi*np.cumsum(300+2200*(t/d)**1.5)/sr)*.10*np.sign(np.sin(2*np.pi*38*t))+hp(noise(d),30)*.10)*np.sin(np.pi*t/d)**.5)
add(M['rw1']-.02,impact(),.6)
# Akt 3 (ab neu): hell, treibend, Dur
add(M['neu']-.4,whoosh(.4),.2); add(M['neu'],impact(),1.0)
ch3=[[130.81,196.0,261.63,329.63],[196.0,246.94,293.66,392.0],[220.0,261.63,329.63,440.0],[174.61,220.0,261.63,349.23]]
i=0; bpm3=118; b3=60/bpm3
for b in np.arange(M['neu'],D-.5,b3):
    c=ch3[(i//4)%4]; add(b,kick(),.9); add(b+b3/2,tone(c[0]/2,.24,9,(1,.4)),.40)
    h=hp(noise(.05),3); add(b+b3/2,h*np.exp(-np.arange(len(h))/sr*110),.055,pan=.3)
    for k in range(2): add(b+k*b3/2,tone(c[1+((i*2+k)%3)]*2,.35,9,(1,.3,.1)),.085,pan=(-.5 if k else .5))
    if i%4==0: add(b,pad(c[1:],b3*4+.1,.15,.4),.03)
    if i%4==2: cl_=hp(noise(.12),6); add(b,cl_*np.exp(-np.arange(len(cl_))/sr*40),.14)
    i+=1
for k,f in enumerate([1046.5,1318.5,1568.0,2093.0]): add(M['tap4']+.35+k*.08,tone(f,.7,6,(1,.3)),.11,pan=(.5 if k%2 else -.5))   # reserviert
add(M['q']-.3,whoosh(.4),.14)
for k,f in enumerate([880,1108.7,1318.5]): add(M['end']+k*.09,tone(f,.6,7,(1,.3)),.09)
for a_ in (L_,R_): a_[-int(.35*sr):]*=np.linspace(1,0,int(.35*sr))
m=np.stack([np.tanh(L_*1.5)*.85,np.tanh(R_*1.5)*.85],1)
w=wave.open(sys.argv[1],'w'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes((m*32767).astype(np.int16).tobytes()); w.close()
