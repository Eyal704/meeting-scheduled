from pathlib import Path
import numpy as np
import wave
S=44100; D=40.; beat=60/90; bar=4*beat
rng=np.random.default_rng(19)
a=np.zeros((int((D+3)*S),2),dtype=np.float64)
def hz(m):return 440*2**((m-69)/12)
def put(t,s,amp=1,pan=0):
 i=int(t*S);n=min(len(s),len(a)-i)
 if n<=0:return
 a[i:i+n,0]+=s[:n]*amp*np.sqrt((1-pan)/2)
 a[i:i+n,1]+=s[:n]*amp*np.sqrt((1+pan)/2)
def key(m,d=1.5):
 t=np.arange(int(d*S))/S;f=hz(m)
 env=(1-np.exp(-t/.012))*np.exp(-t/0.53)*np.minimum((d-t)/.16,1)
 return env*(np.sin(2*np.pi*f*t)+.20*np.sin(2*np.pi*2*f*t)*np.exp(-t/.22)+.07*np.sin(2*np.pi*3*f*t)*np.exp(-t/.12))
def pad(m,d=3.1):
 t=np.arange(int(d*S))/S;f=hz(m);env=np.minimum(t/.3,1)*np.minimum((d-t)/.5,1)
 return env*(.62*np.sin(2*np.pi*f*t)+.28*np.sin(2*np.pi*f*1.0015*t)+.10*np.sin(2*np.pi*2*f*t))
cycle=[[50,57,61,64,66],[47,54,57,62,66],[43,50,57,59,62],[45,52,57,59,64]]
chords=cycle*3+[cycle[2],cycle[3],cycle[0]]
for j,ch in enumerate(chords):
 start=j*bar
 for k,m in enumerate(ch[1:]):put(start,pad(m),.032,(-.6,.5,-.25,.3)[k])
 for b in [0,2]:
  t=np.arange(int(beat*1.7*S))/S
  bass=np.sin(2*np.pi*hz(ch[0]-12)*t)*(1-np.exp(-t/.025))*np.exp(-t/.4)*np.minimum((t[-1]-t)/.05,1)
  put(start+b*beat,bass,.09)
 pattern=([(0,1),(.75,3),(1.5,2),(2.5,4),(3.25,2)] if j<4 else [(0,2),(1,4),(1.75,3),(2.5,1),(3.25,3)])
 if 8<=j<11:pattern=[(0,1),(1.5,3),(3,2)]
 if j==14:pattern=[(0,1),(.3,2),(.6,3)]
 for b,k in pattern:
  put(start+b*beat,key(ch[k]+12),(.060 if 8<=j<11 else .067),(-.3 if k%2 else .3))
 for b in [0,2]:
  t=np.arange(int(.18*S))/S
  kick=np.sin(2*np.pi*(48*t+19*.022*(1-np.exp(-t/.022))))*np.exp(-t/.055)*(1-np.exp(-t/.002))
  put(start+b*beat,kick,.045)
 for b in ([] if j==14 else np.arange(.5,4,.5)):
  t=np.arange(int(.045*S))/S;noise=rng.normal(0,1,len(t));noise=np.convolve(noise,[.25,.5,.25],'same')
  put(start+b*beat,noise*np.exp(-t/.012)*(1-np.exp(-t/.002)),.008,(-.4 if int(b*2)%2 else .4))
# Soft ambience from short stereo echoes. No notification or compliance-success tones.
wet=a.copy()
for delay,level in [(.139,.11),(.283,.08),(.431,.045)]:
 n=int(delay*S);a[n:]+=wet[:-n,::-1]*level
n=int(D*S);a=a[:n];t=np.arange(n)/S
a*=np.minimum(t/.6,1)[:,None]*np.minimum((D-t)/2.4,1)[:,None]
a=np.tanh(a);peak=np.max(np.abs(a));a*=.27/peak
p=Path(__file__).parent/'warm-progress-full-v2.wav'
with wave.open(str(p),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(S);w.writeframes((a*32767).astype('<i2').tobytes())
print(p)
