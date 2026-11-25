'use strict';
function emailHTML(){
  return `<section class="panel email-panel no-print" aria-labelledby="email-title">
    <h2 id="email-title">שליחה במייל</h2>
    <label class="field" for="email-to"><span class="field-label">כתובת המייל של הנמען <span class="required">*</span></span>
      <input id="email-to" type="email" inputmode="email" autocomplete="email" dir="ltr" required maxlength="254" value="${escape(current.emailTo||'')}" aria-describedby="email-help">
    </label>
    <div class="email-actions"><button type="button" class="primary" data-action="email-compose" disabled>פתיחת מייל עם PDF</button><button type="button" data-action="email-copy">העתקת נוסח המייל</button></div>
    <p id="email-help" class="note">בחרו באפליקציית המייל. הדוח מצורף כ־PDF עם התמונות והחתימות; יש לבדוק את הנמען וללחוץ על שליחה באפליקציית המייל.</p>
    <p id="email-status" class="note" role="status" aria-live="polite"></p>
  </section>`;
}
async function openEmail(){
  const input=document.querySelector('#email-to');
  input.value=input.value.trim();
  if(!input.reportValidity()||!pdfFile)return;
  current.emailTo=input.value;
  await save();
  await window.massadNative.export(pdfFile,'email',{
    recipient:input.value,subject:emailSubject(),
    text:`דיווח מפגעים — מסד\nאתר: ${current.site}\nשם המדווח: ${current.reporter}\nתאריך: ${current.date}\nמספר מפגעים: ${current.hazards.length}\nפרטי המפגעים, התמונות והחתימה מצורפים בדוח PDF.`
  });
  document.querySelector('#email-status').textContent='נפתח חלון לבחירת אפליקציה. השליחה נעשית באפליקציית המייל; אין כאן אישור מסירה.';
}
