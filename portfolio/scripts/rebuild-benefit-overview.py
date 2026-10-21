"""Reframe the portfolio overview around business benefits; preserve source speech.
Usage: python rebuild-benefit-overview.py --source V3.mp4 --voice speech.wav
       --music cylinder-seven.m4a --output output/video/benefit-overview-v4
Requires FFmpeg with drawtext, fontTools, Pillow and NumPy.
"""
from pathlib import Path
import argparse, subprocess, json, wave, shutil, concurrent.futures
import numpy as np
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import ImageFont

args=argparse.ArgumentParser()
for n in ['source','voice','music','output']:args.add_argument('--'+n,required=True)
args.add_argument('--reuse-scenes',action='store_true')
a=args.parse_args();out=Path(a.output).resolve();out.mkdir(parents=True,exist_ok=True)
repo=Path(__file__).resolve().parents[2]
ff='/opt/homebrew/opt/ffmpeg-full/bin/ffmpeg'
if not Path(ff).exists():ff='ffmpeg'
font_source=repo/'node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2'
fonts={}
for weight in [400,600,700]:
 f=TTFont(font_source);f=instantiateVariableFont(f,{'wght':weight},inplace=True);f.flavor=None
 dest=out/f'dm-{weight}.ttf';f.save(dest);fonts[weight]=dest

# Boundaries are integer frames at 30fps to prevent cumulative audio drift.
scenes=[
 dict(id='opening',start=0,end=30,frames=120,kind='opening',title='More replies.\nMore calls.\nLess manual work.',detail='A sales system you can repeat.'),
 dict(id='research',start=30,end=480,kind='screen',kicker='01 / PROSPECT RESEARCH',title='Know who\nis worth\ncontacting.',detail='Less manual research.\nBetter reasons to reach out.'),
 dict(id='email',start=480,end=798,kind='screen',kicker='01 / PERSONALIZED OUTREACH',title='Give prospects\na reason\nto reply.',detail='Relevant emails, built from\nresearch on each prospect.'),
 dict(id='voice-intro',start=798,end=858,kind='title',title='Respond while interest is fresh.',detail='AI VOICE AGENT / INBOUND & OUTBOUND'),
 dict(id='lead-response',start=858,end=1143,kind='screen',kicker='02 / NEW LEAD FOLLOW-UP',title='Reach leads\nwhile interest\nis fresh.',detail='Turn a website enquiry\ninto a follow-up call.'),
 dict(id='voice-response',start=1143,end=1485,kind='screen',kicker='02 / ANSWER INCOMING CALLS',title='Answer calls.\nEven after\nhours.',detail='Help callers when your\nteam is busy or offline.'),
 dict(id='dialer',start=1485,end=1701,kind='phone',kicker='03 / YOUR SALES WORKFLOW',title='Spend less time\nswitching tools.',detail='Call, email or WhatsApp.\nKeep company context at hand.'),
 dict(id='call-history',start=1701,end=1967,kind='phone',kicker='03 / FOLLOW-UP CONTEXT',title='Follow up with\nthe full context.',detail='Call history, recordings\nand transcripts in one place.'),
 dict(id='crm',start=1967,end=2325,kind='screen',kicker='04 / CRM & REVENUE',title='Make every\nconversation\ncount.',detail='Review what was said.\nPrepare the next action.'),
 dict(id='proof',start=2475,end=2580,frames=135,kind='proof',kicker='COMMERCIAL FOUNDATION',title='Commercial\nexperience.\nBuilt in.',detail='USD 367K Closed Won\nHistorical Salesforce snapshot'),
 dict(id='closing',start=2580,end=2700,frames=150,kind='closing',title='Build a system\nthat keeps sales\nmoving.',detail='More relevant outreach.\nFaster responses. Clearer follow-up.'),
]
for s in scenes:s.setdefault('frames',s['end']-s['start'])
assert sum(s['frames'] for s in scenes)==2700
blue='#83b5ff';white='#f6f8fc';muted='#b4c4da';bg='#09111c'
def text_filter(s,name,text,x,y,size=44,weight=600,color=white,maxwidth=355,spacing=10,fade=True):
 font=ImageFont.truetype(str(fonts[weight]),size)
 widest=max(font.getlength(line) for line in text.splitlines())
 if widest>maxwidth:raise ValueError(f'{s["id"]}/{name} overflows: {widest}>{maxwidth}')
 f=out/f'{s["id"]}-{name}.txt';f.write_text(text)
 alpha=":alpha='min(1,t/0.22)'" if fade else ''
 return f"drawtext=fontfile='{fonts[weight]}':textfile='{f}':expansion=none:fontcolor={color}:fontsize={size}:x={x}:y={y}:line_spacing={spacing}{alpha}"
