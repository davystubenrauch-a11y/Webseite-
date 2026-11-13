# Musik + Effekte (selbst erzeugt, keine fremden Rechte). Zeiten = MARKS aus ad.html
import numpy as np, wave, sys
sr=44100; D=19.0; n=int(sr*D); L_=np.zeros(n); R_=np.zeros(n); rng=np.random.default_rng(5)
T2=3.38; CLICK=4.76; WEG=5.06; T3=5.93; REV=7.51; T4=8.13; KC=[10.42,12.33,13.12]; T6=14.13; BR=16.4
def add(s,x,g=1.0,pan=0.0):
    s=int(s*sr); L=min(len(x),n-s)
    if L>0 and s>=0: L_[s:s+L]+=x[:L]*g*(1-max(0,pan)); R_[s:s+L]+=x[:L]*g*(1+min(0,pan))
def tone(f,d,dec,h=(1,)): t=np.arange(int(d*sr))/sr; return sum(a*np.sin(2*np.pi*f*(i+1)*t) for i,a in enumerate(h))*np.exp(-t*dec)
def hp(x,k=30): return x-np.convolve(x,np.ones(k)/k,'same')
def noise(d): return rng.standard_normal(int(d*sr))
def kick(): t=np.arange(int(.32*sr))/sr; return np.sin(2*np.pi*(46+110*np.exp(-t*34))*t)*np.exp(-t*11)
def impact(): t=np.arange(int(1.2*sr))/sr; return np.sin(2*np.pi*(36+70*np.exp(-t*9))*t)*np.exp(-t*3)+hp(noise(1.2),8)*np.exp(-t*7)*.35
def whoosh(d=.4): L=int(d*sr); t=np.arange(L)/sr; return hp(noise(d),50)*np.sin(np.pi*t/d)**2*(.3+.7*t/d)
bpm=122; beat=60/bpm
# Teil 1 (Problem): dunkler Puls, Ticks
for b in np.arange(0,T3,beat/2): add(b,tone(55,.2,16),.26); add(b,hp(noise(.025),4)*np.exp(-np.arange(int(.025*sr))/sr*160),.035,pan=(.5 if int(b/beat*2)%2 else -.5))
for b in np.arange(0,T3,beat): add(b,kick(),.4)
add(CLICK,tone(1100,.05,80),.25); add(WEG-.25,whoosh(.25),.2); add(WEG,impact(),.8)
# Teil 2 (Spannung): Stille + Riser bis zur Enthuellung
L=int((REV-T3)*sr); t=np.arange(L)/sr; d=REV-T3
add(T3,(np.sin(2*np.pi*(160+1100*(t/d)**2.2)*t)*.11+hp(noise(d),40)*.12)*(t/d)**2.4)
for i,b in enumerate(np.arange(T3,REV-.05,beat/2)): add(b,tone(55,.12,22),.18+.02*i)
# Teil 3 (Loesung): Drop, hell, treibend
add(REV,impact(),1.0)
ch=[[130.81,196.0,261.63,329.63],[98.0,196.0,246.94,293.66],[110.0,220.0,261.63,329.63],[87.31,174.61,220.0,261.63]]
i=0
for b in np.arange(REV,D-.4,beat):
    c=ch[(i//4)%4]; add(b,kick(),.95)
    add(b+beat/2,tone(c[0]/2,.26,9,(1,.4)),.42)
    h=hp(noise(.05),3); add(b+beat/2,h*np.exp(-np.arange(len(h))/sr*110),.06,pan=.3)
    for k in range(2): add(b+k*beat/2,tone(c[1+((i*2+k)%3)]*2,.35,10,(1,.3,.1)),.075,pan=(-.5 if k else .5))
    if i%4==2: clp=hp(noise(.12),6); add(b,clp*np.exp(-np.arange(len(clp))/sr*40),.15)
    i+=1
for k in KC: add(k-.2,whoosh(.2),.16); add(k,impact(),.55)
add(T6-.3,whoosh(.3),.2); add(T6,impact(),.6); add(T6+.45,whoosh(1.1),.12)
for j,f in enumerate([880,1108.7,1318.5]): add(BR+j*.09,tone(f,.6,7,(1,.3)),.10)
for a in (L_,R_): a[-int(.3*sr):]*=np.linspace(1,0,int(.3*sr))
m=np.stack([np.tanh(L_*1.5)*.85,np.tanh(R_*1.5)*.85],1)
w=wave.open(sys.argv[1],'w'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes((m*32767).astype(np.int16).tobytes()); w.close()
