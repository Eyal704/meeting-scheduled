/* A local, disposable interactive proposal. No accounts, payments or messages are sent. */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const originalIcons=[...document.querySelectorAll('.icon')].map(el=>el.innerHTML);
const clock='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
const arrow='<svg viewBox="0 0 24 24"><path d="M19 12H5m6-6-6 6 6 6"/></svg>';
const questions=[
 ['תחילת הדרך','מה הכי חשוב לך<br>להשיג כרגע?',['להיכנס לשגרת אימונים','להתחזק ולהרגיש בכושר','לשפר שיווי משקל ויציבות'],originalIcons],
 ['קצת עליך','מה טווח<br>הגיל שלך?',['18–39','40–59','60–74','75 ומעלה'],['18+','40+','60+','75+']],
 ['השגרה שלך','כמה אימונים יש<br>בשבוע שלך כיום?',['כרגע לא מתאמנים','אימון אחד או שניים','שלושה אימונים ומעלה'],originalIcons],
 ['זמן לעצמך','כמה זמן נוח לך<br>להקדיש לכל אימון?',['10 דקות','20 דקות','30 דקות ומעלה'],[clock,clock,clock]],
 ['מקום בשבוע','כמה ימים בשבוע<br>נוח לך להתאמן?',['יומיים','שלושה ימים','ארבעה ימים ומעלה'],['2','3','4+']],
 ['הציוד שלך','איזה ציוד<br>יש לך בבית?',['ללא ציוד','מזרן וגומייה','גם משקולות יד'],originalIcons],
 ['בקצב שלך','יש משהו שחשוב<br>להתחשב בו?',['אין משהו מיוחד','צריך להתאים לי את האימונים','מעדיפים לדבר עם בועז'],originalIcons],
 ['גובה','מה הגובה שלך?',null,null,{unit:'ס״מ',min:100,max:230,step:1}],
 ['משקל','מה המשקל שלך?',null,null,{unit:'ק״ג',min:30,max:300,step:.1}]
];
const names=[...questions.map(q=>q[0]),'התאמת מסלול','התוכנית שלך','הצטרפות','תזכורות','זמן לאימון','הבית שלך','אימון היום','כל הכבוד','התקדמות','שיעורים קבוצתיים','עדכונים מבועז','יצירת קשר','כניסה לחשבון','מבט מאמן','כרטיס מתאמן','עדכון למתאמנים'];
const state={answers:[1,...Array(8).fill(null)],days:[0,2,4],time:'08:00',reminders:false,updates:true,done:false,feeling:null,bookings:new Set(),broadcast:null,events:[],current:0};
let timer;
const phone=$('.phone'),header=$('.app-header');
while(header.nextElementSibling)header.nextElementSibling.remove();
header.innerHTML='<img class="logo" src="assets/fitnet-logo.png" alt="fitNET.online"><div class="header-actions"><button class="demo-badge" data-action="about">המחשה</button><button class="login" data-go="21">כניסה</button></div>';
const screen=document.createElement('div');screen.className='screen';screen.id='app-screen';phone.append(screen);
const tabs=document.createElement('nav');tabs.className='bottom-tabs';tabs.setAttribute('aria-label','ניווט באפליקציה');phone.append(tabs);
const homeBar=document.createElement('div');homeBar.className='home-bar';phone.append(homeBar);
$('.preview-nav').innerHTML=names.map((name,i)=>`<button type="button" data-go="${i}" aria-label="מסך ${i+1}: ${name}">${String(i+1).padStart(2,'0')}</button>`).join('');
const tools=document.createElement('div');tools.className='preview-tools';tools.innerHTML='<button data-go="22">מבט המאמן</button><button data-action="reset">התחלה מחדש</button>';$('.stage').append(tools);
const dialog=document.createElement('dialog');dialog.className='app-dialog';dialog.innerHTML='<h2>המחשה לחוויית Fitnet</h2><p>התוכניות והתמונה מתוך אתר Fitnet. התוכן, לוח השיעורים ונתוני המתאמנים כאן הם דוגמאות.</p><p>הבחירות נשמרות רק עד לרענון העמוד. אין חיוב, חשבון מחובר, משלוח הודעות או התראות אמיתיות.</p><button class="secondary" data-action="close-dialog">הבנתי</button>';document.body.append(dialog);
const btn=(label,action,cls='next')=>`<button type="button" class="${cls}" ${typeof action==='number'?`data-go="${action}"`:`data-action="${action}"`}>${label}${cls==='next'?arrow:''}</button>`;
const title=(heading,eyebrow='')=>`${eyebrow?`<span class="eyebrow">${eyebrow}</span>`:''}<h2 tabindex="-1">${heading}</h2>`;
const back=to=>`<div class="step">${btn('→ חזרה',to,'back')}<span>Fitnet · המחשה</span></div>`;
const photo=()=>'<img class="hero-photo" src="assets/boaz-balance.jpg" alt="בועז לוי, מאמן Fitnet">';
const coach=()=>'<div class="row coach-intro"><img class="avatar" src="assets/boaz-balance.jpg" alt="בועז לוי"><div><strong>בועז לוי</strong><p>Fitnet · מתאמנים מהבית</p></div></div>';
const actions=(...items)=>`<div class="actions">${items.join('')}</div>`;
const note=text=>`<p class="info-note">${text}</p>`;
function plan(){return state.answers[0]===2?{name:'תוכנית שיווי משקל',url:'https://www.fitnet.online/balanceprogram',reason:'בחרת בשיווי משקל וביציבות כמטרה המרכזית שלך.',length:'בקצב שלך'}:{name:'אימונים ב־10 דקות',url:'https://www.fitnet.online/אימון-10-דקות',reason:state.answers[3]===0?'בחרת באימונים קצרים של 10 דקות.':'אימונים קצרים שאפשר לשלב בזמן שפינית לעצמך.',length:'10 דקות'};}
const dayNames=['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
const scheduleText=()=>state.days.map(d=>dayNames[d]).join(', ')+' · '+state.time;
function log(text){state.events.unshift({text,time:new Date().toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'})});}
function go(index){clearTimeout(timer);state.current=index;render();screen.scrollTop=0;screen.querySelector('h2')?.focus({preventScroll:true});}
function render(){
 const i=state.current,p=plan();
 $('.kicker').textContent=String(i+1).padStart(2,'0')+' / '+names[i];
 document.querySelectorAll('.preview-nav button').forEach(b=>{if(Number(b.dataset.go)===i)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
 const activePreview=$('.preview-nav [aria-current]'),previewNav=$('.preview-nav');
 previewNav.scrollLeft=activePreview.offsetLeft-previewNav.offsetLeft-(previewNav.clientWidth-activePreview.offsetWidth)/2;
 const member=i>=14&&i<=20;
 tabs.hidden=!member;tabs.style.display=member?'flex':'none';
 tabs.innerHTML=member?[[14,'בית'],[17,'התקדמות'],[18,'שיעורים'],[19,'עדכונים'],[20,'קשר']].map(([id,label])=>`<button data-go="${id}" class="${i===id?'active':''}" ${i===id?'aria-current="page"':''}>${label}</button>`).join(''):'';
 header.querySelector('.login').textContent=member?'הגדרות':'כניסה';header.querySelector('.login').dataset.go=member?'13':'21';
 if(i<9){renderQuestion(i);return;}
 if(i===9){screen.innerHTML=`<div class="center"><div class="loader" aria-hidden="true"></div>${title('מוצאים לך<br>נקודת התחלה')}<p class="muted" role="status">המטרה, הזמן והשגרה שלך — ביחד.</p>${note('התאמה לדוגמה מתוך התוכניות של Fitnet.')}</div>`;timer=setTimeout(()=>go(10),1500);return;}
 if(i===10){const needsCoach=state.answers[6]>0;screen.innerHTML=back(8)+title(needsCoach?'נתחיל בשיחה קצרה':'נקודת התחלה בשבילך','מתוך התוכניות של בועז')+photo()+`<h3 class="plan-title">${p.name}</h3><p class="muted">${needsCoach?'ציינת שחשוב להתאים את האימון. בועז יוכל לעבור איתך על האפשרויות לפני שמתחילים.':p.reason}</p><div class="row"><span class="tag">מהבית</span><span class="tag">${p.length}</span><span class="tag">עם בועז</span></div>`+note('המלצה להמחשה; ההתאמה הסופית תיעשה עם בועז.')+actions(btn(needsCoach?'לדבר עם בועז':'לפרטי התוכנית',needsCoach?20:11),needsCoach?btn('לצפייה בתוכנית לדוגמה',11,'secondary'):btn('יש לי שאלה',20,'text-button'));}
 if(i===11){screen.innerHTML=back(10)+title('מתחילים את הדרך')+coach()+`<div class="card"><span class="tag">מנוי לתוכנית</span><h3 class="plan-title">${p.name}</h3><ul class="checklist"><li>תכני האימון של Fitnet</li><li>לוח אימונים אישי</li><li>מעקב אחרי ההתמדה שלך</li></ul><p class="muted">המחיר ותנאי המנוי מופיעים באתר Fitnet.</p><a href="${p.url}" target="_blank" rel="noopener">לפרטי התוכנית באתר ↗</a></div>`+note('מסך הצטרפות לדוגמה. לא נדרשים פרטי אשראי ולא מתבצע חיוב.')+actions(btn('פתיחת תוכנית לדוגמה',12),btn('כבר יש לי חשבון',21,'secondary'),btn('שאלה לפני שמתחילים',20,'text-button'));}
 if(i===12){screen.innerHTML=back(11)+`<div class="success-mark" aria-hidden="true">♧</div>`+title('תזכורת קטנה.<br>זמן בשבילך.')+`<p class="muted">תזכורת בזמן שקבעת תיקח אותך ישירות לאימון של היום.</p><div class="notification"><span>Fitnet · תזכורת לדוגמה</span><strong>הזמן שלך לזוז</strong><span>האימון של היום מחכה לך.</span></div>`+note('בהמחשה לא תופיע בקשת הרשאה של המכשיר ולא יישלחו התראות.')+actions(btn('כן, להזכיר לי','enable-reminders'),btn('אולי בהמשך','skip-reminders','text-button'));}
 if(i===13){screen.innerHTML=back(12)+title('קובעים זמן<br>שמתאים לחיים שלך')+`<p class="muted">באילו ימים נוח לך להתאמן?</p><div class="day-grid">${dayNames.map((d,n)=>`<button data-day="${n}" aria-label="יום ${d}" aria-pressed="${state.days.includes(n)}">${['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'][n]}</button>`).join('')}</div><label class="field">שעת האימון<input type="time" id="training-time" value="${state.time}" required></label><label class="toggle-row">תזכורת לאימון <input type="checkbox" id="reminders" ${state.reminders?'checked':''}></label><label class="toggle-row">עדכונים ותוכניות חדשות מבועז<input type="checkbox" id="updates" ${state.updates?'checked':''}></label>`+note('העדפות לדוגמה בלבד. אפשר לשנות אותן בכל עת.')+actions(btn('שומרים ומתחילים','save-schedule'))+`<p class="inline-status" role="status" id="schedule-status"></p>`;}
 if(i===14){screen.innerHTML=title('הזמן שלך לזוז','התוכנית שלי')+`<div class="card dark"><span class="eyebrow">${state.done?'עשית את זה היום':'האימון הבא שלך'}</span><h3 style="font-size:25px;margin-top:12px">${p.name}</h3><p class="muted">${scheduleText()}</p>${btn(state.done?'לצפייה באימון':'לאימון של היום',15)}</div><div class="row"><h3>השבוע שלך</h3><span class="tag">${state.done?1:0} מתוך ${state.days.length} אימונים</span></div><div class="meter"><span style="width:${state.done?100/Math.max(1,state.days.length):0}%"></span></div><div class="card"><div class="row"><h3>מתאמנים יחד</h3><span class="tag">לוח לדוגמה</span></div><p>שיווי משקל בזום</p><p class="muted">יום שני · 18:00</p>${btn('למערכת השיעורים',18,'secondary')}</div>${state.reminders?`<button class="notification" data-go="15"><span>כך תיראה התזכורת שלך</span><strong>הגיע הזמן לאימון</strong><span>לחיצה פותחת את האימון של היום ←</span></button>`:''}<button class="secondary" data-go="19">${state.broadcast?'עדכון חדש מבועז':'מה חדש ב־Fitnet?'}</button>`;}
 if(i===15){screen.innerHTML=back(14)+title(p.name,'אימון היום')+`<div class="video-placeholder"><span class="play">▷</span><h3>כאן ייפתח השיעור של בועז</h3><p>נגן לדוגמה · תוכן השיעור המלא יחובר לתוכנית.</p><a href="${p.url}" target="_blank" rel="noopener" style="color:#edc477">לתוכן המקורי באתר Fitnet ↗</a></div><div class="card"><h3>הכול במקום אחד</h3><p class="muted">השיעור, הסבר הביצוע והמעקב אחרי האימון.</p></div>`+note('אפשר לסמן השלמה כדי לראות איך ההתקדמות מתעדכנת בדמו.')+actions(btn(state.done?'לסיכום האימון':'סיימתי את האימון','complete-workout'),btn('אחזור לזה אחר כך',14,'text-button'));}
 if(i===16){screen.innerHTML=`<div class="success-mark">✓</div><div class="center">${title('עוד צעד בשבילך')}<p class="muted">האימון סומן כהושלם בהמחשה.</p></div><h3>איך היה לך?</h3><div class="feelings">${['קליל','בדיוק בשבילי','מאתגר'].map((f,n)=>`<button data-feeling="${n}" aria-pressed="${state.feeling===n}">${f}</button>`).join('')}</div><p class="muted">המשוב יעזור לבועז להבין איך האימונים מרגישים לך.</p>`+actions(btn('להתקדמות שלי',17),btn('חזרה לבית',14,'secondary'));}
 if(i===17){const done=state.done?1:0;screen.innerHTML=title('רואים את ההתמדה','ההתקדמות שלי')+`<div class="stats"><div class="stat"><b>${done}</b><span>אימונים שהושלמו</span></div><div class="stat"><b>${state.days.length}</b><span>ימים בתכנון</span></div><div class="stat"><b>${Math.round(done/Math.max(1,state.days.length)*100)}%</b><span>מהיעד השבועי</span></div></div><div class="card"><h3>השבוע שלך</h3><div class="week">${['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'].map((d,n)=>`<span>${d}<i class="${state.done&&n===state.days[0]?'done':''}">${state.done&&n===state.days[0]?'✓':state.days.includes(n)?'•':'–'}</i></span>`).join('')}</div><p class="muted">${state.done?'האימון הראשון שלך מסומן. ממשיכים בקצב שלך.':'האימון הראשון שלך יופיע כאן לאחר השלמה.'}</p></div><h3>האימונים שלך</h3><div class="card"><p>${state.done?'✓ '+p.name:'עדיין אין אימונים שהושלמו'}</p>${state.feeling!==null?`<p class="muted">התחושה שלך: ${['קליל','בדיוק בשבילי','מאתגר'][state.feeling]}</p>`:''}</div>`+actions(btn('לאימון של היום',15),btn('שינוי ימי האימון',13,'secondary'));}
 if(i===18){screen.innerHTML=title('נפגשים, זזים,<br>מתאמנים יחד','שיעורים קבוצתיים')+note('מערכת שעות לדוגמה · ההרשמה אינה מועברת לבועז.')+[ ['שיווי משקל בזום','יום שני · 18:00'],['תנועה וכוח מהבית','יום רביעי · 09:00'],['פותחים את השבוע בתנועה','יום ראשון · 08:30']].map(([name,time],n)=>`<div class="card"><span class="tag">Zoom · לדוגמה</span><h3 style="margin-top:13px">${name}</h3><p class="muted">${time}</p>${btn(state.bookings.has(n)?'ביטול הרשמה לדוגמה':'הרשמה לדוגמה','book-'+n,'secondary')}</div>`).join('');}
 if(i===19){screen.innerHTML=title('בקשר עם בועז','העדכונים שלך')+coach()+note('דוגמאות לתוכן ולתצוגת הודעות.')+(state.broadcast?`<div class="card"><span class="tag">תצוגה מקדימה · לא נשלח</span><h3 style="margin-top:12px">${esc(state.broadcast.title)}</h3><p class="broadcast-preview">${esc(state.broadcast.body)}</p></div>`:'')+`<div class="card"><span class="tag">תוכנית באתר Fitnet</span><h3 style="margin-top:12px">מכירים את אימוני ה־10 דקות?</h3><p class="muted">אפשר להכיר את התוכנית ואת התכנים באתר.</p><a href="https://www.fitnet.online/אימון-10-דקות" target="_blank" rel="noopener">לפרטי התוכנית ↗</a></div><div class="card"><h3>השבוע ב־Fitnet</h3><p class="muted">כאן יופיע העדכון השבועי של בועז, עם קישור לתוכן או לשיעור הרלוונטי.</p>${btn('למערכת השיעורים',18,'secondary')}</div>`+actions(btn('יצירת קשר',20),btn('העדפות עדכונים',13,'text-button'));}
 if(i===20){screen.innerHTML=back(14)+title('יש שאלה?<br>בועז כאן.')+coach()+`<div class="card"><h3>אפשר לדבר ישירות</h3><p class="muted">פרטי הקשר מתוך אתר Fitnet.</p><p><a href="tel:+972545326004">054-5326004</a></p><p><a href="mailto:blfitnet@gmail.com">blfitnet@gmail.com</a></p></div><label class="field">מה רצית לשאול?<textarea id="contact-message" placeholder="אפשר לכתוב כאן שאלה לבועז"></textarea></label>`+note('הכפתור פותח טיוטה באפליקציית המייל שלך. השליחה בידיך.')+actions(btn('פתיחת טיוטת מייל','contact'));}
 if(i===21){screen.innerHTML=back(11)+title('טוב שחזרת')+coach()+`<div class="card"><h3>הכניסה לתוכנית שלך</h3><p class="muted">באפליקציה המלאה נכנסים לחשבון וממשיכים מהמקום שבו עצרת.</p></div>`+note('אין כאן חיבור לחשבונות קיימים. אפשר להיכנס כמתאמן לדוגמה.')+actions(btn('כניסה לחשבון לדוגמה',14),btn('עדיין אין לי תוכנית',0,'secondary'));}
 if(i===22){screen.innerHTML=title('שלום, בועז','מבט מאמן · נתוני דוגמה')+`<div class="stats"><div class="stat"><b>3</b><span>כרטיסי דוגמה</span></div><div class="stat"><b>${state.done?1:0}</b><span>השלמות בדמו</span></div><div class="stat"><b>${state.bookings.size}</b><span>הרשמות בדמו</span></div></div><h3>כדאי לשים לב</h3><div class="card"><div class="row"><div><h3>המתאמן בהמחשה</h3><p class="muted">${state.done?'השלים אימון היום':'התוכנית מוכנה לתחילת הדרך'}</p></div>${btn('לכרטיס',23,'small-action')}</div></div><div class="card"><h3>דנה · דוגמה</h3><p class="muted">לא התאמנה השבוע · כאן תופיע אפשרות לפנייה אישית.</p></div><div class="card"><h3>אורי · דוגמה</h3><p class="muted">3 אימונים השבוע · עומד ביעד שקבע.</p></div>`+actions(btn('הכנת עדכון למתאמנים',24),btn('חזרה למבט מתאמן',14,'secondary'));}
 if(i===23){screen.innerHTML=back(22)+title('המתאמן בהמחשה','מעקב אישי')+`<div class="card"><h3>${p.name}</h3><p class="muted">${scheduleText()}</p><p class="muted">${state.reminders?'בחר בתזכורות':'ללא תזכורות'} · ${state.done?'אימון אחד הושלם':'טרם הושלם אימון'}</p></div><h3>מה קרה באפליקציה?</h3><div class="timeline">${state.events.length?state.events.map(e=>`<p>${esc(e.text)}<small>${e.time} · פעילות מקומית בהמחשה</small></p>`).join(''):'<p>הפעולות במסע המתאמן יופיעו כאן.</p>'}</div>`+note('באפליקציה המלאה יוצגו לבועז רק נתונים שהמתאמן הסכים לשתף.')+actions(btn('חזרה למתאמנים',22));}
 if(i===24){screen.innerHTML=back(22)+title('עדכון אחד.<br>למי שהוא רלוונטי.')+`<form id="broadcast-form"><label class="field">למי העדכון?<select id="audience"><option>לכל מי שבחר לקבל עדכונים</option><option>למשתתפי תוכנית שיווי משקל</option><option>למשתתפי אימוני 10 דקות</option></select></label><label class="field">כותרת<input id="broadcast-title" maxlength="70" required value="עדכון חדש מ־Fitnet"></label><label class="field">תוכן העדכון<textarea id="broadcast-body" maxlength="600" required placeholder="מה תרצה לעדכן?"></textarea></label><p class="info-note">תצוגה מקדימה בלבד. לא נשלחת הודעה למתאמנים.</p><button class="next" type="submit">לתצוגה מקדימה ${arrow}</button></form>`;}
}
function renderQuestion(i){
 const [label,q,options,icons,measure]=questions[i];
 screen.innerHTML=`<div class="step">${i?btn('→ חזרה',i-1,'back'):'<strong>קצת עליך</strong>'}<span>שאלה ${i+1} מתוך 9</span></div><div class="progress" aria-label="שאלה ${i+1} מתוך 9"><span style="width:${(i+1)/9*100}%"></span></div><section class="question">${title(q)}</section><form class="question-form" id="question-form">${options?`<fieldset><legend>${q.replace(/<br>/g,' ')}</legend>${options.map((text,n)=>`<label class="option"><input type="radio" name="answer" value="${n}" ${state.answers[i]===n?'checked':''}><span class="choice"><span class="icon number-icon" aria-hidden="true">${icons[n]}</span><span class="copy"><strong ${i===1?'dir="auto"':''}>${text}</strong></span><span class="radio" aria-hidden="true"></span></span></label>`).join('')}</fieldset>`:`<label class="field measure"><span>${measure.unit}</span><input type="number" inputmode="decimal" id="measure" min="${measure.min}" max="${measure.max}" step="${measure.step}" value="${state.answers[i]??''}" aria-label="${label}" placeholder="—"></label><p class="optional">לא חובה. אפשר גם לדלג.</p>`}<button class="next" type="submit" ${options&&state.answers[i]===null?'disabled':''}>${i===8?'למציאת מסלול':'ממשיכים'}${arrow}</button>${measure?btn('דלג על השאלה','skip-measure','text-button'):''}</form>`;
}
function advanceQuestion(){
 const i=state.current;
 if(i<7&&state.answers[i]===null)return;
 if(i>=7)state.answers[i]=$('#measure').value?Number($('#measure').value):null;
 log('מענה לשאלה: '+questions[i][0]);
 if(i===4)state.days=state.answers[4]===0?[0,3]:state.answers[4]===1?[0,2,4]:[0,1,3,4];
 go(i+1);
}
function selectAnswer(input){
 clearTimeout(timer);
 const question=state.current;
 state.answers[question]=Number(input.value);
 $('#question-form .next').disabled=false;
 timer=setTimeout(()=>{if(state.current===question)advanceQuestion();},280);
}
document.addEventListener('change',e=>{
 if(e.target.name==='answer')selectAnswer(e.target);
 if(e.target.id==='training-time')state.time=e.target.value;
 if(e.target.id==='reminders')state.reminders=e.target.checked;
 if(e.target.id==='updates')state.updates=e.target.checked;
});
document.addEventListener('submit',e=>{
 e.preventDefault();
 if(e.target.id==='question-form')advanceQuestion();
 if(e.target.id==='broadcast-form'){state.broadcast={title:$('#broadcast-title').value,body:$('#broadcast-body').value,audience:$('#audience').value};go(19);}
});
document.addEventListener('click',e=>{
 if(e.target.matches('input[name="answer"]')){selectAnswer(e.target);return;}
 const target=e.target.closest('button');if(!target)return;
 if(target.dataset.go!==undefined){go(Number(target.dataset.go));return;}
 if(target.dataset.day!==undefined){const day=Number(target.dataset.day);state.days=state.days.includes(day)?state.days.filter(d=>d!==day):[...state.days,day].sort();target.setAttribute('aria-pressed',state.days.includes(day));return;}
 if(target.dataset.feeling!==undefined){state.feeling=Number(target.dataset.feeling);log('משוב על האימון: '+['קליל','בדיוק בשבילי','מאתגר'][state.feeling]);render();return;}
 const action=target.dataset.action;
 if(action==='about')dialog.showModal();
 if(action==='close-dialog')dialog.close();
 if(action==='reset')location.reload();
 if(action==='skip-measure'){state.answers[state.current]=null;go(state.current+1);}
 if(action==='enable-reminders'||action==='skip-reminders'){state.reminders=action==='enable-reminders';go(13);}
 if(action==='save-schedule'){if(!state.days.length||!state.time){$('#schedule-status').textContent='יש לבחור לפחות יום אחד ושעה לאימון.';return;}log('נקבע לוח אימונים: '+scheduleText());go(14);}
 if(action==='complete-workout'){if(!state.done){state.done=true;log('אימון סומן כהושלם');}go(16);}
 if(action?.startsWith('book-')){const id=Number(action.split('-')[1]);if(state.bookings.has(id)){state.bookings.delete(id);log('ביטול הרשמה לשיעור לדוגמה');}else{state.bookings.add(id);log('הרשמה לשיעור קבוצתי לדוגמה');}render();}
 if(action==='contact'){const body=$('#contact-message').value;location.href='mailto:blfitnet@gmail.com?subject='+encodeURIComponent('שאלה לגבי תוכנית Fitnet')+'&body='+encodeURIComponent(body);}
});
render();