def render(s):
 filters=['fps=30','setsar=1']
 extra=s['frames']-(s['end']-s['start'])
 if extra>0:filters.append(f'tpad=stop_mode=clone:stop_duration={extra/30}')
 k=s['kind']
 if k in ['screen','phone','proof']:
  width={'screen':410,'phone':800,'proof':720}[k]
  filters.append(f'drawbox=x=0:y=88:w={width}:h=548:color={bg}:t=fill')
  filters.append(text_filter(s,'kicker',s['kicker'],48,122,15,600,blue,width-80))
  size={'screen':43,'phone':52,'proof':58}[k]
  filters.append(text_filter(s,'title',s['title'],48,210,size,700,white,width-80,12))
  filters.append(text_filter(s,'detail',s['detail'],48,464,22 if k=='screen' else 25,400,muted,width-80,13))
  filters.append(f'drawbox=x=48:y=590:w=62:h=3:color={blue}:t=fill')
 elif k=='opening':
  filters.append(f'drawbox=x=0:y=0:w=810:h=720:color={bg}:t=fill')
  filters += [text_filter(s,'kicker','THE VALUE FOR YOUR BUSINESS',48,70,20,600,blue,710),
   text_filter(s,'title',s['title'],48,170,56,700,white,710,12),
   text_filter(s,'detail',s['detail'],48,438,28,400,muted,710),
   text_filter(s,'name','EYAL TAIEB / AI & GTM BUILDER',48,592,20,600,blue,710)]
 elif k=='title':
  filters.append(f'drawbox=x=0:y=88:w=1280:h=570:color={bg}:t=fill')
  filters += [text_filter(s,'kicker',s['detail'],48,176,20,600,blue,1184),
   text_filter(s,'title',s['title'],48,286,56,700,white,1184),
   text_filter(s,'support','From enquiry to conversation.',48,432,30,400,muted,1184)]
 elif k=='closing':
  filters.append(f'drawbox=x=434:y=0:w=846:h=720:color={bg}:t=fill')
  filters += [text_filter(s,'kicker','EYAL TAIEB / AI & GTM BUILDER',490,72,19,600,blue,735),
   text_filter(s,'title',s['title'],490,158,51,700,white,735,10),
   text_filter(s,'detail',s['detail'],490,388,25,400,muted,735,10),
   text_filter(s,'email','eyal.growth@gmail.com',490,522,30,600,blue,735),
   text_filter(s,'site','meeting-scheduled.com/eyal',490,579,22,400,muted,735),
   text_filter(s,'credit','Music: Cylinder Seven / Chris Zabriskie / Cylinders / CC BY 4.0',490,674,12,400,muted,735,0,False)]
 cmd=[ff,'-y','-hide_banner','-loglevel','error','-ss',str(s['start']/30),'-t',str((s['end']-s['start'])/30),'-i',str(Path(a.source).resolve()),'-an','-vf',','.join(filters),'-frames:v',str(s['frames']),'-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-threads','2',str(out/(s['id']+'.mp4'))]
 subprocess.run(cmd,check=True)
 print('Rendered',s['id'],flush=True)
if not a.reuse_scenes:
 with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(render,scenes))
else:
 assert all((out/(s['id']+'.mp4')).exists() for s in scenes)
concat=out/'concat.txt';concat.write_text(''.join("file '"+str(out/(s['id']+'.mp4'))+"'\n" for s in scenes))
subprocess.run([ff,'-y','-v','error','-f','concat','-safe','0','-i',str(concat),'-c','copy',str(out/'visual.mp4')],check=True)
# Keep speech samples intact, shifted 3 seconds after a longer value-led opening.
rate=48000
raw=subprocess.check_output([ff,'-v','error','-i',a.voice,'-ar',str(rate),'-ac','2','-f','f32le','-'])
voice=np.frombuffer(raw,dtype='<f4').reshape(-1,2)
speech=np.zeros((90*rate,2),dtype=np.float32)
speech[4*rate:round(80.5*rate)]=voice[rate:round(77.5*rate)]
raw=subprocess.check_output([ff,'-v','error','-ss','30','-i',a.music,'-t','90','-af','loudnorm=I=-18:TP=-2:LRA=11','-ar',str(rate),'-ac','2','-f','f32le','-'])
music=np.frombuffer(raw,dtype='<f4').reshape(-1,2)[:90*rate]
missing=len(speech)-len(music)
assert 0<=missing<=2048, f'Unexpected music length: {len(music)}'
if missing: music=np.pad(music,((0,missing),(0,0)))
t=np.arange(len(speech))/rate
# Music rises for the opening, voice-agent title, proof and closing, ducks for speech.
gain=np.interp(t,[0,.45,3.6,4,29.3,29.6,31.25,31.6,80.3,80.8,88.4,90],
 [0,.50,.50,.16,.16,.40,.40,.16,.16,.50,.50,0])
mix=speech+music*gain[:,None]
peak=float(np.max(np.abs(mix)));scale=min(1,.94/max(peak,1e-9));mix*=scale
with wave.open(str(out/'mix.wav'),'wb') as w:
 w.setnchannels(2);w.setsampwidth(2);w.setframerate(rate);w.writeframes((np.clip(mix,-1,1)*32767).astype('<i2').tobytes())
final=out/'eyal-90-seconds-v4.mp4'
subprocess.run([ff,'-y','-v','error','-i',str(out/'visual.mp4'),'-i',str(out/'mix.wav'),'-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','192k','-t','90','-movflags','+faststart','-metadata','title=More replies, more calls, less manual work — Eyal Taieb','-metadata','comment=Music: Cylinder Seven by Chris Zabriskie, Cylinders, CC BY 4.0. https://chriszabriskie.com/cylinders/ | Trimmed, faded and mixed under original narration.',str(final)],check=True)
report={'duration':90,'frames':2700,'speech_shift_seconds':3,'music_gain_speech':.16,'music_gain_titles':.50,'master_scale':scale,'peak_dbfs':float(20*np.log10(max(np.max(np.abs(mix)),1e-9))),'scenes':scenes}
(out/'edit-and-audio-report.json').write_text(json.dumps(report,indent=2));print('FINAL',final,flush=True)
