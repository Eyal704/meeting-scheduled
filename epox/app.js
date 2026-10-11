(() => {
  'use strict';
  const config = window.EPOX_CONFIG || {};
  const event = (name, detail = {}) => window.dispatchEvent(new CustomEvent('epox:analytics', {detail:{name,...detail}}));
  // No analytics vendor or pixels are connected. These events are integration hooks.
  const categories = {
    furniture: {source:'sofa-raw.webp', result:'sofa-life.webp', sourceAlt:'תמונת המקור של הספה', resultAlt:'אותה ספה בחלל מעוצב — דוגמה מאתר אפוקס', sourceCaption:'התמונה שממנה מתחילים', resultCaption:'תמונת אווירה שמציגה את הספה בחלל'},
    shoes: {source:'shoe-raw.webp', result:'shoe-life.webp', sourceAlt:'נעל על רקע נקי מתוך דוגמאות אפוקס', resultAlt:'אותה נעל בתמונת אווירה — דוגמה מאתר אפוקס', sourceCaption:'תמונת מוצר על רקע נקי', resultCaption:'תמונה נוספת לשימוש באתר ובשיווק'},
    jewelry: {source:'jewelry-raw.webp', result:'jewelry-life.webp', sourceAlt:'תמונת מקור של עגילים', resultAlt:'אותם עגילים בענידה — דוגמה מאתר אפוקס', sourceCaption:'תמונת המקור של העגילים', resultCaption:'כך אפשר להציג את התכשיט גם בענידה'}
  };
  const tabs = [...document.querySelectorAll('[data-category]')];
  const selectCategory = (button) => {
    const key=button.dataset.category, data=categories[key];
    tabs.forEach(t=>{t.setAttribute('aria-selected',String(t===button));t.tabIndex=t===button?0:-1;});
    const panel=document.getElementById('gallery');panel.setAttribute('aria-labelledby',button.id);
    document.querySelector('.gallery .after').className='after '+key;
    for(const [id,file,alt] of [['source-image',data.source,data.sourceAlt],['result-image',data.result,data.resultAlt]]){const img=document.getElementById(id);img.src='assets/'+file;img.alt=alt;}
    document.getElementById('source-caption').textContent=data.sourceCaption;
    document.getElementById('result-caption').textContent=data.resultCaption;
    document.querySelector('.before .image-tag').textContent=key==='shoes'?'תמונת מוצר':'תמונת מקור';
    event('example_select',{category:key});
  };
  tabs.forEach((button,index)=>{button.addEventListener('click',()=>selectCategory(button));button.addEventListener('keydown',e=>{let next;if(e.key==='ArrowLeft')next=(index+1)%tabs.length;else if(e.key==='ArrowRight')next=(index+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();tabs[next].focus();selectCategory(tabs[next]);});});
  const params=new URLSearchParams(location.search);
  document.querySelectorAll('.signup-cta').forEach(link=>{const target=new URL(config.signupUrl||'https://app.epox.ai/signup');for(const name of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']){const value=params.get(name);if(value&&value.length<250)target.searchParams.set(name,value);}link.href=target.href;link.addEventListener('click',()=>event('signup_click',{placement:link.classList.contains('mobile-cta')?'mobile':link.closest('section')?.id||'content'}));});
  document.querySelectorAll('details').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)event('faq_open',{question:detail.querySelector('summary').textContent});}));
  const mount=document.getElementById('video-mount');
  if(config.video?.src){
    const url=new URL(config.video.src,location.href);
    if(['https:','http:'].includes(url.protocol)){
      const video=document.createElement('video');video.controls=true;video.playsInline=true;video.preload='metadata';video.src=url.href;video.poster=config.video.poster||'assets/sofa-life.webp';video.setAttribute('aria-label','הדגמת אפוקס עם מתן');
      if(config.video.captions){const track=document.createElement('track');track.kind='captions';track.srclang='he';track.label='עברית';track.src=config.video.captions;track.default=true;video.append(track);}
      mount.replaceChildren(video);let started=false;const milestones=new Set();video.addEventListener('play',()=>{if(!started){event('video_start');started=true;}});video.addEventListener('timeupdate',()=>{if(video.duration>0)for(const percentage of [25,50,75,100])if(video.currentTime/video.duration>=percentage/100&&!milestones.has(percentage)){milestones.add(percentage);event('video_progress',{percentage});}});video.addEventListener('error',()=>{const p=document.createElement('p');p.className='video-error';p.textContent='לא הצלחנו לטעון את הסרטון. נסו לרענן את העמוד, או המשיכו לדוגמאות ולחבילות בהמשך.';mount.append(p);});
    }
  }
  const sticky=document.querySelector('.mobile-cta');let inClosing=false;
  new IntersectionObserver(entries=>{inClosing=entries[0].isIntersecting;updateSticky();},{threshold:0}).observe(document.getElementById('start'));
  function updateSticky(){sticky.classList.toggle('visible',scrollY>700&&!inClosing);}
  addEventListener('scroll',updateSticky,{passive:true});updateSticky();
})();
