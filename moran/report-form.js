/* The output report. It follows the structure and wording of the form Moran sent:
   same title, sections, order, symbols and permit paragraph. Values are blue as in his form.
   Page 4 is an annex with additions that are not part of the original form. */
const CASE_ID='2026-0148';
const SYMBOL={pass:'✓',fail:'X',nt:'ל.נ.',na:'ל.ר.',nr:'ל.ב.'};
const FORM_PAGES=4;

function reportValue(v){return /^[A-Za-z0-9>]/.test(String(v))?'<bdi dir="ltr">'+esc(v)+'</bdi>':esc(v)}
function rv(key,value){const v=(value===undefined||value===null||String(value).trim()==='')?'/':value;return `<span class="rv" data-k="${key}">${reportValue(v)}</span>`}
function rf(key){return rv('f.'+key,state.fields[key])}
function rx(key,suffix=''){return rv('x.'+key,(state.extra[key]??'')+suffix)}
function longDate(iso){if(!iso)return '';const d=new Date(iso+'T12:00:00');if(isNaN(d))return iso;return d.toLocaleDateString('he-IL',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}
function shortDate(iso){if(!iso)return '';const [y,m,d]=iso.split('-');return `${d}.${m}.${y}`}

function formContacts(){return `<div class="form-contacts"><div>רח' משה קול 1 ת.ד 10049 ת"א 6110001 || טל. 03-5757949 || פקס. 077-6165500</div><div>www.moran-eng.com || office@moran-eng.com</div></div>`}
function pageShell(n,body){const label=n<3?`עמוד ${n+1} מתוך 3`:'נספח';return `<article class="report-page" data-page="${n}"><div class="form-frame"><div class="form-watermark" aria-hidden="true">הדגמה · נתונים בדויים · ללא תוקף</div><div class="page-no">${label}</div>${body}${formContacts()}</div></article>`}
function formLogo(){return `<div class="form-logo"><img src="assets/moran-logo.png" alt="מורן מהנדסים"/></div>`}
function pairRow(a,av,b,bv){return `<div class="pair-row"><div><span class="l">${a}</span>${av}</div><div><span class="l">${b}</span>${bv}</div></div>`}
function numRow(n,label,val){return `<div class="num-row"><span class="n">${n}</span><span class="l">${label}</span><span class="v">${val}</span></div>`}

function permitAllowed(){return state.fields.conclusion==='acceptable'&&!openFindings().length&&!blockers().length}
function permitBlock(){const open=openFindings().length;const text=`<p>הנני מאשר כי מתקן החשמל באתר המתואר לעיל נבדק ונמצא תקין ומתאים לדרישות חוק החשמל, תקנותיו ולתקנים הרלוונטיים במועד ביצוע בדיקה זו, למעט אביזרים וציוד חשמל קבוע או מיטלטל.</p><p>תעודת הבדיקה נכונה למתכונת המתקן המתואר מעלה ביום ובשעת הבדיקה, בהתאם לכך, <strong>הנני מתיר לחבר את מתקן החשמל למתח ולהפעילו.</strong></p>`;
  if(permitAllowed())return `<div class="permit" data-k="permit" data-v="open">${text}</div>`;
  const why=open?`יש ליקוי פתוח (${open}). הפסקה נכנסת לדוח רק אחרי תיקון, אימות והחלטת הבודק.`:(state.fields.conclusion==='acceptable'?'חסרים נתונים נדרשים להשלמת הדוח.':'הבודק עדיין לא קבע שהמתקן תקין.');
  return `<div class="permit blocked" data-k="permit" data-v="blocked"><div class="permit-text">${text}</div><div class="permit-stop"><strong>ההיתר חסום.</strong> ${why}</div></div>`}

function signatureMark(){const s=state.signature;if(s&&s.img)return `<img class="sig-img" src="${esc(s.img)}" alt="חתימת הבודק"/>`;if(s&&s.mode==='wet')return `<span class="sig-line wet">לחתימה ידנית</span>`;return `<span class="sig-line"></span>`}
function inspectorBlock(){const f=state.fields;return `<div class="inspector"><h3>פרטי החשמלאי הבודק:</h3><div class="ins-row"><div><span class="l u">שם:</span> <strong>${rf('inspector')} ${esc(f.inspectorTitle||'')}</strong></div></div><div class="ins-row"><div><span class="l u">רישוי:</span> <strong>מ.ר. מהנדס חשמל – ${rf('license')}</strong></div><div class="sig"><span class="l">חתימה:</span>${signatureMark()}</div></div><div class="ins-row"><div><span class="l u">כתובת:</span> <strong>רחוב משה קול 1 תל אביב</strong></div><div><span class="l">תאריך:</span> ${rv('f.date',shortDate(f.date))}</div></div></div>`}

function pageGeneral(){const f=state.fields;return pageShell(0,`<div class="form-top"><div class="form-title"><h2>אישור בדיקת בטיחות למתקן החשמל</h2><p>(עפ"י חוק החשמל תשי"ד 1954 ותקנותיו)</p></div>${formLogo()}</div>
<h3>כללי:</h3><div class="pairs">${pairRow('מזמין הבדיקה:',rf('client'),'שם המתקן הנבדק:',rf('facility'))}${pairRow('טלפון:',rf('phone'),'כתובת המתקן הנבדק:',rf('address'))}${pairRow('אימייל:',rf('email'),'סוג הבדיקה:',rv('type','בטיחות למתקן החשמל'))}${pairRow('חברה:',rf('company'),'הזנה במתח נמוך:',rv('f.voltage',f.voltage+' [V]'))}${pairRow('הזמנה מתאריך:',rv('f.date',longDate(f.date)),'גודל חיבור הלוח הנבדק:',rv('f.connection',f.connection+' [A]'))}</div>
<h3>פרטי זיהוי:</h3><div class="nums">${numRow(1,'שם המתקן הנבדק:',rf('facility'))}${numRow(2,'בעל המתקן (צרכן):',rf('client'))}${numRow(3,'מלווה הבדיקה:',rf('contact'))}${numRow(4,'תפקידו:',rf('contactRole'))}${numRow(5,"מס' הפלאפון:",rf('phone'))}${numRow(6,'משתתפים בבדיקה:',rf('participants'))}${numRow(7,'מספר רישוי:',rf('contactLicense'))}${numRow(8,'מבצע המתקן:',rf('contractor'))}${numRow(9,"מס' ח.פ:",rf('contractorVat'))}${numRow(10,'מספר רישוי:',rf('contractorLicense'))}${numRow(11,'כתובת:',rf('contractorAddress'))}${numRow(12,"מס' הטלפון:",rf('contractorPhone'))}</div>
<h3>פרטים טכניים:</h3><div class="nums">${numRow(1,'מתח הזנה:',rv('f.voltage',f.voltage+' [V]'))}${numRow(2,'גודל חיבור:',rv('f.connection',f.connection+' [A]'))}${numRow(3,"מס' לוחות משנה:",rf('boards'))}${numRow(4,'תיאור המתקן הנבדק:',rf('facility'))}${numRow(5,'מקור הזנה:',rf('supply'))}${numRow(6,'אספקת חירום:',rf('emergency'))}${numRow(7,'שיטת הגנה נגד חשמול:',rf('method'))}</div>
<h3>היתר לחיבור מתח:</h3>${permitBlock()}${inspectorBlock()}`)}

function checkTable(items){const groups=[];for(const i of items){const g=groups[groups.length-1];if(g&&g.name===i.group)g.items.push(i);else groups.push({name:i.group,items:[i]})}
  return `<table class="form-checks"><tbody>${groups.map(g=>g.items.map((i,n)=>{const s=state.checks[i.id];return `<tr>${n===0?`<td class="grp ${g.items.length<3?'short':''}" rowspan="${g.items.length}"><span>${esc(g.name)}</span></td>`:''}<td class="sym ${s==='fail'?'bad':''}"><span class="rv" data-k="c.${i.id}">${esc(SYMBOL[s]||'')}</span></td><td class="lbl">${esc(i.label)}</td></tr>`}).join('')).join('')}</tbody></table>`}
function pageChecks(){return pageShell(1,`<div class="form-top compact"><div class="form-title"><h2 class="h-sub">מתקן החשמל ב${rf('site')}:</h2></div>${formLogo()}</div>
<div class="pairs tight">${pairRow('מקור זינה:',rf('supply'),'נתוני כבל הזנה:',rf('cable'))}${pairRow('שיטת הגנה בפני חשמול:',rf('method'),'הארקה:',rf('earthing'))}${pairRow('אופן ביצוע איפוס / הארקת שיטה:',rf('bonding'),'מפסק הזנה:',rv('f.voltage',state.fields.voltage+' [V]'))}${pairRow('מיקום פה"פ:',rf('earthbar'),'גודל חיבור:',rv('f.connection',state.fields.connection+' [A]'))}</div>
<div class="checks-grid">${checkTable(CHECKLIST.slice(23))}${checkTable(CHECKLIST.slice(0,23))}</div>
<p class="legend"><b>✓</b> - <u>תקין</u> &nbsp; <b>X</b> - <u>לא תקין</u> &nbsp; <b>ל.נ.</b> - <u>לא נבדק</u> &nbsp; <b>ל.ר.</b> - <u>לא רלוונטי</u> &nbsp; <b>ל.ב.</b> - <u>לא נדרש בתקן לפי שנת ההקמה.</u></p>`)}

function pageMeasures(){const f=state.fields,x=state.extra,m=state.measurements;const zr=(sub,k,val,unit)=>`<div class="m-cell"><span class="m-sym">${sub}</span><span class="m-val">${rv(k,val)}</span><span class="m-unit">${unit}</span></div>`;
  const rows=m.map((p,i)=>`${zr(`Z<sub>ph${i+1}-e</sub> =`,`m.${i}.pe`,p.pe,'[Ω]')}${zr('I<sub>SC</sub> =',`m.${i}.iscPE`,p.iscPE,'[kA]')}${zr(`Z<sub>ph${i+1}-n</sub> =`,`m.${i}.pn`,p.pn,'[Ω]')}${zr('I<sub>SC</sub> =',`m.${i}.iscPN`,p.iscPN,'[kA]')}`).join('');
  return pageShell(2,`<p class="form-note"><b>הערה:</b> <u>נתוני כוונון ההגנות במפסקים האוטומטיים בדו"ח זה הם לאחר ביצוע הכוונון.</u></p>
<div class="form-top compact"><div class="form-title"><h2 class="h-sub">תעודת רישום ללוח חשמל זמני באתר בנייה – ${rf('site')}</h2><h2 class="h-sub small-h">בדיקת התנגדות הבידוד וטיב הארקה:</h2></div>${formLogo()}</div>
<h3>ממצאים:</h3><div class="m-heads" dir="ltr"><span>גודל נמדד:</span><span>זרם קצר צפוי:</span><span>גודל נמדד:</span><span>זרם קצר צפוי:</span></div><div class="m-grid" dir="ltr">${rows}${zr('Z<sub>2ph</sub> =','x.z2',x.z2,'[Ω]')}${zr('I<sub>SC 2ph</sub> =','x.isc2',x.isc2,'[kA]')}<div></div>${zr('I<sub>SC 3ph</sub> =','x.isc3',x.isc3,'[kA]')}</div>
<div class="tune-row"><div>כוונון ההגנות במפסק מתאים לזרם הקצר הצפוי: ${rx('suitable')}</div><div>בוצע כוונון: ${rx('adjusted')}</div><div>נדרשת החלפת מפסק: ${rx('replace')}</div></div>
<p class="form-statement">${permitAllowed()?`✦ החברה המבצעת חברת '${rf('contractor')}', ביצעה את העבודה על פי תקנות החשמל, כללי המקצוע והבטיחות ובהתאם לחוק החשמל.`:'טרם הושלמו התנאים להצגת הצהרת התאמה. יש לעיין בממצאים ובהחלטת הבודק.'}</p>
<h3>הערות כלליות:</h3><p class="form-notes">${rf('notes')}</p>
<table class="form-circuits"><thead><tr><th colspan="8" class="t-title">לוח חשמל חלוקה</th></tr><tr><th rowspan="2">תיאור קו הזינה ומעגלים סופיים</th><th rowspan="2">מס' מעגלים</th><th rowspan="2">סוג הכבל וחתך בממ"ר</th><th colspan="2">נתוני המבטח</th><th rowspan="2">התנגדות הבידוד [MΩ]</th><th rowspan="2">רציפות הארקה</th><th rowspan="2">הערות</th></tr><tr><th>מא"ז / מפ"ז [A]</th><th>כוונון מגנטי / תרמי</th></tr></thead><tbody>${state.circuits.map((c,i)=>`<tr>${['name','count','cable','breaker','setting','insulation','earth'].map(k=>`<td>${rv(`c${i}.${k}`,c[k])}</td>`).join('')}<td>${rv(`c${i}.note`,c.note||'/')}</td></tr>`).join('')}</tbody></table>${inspectorBlock()}`)}

function pageAnnex(){const f=state.fields,x=state.extra;const itemNotes=CHECKLIST.filter(i=>['nt','nr'].includes(state.checks[i.id])||(state.checks[i.id]==='na'&&state.reasons[i.id]&&state.reasons[i.id]!==NA_REASON));
  return pageShell(3,`<div class="form-top compact"><div class="form-title"><h2 class="h-sub">נספח לדוח: ליקויים, תמונות ומכשיר מדידה</h2><p class="annex-sub">תוספת שאינה חלק מהטופס המקורי. אפשר להשאיר או להוריד.</p></div>${formLogo()}</div>
<h3>מכשיר המדידה:</h3><div class="pairs tight">${pairRow('מכשיר:',rf('instrument'),'מספר סידורי:',rf('serial'))}${pairRow('תוקף כיול:',rv('f.calibration',shortDate(f.calibration)),'אסמכתת כיול:',rf('calibrationRef'))}</div>
<h3>מפסק מגן:</h3><div class="pairs tight">${pairRow('סוג:',rx('rcdType'),'זרם דלף נקוב:',rx('rcdCurrent',' mA'))}${pairRow('זמן תגובה שנמדד:',rx('rcdTime',' ms'),'שעת הבדיקה:',rf('time'))}</div>
<h3>ליקויים ותיעוד תיקון:</h3>${state.findings.length?state.findings.map((d,i)=>`<div class="annex-finding"><div class="af-text"><div class="af-title"><strong>${esc(d.id)} · ${rv(`d${i}.title`,d.title)}</strong><span class="af-status ${d.status==='אומת ונסגר'?'ok':''}" data-k="d${i}.status">${esc(d.status)}</span></div><div>מיקום: ${rv(`d${i}.location`,d.location)} · אחראי: ${rv(`d${i}.owner`,d.owner)} · יעד: ${rv(`d${i}.due`,shortDate(d.due))}</div><div>הנחיה: ${rv(`d${i}.action`,d.action)}</div>${d.resolution?`<div><b>תיקון ואימות:</b> ${rv(`d${i}.resolution`,d.resolution)}</div>`:''}</div>${d.photo?`<img src="${esc(d.photo)}" alt="תיעוד הליקוי ${esc(d.id)}"/>`:''}</div>`).join(''):'<p class="form-notes">לא נרשמו ליקויים.</p>'}
${itemNotes.length?`<h3>הערות לסעיפים:</h3><ul class="annex-list">${itemNotes.map(i=>`<li>${esc(i.label)}: ${rv(`r.${i.id}`,state.reasons[i.id])}</li>`).join('')}</ul>`:''}
<h3>מעקב המשך:</h3><p class="form-notes">${rv('f.nextDate',shortDate(f.nextDate))} · ${rf('nextReason')}</p>
<h3>מצב הדוח:</h3><p class="form-notes">תיק ${CASE_ID} · גרסה ${state.revision} · ${esc(stageLabel())}${state.qa?' · עם בקרת משרד':' · ללא בקרת משרד'}${state.qaNote?` · הערת בקרה: ${esc(state.qaNote)}`:''}</p>`)}

function reportPageList(){return [pageGeneral(),pageChecks(),pageMeasures(),pageAnnex()]}
function reportPages(){return reportPageList().join('')}
function fitPages(pages){return pages.map(p=>`<div class="report-fit">${p}</div>`).join('')}

/* The page keeps its A4 layout on every screen and is scaled to the available width. */
function fitReports(){document.querySelectorAll('.report-fit').forEach(el=>{const w=el.parentElement.clientWidth;el.style.zoom=w?Math.min(1,w/794):1})}
window.addEventListener('resize',fitReports);
window.addEventListener('beforeprint',()=>document.querySelectorAll('.report-fit').forEach(el=>{el.style.zoom=1}));
window.addEventListener('afterprint',fitReports);

function nextForReport(){if(state.stage==='ready')return null;if(state.stage==='review')return ['לבקרת המשרד',"setRole('office')"];if(['signed','prepared'].includes(state.stage))return null;return ['להשלמת הבדיקה',"state.step=4;setRole('field')"]}
function reportView(){const n=nextForReport();const signed=['signed','prepared'].includes(state.stage);return `<div class="page-head"><div><h1>הדוח, באותו מבנה של הטופס שלכם</h1><p class="head-sub">הכול נבנה ממה שהבודק מילא בשטח. אף אחד לא מקליד אותו מחדש.</p></div><span class="badge ${signed?'green':'amber'}">${stageLabel()}</span></div><div class="report-toolbar no-print"><div class="btn-row"><button class="btn" onclick="window.print()">${icon('report')} שמירת הדוח שלי כ־PDF</button><a class="btn" href="downloads/moran-sample-report.pdf" download>${icon('download')} דוח לדוגמה (PDF)</a></div><div class="btn-row">${signed?`<button class="btn primary" onclick="setRole('done')">${icon('check')} הדוח מוכן</button>`:n?`<button class="btn primary" id="report-next" onclick="${n[1]}">${n[0]} ${icon('arrow')}</button>`:`<button class="btn primary" id="sign-btn" onclick="signDialog()">חתימת הבודק ${icon('arrow')}</button>`}</div></div><div class="report-shell">${fitPages(reportPageList())}</div>`}
