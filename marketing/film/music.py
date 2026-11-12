# Musik + Effekte fuer den FOAV-Film (selbst erzeugt, keine fremden Rechte)
import numpy as np, wave, sys
sr=44100; D=25.6; n=int(sr*D); L_=np.zeros(n); R_=np.zeros(n); rng=np.random.default_rng(7)
S=[0,2.8,6.6,9.9,14.8,18.3,21.3]
def add(s,x,g=1.0,pan=0.0):
    s=int(s*sr); L=min(len(x),n-s)
    if L>0 and s>=0: L_[s:s+L]+=x[:L]*g*(1-max(0,pan)); R_[s:s+L]+=x[:L]*g*(1+min(0,pan))
def tone(f,d,dec,h=(1,)): t=np.arange(int(d*sr))/sr; return sum(a*np.sin(2*np.pi*f*(i+1)*t) for i,a in enumerate(h))*np.exp(-t*dec)
def hp(x,k=30): return x-np.convolve(x,np.ones(k)/k,'same')
def noise(d): return rng.standard_normal(int(d*sr))
def kick(): t=np.arange(int(.3*sr))/sr; return np.sin(2*np.pi*(48+95*np.exp(-t*36))*t)*np.exp(-t*12)
def whoosh(d=.5): L=int(d*sr); t=np.arange(L)/sr; return hp(noise(d),50)*np.sin(np.pi*t/d)**2*(.3+.7*t/d)
def pad(fs,d): t=np.arange(int(d*sr))/sr; x=sum(np.sin(2*np.pi*(f+dt)*t) for f in fs for dt in(-.5,.5)); e=np.minimum(1,t/.4)*np.minimum(1,(d-t)/.5); return x*e
bpm=112; beat=60/bpm; bar=4*beat
ch=[[261.63,329.63,392.0],[196.0,246.94,293.66],[220.0,261.63,329.63],[174.61,220.0,261.63]]   # C G Am F
nb=int(D/bar)+1
for i in range(nb):
    c=ch[i%4]; s=i*bar
    add(s,pad(c,bar+.2),.035); add(s,pad([c[0]/2],bar+.2),.07)
    arp=[c[0],c[1],c[2],c[1]*2,c[2],c[1],c[0]*2,c[2]]
    for k in range(8):
        add(s+k*beat/2,tone(arp[k]*2,.4,9,(1,.3,.1)),.085,pan=(-.5 if k%2 else .5))
    if s>=S[1]-.01:
        for b in range(4):
            add(s+b*beat,kick(),.6)
            h=hp(noise(.04),3); add(s+b*beat+beat/2,h*np.exp(-np.arange(len(h))/sr*120),.045)
            add(s+b*beat+beat/2,tone(c[0]/2,.2,10,(1,.5)),.22)
        cl=hp(noise(.1),6); 
        for b in (1,3): add(s+b*beat,cl*np.exp(-np.arange(len(cl))/sr*45),.11)
for c in S[1:]: add(c-.38,whoosh(.5),.16)
for i in range(14): add(S[2]+.55+i*1.05/14,tone(1800+rng.random()*500,.03,150),.10)     # Tippen
add(S[2]+2.5,tone(900,.08,60),.3); add(S[2]+2.52,kick(),.5)                                # Klick
for i in range(4): add(S[5]+.9+i*.13,tone(1046.5*2**(i*2/12),.6,7,(1,.4)),.12,pan=(.6 if i%2 else -.6))   # Sterne
add(S[6]+2.05,tone(130.81,2.5,1.2,(1,.5,.25)),.25); add(S[6]+2.7,tone(1568,.9,5,(1,.3)),.10)
for a in (L_,R_): a[-int(1.2*sr):]*=np.linspace(1,0,int(1.2*sr))**1.5
m=np.stack([np.tanh(L_*1.4)*.85,np.tanh(R_*1.4)*.85],1)
w=wave.open(sys.argv[1],'w'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes((m*32767).astype(np.int16).tobytes()); w.close()
