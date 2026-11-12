# Musik + Effekte fuer Social-Video 2 (selbst erzeugt, keine fremden Rechte)
import numpy as np, wave, sys
sr=44100; D=14.0; n=int(sr*D); out=np.zeros(n); rng=np.random.default_rng(3)
CUT1=3.83; WEG=2.90; KC=[6.63,8.37,9.42]; CUT3=11.08
def add(s,x,g=1.0):
    s=int(s*sr); L=min(len(x),n-s)
    if L>0: out[s:s+L]+=x[:L]*g
def tone(f,d,dec): t=np.arange(int(d*sr))/sr; return np.sin(2*np.pi*f*t)*np.exp(-t*dec)
def kick(g=1.0): t=np.arange(int(.32*sr))/sr; return np.sin(2*np.pi*(46+110*np.exp(-t*34))*t)*np.exp(-t*11)*g
def noise(d): return rng.standard_normal(int(d*sr))
def hp(x,k=30): return x-np.convolve(x,np.ones(k)/k,'same')
def impact(): t=np.arange(int(1.1*sr))/sr; return np.sin(2*np.pi*(38+60*np.exp(-t*9))*t)*np.exp(-t*3.2)*1.0+hp(noise(1.1),8)*np.exp(-t*7)*.35
def whoosh(d=.45,up=True):
    L=int(d*sr); t=np.arange(L)/sr; e=np.sin(np.pi*t/d)**2; x=hp(noise(d),60 if up else 20); return x*e*(t/d if up else 1-t/d+.2)
bpm=124; beat=60/bpm
# Teil 1: Spannung (Puls auf einer Note, Ticks)
for b in np.arange(0,CUT1,beat/2):
    add(b,tone(55,.22,16),.30); add(b,hp(noise(.03),4)*np.exp(-np.arange(int(.03*sr))/sr*150),.05)
for b in np.arange(0,CUT1,beat): add(b,kick(.45))
# Aufbau (Riser) vor dem Wechsel
L=int(.9*sr); t=np.arange(L)/sr; add(CUT1-.9,(np.sin(2*np.pi*(200+900*(t/.9)**2)*t)*.12+hp(noise(.9),40)*.10)*(t/.9)**2)
add(WEG,impact(),.75); add(WEG-.33,whoosh(.33),.22)
# Teil 2: Drop (Kick, Bass, Hats, Akkord-Stabs) ab CUT1
add(CUT1,impact(),.9)
ch=[[110,164.81,220,261.63],[87.31,174.61,220,261.63],[130.81,196,261.63,329.63],[98,196,246.94,293.66]]
i=0
for b in np.arange(CUT1,D-.3,beat):
    add(b,kick(.95))
    c=ch[(i//4)%4]; 
    add(b+beat/2,(tone(c[0]/2,.26,9)+.4*tone(c[0],.26,9)),.42)       # Offbeat-Bass
    h=hp(noise(.05),3); add(b+beat/2,h*np.exp(-np.arange(len(h))/sr*110),.07)
    if i%2==0:
        st=sum(tone(f*2,.5,7)+.5*tone(f*4,.5,9) for f in c[1:]); add(b,st,.06)
    if i%4==2: cl=hp(noise(.12),6); add(b,cl*np.exp(-np.arange(len(cl))/sr*40),.16)   # Clap
    i+=1
for k in KC: add(k,impact(),.55); add(k-.2,whoosh(.2),.16)
add(CUT3-.3,whoosh(.3),.2); add(CUT3,impact(),.6)
add(CUT3+.5,whoosh(1.0,True),.14)                     # Papierflieger
for j,f in enumerate([880,1108.7,1318.5]): add(CUT3+1.15+j*.09,tone(f,.5,8),.10)  # Marke
out[-int(.25*sr):]*=np.linspace(1,0,int(.25*sr))
out=np.tanh(out*1.5)*.85
w=wave.open(sys.argv[1],'w'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((out*32767).astype(np.int16).tobytes()); w.close()
