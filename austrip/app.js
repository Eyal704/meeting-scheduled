'use strict';
const BASE='/austrip/';
const menu=document.querySelector('.menu-toggle');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.getElementById('main-nav').classList.toggle('open',open)});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');document.getElementById('main-nav').classList.remove('open');menu.focus()}});
const filters=document.getElementById('catalog-filter');
if(filters){
 const params=new URLSearchParams(location.search);for(const key of ['q','origin','category']){if(params.has(key))filters.elements[key].value=params.get(key)}
 const normalize=value=>value.toLowerCase().normalize('NFKD').replace(/[\u0591-\u05C7]/g,'').replace(/[״"׳']/g,'').trim();
 function apply(){const q=normalize(filters.elements.q.value);const origin=filters.elements.origin.value;const category=filters.elements.category.value;let count=0;document.querySelectorAll('#trip-results .trip-card').forEach(card=>{const match=(!q||normalize(card.dataset.search).includes(q))&&(!origin||card.dataset.origin===origin)&&(!category||card.dataset.category===category);card.hidden=!match;if(match)count++});document.getElementById('result-count').textContent=count+' חוויות מחכות לכם';document.getElementById('no-results').hidden=count!==0;const next=new URLSearchParams();for(const key of ['q','origin','category']){if(filters.elements[key].value)next.set(key,filters.elements[key].value)}history.replaceState(null,'',location.pathname+(next.size?'?'+next:''));}
 filters.addEventListener('input',apply);filters.addEventListener('change',apply);filters.addEventListener('submit',event=>{event.preventDefault();apply()});filters.addEventListener('reset',()=>setTimeout(apply,0));document.getElementById('clear-search').addEventListener('click',()=>{filters.reset();filters.elements.q.focus()});apply();
}
const form=document.getElementById('plan-form');
if(form){
 const params=new URLSearchParams(location.search);const selected=params.get('trip');if(selected)form.elements.trip.value=selected;if(params.get('mode')==='private')form.querySelector('[value="private"]').checked=true;
 const summary=document.getElementById('plan-summary');let catalog;
 const escape=text=>String(text).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(!form.reportValidity())return;const button=form.querySelector('button[type="submit"]');button.disabled=true;button.textContent='מכינים לכם את הפרטים…';
  try{if(!catalog){const response=await fetch(BASE+'catalog.json');if(!response.ok)throw new Error('catalog');catalog=await response.json()}
   const trip=catalog.find(item=>item.slug===form.elements.trip.value);if(!trip)throw new Error('trip');const mode=form.elements.mode.value;const direct=mode==='group'&&trip.booking;const destination=direct?trip.booking:(mode==='private'&&trip.category!=='הסעות'?BASE+'private-group-form/':trip.source);
   const note=trip.slug==='hallstatt-and-salzkammergut'?'<div class="notice"><strong>שימו לב למסלול</strong><p>הטיול אינו כולל כניסה לכפר האלשטאט עצמו. מטיילים באזור האגמים והאלפים שסביבו.</p></div>':'';
   const explanation=direct?'במערכת ההזמנות של אוסטריפ בוחרים תאריך, רואים זמינות עדכנית, מוסיפים משתתפים ומשלימים את ההרשמה. מחיר סופי ותנאי תשלום יוצגו שם.':mode==='private'?'ממשיכים לטופס טיול פרטי, שבו מציינים תאריך, הרכב והעדפות. הצוות יחזור אליכם עם פרטים והצעה בהתאם לבקשה.':'לחוויה הזו ממשיכים לעמוד אוסטריפ כדי למלא את הטופס המתאים או לבדוק את אפשרויות ההרשמה העדכניות.';
   summary.innerHTML='<img class="plan-summary-image" src="'+escape(trip.hero)+'" alt="'+escape(trip.title)+'"><span class="eyebrow">'+(mode==='private'?'החוויה הפרטית שלכם':'החוויה שבחרתם')+'</span><h2>'+escape(trip.name)+'</h2><p>'+escape('יציאה מ'+trip.origin)+(trip.duration?' · '+escape(trip.duration):'')+(trip.price&&mode==='group'?' · '+escape(trip.price)+' למשתתף לפי המחיר המפורסם':'')+'</p>'+note+'<p>'+explanation+'</p><a class="button" href="'+escape(destination)+'"'+(destination.startsWith('http')?' target="_blank" rel="noopener noreferrer"':'')+'>'+(direct?'לתאריכים ולהרשמה באוסטריפ ↗':mode==='private'?'להמשך בקשת טיול פרטי ←':'להמשך הרשמה באתר אוסטריפ ↗')+'</a><p class="fine-print">עדיין לא בוצעה הזמנה ולא חויבתם. ההרשמה מושלמת רק לאחר אישור במערכת אוסטריפ.</p><a class="secondary-button" href="'+BASE+encodeURIComponent(trip.slug)+'/">לכל פרטי המסלול והתנאים</a><button class="reset-button" id="edit-plan" type="button">חזרה לבחירת חוויה</button>';
   form.hidden=true;summary.hidden=false;document.getElementById('progress-review').classList.add('active');summary.focus();summary.scrollIntoView({block:'start',behavior:'smooth'});document.getElementById('edit-plan').addEventListener('click',()=>{summary.hidden=true;form.hidden=false;document.getElementById('progress-review').classList.remove('active');form.elements.trip.focus()});
  }catch(error){summary.hidden=false;summary.textContent='לא הצלחנו לטעון את פרטי החוויה. אפשר לנסות שוב או לעבור דרך עמוד הטיול.';summary.setAttribute('role','alert')}
  finally{button.disabled=false;button.innerHTML='לפרטים ולהמשך ההרשמה <span>←</span>'}
 });
}
