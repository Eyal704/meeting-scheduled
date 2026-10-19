import React from 'react';
import {AbsoluteFill,Composition,Img,interpolate,registerRoot,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import type {Caption} from '@remotion/captions';
import enScenes from '../public/en/scenes.json';import heScenes from '../public/he/scenes.json';
import enShots from '../public/en/focus-shots.json';import heShots from '../public/he/focus-shots.json';
import enCaptions from '../public/en/captions.json';import heCaptions from '../public/he/captions.json';
const ink='#242427',muted='#5a5a60',rose='#b74460';
function Proof({lang,mobile}:{lang:'en'|'he';mobile:boolean}){
 const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),sec=frame/fps,rtl=lang==='he';
 const scenes=rtl?heScenes:enScenes;const scene=scenes.find(s=>sec>=s.start&&sec<s.end)||scenes.at(-1)!;
 const shots=(rtl?heShots:enShots) as Record<string,{width:number;height:number}>;
 const caption=((rtl?heCaptions:enCaptions) as Caption[]).find(c=>sec*1000>=c.startMs&&sec*1000<c.endMs);
 const local=sec-scene.start;const opacity=interpolate(local,[0,.18],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 // Real UI crops: one detail at a time, with equal scales in the two viewport layouts.
 let id=scene.id;if(scene.start===16&&local>=3.3)id='focus-report-finding';if(scene.start===28&&local>=2.7)id='focus-ready';
 const shot=shots[id];const maxW=mobile?952:900,maxH=mobile?610:690;
 const scale=Math.min(maxW/shot.width,maxH/shot.height);const w=shot.width*scale,h=shot.height*scale;
 const panelX=mobile?(width-w)/2:rtl?75:width-75-w;
 const panelY=mobile?400+(610-h)/2:245+(690-h)/2;
 const textStyle:React.CSSProperties=mobile?{left:62,right:62,top:138,textAlign:rtl?'right':'left'}:{...(rtl?{right:85}:{left:85}),width:790,top:285};
 return <AbsoluteFill style={{background:'#f7f6f3',fontFamily:'Arial,sans-serif',color:ink,direction:rtl?'rtl':'ltr'}}>
  <div style={{position:'absolute',top:mobile?46:42,left:mobile?62:75,right:mobile?62:75,display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'2px solid #e0ded9',paddingBottom:24,fontSize:mobile?31:28,fontWeight:700}}><span>{rtl?'דוחות בדיקה':'Inspection Reports'}</span><span style={{fontSize:mobile?27:24,color:rose}}>{scene.label}</span></div>
  <div style={{opacity}}>
   <div style={{position:'absolute',...textStyle}}>
    <h1 style={{fontSize:mobile?64:78,lineHeight:1.15,letterSpacing:rtl?0:-2,margin:0,fontWeight:700}}>{scene.title}</h1>
    <p style={{fontSize:mobile?45:43,lineHeight:1.4,color:muted,margin:'23px 0 0'}}>{scene.sub}</p>
   </div>
   <Img key={id} src={staticFile(lang+'/'+id+'.png')} style={{position:'absolute',left:panelX,top:panelY,width:w,height:h,borderRadius:14,boxShadow:'0 10px 35px #24242714',outline:'2px solid #e0ded9'}}/>
   {scene.start===28&&local<2.7&&<div style={{position:'absolute',left:panelX+w*.5,top:panelY+h*.55,width:50,height:50,borderRadius:'50%',border:'5px solid white',background:'#ffffff55',transform:`scale(${interpolate(local,[1.3,1.7,2],[1,1.5,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})})`,opacity:local>1.3?1:0}}/>}
  </div>
  <div style={{position:'absolute',left:mobile?62:75,right:mobile?62:75,bottom:mobile?170:75,fontSize:mobile?44:36,lineHeight:1.35,color:muted,borderTop:'2px solid #e0ded9',paddingTop:22}}>{caption?.text}</div>
  <div style={{position:'absolute',left:62,right:62,bottom:mobile?105:22,fontSize:mobile?27:22,color:'#77777b',textAlign:'center'}}>{rtl?'תקריבים מהדמו · בדיקה ונתונים להמחשה':'Demo close-ups · Sample inspection and data'}</div>
  <div style={{position:'absolute',bottom:0,left:0,height:7,width:`${sec/40*100}%`,background:rose}}/>
 </AbsoluteFill>
}
registerRoot(()=> <>{(['en','he'] as const).flatMap(lang=>[false,true].map(mobile=><Composition key={lang+mobile} id={'Report'+lang.toUpperCase()+(mobile?'Mobile':'')} component={Proof} defaultProps={{lang,mobile}} durationInFrames={1200} fps={30} width={mobile?1080:1920} height={mobile?1350:1080}/>))}</>);
