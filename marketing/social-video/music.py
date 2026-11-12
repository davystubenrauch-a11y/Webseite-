import numpy as np, wave
sr=44100; D=20.0; n=int(sr*D); t=np.arange(n)/sr
out=np.zeros(n)
def env(x,a,r,L):
    e=np.ones(L); A=int(a*sr); R=int(r*sr)
    e[:A]=np.linspace(0,1,A); e[-R:]=np.linspace(1,0,R); return x*e
# chords (Am - F - C - G), 5 s each = 2 bars at 96 bpm
bpm=96; beat=60/bpm
ch=[[220.0,261.63,329.63],[174.61,220.0,261.63],[261.63,329.63,392.0],[196.0,246.94,293.66]]
bar=4*beat
for i in range(int(D/bar)+1):
    c=ch[i%4]; s=int(i*bar*sr); L=min(int(bar*sr),n-s)
    if L<=0: break
    tt=np.arange(L)/sr; x=np.zeros(L)
    for f in c:
        for dt in (-.4,.4): x+=np.sin(2*np.pi*(f+dt)*tt)+.35*np.sin(2*np.pi*2*(f+dt)*tt)
    x+=1.4*np.sin(2*np.pi*c[0]/2*tt)
    out[s:s+L]+=env(x,.25,.3,L)*.05
    # plucks on 8ths
    for k in range(8):
        f=c[k%3]*2; ps=s+int(k*beat/2*sr); PL=min(int(.35*sr),n-ps)
        if PL<=0: continue
        pt=np.arange(PL)/sr
        out[ps:ps+PL]+=np.sin(2*np.pi*f*pt)*np.exp(-pt*12)*.09
# kick on every beat from 3.0 s (after the hook), soft
for b in np.arange(0,D,beat):
    s=int(b*sr); L=min(int(.3*sr),n-s); pt=np.arange(L)/sr
    g=.5 if b>=3.0 else .22
    out[s:s+L]+=np.sin(2*np.pi*(50+70*np.exp(-pt*30))*pt)*np.exp(-pt*14)*g
# hats offbeat from 7.4
rng=np.random.default_rng(1)
for b in np.arange(beat/2,D,beat):
    if b<3.0: continue
    s=int(b*sr); L=min(int(.05*sr),n-s); pt=np.arange(L)/sr
    h=rng.standard_normal(L); h=h-np.concatenate([[0],h[:-1]])
    out[s:s+L]+=h*np.exp(-pt*90)*.035
# whooshes at scene changes
for w in (2.75,7.15,12.15,16.15):
    s=int(w*sr); L=int(.6*sr); pt=np.arange(L)/sr
    x=rng.standard_normal(L); k=np.cumsum(x)/40; x=x-np.convolve(x,np.ones(40)/40,'same')
    out[s:s+L]+=x*np.sin(np.pi*pt/.6)**3*.10
# star dings 13.9 + i*.14
for i in range(5):
    s=int((13.9+i*.14)*sr); L=int(.5*sr); pt=np.arange(L)/sr; f=880*2**(i*2/12)
    out[s:s+L]+=(np.sin(2*np.pi*f*pt)+.4*np.sin(2*np.pi*2*f*pt))*np.exp(-pt*9)*.10
out[-int(.8*sr):]*=np.linspace(1,0,int(.8*sr)); out[:int(.05*sr)]*=np.linspace(0,1,int(.05*sr))
out=np.tanh(out*1.6)*.8
w=wave.open('music.wav','w'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((out*32767).astype(np.int16).tobytes()); w.close()
