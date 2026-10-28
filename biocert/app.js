'use strict';
(() => {
  const KEY = 'biocert-preview-v1';
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => [...root.querySelectorAll(q)];
  const escape = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const types = {
    bsc: {title:'Biosafety Cabinet Certification Report', label:'Biosafety cabinet · uniform', measurement:'Downflow velocity', checks:['HEPA filter leak test','Airflow smoke pattern','Site installation','Electrical test','Particle monitoring','UV intensity']},
    zoned: {title:'Biosafety Cabinet — Multi-zone Report', label:'Biosafety cabinet · multi-zone', measurement:'Downflow velocity by zone', checks:['HEPA filter leak test','Airflow smoke pattern','Site installation','Electrical test','Particle monitoring','UV intensity']},
    fume: {title:'Fume Hood Performance Report', label:'Fume hood · illustrative', measurement:'Face velocity', checks:['Smoke visualization','Sash operation','Airflow alarm','Cross-draft assessment','Tracer gas test (if specified)']}
  };
  const defaultProcedure = {
    title:'Equipment certification — procedure outline',
    body:'DRAFT OUTLINE — for discussion and technical approval\n\n1. Purpose and scope\nDefine the equipment types, test conditions and limits of the procedure.\n\n2. Responsibilities\nName the qualified technician and the person authorized to review and issue reports.\n\n3. Applicable references\nInsert the approved standards, manufacturer instructions and any client-specific or regulatory requirements. Confirm the applicable editions.\n\n4. Preparation and instruments\nConfirm equipment identity, site conditions and instrument calibration status before testing.\n\n5. Test method\nInsert the approved step-by-step method, reading locations, units and calculations for this equipment type.\n\n6. Acceptance and exceptions\nInsert approved acceptance criteria. Define how failed, incomplete and not-applicable tests are handled.\n\n7. Review and reporting\nReview the readings, results, instrument references and remarks before issuing a controlled report.\n\n8. Document control\nDefine procedure owner, revision, approval date, retention period and how approved copies are shared.\n\nThis outline does not establish compliance or replace a qualified technical review.'
  };
  function sample(type) {
    return {customer:'Harbor Research Laboratory (sample)',address:'100 Example Avenue, Sample City',facility:'Life Sciences Building',room:'Lab 204',asset:type === 'fume' ? 'FH-DEMO-002' : 'BSC-DEMO-001',serial:'DEMO-24001',manufacturer:'Sample manufacturer',model:type === 'fume' ? 'Demonstration fume hood' : 'Class II Type A2 · sample',testDate:'2026-10-28',dueDate:'2027-10-28',title:types[type].title,technician:'Demo technician',status:'Draft — pending review',instrument:'Anemometer · sample instrument',instrumentSerial:'INST-DEMO-01',calibrationDue:'2027-04-01',remarks:'Demonstration data only. Confirm the test method, acceptance criteria and report format with BioCert before operational use.',readings:type === 'fume' ? [98,103,99,102,100,101,97,104,100,99,102,101] : type === 'zoned' ? [54,55,53,56,54,55,61,62,60,63,61,62] : [54,55,53,56,54,55,52,54,56,55,53,54],area:type === 'fume' ? '4.0' : '7.25',inflow:['330','338','334','336','332'],openingArea:'3.2',sash:'10',checks:Object.fromEntries(types[type].checks.map(k=>[k,'Not recorded']))};
  }
  let stored = {};
  let storageOK = true;
  try { stored = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { storageOK = false; }
  const validData = d => d && typeof d === 'object' && Array.isArray(d.readings) && d.readings.length === 12 && d.checks && typeof d.checks === 'object';
  let active = types[stored.active] ? stored.active : 'bsc';
  const data = Object.fromEntries(Object.keys(types).map(k=>[k,validData(stored.data?.[k]) ? {...sample(k),...stored.data[k]} : sample(k)]));
  let drafts = Array.isArray(stored.drafts) ? stored.drafts.filter(d=>types[d.type] && validData(d.data)).slice(0,20) : [];
  let procedure = typeof stored.procedure?.body === 'string' && typeof stored.procedure?.title === 'string' ? stored.procedure : {...defaultProcedure};
  let editingId = null;
  let toastTimer;
  function toast(message) { $('#toast').textContent = message; $('#toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(()=>$('#toast').hidden=true,4500); }
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify({active,data,drafts,procedure})); storageOK = true; }
    catch { storageOK = false; }
    $('#save-state').textContent = storageOK ? 'Saved on this device' : 'Not saved · browser storage unavailable';
  }
  function numbers(values) { return values.map(v => v === '' || v === null ? NaN : Number(v)).filter(Number.isFinite); }
  function stats(values) { const n = numbers(values); return {count:n.length,mean:n.length ? n.reduce((a,b)=>a+b,0)/n.length : null,low:n.length ? Math.min(...n) : null,high:n.length ? Math.max(...n) : null}; }
  function format(v) { return v === null || !Number.isFinite(Number(v)) ? '—' : Number(v).toLocaleString('en-US',{maximumFractionDigits:2}); }
  function date(v) { return /^\d{4}-\d{2}-\d{2}$/.test(v || '') ? new Date(v+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : 'Not recorded'; }
  function numericInputs(values,prefix,start=0) {
    return `<div class="reading-grid">${values.map((v,i)=>`<label>Point ${start+i+1}<input aria-label="${prefix} point ${start+i+1}" type="number" min="0" max="100000" step="any" data-reading="${start+i}" value="${escape(v)}" inputmode="decimal"></label>`).join('')}</div>`;
  }
  function mount() {
    const d = data[active];
    $$('#report-form [name]').forEach(el=>el.value=d[el.name] ?? '');
    $$('.template').forEach(el=>{const selected=el.dataset.template===active;el.classList.toggle('active',selected);el.setAttribute('aria-pressed',String(selected));});
    $('#measurement-title').textContent=types[active].measurement;
    $('#measurement-note').textContent=active==='zoned' ? 'Two illustrative zones, six readings each. Edit the readings in feet per minute (FPM).' : active==='fume' ? 'Illustrative 12-point face-velocity grid (FPM). Replace with your approved hood-specific worksheet in the build.' : 'A compact 12-point example, in feet per minute (FPM). The final grid will follow your approved worksheet.';
    const zones = active==='zoned' ? `<div class="zone-title">Zone A <span>Points 1–6</span></div>${numericInputs(d.readings.slice(0,6),'Zone A',0)}<div class="zone-title">Zone B <span>Points 7–12</span></div>${numericInputs(d.readings.slice(6),'Zone B',6)}` : numericInputs(d.readings,active==='fume'?'Face velocity':'Downflow');
    $('#measurements').innerHTML=zones+`<div class="field-grid" style="margin-top:16px"><label>${active==='fume'?'Hood opening area':'Downflow area'} (ft²)<input type="number" min="0.01" step="any" data-extra="area" value="${escape(d.area)}" inputmode="decimal"></label><label>Sash height (in)<input type="number" min="0" step="any" data-extra="sash" value="${escape(d.sash)}" inputmode="decimal"></label></div>`+(active==='fume'?'':`<div class="zone-title">Inflow volume readings <span>CFM · illustrative method</span></div><div class="reading-grid">${d.inflow.map((v,i)=>`<label>Reading ${i+1}<input aria-label="Inflow volume reading ${i+1}" type="number" min="0" step="any" data-inflow="${i}" value="${escape(v)}" inputmode="decimal"></label>`).join('')}</div><label style="margin-top:12px">Access opening area (ft²)<input type="number" min="0.01" step="any" data-extra="openingArea" value="${escape(d.openingArea)}" inputmode="decimal"></label>`);
    $('#checks').innerHTML=types[active].checks.map(k=>`<div class="check-row"><label for="check-${types[active].checks.indexOf(k)}">${escape(k)}</label><select id="check-${types[active].checks.indexOf(k)}" data-check="${escape(k)}">${['Not recorded','Passed','Failed','N/A'].map(v=>`<option${d.checks[k]===v?' selected':''}>${v}</option>`).join('')}</select></div>`).join('');
    update();
  }
  function field(label,value) { return `<div class="paper-field"><span>${escape(label)}</span><strong>${escape(value || 'Not recorded')}</strong></div>`; }
  function metricTable(readings) { return `<table class="paper-table"><thead><tr><th>Point</th><th class="value">Velocity (FPM)</th><th>Point</th><th class="value">Velocity (FPM)</th></tr></thead><tbody>${Array.from({length:Math.ceil(readings.length/2)},(_,i)=>{const j=i*2;return `<tr><td>${j+1}</td><td class="value">${escape(readings[j] === '' ? '—' : format(readings[j]))}</td><td>${j+2}</td><td class="value">${escape(readings[j+1] === '' ? '—' : format(readings[j+1]))}</td></tr>`;}).join('')}</tbody></table>`; }
  function reportHTML() {
    const d=data[active], s=stats(d.readings), inf=stats(d.inflow), area=Number(d.area), opening=Number(d.openingArea);
    const all=s.count===12, volume=all && area>0 ? s.mean*area : null;
    const metrics=active==='zoned' ? `<table class="paper-table"><thead><tr><th>Zone</th><th>Readings (FPM)</th><th class="value">Mean (FPM)</th></tr></thead><tbody>${['A','B'].map((z,i)=>{const values=d.readings.slice(i*6,i*6+6),st=stats(values);return `<tr><td>Zone ${z}</td><td>${values.map(v=>escape(v===''?'—':format(v))).join(' · ')}</td><td class="value">${format(st.mean)}${st.count<6?' (partial)':''}</td></tr>`;}).join('')}</tbody></table>` : metricTable(d.readings);
    return `<div class="paper-head"><img src="assets/biocert-logo.png" alt="BioCert Laboratory"><div class="paper-meta"><span class="paper-badge">DEMO · DRAFT</span><br>Equipment test report<br>BC-DEMO-001</div></div><h3>${escape(d.title)}</h3><div class="paper-subtitle">${escape(types[active].label)} · Sample record · Not an issued certificate</div><div class="paper-grid">${field('Customer',d.customer)}${field('Equipment / Asset',d.asset)}${field('Site address',d.address)}${field('Serial number',d.serial)}${field('Facility / room',[d.facility,d.room].filter(Boolean).join(' · '))}${field('Manufacturer / model',[d.manufacturer,d.model].filter(Boolean).join(' / '))}${field('Test date',date(d.testDate))}${field('Due date',date(d.dueDate))}</div><div class="paper-section"><h4>01 / ${escape(types[active].measurement)}</h4>${metrics}<table class="paper-table"><tbody><tr><td>Mean velocity${all?'':' (partial)'}</td><td class="value">${format(s.mean)} FPM</td><td>Low / high</td><td class="value">${format(s.low)} / ${format(s.high)}</td></tr><tr><td>${active==='fume'?'Opening':'Downflow'} area</td><td class="value">${format(d.area)} ft²</td><td>Calculated volume</td><td class="value">${format(volume)} CFM</td></tr></tbody></table><p class="paper-note">${active==='zoned'?'Zone means are calculated separately; overall volume is an illustration using the overall mean and total area. ':''}Volume = mean velocity × area. Acceptance criteria and the approved test method require BioCert review.</p></div>${active==='fume'?'':`<div class="paper-section"><h4>02 / Inflow velocity</h4><table class="paper-table"><tbody><tr><td>Volume readings (CFM)</td><td class="value">${d.inflow.map(v=>escape(v===''?'—':format(v))).join(' · ')}</td></tr><tr><td>Mean volume${inf.count<5?' (partial)':''}</td><td class="value">${format(inf.mean)} CFM</td></tr><tr><td>Access opening / sash height</td><td class="value">${format(d.openingArea)} ft² / ${format(d.sash)} in</td></tr><tr><td>Calculated mean inflow</td><td class="value">${format(inf.count===5 && opening>0 ? inf.mean/opening : null)} FPM</td></tr></tbody></table><p class="paper-note">Illustration: mean volume ÷ opening area, with no correction factor. Confirm the applicable method before use.</p></div>`}<div class="paper-section"><h4>${active==='fume'?'02':'03'} / Recorded test results</h4><table class="paper-table"><tbody>${types[active].checks.map(k=>`<tr><td>${escape(k)}</td><td class="value">${escape(d.checks[k] || 'Not recorded')}</td></tr>`).join('')}</tbody></table></div><div class="paper-section"><h4>${active==='fume'?'03':'04'} / Instrument & review</h4><div class="paper-grid">${field('Instrument',d.instrument)}${field('Instrument serial',d.instrumentSerial)}${field('Calibration due',date(d.calibrationDue))}${field('Prepared by',d.technician)}${field('Review status',d.status)}</div></div><div class="paper-section"><h4>${active==='fume'?'04':'05'} / Remarks</h4><div class="paper-remarks">${escape(d.remarks)}</div></div><div class="paper-draft">DEMONSTRATION ONLY. Not an issued certification, an approved procedure, an electronic signature or evidence of regulatory compliance. Technical review and authorization are required before operational use.</div><div class="paper-footer"><span>BioCert Laboratory, LLC · Reporting preview</span><span>Fictional sample data</span></div>`;
  }
  function update() {
    const s=stats(data[active].readings);
    $('#live-stats').innerHTML=[['Mean',s.mean],['Low',s.low],['High',s.high]].map(([k,v])=>`<div><small>${k}${s.count<12?' · partial':''}</small><strong>${format(v)}<em>FPM</em></strong></div>`).join('');
    $('#report-paper').innerHTML=reportHTML();
    persist();
  }
  $('#report-form').addEventListener('input',e=>{
    const el=e.target,d=data[active];
    if(el.dataset.reading!==undefined)d.readings[Number(el.dataset.reading)]=el.value;
    else if(el.dataset.inflow!==undefined)d.inflow[Number(el.dataset.inflow)]=el.value;
    else if(el.dataset.extra)d[el.dataset.extra]=el.value;
    else if(el.dataset.check)d.checks[el.dataset.check]=el.value;
    else if(el.name)d[el.name]=el.value;
    update();
  });
  $$('.template').forEach(el=>el.addEventListener('click',()=>{active=el.dataset.template;editingId=null;mount();}));
  $('#reset').addEventListener('click',()=>{if(confirm('Reset this form to its fictional example? Saved drafts will stay available.')){data[active]=sample(active);editingId=null;mount();toast('Example restored.');}});
  function view(name) {
    $$('.app-tabs button').forEach(el=>{const yes=el.dataset.view===name;el.setAttribute('aria-selected',String(yes));el.tabIndex=yes?0:-1;});
    ['builder','saved','procedure'].forEach(k=>$('#panel-'+k).hidden=k!==name);
    if(name==='saved')renderDrafts();
  }
  $$('.app-tabs button').forEach((el,i)=>{el.addEventListener('click',()=>view(el.dataset.view));el.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=$$('.app-tabs button');let n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;view(tabs[n].dataset.view);tabs[n].focus();});});
  function renderDrafts() {
    $('#saved-count').textContent=drafts.length;
    $('#saved-list').innerHTML=drafts.length ? drafts.map(d=>`<div class="saved-item"><div><strong>${escape(d.data.customer)}</strong><small>${escape(types[d.type].label)} · ${escape(d.data.asset)}<br>Saved ${escape(new Date(d.updated).toLocaleString())}</small></div><div class="actions"><button class="text-button" data-open="${escape(d.id)}">Open draft ↗</button><button class="text-button" data-delete="${escape(d.id)}">Delete</button></div></div>`).join('') : '<div class="empty-state">No saved drafts yet. Create a report and choose “Save a report draft”.</div>';
  }
  $('#report-form').addEventListener('submit',e=>{
    e.preventDefault();
    const d=data[active];
    if(d.dueDate<d.testDate){toast('Choose a due date on or after the test date.');return;}
    if(!storageOK){toast('Browser storage is unavailable. You can still print this report.');return;}
    const saved={id:editingId || (globalThis.crypto?.randomUUID?.() || String(Date.now())),type:active,data:JSON.parse(JSON.stringify(d)),updated:new Date().toISOString()};
    const idx=drafts.findIndex(x=>x.id===saved.id);
    if(idx>=0)drafts[idx]=saved;else{if(drafts.length>=20){toast('This preview holds 20 drafts. Delete one before saving another.');return;}drafts.unshift(saved);}
    editingId=saved.id;persist();renderDrafts();toast(storageOK?'Report draft saved on this device.':'Could not save. Browser storage is full or unavailable.');
  });
  $('#saved-list').addEventListener('click',e=>{
    const open=e.target.closest('[data-open]'),del=e.target.closest('[data-delete]');
    if(open){const d=drafts.find(d=>d.id===open.dataset.open);if(!d)return;active=d.type;data[active]=JSON.parse(JSON.stringify(d.data));editingId=d.id;mount();view('builder');toast('Draft opened for editing.');}
    if(del && confirm('Delete this saved draft from this browser?')){drafts=drafts.filter(d=>d.id!==del.dataset.delete);if(editingId===del.dataset.delete)editingId=null;persist();renderDrafts();}
  });
  function printReport() {
    const root=$('#print-root');root.replaceChildren();const sheet=document.createElement('div');sheet.className='report-paper';sheet.innerHTML=reportHTML();root.append(sheet);window.print();
  }
  $('#print-report').addEventListener('click',printReport);
  $('#show-report').addEventListener('click',()=>$('#report-preview').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}));
  $('#procedure-title').value=procedure.title;$('#procedure-body').value=procedure.body;
  ['title','body'].forEach(k=>$('#procedure-'+k).addEventListener('input',e=>{procedure[k]=e.target.value;persist();}));
  $('#print-procedure').addEventListener('click',()=>{const root=$('#print-root');root.innerHTML=`<div class="procedure-print"><img src="assets/biocert-logo.png" alt="BioCert Laboratory"><h1>${escape(procedure.title)}</h1><p>DEMO · DRAFT OUTLINE · NOT AN APPROVED PROCEDURE</p><div>${escape(procedure.body)}</div></div>`;window.print();});
  // Keep a draft ready if the visitor uses the browser's own Print action.
  window.addEventListener('beforeprint',()=>{if(!$('#print-root').childElementCount){const sheet=document.createElement('div');sheet.className='report-paper';sheet.innerHTML=reportHTML();$('#print-root').append(sheet);}});
  window.addEventListener('afterprint',()=>$('#print-root').replaceChildren());
  renderDrafts();mount();
})();
