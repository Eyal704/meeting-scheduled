"""Create the one-page portfolio handout. Requires reportlab, Pillow and pypdf."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from PIL import Image
from pypdf import PdfReader
import shutil
from io import BytesIO

ROOT = Path(__file__).resolve().parents[2]
MEDIA = ROOT / 'portfolio/public/media'
OUT = ROOT / 'output/pdf/eyal-taieb-portfolio.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
FONT = Path('/System/Library/Fonts/Supplemental')
pdfmetrics.registerFont(TTFont('Portfolio', str(FONT/'Arial.ttf')))
pdfmetrics.registerFont(TTFont('PortfolioBold', str(FONT/'Arial Bold.ttf')))
pdfmetrics.registerFontFamily('Portfolio', normal='Portfolio', bold='PortfolioBold')
W, H = 595.276, 841.89
c = canvas.Canvas(str(OUT), pagesize=(W,H), pageCompression=1)
c.setTitle('Eyal Taieb | AI Deployment & GTM Builder')
c.setAuthor('Eyal Taieb')
c.setSubject('AI deployment, technical GTM and working revenue systems')
NAVY = '#0A1018'; BLUE = '#92BDFA'; INK = '#132439'; MUTED = '#536477'; LINE = '#D9E1EB'
BASE = 'https://www.meeting-scheduled.com/eyal/'

def rect(x, top, w, h, fill, stroke=None, radius=0):
    c.setFillColor(HexColor(fill))
    c.setStrokeColor(HexColor(stroke or fill))
    if radius: c.roundRect(x,H-top-h,w,h,radius,fill=1,stroke=bool(stroke))
    else: c.rect(x,H-top-h,w,h,fill=1,stroke=bool(stroke))

def txt(text,x,top,size=9,color=INK,bold=False):
    c.setFillColor(HexColor(color));c.setFont('PortfolioBold' if bold else 'Portfolio',size)
    c.drawString(x,H-top-size,text)

def para(text,x,top,w,size=9,leading=13,color=MUTED,bold=False,max_h=None):
    style=ParagraphStyle('p',fontName='PortfolioBold' if bold else 'Portfolio',fontSize=size,leading=leading,textColor=HexColor(color),alignment=TA_LEFT)
    p=Paragraph(text,style);_,h=p.wrap(w,H)
    if max_h is not None: assert h<=max_h, (text,h,max_h)
    p.drawOn(c,x,H-top-h)
    return h

def link(label,url,x,top,size=8,color='#245C9E'):
    txt(label,x,top,size,color,bold=True)
    width=pdfmetrics.stringWidth(label,'PortfolioBold',size)
    c.linkURL(url,(x,H-top-size-3,x+width,H-top+3),relative=0,thickness=0)

def photo(file,x,top,w,h,cover=False):
    image=Image.open(MEDIA/file).convert('RGB')
    image.thumbnail((int(w*3), int(h*3)), Image.Resampling.LANCZOS)
    packed=BytesIO();image.save(packed,format='JPEG',quality=92,optimize=True);packed.seek(0)
    drawable=ImageReader(packed)
    if cover:
        scale=max(w/image.width,h/image.height)
        iw,ih=image.width*scale,image.height*scale
        c.saveState();clip=c.beginPath();clip.rect(x,H-top-h,w,h);c.clipPath(clip,stroke=0)
        c.drawImage(drawable,x+(w-iw)/2,H-top-h+(h-ih)/2,width=iw,height=ih,mask='auto')
        c.restoreState()
    else:
        c.drawImage(drawable,x,H-top-h,width=w,height=h,preserveAspectRatio=True,anchor='c',mask='auto')

# Hero: supplied portrait, typography and positioning; no generated imagery.
rect(0,0,W,H,'#FFFFFF')
rect(0,0,W,225,NAVY)
txt('EYAL TAIEB',32,24,17,'#FFFFFF',True)
txt('AI DEPLOYMENT & GTM BUILDER',32,49,8,BLUE,True)
para('I build and deploy AI systems that turn business workflows <font color="#92BDFA">into revenue.</font>',32,74,370,25,28,'#F1F5FA',True,max_h=90)
para('From outbound platforms and voice agents to calling systems and CRM workflows, I design, build and deploy software that companies actually use - with a clear connection to commercial outcomes.',32,168,365,8.7,12,'#BECADB',max_h=42)
photo('headshot.webp',432,39,131,169,cover=True)

# Career figures.
rect(32,239,531,57,'#F0F4F9',radius=4)
metrics=[('$4M+','Qualified Pipeline Generated'),('~$700K','Contributed in Closed Business'),('150%','Annual Quota Attainment'),('8+ Years','GTM, Sales & AI Automation')]
for i,(value,label) in enumerate(metrics):
    x=43+i*132
    txt(value,x,248,22,INK,True)
    para(label,x,276,122,6.9,9,MUTED,max_h=10)

# Four selected projects, each linked to its complete case study and demo.
txt('SELECTED WORK',32,310,8,'#245C9E',True)
txt('Working systems, not prototypes.',135,307,12,INK,True)
projects=[
 ('01','MeetingScheduled','AI Outbound Operating System','Identifies companies and decision-makers, researches prospects, generates signals and personalized outreach, and manages a complete outbound cadence.','meetingscheduled'),
 ('02','AI Voice Agent','Inbound & Outbound Calling','Handles inbound calls, qualifies leads, answers questions and books meetings. Can automatically call new leads generated through a website.','ai-voice-agent'),
 ('03','Speed Dialer','Multi-Line Outbound Calling','Connects multiple phone numbers with lead queues, dialing workflows, call-status tracking and structured follow-up.','speed-dialer'),
 ('04','CRM & Revenue Systems','From Workflow to Revenue','Custom CRM and sales workflows connecting prospecting, calling, follow-up, pipeline management and reporting.','crm-revenue-systems')
]
for i,(num,title,subtitle,description,slug) in enumerate(projects):
    x=32+(i%2)*272; y=331+(i//2)*116
    rect(x,y,259,106,'#F9FAFC',LINE,4)
    txt(num,x+12,y+11,7,'#6D819A',True)
    txt(title,x+31,y+9,11.3,INK,True)
    txt(subtitle,x+12,y+28,8,'#245C9E',True)
    para(description,x+12,y+43,235,8.2,10.8,MUTED,max_h=34)
    link('View case study + full demo',BASE+'projects/'+slug+'/#demo',x+12,y+87,7.3)

# Real evidence with careful attribution.
txt('COMMERCIAL PROOF',32,568,8,'#245C9E',True)
photo('gdc.webp',32,585,54,63,cover=True)
photo('closed-won.webp',94,585,43,63)
para('<b>$367K recorded in Salesforce.</b> An original Closed Won snapshot, separate from the career-wide figures above. Incredibuild / GDC experience, customer discovery and pipeline dashboards document the commercial work behind the systems.',151,585,412,8.5,12,MUTED,max_h=49)
link('Inspect the original evidence',BASE+'#evidence',151,634,7.6)

# Context, approach and selected toolset.
para('<b>BUSINESS + TECHNOLOGY</b>  I spent years building B2B pipeline and selling technical products before moving deeply into building AI systems myself. I approach software from both sides: what needs to be built technically, and what has to happen for someone to use it and create business value.',32,665,531,8.5,11.6,INK,max_h=47)
txt('HOW I WORK',32,714,7.5,'#245C9E',True)
para('Business problem > Workflow design > AI/system architecture > Implementation<br/>Deployment > User feedback > Iteration > Business outcome',119,712,444,8,11.5,MUTED,max_h=24)
txt('TECH & TOOLS',32,746,7.5,'#245C9E',True)
para('Claude / Cursor / Next.js / Supabase/Postgres / Vercel / APIs / LLMs / Voice AI / CRM integrations',119,744,444,7.7,11,MUTED,max_h=22)
txt('EXPERIENCE',32,775,7.5,'#245C9E',True)
txt('Incredibuild  /  Epox.ai  /  RampedUp  /  Twingo.co.il  /  SingleStore',119,774,8,INK,True)

# Clickable recruiter-friendly contact block.
rect(0,800,W,42,NAVY)
link('eyal.growth@gmail.com','mailto:eyal.growth@gmail.com',32,811,8,'#E7EDF6')
link('LinkedIn','https://www.linkedin.com/in/eyalshoval/',246,811,8,BLUE)
link('meeting-scheduled.com/eyal',BASE,375,811,8,BLUE)
c.showPage();c.save()
reader=PdfReader(str(OUT));assert len(reader.pages)==1
text=reader.pages[0].extract_text()
for key in ['Eyal','MeetingScheduled','AI Voice Agent','Speed Dialer','CRM & Revenue Systems']:
    assert key.lower() in text.lower()
assert len(reader.pages[0].get('/Annots',[]))==8
public=ROOT/'portfolio/public/documents/eyal-taieb-portfolio.pdf'
shutil.copyfile(OUT,public)
print(f'Created one-page PDF: {OUT} ({OUT.stat().st_size:,} bytes, 8 clickable links)')
