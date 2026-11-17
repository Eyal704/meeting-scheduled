'use strict';

function emailSubject(){
  return `מסד — דיווח מפגעים — ${current.site} — ${current.date}`.replace(/[\r\n]/g,' ').slice(0,180);
}

function emailText(){
  const lines=[
    'דיווח מפגעים — מסד',
    `מזהה דוח: ${current.id.slice(0,8)}`,
    `אתר: ${current.site}`, `כתובת: ${current.address||'לא צוינה'}`,
    `תאריך ושעה: ${current.date} ${current.time}`,
    `שם המדווח: ${current.reporter||'לא צוין'}`,
    `ממונה / מבקר הבטיחות: ${current.inspector}`,
    `מנהל העבודה / בעל האתר: ${current.manager||'לא צוין'}`,
    `טלפון איש קשר: ${current.phone||'לא צוין'}`, ''
  ];
  current.hazards.forEach((h,i)=>lines.push(
    `מפגע ${i+1}`,
    `מקום מדויק: ${h.location}`, `סיווג: ${h.category}`,
    `חומרה: ${h.risk}`, `תיאור: ${h.description}`,
    `סטטוס טיפול: ${h.treatment||'לא צוין'}`,
    ...(h.deadline?[`מועד יעד לטיפול: ${h.deadline}`]:[]),
    ...(h.notes?[`הנחיות לטיפול: ${h.notes}`]:[]),
    `מספר תמונות בדוח: ${h.photos.length}`, ''
  ));
  if(current.notes)lines.push(`הערות נוספות: ${current.notes}`,'');
  lines.push('התמונות והחתימה מופיעות בדוח ה־PDF.');
  return lines.join('\r\n');
}

function emailHTML(){
  return `<section class="panel email-panel no-print" aria-labelledby="email-title">
    <h2 id="email-title">שליחה במייל</h2>
    <p>ההודעה נפתחת באפליקציית המייל לבדיקה ושליחה.</p>
    <label class="field" for="email-to"><span class="field-label">כתובת המייל של הנמען <span class="required">*</span></span>
      <input id="email-to" type="email" inputmode="email" autocomplete="email" dir="ltr" required maxlength="254" value="${escape(current.emailTo||'')}" aria-describedby="email-help">
    </label>
    <div class="email-actions">
      <button type="button" class="primary" data-action="email-compose">פתיחת הודעת מייל</button>
      <button type="button" data-action="email-copy">העתקת נוסח המייל</button>
    </div>
    <p id="email-help" class="note">המייל כולל את פרטי המפגעים בטקסט. תמונות וחתימה מצרפים כ־PDF.</p>
    <div class="email-attachment">
      <button type="button" data-action="email-share" disabled>שיתוף PDF לאפליקציית המייל</button>
      <p class="note">בחרו באפליקציית המייל והזינו בה את הנמען. אם השיתוף אינו זמין, ה־PDF יורד לצירוף ידני.</p>
    </div>
    <p id="email-status" class="note" role="status" aria-live="polite"></p>
  </section>`;
}

// mailto composes only. Attachments and final delivery remain in the user's mail app.
function emailLink(recipient){
  const prefix=`mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(emailSubject())}&body=`;
  const full=prefix+encodeURIComponent(emailText());
  if(full.length<=7000)return {url:full,shortened:false};
  const summary=`דיווח מפגעים — מסד\r\nאתר: ${current.site.slice(0,160)}\r\nתאריך: ${current.date}\r\nשם המדווח: ${current.reporter.slice(0,160)}\r\nמזהה דוח: ${current.id.slice(0,8)}\r\nמספר מפגעים: ${current.hazards.length}\r\nפרטי המפגעים המלאים והתמונות נמצאים בדוח PDF נפרד.`;
  return {url:prefix+encodeURIComponent(summary),shortened:true};
}

function openEmail(){
  const input=document.querySelector('#email-to');
  input.value=input.value.trim();
  if(!input.reportValidity())return;
  current.emailTo=input.value;
  save();
  const draft=emailLink(input.value);
  document.querySelector('#email-status').textContent=draft.shortened
    ?'הדיווח ארוך ולכן המייל נפתח עם תקציר בלבד. צרפו את ה־PDF או השתמשו בהעתקת פרטי המפגעים כדי לכלול את כל התוכן. השליחה נעשית באפליקציית המייל.'
    :'נשלחה בקשה לפתיחת אפליקציית המייל; הדוח עדיין לא נשלח. אם לא נפתחה הודעה, העתיקו את הפרטים ופתחו מייל ידנית. את ה־PDF יש לצרף בנפרד.';
  const link=document.createElement('a');
  link.href=draft.url;
  link.click();
}
