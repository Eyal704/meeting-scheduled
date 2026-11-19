/* שחר הנדסת מיזוג אוויר — דמו ניהול שירות ושטח. הכל רץ בדפדפן, בלי שרת. */
(function () {
  'use strict';
  const KEY = 'shahar-demo-v3', UIKEY = 'shahar-demo-ui-v3';
  const DAY = 86400000;

  /* ---------------- state ---------------- */
  function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }
  function read(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  let S = read(KEY);
  if (!S || S.version !== 3) S = window.SHAHAR_SEED();
  const params = new URLSearchParams(location.search);
  let ui = Object.assign({ mode: 'office', view: 'today', jobId: null, custId: null, tplId: 'tp1', filter: 'open', q: '', techId: 't1', tjob: null, ttab: 'details', lang: 'he', report: null, modal: null, cat: 'הכל', planTab: 'soon' }, read(UIKEY) || {});
  if (params.get('view') === 'tech') ui.mode = 'tech';
  if (params.get('view') === 'office') ui.mode = 'office';
  ui.modal = null; ui.report = null;
  function save() { store(KEY, S); store(UIKEY, { mode: ui.mode, view: ui.view, techId: ui.techId, tplId: ui.tplId, jobId: ui.jobId, custId: ui.custId, tjob: ui.tjob, ttab: ui.ttab, lang: ui.lang }); }

  /* ---------------- helpers ---------------- */
  const RU = window.SHAHAR_RU || {}, RUD = window.SHAHAR_RU_DATES, RUV = window.SHAHAR_RU_VOICE;
  let PH = false; // true while building the technician phone
  function tx(s, force) { return (PH || force) && ui.mode === 'tech' && ui.lang === 'ru' && s != null && RU[s] !== undefined ? RU[s] : s; }
  const $ = (s, r) => (r || document).querySelector(s);
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  const WD = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  function d(x) { return new Date(x); }
  function fD(x) { if (!x) return '—'; const t = d(x); return t.getDate() + '.' + (t.getMonth() + 1); }
  function fDY(x) { if (!x) return '—'; const t = d(x); return t.getDate() + '.' + (t.getMonth() + 1) + '.' + t.getFullYear(); }
  function fT(x) { if (!x) return '—'; const t = d(x); return String(t.getHours()).padStart(2, '0') + ':' + String(t.getMinutes()).padStart(2, '0'); }
  function sod(x) { const t = d(x); t.setHours(0, 0, 0, 0); return t.getTime(); }
  function dayDiff(x) { return Math.round((sod(x) - sod(Date.now())) / DAY); }
  function rel(x) { const n = dayDiff(x); if (n === 0) return 'היום'; if (n === 1) return 'מחר'; if (n === -1) return 'אתמול'; if (n > 1) return 'בעוד ' + n + ' ימים'; return 'באיחור של ' + (-n) + ' ימים'; }
  function money(n) { return '₪' + Math.round(n).toLocaleString('he-IL'); }
  function mins(a, b) { return a && b ? Math.max(0, Math.round((d(b) - d(a)) / 60000)) : 0; }
  function dur(n) { if (!n) return '—'; const h = Math.floor(n / 60), m = n % 60; return h ? h + ' ש׳' + (m ? ' ' + m + ' דק׳' : '') : m + ' דק׳'; }
  function initials(n) { return String(n || '').split(' ').slice(0, 2).map(w => w[0]).join(''); }
  function uid(p) { return (p || 'x') + Math.random().toString(36).slice(2, 9); }
  const tech = id => S.techs.find(t => t.id === id);
  const cust = id => S.customers.find(c => c.id === id);
  const tpl = id => S.templates.find(t => t.id === id);
  const catItem = id => S.catalog.find(c => c.id === id);
  const job = id => S.jobs.find(j => j.id === id);
  function equipOf(j) { const c = cust(j.customerId); return c && c.equipment.find(e => e.id === j.equipId); }
  function allPlans() { const out = []; S.customers.forEach(c => c.plans.forEach(p => out.push({ p, c, e: c.equipment.find(e => e.id === p.equipId), t: tpl(p.templateId) }))); return out; }
  function openJobForPlan(pid) { return S.jobs.find(j => j.planId === pid && j.status !== 'closed'); }
  function freqLabel(n) { return ({ 0: 'חד פעמי', 1: 'חודשי', 3: 'רבעוני', 6: 'חצי שנתי', 12: 'שנתי' })[n] || ('כל ' + n + ' חודשים'); }

  /* ---------------- icons ---------------- */
  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
    cal: '<rect x="3" y="4.5" width="18" height="16.5" rx="2"/><path d="M16 2.5v4M8 2.5v4M3 10h18"/>',
    repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
    building: '<rect x="4" y="2.5" width="16" height="19" rx="2"/><path d="M9 21.5v-4h6v4M8.5 7h.01M12 7h.01M15.5 7h.01M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 15h.01M12 15h.01M15.5 15h.01"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checklist: '<path d="m3 6 1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17M11 6h10M11 12h10M11 18h10"/>',
    tag: '<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z"/><circle cx="7.5" cy="7.5" r="1.3"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    sign: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/>',
    gear: '<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    nav: '<path d="m3 11 19-9-9 19-2-8z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.6a1 1 0 0 0-.2-.6l-3.5-4.4A1 1 0 0 0 17.5 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4"/>',
    cam: '<path d="M14.5 4h-5L7.5 6.5H4a2 2 0 0 0-2 2V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.5a2 2 0 0 0-2-2h-3.5z"/><circle cx="12" cy="13" r="3.5"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    print: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    swap: '<path d="m16 3 4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    wa: '<path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.6z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.5-1.5-2-1-1 .8a4 4 0 0 1-2.3-2.3l.8-1-1-2z"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4L21 8"/><path d="M21 3v5h-5"/>',
    box: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
    phoneDev: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>'
  };
  function ic(n, s) { return '<svg class="i" viewBox="0 0 24 24"' + (s ? ' style="width:' + s + 'px;height:' + s + 'px"' : '') + '>' + (P[n] || '') + '</svg>'; }

  /* ---------------- job flow ---------------- */
  const FLOW = ['assigned', 'accepted', 'enroute', 'arrived', 'working', 'done', 'returning', 'returned', 'review', 'closed'];
  const ST = { assigned: 'ממתינה לאישור', accepted: 'התקבלה', enroute: 'בדרך ללקוח', arrived: 'הגיע לאתר', working: 'בטיפול', done: 'העבודה הסתיימה', returning: 'בדרך חזרה', returned: 'חזר לבית המלאכה', review: 'ממתינה לבדיקה', closed: 'נסגרה' };
  const STEP = { accepted: 'קיבלתי את הקריאה', enroute: 'יצאתי לדרך', arrived: 'הגעתי ללקוח', working: 'התחלתי לעבוד', done: 'סיימתי את העבודה', returning: 'יצאתי חזרה', returned: 'הגעתי לבית המלאכה', review: 'שליחת הדוח למשרד' };
  const EVT = { accepted: 'אישר קבלה', enroute: 'יצא לדרך', arrived: 'הגיע ללקוח', working: 'התחיל לעבוד', done: 'סיים את העבודה', returning: 'יצא חזרה', returned: 'הגיע לבית המלאכה', review: 'שלח דוח למשרד', closed: 'הקריאה נסגרה', transfer: 'הקריאה הועברה', reopen: 'נפתחה להמשך טיפול', created: 'הקריאה נפתחה' };
  const PRI = { urgent: 'דחופה', normal: 'רגילה', low: 'מתוכננת' };
  const ACTIVE = ['enroute', 'arrived', 'working', 'done', 'returning'];
  function nextStatus(j) { const i = FLOW.indexOf(j.status); return i >= 0 && i < FLOW.indexOf('review') ? FLOW[i + 1] : null; }
  function evAt(j, s) { const e = [...j.events].reverse().find(e => e.status === s); return e && e.at; }
  function totals(j) {
    return { travel: mins(evAt(j, 'enroute'), evAt(j, 'arrived')) + mins(evAt(j, 'returning'), evAt(j, 'returned')), work: mins(evAt(j, 'working'), evAt(j, 'done')) || (j.status === 'working' ? mins(evAt(j, 'working'), Date.now()) : 0) };
  }
  function lastLoc(j) { const e = [...j.events].reverse().find(e => e.loc); return e; }
  function jitter(loc) { return { lat: +(loc.lat + (Math.random() - .5) * .0008).toFixed(5), lng: +(loc.lng + (Math.random() - .5) * .0008).toFixed(5), addr: loc.addr, acc: Math.round(4 + Math.random() * 10) }; }
  function chip(s) { return '<span class="chip s-' + s + '"><i></i>' + tx(ST[s]) + '</span>'; }
  function pri(p) { return '<span class="chip p-' + p + '">' + (p === 'urgent' ? ic('alert', 13) : '') + tx(PRI[p]) + '</span>'; }
  function mapUrl(l) { return 'https://www.google.com/maps?q=' + l.lat + ',' + l.lng; }
  function wazeUrl(c) { return 'https://waze.com/ul?ll=' + c.lat + ',' + c.lng + '&navigate=yes'; }
  function checklistDone(j) { return j.checklist.filter(c => c.type === 'check' ? c.done : String(c.value || '').trim()).length; }

  function pushEvent(j, status, extra) {
    const c = cust(j.customerId);
    let loc = null;
    if (['enroute', 'returned', 'review', 'accepted'].includes(status)) loc = jitter(S.workshop);
    if (['arrived', 'working', 'done', 'returning'].includes(status)) loc = jitter({ lat: c.lat, lng: c.lng, addr: c.address });
    j.events.push(Object.assign({ status, at: new Date().toISOString(), loc, by: j.techId }, extra || {}));
  }

  /* ---------------- attention ---------------- */
  function attention() {
    const out = [];
    S.jobs.filter(j => j.status === 'review').forEach(j => out.push({ hot: true, icon: 'file', title: 'דוח מחכה לאישור שלך · #' + j.id, sub: cust(j.customerId).name + ' · ' + tech(j.techId).name, act: 'open-job', arg: j.id }));
    S.jobs.filter(j => j.status === 'assigned' && j.priority === 'urgent').forEach(j => out.push({ hot: true, icon: 'alert', title: 'קריאה דחופה עוד לא אושרה · #' + j.id, sub: j.title + ' · ' + tech(j.techId).name, act: 'open-job', arg: j.id }));
    allPlans().filter(x => dayDiff(x.p.next) <= 7 && !openJobForPlan(x.p.id) && x.p.reminder !== 'confirmed').forEach(x => out.push({ hot: dayDiff(x.p.next) < 0, icon: 'repeat', cls: dayDiff(x.p.next) < 0 ? '' : 'blue', title: x.t.name + ' · ' + x.c.name, sub: rel(x.p.next) + ' · ' + ({ none: 'עוד לא נשלחה תזכורת', sent: 'נשלחה תזכורת, הלקוח לא ענה', asked_later: 'הלקוח ביקש לדחות' })[x.p.reminder], act: 'go', arg: 'periodic' }));
    S.customers.filter(c => c.contract && c.contract.status !== 'חודש' && dayDiff(c.contract.end) <= 45).forEach(c => out.push({ hot: dayDiff(c.contract.end) <= 21, icon: 'sign', cls: dayDiff(c.contract.end) <= 21 ? '' : 'blue', title: 'חוזה אחזקה מסתיים ' + rel(c.contract.end), sub: c.name + ' · ' + c.contract.status, act: 'go', arg: 'contracts' }));
    return out;
  }

  /* ---------------- top bar ---------------- */
  function topbar() {
    const n = attention().filter(a => a.hot).length;
    return '<header class="topbar"><a class="brand" href="#" data-a="go" data-arg="today"><img src="logo.png" alt="שחר הנדסת מיזוג אוויר"><span class="bname"><b>שחר הנדסת מיזוג אוויר</b><small>ניהול שירות ושטח</small></span></a>' +
      '<div class="top-actions"><div class="seg" role="tablist"><button class="' + (ui.mode === 'office' ? 'on' : '') + '" data-a="mode" data-arg="office">' + ic('monitor', 16) + '<span>משרד</span></button><button class="' + (ui.mode === 'tech' ? 'on' : '') + '" data-a="mode" data-arg="tech">' + ic('phoneDev', 16) + '<span>טכנאי<span class="lbl-long"> בשטח</span></span></button></div>' +
      (ui.mode === 'office' ? '<button class="bell" data-a="go" data-arg="today" aria-label="מחכה לך">' + ic('bell', 20) + (n ? '<i>' + n + '</i>' : '') + '</button><span class="avatar" title="' + esc(S.me) + '">' + initials(S.me) + '</span>' : '') + '</div></header>';
  }

  /* ---------------- office ---------------- */
  const NAV = [
    ['grp', 'עבודה יומית'],
    ['today', 'היום', 'home'], ['jobs', 'קריאות שירות', 'list'], ['periodic', 'טיפולים תקופתיים', 'repeat'],
    ['grp', 'לקוחות'],
    ['customers', 'לקוחות וציוד', 'building'], ['contracts', 'חוזי אחזקה', 'sign'],
    ['grp', 'הגדרות'],
    ['templates', 'תבניות טיפול', 'checklist'], ['catalog', 'מחירון ופריטים', 'tag'], ['settings', 'צוות ואוטומציות', 'gear']
  ];
  function navCount(v) {
    if (v === 'jobs') { const n = S.jobs.filter(j => j.status === 'review').length; return n ? '<span class="cnt hot">' + n + '</span>' : '<span class="cnt">' + S.jobs.filter(j => !['closed'].includes(j.status)).length + '</span>'; }
    if (v === 'periodic') { const n = allPlans().filter(x => dayDiff(x.p.next) < 0 && !openJobForPlan(x.p.id)).length; return n ? '<span class="cnt hot">' + n + '</span>' : ''; }
    if (v === 'contracts') { const n = S.customers.filter(c => c.contract && c.contract.status !== 'חודש' && dayDiff(c.contract.end) <= 45).length; return n ? '<span class="cnt hot">' + n + '</span>' : ''; }
    return '';
  }
  function activeNav() { if (ui.view === 'job') return 'jobs'; if (ui.view === 'customer') return 'customers'; return ui.view; }
  function office() {
    const av = activeNav();
    const side = '<aside class="side">' + NAV.map(n => n[0] === 'grp' ? '<div class="grp">' + n[1] + '</div>' : '<button class="' + (av === n[0] ? 'on' : '') + '" data-a="go" data-arg="' + n[0] + '">' + ic(n[2]) + n[1] + navCount(n[0]) + '</button>').join('') + '<div class="foot">כל השמות והנתונים לדוגמה.<br><button class="link" style="padding:0;width:auto" data-a="reset">איפוס הדמו</button></div></aside>';
    const mnav = '<nav class="mnav">' + NAV.filter(n => n[0] !== 'grp').map(n => '<button class="' + (av === n[0] ? 'on' : '') + '" data-a="go" data-arg="' + n[0] + '">' + ic(n[2], 16) + n[1] + '</button>').join('') + '</nav>';
    const views = { today: vToday, jobs: vJobs, job: vJob, periodic: vPeriodic, customers: vCustomers, customer: vCustomer, contracts: vContracts, templates: vTemplates, catalog: vCatalog, settings: vSettings };
    return mnav + '<div class="office">' + side + '<main class="main">' + (views[ui.view] || vToday)() + '</main></div>';
  }

  function greeting() { const h = new Date().getHours(); return h < 12 ? 'בוקר טוב' : h < 17 ? 'צהריים טובים' : 'ערב טוב'; }
  function todayLabel() { const t = new Date(); if (PH && ui.lang === 'ru') { const w = RUD.wd[t.getDay()]; return w[0].toUpperCase() + w.slice(1) + ', ' + t.getDate() + ' ' + RUD.mo[t.getMonth()]; } return 'יום ' + WD[t.getDay()] + ', ' + t.getDate() + ' ב' + MONTHS[t.getMonth()]; }

  function vToday() {
    const open = S.jobs.filter(j => j.status !== 'closed');
    const field = S.jobs.filter(j => ACTIVE.includes(j.status));
    const review = S.jobs.filter(j => j.status === 'review');
    const plans30 = allPlans().filter(x => dayDiff(x.p.next) <= 30);
    const renew = S.customers.filter(c => c.contract && c.contract.status !== 'חודש' && dayDiff(c.contract.end) <= 60);
    const att = attention();
    const kpis = [
      ['jobs', 'קריאות פתוחות', open.length, open.filter(j => j.priority === 'urgent').length + ' דחופות'],
      ['jobs', 'בשטח עכשיו', field.length, 'טכנאים בדרך או באתר'],
      ['jobs', 'דוחות לבדיקה', review.length, 'מחכים לאישור שלך', review.length > 0],
      ['periodic', 'טיפולים ב-30 יום', plans30.length, plans30.filter(x => dayDiff(x.p.next) < 0).length + ' באיחור', plans30.some(x => dayDiff(x.p.next) < 0)],
      ['contracts', 'חוזים לחידוש', renew.length, 'ב-60 הימים הקרובים', renew.some(c => dayDiff(c.contract.end) <= 21)]
    ];
    const todays = S.jobs.filter(j => j.status !== 'closed' && dayDiff(j.due) <= 0).sort((a, b) => d(a.due) - d(b.due));
    const fieldRows = S.techs.filter(t => !t.helper).map(t => {
      const js = S.jobs.filter(j => j.techId === t.id && j.status !== 'closed' && j.status !== 'review');
      const act = js.find(j => ACTIVE.includes(j.status)) || js.find(j => j.status === 'accepted') || js[0];
      const ll = act && lastLoc(act);
      return '<div class="field-row"><span class="avatar">' + initials(t.name) + '</span><div class="who"><b>' + esc(t.name) + '</b>' +
        (act ? '<small>' + ic('pin', 13) + (ll ? esc(ll.loc.addr) + ' · ' + fT(ll.at) : 'עוד לא יצא') + '</small>' : '<small>' + esc(t.spec) + '</small>') + '</div>' +
        '<div class="st">' + (act ? '<button class="link" data-a="open-job" data-arg="' + act.id + '">' + chip(act.status) + '</button>' : '<span class="chip c-ok">פנוי</span>') + '</div></div>';
    }).join('');
    return '<div class="ph"><div><div class="eyebrow">' + todayLabel() + '</div><h1>' + greeting() + ', ' + esc(S.me) + '</h1></div><div class="actions"><button class="btn pri" data-a="new-job">' + ic('plus') + 'קריאת שירות חדשה</button></div></div>' +
      '<div class="kpis">' + kpis.map(k => '<button class="kpi' + (k[4] ? ' hot' : '') + '" data-a="go" data-arg="' + k[0] + '"><span>' + k[1] + '</span><strong>' + k[2] + '</strong><small>' + k[3] + '</small></button>').join('') + '</div>' +
      '<div class="grid g-main"><div class="grid" style="align-content:start">' +
      '<section class="card"><div class="card-h"><div><h2>' + ic('bell') + 'מחכה לך</h2><div class="sub">רק מה שצריך החלטה שלך. כל השאר רץ לבד.</div></div></div><div class="att">' +
      (att.length ? att.map(a => '<button class="att-row' + (a.hot ? ' hot' : '') + '" data-a="' + a.act + '" data-arg="' + a.arg + '"><span class="att-ic ' + (a.cls || '') + '">' + ic(a.icon) + '</span><span><b>' + esc(a.title) + '</b><small>' + esc(a.sub) + '</small></span><span class="go">' + ic('left') + '</span></button>').join('') : '<div class="empty">' + ic('check') + '<div>אין משהו שמחכה לך עכשיו</div></div>') + '</div></section>' +
      '<section class="card"><div class="card-h"><div><h2>' + ic('list') + 'קריאות להיום</h2></div><button class="link" data-a="go" data-arg="jobs">לכל הקריאות ' + ic('left', 15) + '</button></div>' + jobsTable(todays, true) + '</section>' +
      '</div><div class="grid" style="align-content:start">' +
      '<section class="card"><div class="card-h"><div><h2>' + ic('pin') + 'מי בשטח</h2><div class="sub">המיקום נרשם בכל לחיצה של הטכנאי על שלב</div></div></div>' + fieldRows + '</section>' +
      '<section class="card"><div class="card-h"><div><h2>' + ic('repeat') + 'טיפולים קרובים</h2></div><button class="link" data-a="go" data-arg="periodic">לכולם ' + ic('left', 15) + '</button></div>' +
      allPlans().filter(x => dayDiff(x.p.next) <= 14).sort((a, b) => d(a.p.next) - d(b.p.next)).slice(0, 5).map(x => '<div class="field-row"><span class="att-ic ' + (dayDiff(x.p.next) < 0 ? '' : 'blue') + '">' + ic('repeat', 16) + '</span><div class="who"><b>' + esc(x.c.name) + '</b><small>' + esc(x.t.name) + ' · ' + esc(x.e.name) + '</small></div><div class="st small ' + (dayDiff(x.p.next) < 0 ? '' : 'muted') + '" style="' + (dayDiff(x.p.next) < 0 ? 'color:var(--orange);font-weight:700' : '') + '">' + rel(x.p.next) + '</div></div>').join('') + '</section>' +
      '</div></div>';
  }

  function jobsTable(list, compact) {
    if (!list.length) return '<div class="empty">' + ic('list') + '<div>אין קריאות להצגה</div></div>';
    return '<div class="tbl-wrap"><table class="tbl cards"><thead><tr><th>קריאה</th>' + (compact ? '' : '<th>סוג</th>') + '<th>טכנאי</th><th>סטטוס</th><th>מועד</th></tr></thead><tbody>' +
      list.map(j => {
        const c = cust(j.customerId), t = tech(j.techId);
        return '<tr class="click' + (j.status === 'review' || (j.priority === 'urgent' && j.status === 'assigned') ? ' hot' : '') + '" data-a="open-job" data-arg="' + j.id + '"><td class="t-main"><b>#' + j.id + ' · ' + esc(j.title) + '</b><small>' + esc(c.name) + ' · ' + esc(c.city) + '</small></td>' +
          (compact ? '' : '<td class="nowrap">' + esc(j.kind) + (j.priority === 'urgent' ? ' ' + pri(j.priority) : '') + '</td>') +
          '<td><span class="row" style="gap:7px"><span class="avatar sm">' + initials(t.name) + '</span>' + esc(t.name) + '</span></td><td>' + chip(j.status) + '</td><td class="nowrap num">' + (dayDiff(j.due) === 0 ? 'היום ' : fD(j.due) + ' ') + fT(j.due) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function vJobs() {
    const tabs = [['open', 'פתוחות', j => !['closed', 'review'].includes(j.status)], ['field', 'בשטח עכשיו', j => ACTIVE.includes(j.status)], ['review', 'לבדיקה', j => j.status === 'review'], ['closed', 'נסגרו', j => j.status === 'closed'], ['all', 'הכל', () => true]];
    const tab = tabs.find(t => t[0] === ui.filter) || tabs[0];
    const q = ui.q.trim();
    const list = S.jobs.filter(tab[2]).filter(j => !q || ('#' + j.id + ' ' + j.title + ' ' + cust(j.customerId).name + ' ' + tech(j.techId).name).includes(q)).sort((a, b) => (a.priority === 'urgent' ? -1 : 0) - (b.priority === 'urgent' ? -1 : 0) || d(a.due) - d(b.due));
    return '<div class="ph"><div><div class="eyebrow">מהפתיחה ועד הסגירה</div><h1>קריאות שירות</h1></div><div class="actions"><button class="btn pri" data-a="new-job">' + ic('plus') + 'קריאה חדשה</button></div></div>' +
      '<div class="toolbar"><label class="search">' + ic('search') + '<input id="q" data-in="q" value="' + esc(ui.q) + '" placeholder="חיפוש לפי לקוח, טכנאי או מספר קריאה"></label><div class="tabs">' +
      tabs.map(t => '<button class="' + (t === tab ? 'on' : '') + '" data-a="filter" data-arg="' + t[0] + '">' + t[1] + '<small>' + S.jobs.filter(t[2]).length + '</small></button>').join('') + '</div></div>' +
      '<section class="card">' + jobsTable(list) + '</section>';
  }

  function vJob() {
    const j = job(ui.jobId); if (!j) { ui.view = 'jobs'; return vJobs(); }
    const c = cust(j.customerId), t = tech(j.techId), e = equipOf(j), tt = totals(j), tp = j.templateId && tpl(j.templateId);
    const partner = j.partnerId && tech(j.partnerId);
    const clDone = checklistDone(j);
    const usedItems = j.items.filter(i => i.used != null && i.used > 0);
    const s1 = catItem('s1'), s2 = catItem('s2'), s3 = catItem('s3');
    const hrs = n => Math.ceil(n / 30) / 2;
    const billRows = usedItems.map(i => [i.name, i.used + ' ' + i.unit, i.price, i.used * i.price]);
    if (tt.work) billRows.push([s1.name, hrs(tt.work) + ' שעות', s1.price, hrs(tt.work) * s1.price]);
    if (tt.work && partner) billRows.push([s2.name, hrs(tt.work) + ' שעות', s2.price, hrs(tt.work) * s2.price]);
    if (tt.travel) billRows.push([s3.name, hrs(tt.travel) + ' שעות', s3.price, hrs(tt.travel) * s3.price]);
    const total = billRows.reduce((s, r) => s + r[3], 0);
    const evRows = j.events.slice().reverse().map(ev => '<div class="tl-row done"><span class="tl-dot"></span><div><b>' + (EVT[ev.status] || ev.status) + (ev.note ? ' · ' + esc(ev.note) : '') + '</b><span class="when">' + fT(ev.at) + '</span>' + (dayDiff(ev.at) !== 0 ? ' <span class="muted small">' + fD(ev.at) + '</span>' : '') +
      (ev.loc ? '<small>' + ic('pin', 13) + esc(ev.loc.addr) + (ev.loc.acc ? ' · דיוק ' + ev.loc.acc + ' מ׳' : '') + ' · <a href="' + mapUrl(ev.loc) + '" target="_blank" rel="noopener">במפה</a></small>' : '') + '</div></div>').join('');
    return '<button class="back" data-a="go" data-arg="jobs">' + ic('right', 16) + 'חזרה לקריאות</button>' +
      (j.status === 'review' ? '<div class="banner orange"><span class="bi">' + ic('file', 24) + '</span><div><b>' + esc(t.name) + ' שלח את הדוח ' + rel(evAt(j, 'review')).replace('היום', 'היום ב-' + fT(evAt(j, 'review'))) + '</b><span class="small muted">בודקים צ׳קליסט, פריטים וחתימה, ומאשרים.</span></div><div class="actions"><button class="btn ok" data-a="approve" data-arg="' + j.id + '">' + ic('check') + 'אישור וסגירה</button><button class="btn" data-a="reopen" data-arg="' + j.id + '">החזרה לטכנאי</button></div></div>' : '') +
      (j.status === 'closed' ? '<div class="banner green"><span class="bi">' + ic('check', 24) + '</span><div><b>הקריאה נסגרה ' + fDY(evAt(j, 'closed')) + '</b><span class="small muted">' + (j.planId ? 'מועד הטיפול הבא עודכן אוטומטית אצל הלקוח.' : 'הדוח שמור בהיסטוריה של הלקוח.') + '</span></div></div>' : '') +
      '<section class="card"><div class="jd-head"><div><div class="row wrap" style="gap:6px"><span class="muted small">#' + j.id + ' · ' + esc(j.kind) + '</span>' + chip(j.status) + pri(j.priority) + '</div><h1>' + esc(j.title) + '</h1><div class="row wrap muted small" style="gap:14px"><span class="row" style="gap:5px">' + ic('building', 15) + '<a href="#" data-a="open-cust" data-arg="' + c.id + '">' + esc(c.name) + '</a></span><span class="row" style="gap:5px">' + ic('pin', 15) + esc(c.address) + '</span><span class="row" style="gap:5px">' + ic('phone', 15) + esc(c.contact) + '</span></div></div>' +
      '<div class="row wrap"><button class="btn" data-a="report" data-arg="' + j.id + '">' + ic('file') + 'דוח ללקוח</button>' + (j.status !== 'closed' ? '<button class="btn" data-a="transfer" data-arg="' + j.id + '">' + ic('swap') + 'העברה לטכנאי</button>' : '') + (j.status === 'closed' ? '<button class="btn" data-a="reopen" data-arg="' + j.id + '">' + ic('refresh') + 'פתיחה מחדש</button>' : '') + '</div></div>' +
      '<div class="jd-meta"><div><span>טכנאי</span><b><span class="avatar sm">' + initials(t.name) + '</span>' + esc(t.name) + (partner ? '<span class="muted small" style="font-weight:600"> + ' + esc(partner.name) + '</span>' : '') + '</b></div><div><span>מועד</span><b>' + (dayDiff(j.due) === 0 ? 'היום' : fD(j.due)) + ' · ' + fT(j.due) + '</b></div><div><span>זמן עבודה באתר</span><b>' + dur(tt.work) + '</b></div><div><span>זמן נסיעה הלוך וחזור</span><b>' + dur(tt.travel) + '</b></div></div></section>' +
      '<div class="grid g-main mt"><div class="grid" style="align-content:start">' +
      '<section class="card pad"><h2>' + ic('wrench') + 'מה צריך לבצע</h2><p class="pre mt-s">' + esc(j.desc) + '</p>' + (e ? '<div class="kv mt"><span>ציוד</span><b>' + esc(e.name) + ' · ' + esc(e.model) + '</b><span>מספר סידורי</span><b class="num">' + esc(e.serial) + '</b><span>מיקום באתר</span><b>' + esc(e.place) + '</b></div>' : '') + '</section>' +
      (tp ? '<section class="card pad"><div class="row"><h2>' + ic('checklist') + 'צ׳קליסט · ' + esc(tp.name) + '</h2><span class="spacer"></span><span class="chip ' + (clDone === j.checklist.length ? 'c-ok' : 'c-info') + '">' + clDone + ' / ' + j.checklist.length + '</span></div><div class="progress"><i style="width:' + Math.round(clDone / Math.max(1, j.checklist.length) * 100) + '%"></i></div><div class="cl mt-s">' +
        j.checklist.map(r => { const ok = r.type === 'check' ? r.done : String(r.value || '').trim(); return '<div class="cl-row"><span class="tick' + (ok ? ' on' : '') + '">' + (ok ? ic('check', 14) : '') + '</span><span class="t">' + esc(r.text) + (r.type === 'text' && r.value ? '<small>' + esc(r.value) + '</small>' : '') + '</span>' + (r.type === 'num' ? '<span class="v">' + (r.value ? esc(r.value) + ' ' + esc(r.unit) : '<span class="muted small">—</span>') + '</span>' : '') + '</div>'; }).join('') + '</div></section>' : '') +
      '<section class="card pad"><div class="row"><h2>' + ic('box') + 'פריטים לקריאה</h2><span class="spacer"></span><span class="muted small">מה לקחת · מה הטכנאי סימן שהשתמש</span></div><div class="items mt-s">' +
      (j.items.length ? j.items.map(i => '<div class="it"><div class="nm"><b>' + esc(i.name) + '</b><small>' + (i.added ? 'נוסף בשטח' : 'לקחת: ' + i.planned + ' ' + esc(i.unit)) + '</small></div><span>' + (i.used == null ? '<span class="chip">טרם סומן</span>' : i.used > 0 ? '<span class="chip c-ok">השתמש</span>' : '<span class="chip">לא נדרש</span>') + '</span><span class="q">' + (i.used > 0 ? i.used + ' ' + esc(i.unit) : '') + '</span></div>').join('') : '<p class="muted">לא הוגדרו פריטים.</p>') + '</div></section>' +
      '<section class="card pad"><h2>' + ic('pen') + 'דיווח הטכנאי</h2>' + (j.diagnosis || j.work ? '<div class="kv mt-s" style="grid-template-columns:90px 1fr"><span>אבחון</span><p class="pre">' + esc(j.diagnosis || '—') + '</p><span>מה בוצע</span><p class="pre">' + esc(j.work || '—') + '</p></div>' : '<p class="muted mt-s">הדיווח יופיע כאן ברגע שהטכנאי יכתוב או יקליט.</p>') +
      (j.photos.length ? '<div class="photos mt">' + j.photos.map(p => '<img src="' + p + '" alt="תמונה מהשטח">').join('') + '</div>' : '') +
      '<div class="grid g2 mt"><div><div class="small muted" style="margin-bottom:4px">חתימת הלקוח' + (j.signer ? ' · ' + esc(j.signer) : '') + '</div><div class="sig">' + (j.signature ? '<img src="' + j.signature + '" alt="חתימה">' : '<span class="muted small">' + (j.signer && j.status === 'closed' || j.status === 'review' ? 'נחתם על המסך' : 'טרם נחתם') + '</span>') + '</div></div></div></section>' +
      '</div><div class="grid" style="align-content:start">' +
      '<section class="card pad"><h2>' + ic('pin') + 'ציר זמן ומיקומים</h2><div class="split"><div><span>עבודה באתר</span><b>' + dur(tt.work) + '</b></div><div><span>נסיעות</span><b>' + dur(tt.travel) + '</b></div></div><div class="tl mt">' + (evRows || '<p class="muted">עוד לא דווחו שלבים.</p>') + '</div></section>' +
      '<section class="card pad private"><div class="row"><h2>' + ic('shield') + 'חיוב</h2><span class="spacer"></span><span class="chip">למשרד בלבד</span></div><p class="muted small mt-s">לפי המחירון. לא מופיע בדוח ללקוח.</p>' +
      (billRows.length ? '<table class="tbl billing mt-s"><thead><tr><th>פריט</th><th>כמות</th><th>סה״כ</th></tr></thead><tbody>' + billRows.map(r => '<tr><td>' + esc(r[0]) + '</td><td class="nowrap num">' + esc(r[1]) + '</td><td class="num">' + money(r[3]) + '</td></tr>').join('') + '</tbody><tfoot><tr><td colspan="2">סה״כ לפני מע״מ</td><td class="num">' + money(total) + '</td></tr></tfoot></table>' : '<p class="muted mt-s">יחושב לפי הפריטים והשעות שהטכנאי ידווח.</p>') + '</section>' +
      '<section class="card pad"><h2>' + ic('info') + 'הערה פנימית</h2><textarea class="mt-s" id="note-' + j.id + '" data-in="note" data-arg="' + j.id + '" placeholder="לא מוצגת לטכנאי ולא בדוח">' + esc(j.note || '') + '</textarea></section>' +
      '</div></div>';
  }

  function remChip(r) { return ({ none: '<span class="chip">לא נשלחה</span>', sent: '<span class="chip c-info">נשלחה · ממתין</span>', confirmed: '<span class="chip c-ok">אישר מועד</span>', asked_later: '<span class="chip c-warn">ביקש לדחות</span>' })[r]; }
  function vPeriodic() {
    const tabs = [['late', 'באיחור', x => dayDiff(x.p.next) < 0], ['soon', '30 הימים הקרובים', x => dayDiff(x.p.next) <= 30], ['all', 'הכל', () => true]];
    const tab = tabs.find(t => t[0] === ui.planTab) || tabs[1];
    const list = allPlans().filter(tab[2]).sort((a, b) => d(a.p.next) - d(b.p.next));
    return '<div class="ph"><div><div class="eyebrow">לכל לקוח ולכל ציוד, תבנית משלו</div><h1>טיפולים תקופתיים</h1></div><div class="actions"><button class="btn" data-a="go" data-arg="templates">' + ic('checklist') + 'תבניות טיפול</button></div></div>' +
      '<div class="hint" style="margin-bottom:14px">' + ic('info') + '<span>14 יום לפני כל טיפול יוצאת ללקוח תזכורת בוואטסאפ. כשהוא מאשר, נפתחת קריאה עם הצ׳קליסט והפריטים של התבנית. אפשר גם לפתוח קריאה ידנית בלחיצה.</span></div>' +
      '<div class="toolbar"><div class="tabs">' + tabs.map(t => '<button class="' + (t === tab ? 'on' : '') + '" data-a="plantab" data-arg="' + t[0] + '">' + t[1] + '<small>' + allPlans().filter(t[2]).length + '</small></button>').join('') + '</div></div>' +
      '<section class="card"><div class="tbl-wrap"><table class="tbl cards"><thead><tr><th>מועד</th><th>לקוח · ציוד</th><th>תבנית</th><th>תזכורת ללקוח</th><th></th></tr></thead><tbody>' +
      list.map(x => {
        const oj = openJobForPlan(x.p.id), late = dayDiff(x.p.next) < 0;
        return '<tr class="' + (late && !oj ? 'hot' : '') + '"><td class="nowrap"><b class="num">' + fD(x.p.next) + '</b><div class="small" style="' + (late ? 'color:var(--orange);font-weight:700' : 'color:var(--muted)') + '">' + rel(x.p.next) + '</div></td>' +
          '<td class="t-main"><b><a href="#" data-a="open-cust" data-arg="' + x.c.id + '">' + esc(x.c.name) + '</a></b><small>' + esc(x.e.name) + ' · ' + esc(x.e.model) + '</small></td>' +
          '<td><b style="font-weight:600">' + esc(x.t.name) + '</b><div class="small muted">' + x.t.checklist.length + ' סעיפים · ' + freqLabel(x.t.freq) + '</div></td>' +
          '<td>' + remChip(x.p.reminder) + '</td>' +
          '<td class="nowrap" style="text-align:left">' + (oj ? '<button class="btn sm" data-a="open-job" data-arg="' + oj.id + '">קריאה #' + oj.id + ' · ' + ST[oj.status] + '</button>' : '<span class="row" style="gap:6px;justify-content:flex-end"><button class="btn sm" data-a="wa-plan" data-arg="' + x.p.id + '">' + ic('wa', 15) + 'תזכורת</button><button class="btn sm pri" data-a="plan-job" data-arg="' + x.p.id + '">' + ic('plus', 15) + 'פתיחת קריאה</button></span>') + '</td></tr>';
      }).join('') + '</tbody></table></div></section>';
  }

  function vCustomers() {
    const q = ui.q.trim();
    const list = S.customers.filter(c => !q || (c.name + ' ' + c.city + ' ' + c.contact).includes(q));
    return '<div class="ph"><div><div class="eyebrow">כל ציוד עם תבנית הטיפול שלו</div><h1>לקוחות וציוד</h1></div><div class="actions"><button class="btn pri" data-a="new-cust">' + ic('plus') + 'לקוח חדש</button></div></div>' +
      '<div class="toolbar"><label class="search">' + ic('search') + '<input id="q" data-in="q" value="' + esc(ui.q) + '" placeholder="חיפוש לקוח, עיר או איש קשר"></label></div>' +
      '<div class="cust-grid">' + list.map(c => {
        const next = c.plans.slice().sort((a, b) => d(a.next) - d(b.next))[0];
        const openN = S.jobs.filter(j => j.customerId === c.id && j.status !== 'closed').length;
        return '<button class="card cust" data-a="open-cust" data-arg="' + c.id + '"><div class="row"><h3>' + esc(c.name) + '</h3><span class="spacer"></span><span class="chip ' + (c.kind === 'חוזה אחזקה' ? 'c-info' : '') + '">' + esc(c.kind) + '</span></div><span class="line">' + ic('pin', 14) + esc(c.address) + '</span><span class="line">' + ic('phone', 14) + esc(c.contact) + '</span>' +
          '<div class="foot"><span class="chip">' + c.equipment.length + ' ציוד</span>' + (next ? '<span class="chip ' + (dayDiff(next.next) < 0 ? 'c-warn' : '') + '">טיפול הבא ' + rel(next.next) + '</span>' : '') + (openN ? '<span class="chip s-accepted">' + openN + ' קריאות פתוחות</span>' : '') + '</div></button>';
      }).join('') + '</div>';
  }

  function vCustomer() {
    const c = cust(ui.custId); if (!c) { ui.view = 'customers'; return vCustomers(); }
    const hist = S.jobs.filter(j => j.customerId === c.id).sort((a, b) => d(b.due) - d(a.due));
    return '<button class="back" data-a="go" data-arg="customers">' + ic('right', 16) + 'חזרה ללקוחות</button>' +
      '<section class="card"><div class="jd-head"><div><span class="chip ' + (c.kind === 'חוזה אחזקה' ? 'c-info' : '') + '">' + esc(c.kind) + '</span><h1>' + esc(c.name) + '</h1><div class="row wrap muted small" style="gap:14px"><span class="row" style="gap:5px">' + ic('pin', 15) + esc(c.address) + '</span><span class="row" style="gap:5px">' + ic('phone', 15) + esc(c.contact) + ' · ' + esc(c.phone) + '</span></div></div>' +
      '<div class="row wrap"><a class="btn" href="' + wazeUrl(c) + '" target="_blank" rel="noopener">' + ic('nav') + 'ניווט</a><button class="btn pri" data-a="new-job" data-arg="' + c.id + '">' + ic('plus') + 'קריאה חדשה</button></div></div></section>' +
      '<div class="grid g-main mt"><div class="grid" style="align-content:start">' +
      '<section class="card"><div class="card-h"><div><h2>' + ic('box') + 'ציוד ותוכנית טיפולים</h2><div class="sub">לכל יחידה תבנית משלה. הטכנאי מקבל את הצ׳קליסט שלה בשטח.</div></div></div><div class="tbl-wrap"><table class="tbl cards"><thead><tr><th>ציוד</th><th>תבנית טיפול</th><th>טיפול אחרון</th><th>טיפול הבא</th></tr></thead><tbody>' +
      c.equipment.map(e => {
        const pl = c.plans.filter(p => p.equipId === e.id);
        return '<tr><td class="t-main"><b>' + esc(e.name) + '</b><small>' + esc(e.model) + ' · ' + esc(e.serial) + ' · ' + esc(e.place) + '</small></td>' +
          (pl.length ? '<td>' + pl.map(p => esc(tpl(p.templateId).name)).join('<br>') + '</td><td class="num">' + pl.map(p => fDY(p.last)).join('<br>') + '</td><td>' + pl.map(p => '<span style="' + (dayDiff(p.next) < 0 ? 'color:var(--orange);font-weight:700' : '') + '">' + fD(p.next) + ' · ' + rel(p.next) + '</span>').join('<br>') + '</td>'
            : '<td colspan="3"><select data-in="add-plan" data-arg="' + e.id + '" style="max-width:260px"><option value="">+ שיוך תבנית טיפול…</option>' + S.templates.map(t => '<option value="' + t.id + '">' + esc(t.name) + '</option>').join('') + '</select></td>') + '</tr>';
      }).join('') + '</tbody></table></div></section>' +
      '<section class="card"><div class="card-h"><h2>' + ic('list') + 'היסטוריית קריאות</h2></div>' + jobsTable(hist) + '</section>' +
      '</div><div class="grid" style="align-content:start">' +
      '<section class="card pad"><h2>' + ic('sign') + 'חוזה אחזקה</h2>' + (c.contract ? '<div class="kv mt" style="grid-template-columns:110px 1fr"><span>תקופה</span><b class="num">' + fDY(c.contract.start) + ' – ' + fDY(c.contract.end) + '</b><span>ביקורים בשנה</span><b>' + c.contract.visits + '</b><span>שווי שנתי</span><b>' + money(c.contract.value) + '</b><span>סטטוס</span><span>' + contractChip(c.contract) + '</span></div>' : '<p class="muted mt-s">אין חוזה אחזקה ללקוח הזה.</p><button class="btn sm mt-s" data-a="wa-contract" data-arg="' + c.id + '">' + ic('wa', 15) + 'הצעת חוזה בוואטסאפ</button>') + '</section>' +
      '</div></div>';
  }

  function contractChip(k) { const n = dayDiff(k.end); if (k.status === 'חודש') return '<span class="chip c-ok">חודש</span>'; if (k.status === 'נשלחה הצעה') return '<span class="chip c-info">נשלחה הצעה</span>'; if (n <= 45) return '<span class="chip c-warn">לחידוש · ' + rel(k.end) + '</span>'; return '<span class="chip c-ok">פעיל</span>'; }
  function vContracts() {
    const withK = S.customers.filter(c => c.contract).sort((a, b) => d(a.contract.end) - d(b.contract.end));
    const without = S.customers.filter(c => !c.contract);
    const totalV = withK.reduce((s, c) => s + c.contract.value, 0);
    const renew = withK.filter(c => c.contract.status !== 'חודש' && dayDiff(c.contract.end) <= 60);
    return '<div class="ph"><div><div class="eyebrow">חידוש הסכמים בסוף שנה, בלי לפספס אף לקוח</div><h1>חוזי אחזקה</h1></div></div>' +
      '<div class="kpis" style="grid-template-columns:repeat(3,1fr)"><div class="kpi"><span>חוזים פעילים</span><strong>' + withK.length + '</strong><small>' + without.length + ' לקוחות בלי חוזה</small></div><div class="kpi' + (renew.length ? ' hot' : '') + '"><span>לחידוש ב-60 יום</span><strong>' + renew.length + '</strong><small>' + money(renew.reduce((s, c) => s + c.contract.value, 0)) + ' בשנה</small></div><div class="kpi"><span>שווי שנתי כולל</span><strong>' + money(totalV) + '</strong><small>לפני מע״מ</small></div></div>' +
      '<section class="card"><div class="tbl-wrap"><table class="tbl cards"><thead><tr><th>לקוח</th><th>תקופה</th><th>ביקורים</th><th>שווי שנתי</th><th>סטטוס</th><th></th></tr></thead><tbody>' +
      withK.map(c => '<tr class="' + (c.contract.status !== 'חודש' && dayDiff(c.contract.end) <= 21 ? 'hot' : '') + '"><td class="t-main"><b><a href="#" data-a="open-cust" data-arg="' + c.id + '">' + esc(c.name) + '</a></b><small>' + esc(c.contact) + '</small></td><td class="num nowrap">' + fDY(c.contract.start) + ' – ' + fDY(c.contract.end) + '</td><td class="num">' + c.contract.visits + ' בשנה</td><td class="num">' + money(c.contract.value) + '</td><td>' + contractChip(c.contract) + '</td>' +
        '<td class="nowrap" style="text-align:left">' + (c.contract.status === 'חודש' || (c.contract.status !== 'נשלחה הצעה' && dayDiff(c.contract.end) > 60) ? '' : '<span class="row" style="gap:6px;justify-content:flex-end"><button class="btn sm" data-a="wa-contract" data-arg="' + c.id + '">' + ic('wa', 15) + 'תזכורת חידוש</button><button class="btn sm ok" data-a="renew" data-arg="' + c.id + '">' + ic('check', 15) + 'חודש</button></span>') + '</td></tr>').join('') +
      without.map(c => '<tr><td class="t-main"><b><a href="#" data-a="open-cust" data-arg="' + c.id + '">' + esc(c.name) + '</a></b><small>' + esc(c.contact) + '</small></td><td colspan="3" class="muted">אין חוזה · לקוח ' + esc(c.kind) + '</td><td><span class="chip">אין חוזה</span></td><td style="text-align:left"><button class="btn sm" data-a="wa-contract" data-arg="' + c.id + '">' + ic('wa', 15) + 'הצעת חוזה</button></td></tr>').join('') +
      '</tbody></table></div></section>';
  }

  function vTemplates() {
    const t = tpl(ui.tplId) || S.templates[0]; ui.tplId = t.id;
    const usedBy = allPlans().filter(x => x.t.id === t.id);
    return '<div class="ph"><div><div class="eyebrow">בונים פעם אחת, משייכים לכל ציוד</div><h1>תבניות טיפול</h1></div><div class="actions"><button class="btn" data-a="tpl-dup">' + ic('copy') + 'שכפול</button><button class="btn pri" data-a="tpl-new">' + ic('plus') + 'תבנית חדשה</button></div></div>' +
      '<div class="tpl-layout"><section class="card tpl-list">' + S.templates.map(x => '<button class="' + (x.id === t.id ? 'on' : '') + '" data-a="tpl" data-arg="' + x.id + '"><b>' + esc(x.name) + '</b><small>' + esc(x.equip) + ' · ' + freqLabel(x.freq) + ' · ' + x.checklist.length + ' סעיפים</small></button>').join('') + '</section>' +
      '<div class="grid" style="align-content:start"><section class="card pad"><div class="form-grid"><label class="f span"><span>שם התבנית</span><input id="tpl-name" data-in="tpl-name" value="' + esc(t.name) + '"></label><label class="f"><span>סוג ציוד</span><input id="tpl-equip" data-in="tpl-equip" value="' + esc(t.equip) + '"></label><label class="f"><span>תדירות</span><select data-in="tpl-freq">' + [0, 1, 3, 6, 12].map(n => '<option value="' + n + '"' + (t.freq === n ? ' selected' : '') + '>' + freqLabel(n) + '</option>').join('') + '</select></label></div>' +
      '<div class="hint mt">' + ic('info') + '<span>' + (usedBy.length ? 'משויכת ל-' + usedBy.length + ' יחידות: ' + usedBy.map(x => esc(x.c.name) + ' (' + esc(x.e.name) + ')').join(', ') + '.' : 'עוד לא משויכת לציוד. משייכים מכרטיס הלקוח.') + ' שינוי כאן חל על הקריאות הבאות, לא על דוחות שכבר נסגרו.</span></div></section>' +
      '<section class="card pad"><div class="row"><h2>' + ic('checklist') + 'מה הטכנאי בודק</h2><span class="spacer"></span><span class="muted small">' + t.checklist.length + ' סעיפים</span></div><div class="mt-s">' +
      t.checklist.map((r, i) => '<div class="edit-row"><span class="n">' + (i + 1) + '</span><input id="cl-' + r.id + '" data-in="cl-text" data-arg="' + r.id + '" value="' + esc(r.text) + '" placeholder="מה בודקים?"><select data-in="cl-type" data-arg="' + r.id + '"><option value="check"' + (r.type === 'check' ? ' selected' : '') + '>סימון ✓</option><option value="num"' + (r.type === 'num' ? ' selected' : '') + '>מספר</option><option value="text"' + (r.type === 'text' ? ' selected' : '') + '>טקסט חופשי</option></select><input class="unit" id="un-' + r.id + '" data-in="cl-unit" data-arg="' + r.id + '" value="' + esc(r.unit || '') + '" placeholder="יחידה"' + (r.type === 'num' ? '' : ' disabled') + '><button class="icon-btn" data-a="cl-del" data-arg="' + r.id + '" aria-label="מחיקה">' + ic('trash', 16) + '</button></div>').join('') +
      '</div><button class="btn ghost sm mt-s" data-a="cl-add">' + ic('plus', 15) + 'הוספת סעיף</button></section>' +
      '<section class="card pad"><div class="row"><h2>' + ic('box') + 'מה לקחת לטיפול</h2><span class="spacer"></span><span class="muted small">נכנס אוטומטית לכל קריאה מהתבנית</span></div><div class="items mt-s">' +
      (t.items.length ? t.items.map((x, i) => { const ci = catItem(x.catId); return '<div class="it"><div class="nm"><b>' + esc(ci.name) + '</b><small>' + esc(ci.sku) + ' · ' + money(ci.price) + ' ל' + esc(ci.unit) + '</small></div><div class="stepper"><button data-a="ti-qty" data-arg="' + i + '" data-d="-1">−</button><span>' + x.qty + ' ' + esc(ci.unit) + '</span><button data-a="ti-qty" data-arg="' + i + '" data-d="1">+</button></div><button class="icon-btn" data-a="ti-del" data-arg="' + i + '" aria-label="הסרה">' + ic('trash', 16) + '</button></div>'; }).join('') : '<p class="muted">אין פריטים.</p>') +
      '</div><button class="btn ghost sm mt-s" data-a="pick" data-arg="tpl">' + ic('plus', 15) + 'הוספה מהמחירון</button></section></div></div>';
  }

  function vCatalog() {
    const cats = ['הכל'].concat([...new Set(S.catalog.map(c => c.cat))]);
    const q = ui.q.trim();
    const list = S.catalog.filter(c => (ui.cat === 'הכל' || c.cat === ui.cat) && (!q || (c.name + ' ' + c.sku).includes(q)));
    const usage = id => S.templates.filter(t => t.items.some(x => x.catId === id)).length;
    return '<div class="ph"><div><div class="eyebrow">מה לוקחים, מה מחליפים, כמה זה עולה</div><h1>מחירון ופריטים</h1></div><div class="actions"><button class="btn pri" data-a="cat-new">' + ic('plus') + 'פריט חדש</button></div></div>' +
      '<div class="toolbar"><label class="search">' + ic('search') + '<input id="q" data-in="q" value="' + esc(ui.q) + '" placeholder="חיפוש לפי שם או מק״ט"></label><div class="tabs">' + cats.map(c => '<button class="' + (ui.cat === c ? 'on' : '') + '" data-a="cat" data-arg="' + esc(c) + '">' + esc(c) + '</button>').join('') + '</div></div>' +
      '<section class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>מק״ט</th><th>פריט</th><th>קטגוריה</th><th>יחידה</th><th>מחיר</th><th>בתבניות</th></tr></thead><tbody>' +
      list.map(c => '<tr><td class="num muted small nowrap">' + esc(c.sku) + '</td><td><input id="cn-' + c.id + '" data-in="cat-name" data-arg="' + c.id + '" value="' + esc(c.name) + '" style="min-width:200px"></td><td><select data-in="cat-cat" data-arg="' + c.id + '">' + cats.slice(1).map(x => '<option' + (x === c.cat ? ' selected' : '') + '>' + esc(x) + '</option>').join('') + '</select></td><td><select data-in="cat-unit" data-arg="' + c.id + '" style="width:90px">' + ['יח׳', 'ק״ג', 'ליטר', 'מטר', 'שעה'].map(u => '<option' + (u === c.unit ? ' selected' : '') + '>' + u + '</option>').join('') + '</select></td><td><div class="row" style="gap:4px"><span class="muted">₪</span><input id="cp-' + c.id + '" type="number" min="0" data-in="cat-price" data-arg="' + c.id + '" value="' + c.price + '" style="width:90px" class="num"></div></td><td class="muted small">' + (usage(c.id) ? usage(c.id) + ' תבניות' : '—') + '</td></tr>').join('') +
      '</tbody></table></div></section><p class="muted small mt">' + S.catalog.length + ' פריטים. אפשר לייבא את המחירון הקיים מאקסל או מפריוריטי בהטמעה.</p>';
  }

  function vSettings() {
    return '<div class="ph"><div><div class="eyebrow">מה רץ לבד, ומה נשאר אצלך</div><h1>צוות ואוטומציות</h1></div><div class="actions"><button class="btn" data-a="reset">' + ic('refresh') + 'איפוס הדמו</button></div></div>' +
      '<div class="grid g-main"><div class="grid" style="align-content:start">' +
      '<section class="card"><div class="card-h"><div><h2>' + ic('repeat') + 'מה רץ לבד</h2><div class="sub">כל כלל אפשר לכבות או לשנות</div></div></div>' + S.automations.map(a => '<div class="auto"><button class="switch' + (a.on ? ' on' : '') + '" data-a="auto" data-arg="' + a.id + '" aria-label="' + esc(a.title) + '"></button><div><b>' + esc(a.title) + '</b><p>' + esc(a.desc) + '</p></div></div>').join('') + '</section>' +
      '<section class="card pad"><h2>' + ic('check') + 'כשהטכנאי שולח דוח</h2><div class="grid mt" style="gap:8px">' +
      [['review', 'בדיקה ואישור במשרד', 'הקריאה מחכה לאישור שלך לפני שהיא נסגרת. מומלץ בהתחלה.'], ['close', 'סגירה מיידית', 'הקריאה נסגרת ברגע שהטכנאי שולח.']].map(o => '<button class="card pad" style="text-align:right;box-shadow:none;' + (S.settings.closeMode === o[0] ? 'border-color:var(--blue);background:var(--blue-soft)' : '') + '" data-a="closemode" data-arg="' + o[0] + '"><b>' + o[1] + '</b><div class="small muted">' + o[2] + '</div></button>').join('') + '</div></section>' +
      '</div><div class="grid" style="align-content:start">' +
      '<section class="card"><div class="card-h"><h2>' + ic('users') + 'הצוות</h2></div>' + S.techs.map(t => '<div class="field-row"><span class="avatar">' + initials(t.name) + '</span><div class="who"><b>' + esc(t.name) + '</b><small>' + esc(t.spec) + '</small></div><span class="st small muted">' + S.jobs.filter(j => j.techId === t.id && j.status !== 'closed').length + ' פתוחות</span></div>').join('') + '</section>' +
      '<section class="card pad"><h2>' + ic('pin') + 'מיקום</h2><p class="small mt-s">המיקום נרשם רק כשהטכנאי לוחץ על שלב: קיבלתי, יצאתי, הגעתי, סיימתי, חזרתי. אין מעקב רציף ברקע. מזה מחושבים זמן נסיעה וזמן עבודה בנפרד.</p></section>' +
      '<section class="card pad"><h2>' + ic('mic') + 'הקלטה ותמלול</h2><p class="small mt-s">הטכנאי לוחץ על המיקרופון ומדבר, כמו הודעה קולית בוואטסאפ. המערכת כותבת את הטקסט בדוח. עובד בעברית וברוסית.</p></section>' +
      '</div></div>';
  }

  /* ---------------- technician ---------------- */
  function techView() {
    const me = S.techs.find(t => t.id === ui.techId) || S.techs[0];
    const mine = S.jobs.filter(j => j.techId === me.id && j.status !== 'closed').sort((a, b) => (a.priority === 'urgent' ? -1 : 0) - (b.priority === 'urgent' ? -1 : 0) || d(a.due) - d(b.due));
    const j = ui.tjob && job(ui.tjob);
    const ru = ui.lang === 'ru';
    PH = true;
    const langBtn = '<button class="lang-btn" data-a="lang" aria-label="' + (ru ? 'עברית' : 'Русский') + '">' + (ru ? 'עב' : 'RU') + '</button>';
    let top, body, foot = '', sheet = '';
    if (j) {
      top = '<button class="backbtn" data-a="tback">' + ic(ru ? 'left' : 'right', 18) + tx('הקריאות שלי') + '</button><span class="spacer"></span><span class="small" style="opacity:.8">#' + j.id + '</span>' + langBtn;
      body = techJob(j, me); foot = techFoot(j, me);
      if (ui.modal && ui.modal.type === 'pick' && ui.modal.target === 'tjob') sheet = pickSheet(true);
    } else {
      top = '<span class="avatar">' + initials(tx(me.name)) + '</span><div><b>' + esc(tx(me.name)) + '</b><small>' + esc(tx(me.spec)) + '</small></div><select data-in="techid" aria-label="טכנאי">' + S.techs.filter(t => !t.helper).map(t => '<option value="' + t.id + '"' + (t.id === me.id ? ' selected' : '') + '>' + esc(tx(t.name)) + '</option>').join('') + '</select>' + langBtn;
      const doneToday = S.jobs.filter(x => x.techId === me.id && ['review', 'closed'].includes(x.status) && evAt(x, 'review') && dayDiff(evAt(x, 'review')) === 0).length;
      body = '<div style="margin-bottom:12px"><div class="muted small">' + todayLabel() + '</div><h2 style="font-size:20px;color:var(--navy);font-weight:800">' + tx(greeting()) + ', ' + esc(tx(me.name).split(' ')[0]) + '</h2></div>' +
        '<div class="ph-stats"><div><strong>' + mine.filter(x => x.status !== 'review').length + '</strong><span>' + tx('פתוחות') + '</span></div><div><strong>' + mine.filter(x => x.priority === 'urgent').length + '</strong><span>' + tx('דחופות') + '</span></div><div><strong>' + doneToday + '</strong><span>' + tx('הושלמו היום') + '</span></div></div>' +
        (mine.length ? mine.map(x => { const c = cust(x.customerId); return '<button class="tjob' + (x.priority === 'urgent' ? ' urgent' : '') + '" data-a="tjob" data-arg="' + x.id + '"><div class="top"><span class="small muted">#' + x.id + ' · ' + esc(tx(x.kind)) + '</span>' + (x.priority === 'urgent' ? pri('urgent') : '') + '</div><h3>' + esc(tx(x.title)) + '</h3><p>' + ic('building', 14) + esc(tx(c.name)) + '</p><p>' + ic('pin', 14) + esc(tx(c.address)) + '</p><div class="bot">' + chip(x.status) + '<span class="small muted row" style="gap:4px">' + ic('clock', 14) + (dayDiff(x.due) === 0 ? '' : fD(x.due) + ' ') + fT(x.due) + '</span></div></button>'; }).join('') : '<div class="empty">' + ic('check') + '<div>' + tx('אין קריאות פתוחות') + '</div></div>');
    }
    const phone = '<div class="phone" dir="' + (ru ? 'ltr' : 'rtl') + '" lang="' + (ru ? 'ru' : 'he') + '"><div class="ph-top">' + top + '</div><div class="ph-body" id="phbody">' + body + '</div>' + (foot ? '<div class="ph-foot">' + foot + '</div>' : '') + sheet + '</div>';
    PH = false;
    const left = '<aside class="tech-side left"><h2>מה הטכנאי רואה</h2><p>אפליקציה בטלפון, בלי התקנה מחנות. נסו בעצמכם:</p><ul>' +
      ['לחצו על קריאה ואז על הכפתור הגדול למטה: קיבלתי, יצאתי לדרך, הגעתי. כל לחיצה רושמת שעה ומיקום.', 'בלשונית צ׳קליסט מסמנים את סעיפי הטיפול מהתבנית של הלקוח.', 'בלשונית פריטים מסמנים במה השתמשו, ומוסיפים פריט מהמחירון.', 'בדיווח לוחצים על המיקרופון ומדברים. הטקסט נכתב לבד.', 'הלקוח חותם על המסך, והדוח עובר למשרד.', 'כפתור RU למעלה מעביר את כל המסך לרוסית, כולל ההקלטה.'].map(s => '<li>' + ic('check', 16) + '<span>' + s + '</span></li>').join('') + '</ul></aside>';
    const live = j ? '<section class="card pad"><h2 style="font-size:16px">' + ic('monitor') + 'מה המשרד רואה עכשיו</h2><div class="row wrap mt-s" style="gap:6px">' + chip(j.status) + (j.checklist.length ? '<span class="chip">' + checklistDone(j) + '/' + j.checklist.length + ' צ׳קליסט</span>' : '') + '</div><div class="split"><div><span>עבודה</span><b>' + dur(totals(j).work) + '</b></div><div><span>נסיעות</span><b>' + dur(totals(j).travel) + '</b></div></div><div class="tl mt">' +
      (j.events.length ? j.events.slice().reverse().slice(0, 6).map(ev => '<div class="tl-row done"><span class="tl-dot"></span><div><b>' + (EVT[ev.status] || ev.status) + '</b><span class="when">' + fT(ev.at) + '</span>' + (ev.loc ? '<small>' + ic('pin', 13) + esc(ev.loc.addr) + '</small>' : '') + '</div></div>').join('') : '<p class="muted small">עוד לא דווחו שלבים.</p>') + '</div><button class="btn sm mt" data-a="office-job" data-arg="' + j.id + '">פתיחת הקריאה במשרד ' + ic('left', 15) + '</button></section>'
      : '<section class="card pad"><h2 style="font-size:16px">' + ic('monitor') + 'מתעדכן במשרד מיד</h2><p class="small muted mt-s">כל שלב שהטכנאי מדווח מופיע אצל פולינה במסך ״היום״, עם השעה והמיקום. אפשר לעבור ל״משרד״ למעלה בכל רגע.</p></section>';
    return '<div class="techwrap">' + left + phone + '<aside class="tech-side">' + live + '</aside></div>';
  }

  function techJob(j, me) {
    const c = cust(j.customerId), e = equipOf(j), mine = j.techId === me.id;
    const editable = mine && !['assigned', 'review', 'closed'].includes(j.status);
    const dis = editable ? '' : ' disabled';
    const tabs = [['details', tx('פרטים')], ['check', tx('צ׳קליסט') + (j.checklist.length ? ' ' + checklistDone(j) + '/' + j.checklist.length : '')], ['items', tx('פריטים')], ['report', tx('דיווח')], ['sign', tx('חתימה')]];
    let html = '<div class="row wrap" style="gap:6px;margin-bottom:6px">' + chip(j.status) + (j.priority === 'urgent' ? pri('urgent') : '') + '</div><h2 style="font-size:19px;font-weight:800;color:var(--navy);line-height:1.3;margin-bottom:10px">' + esc(tx(j.title)) + '</h2>' +
      (!mine ? '<div class="hint" style="margin-bottom:10px">' + ic('info') + '<span>' + tx('הקריאה באחריות') + ' ' + esc(tx(tech(j.techId).name)) + '. ' + tx('לצפייה בלבד.') + '</span></div>' : '') +
      (j.status === 'assigned' && mine ? '<div class="hint" style="margin-bottom:10px">' + ic('bell') + '<span>' + tx('קריאה חדשה שויכה אליך. אשר קבלה כדי להתחיל.') + '</span></div>' : '') +
      '<div class="ttabs">' + tabs.map(t => '<button class="' + (ui.ttab === t[0] ? 'on' : '') + '" data-a="ttab" data-arg="' + t[0] + '">' + t[1] + '</button>').join('') + '</div>';
    const ll = lastLoc(j);
    if (ui.ttab === 'details') {
      html += (ll ? '<div class="gps">' + ic('pin', 16) + '<span>' + tx(EVT[ll.status]) + ' ' + fT(ll.at) + ' · ' + tx('מיקום נרשם') + ' · ' + tx('דיוק') + ' ' + (ll.loc.acc || 8) + ' ' + tx('מ׳') + '</span></div>' : '') +
        '<div class="tcard"><h3>' + ic('building', 16) + esc(tx(c.name)) + '</h3><p class="small muted">' + esc(tx(c.address)) + '</p><p class="small muted">' + esc(tx(c.contact)) + '</p><div class="acts"><a class="btn sm" href="' + wazeUrl(c) + '" target="_blank" rel="noopener">' + ic('nav', 15) + tx('ניווט') + '</a><a class="btn sm" href="tel:' + esc(c.phone.replace(/[^\d+]/g, '')) + '">' + ic('phone', 15) + tx('חיוג') + '</a></div></div>' +
        '<div class="tcard"><h3>' + ic('wrench', 16) + tx('מה צריך לבצע') + '</h3><p class="pre" style="font-size:14.5px">' + esc(tx(j.desc)) + '</p></div>' +
        (e ? '<div class="tcard"><h3>' + ic('box', 16) + esc(tx(e.name)) + '</h3><div class="kv small" style="grid-template-columns:100px 1fr"><span>' + tx('דגם') + '</span><b>' + esc(tx(e.model)) + '</b><span>' + tx('מס׳ סידורי') + '</span><b class="num">' + esc(e.serial) + '</b><span>' + tx('מיקום') + '</span><b>' + esc(tx(e.place)) + '</b></div></div>' : '') +
        '<div class="tcard"><h3>' + ic('truck', 16) + tx('לקחת איתך') + '</h3>' + (j.items.filter(i => !i.added).length ? j.items.filter(i => !i.added).map(i => '<div class="row small" style="justify-content:space-between;padding:4px 0"><span>' + esc(tx(i.name)) + '</span><b class="num">' + i.planned + ' ' + esc(tx(i.unit)) + '</b></div>').join('') : '<p class="small muted">' + tx('אין פריטים מתוכננים.') + '</p>') + '</div>';
    } else if (ui.ttab === 'check') {
      if (!j.checklist.length) html += '<div class="tcard"><p class="muted small">' + tx('אין צ׳קליסט לקריאת תקלה. ממלאים אבחון ועבודה בלשונית ״דיווח״.') + '</p></div>';
      else html += '<div class="tcard"><div class="row small"><b>' + esc(tx(tpl(j.templateId).name)) + '</b><span class="spacer"></span><span class="muted">' + checklistDone(j) + '/' + j.checklist.length + '</span></div><div class="progress"><i style="width:' + Math.round(checklistDone(j) / j.checklist.length * 100) + '%"></i></div>' +
        j.checklist.map(r => r.type === 'check' ? '<button class="tcheck' + (r.done ? ' on' : '') + '" data-a="tcheck" data-arg="' + r.id + '"' + dis + '><span class="tick">' + (r.done ? ic('check', 16) : '') + '</span><span class="t">' + esc(tx(r.text)) + '</span></button>'
          : r.type === 'num' ? '<div class="tnum"><span class="t">' + esc(tx(r.text)) + '</span><input id="tn-' + r.id + '" data-in="tnum" data-arg="' + r.id + '" value="' + esc(r.value) + '" placeholder="' + esc(r.unit) + '" inputmode="decimal"' + dis + '></div>'
            : '<div class="tnum" style="flex-direction:column;align-items:stretch"><span class="t">' + esc(tx(r.text)) + '</span><textarea id="tt-' + r.id + '" data-in="tnum" data-arg="' + r.id + '" rows="2" style="min-height:60px"' + dis + '>' + esc(r.value) + '</textarea></div>').join('') + '</div>';
    } else if (ui.ttab === 'items') {
      html += '<div class="tcard"><h3>' + ic('box', 16) + tx('במה השתמשת?') + '</h3><p class="small muted" style="margin-bottom:4px">' + tx('מסמנים כמה נצרך בפועל. מה שלא נדרש מסמנים ״לא״.') + '</p>' +
        j.items.map(i => '<div class="titem"><div class="nm"><b>' + esc(tx(i.name)) + '</b><small>' + (i.added ? tx('נוסף בשטח') : tx('לקחת') + ' ' + i.planned + ' ' + esc(tx(i.unit))) + '</small></div>' +
          (i.used == null ? '<div class="row" style="gap:6px"><button class="btn sm ok" data-a="iuse" data-arg="' + i.id + '"' + dis + '>' + tx('השתמשתי') + '</button><button class="btn sm" data-a="inouse" data-arg="' + i.id + '"' + dis + '>' + tx('לא') + '</button></div>'
            : i.used > 0 ? '<div class="stepper"><button data-a="iqty" data-arg="' + i.id + '" data-d="-1"' + dis + '>−</button><span>' + i.used + ' ' + esc(tx(i.unit)) + '</span><button data-a="iqty" data-arg="' + i.id + '" data-d="1"' + dis + '>+</button></div>'
              : '<button class="used-tag" style="background:var(--gray-soft);color:var(--muted)" data-a="iundo" data-arg="' + i.id + '"' + dis + '>' + tx('לא נדרש ↺') + '</button>') + '</div>').join('') +
        '</div>' + (editable ? '<button class="btn full" data-a="pick" data-arg="tjob">' + ic('plus') + tx('הוספת פריט מהמחירון') + '</button>' : '');
    } else if (ui.ttab === 'report') {
      const rec = ui.rec;
      const mic = f => '<button class="mic' + (rec === f + j.id ? ' rec' : '') + '" data-a="mic" data-arg="' + f + '"' + dis + '>' + ic('mic', 16) + (rec === f + j.id ? tx('מקליט… לחצו לעצירה') : tx('הקלטה')) + '</button>';
      html += '<div class="tcard"><div class="row"><h3 style="margin:0">' + tx('אבחון') + '</h3><span class="spacer"></span>' + mic('diagnosis') + '</div><textarea class="mt-s" id="tr-diag" data-in="tdiag" rows="3" placeholder="' + tx('מה מצאת?') + '"' + dis + '>' + esc(tx(j.diagnosis)) + '</textarea></div>' +
        '<div class="tcard"><div class="row"><h3 style="margin:0">' + tx('מה בוצע') + '</h3><span class="spacer"></span>' + mic('work') + '</div><textarea class="mt-s" id="tr-work" data-in="twork" rows="4" placeholder="' + tx('מה בדקת, תיקנת או החלפת?') + '"' + dis + '>' + esc(tx(j.work)) + '</textarea></div>' +
        '<div class="tcard"><h3>' + ic('users', 16) + tx('מי עבד איתך?') + '</h3><select data-in="tpartner"' + dis + '><option value="">' + tx('לבד') + '</option>' + S.techs.filter(t => t.id !== j.techId).map(t => '<option value="' + t.id + '"' + (j.partnerId === t.id ? ' selected' : '') + '>' + esc(tx(t.name)) + '</option>').join('') + '</select></div>' +
        '<div class="tcard"><h3>' + ic('cam', 16) + tx('תמונות') + '</h3>' + (j.photos.length ? '<div class="photos" style="margin-bottom:8px">' + j.photos.map(p => '<img src="' + p + '" alt="">').join('') + '</div>' : '') + (editable ? '<label class="btn full sm" style="cursor:pointer">' + ic('image', 15) + tx('צילום או בחירת תמונה') + '<input type="file" accept="image/*" capture="environment" data-in="tphoto" class="sr"></label>' : '') + '</div>';
    } else if (ui.ttab === 'sign') {
      html += '<div class="tcard"><h3>' + ic('pen', 16) + tx('חתימת הלקוח') + '</h3><label class="f"><span>' + tx('שם החותם') + '</span><input id="tsigner" data-in="tsigner" value="' + esc(j.signer) + '" placeholder="' + esc(tx(c.contact)) + '"' + dis + '></label><div class="mt-s">' +
        (editable ? '<canvas class="sigpad" id="sigpad" data-job="' + j.id + '"></canvas><div class="row mt-s"><span class="small muted">' + tx('חותמים עם האצבע') + '</span><span class="spacer"></span><button class="btn sm" data-a="sigclear">' + tx('ניקוי') + '</button></div>' : '<div class="sig">' + (j.signature ? '<img src="' + j.signature + '" alt="">' : '<span class="muted small">' + tx('טרם נחתם') + '</span>') + '</div>') + '</div></div>' +
        '<button class="btn full" data-a="report" data-arg="' + j.id + '">' + ic('file') + tx('תצוגת הדוח ללקוח') + '</button>';
    }
    return html;
  }

  function techFoot(j, me) {
    if (j.techId !== me.id) return '<div class="small muted" style="text-align:center">' + tx('לצפייה בלבד') + '</div>';
    if (j.status === 'review') return '<div class="next-step"><span class="att-ic green">' + ic('check') + '</span><div><b>' + tx('הדוח נשלח למשרד') + '</b><span class="lbl">' + tx('פולינה תבדוק ותסגור') + '</span></div></div>';
    if (j.status === 'closed') return '<div class="next-step"><span class="att-ic green">' + ic('check') + '</span><div><b>' + tx('הקריאה נסגרה') + '</b></div></div>';
    const n = nextStatus(j);
    return '<div class="next-step"><div style="min-width:86px"><span class="lbl">' + tx('השלב הבא') + '</span><b class="row" style="gap:4px">' + ic('pin', 13) + tx('נרשם מיקום') + '</b></div><button class="btn ' + (n === 'review' ? 'ok' : 'pri') + '" data-a="step" data-arg="' + j.id + '">' + (n === 'review' ? ic('file') : ic('check')) + tx(STEP[n]) + '</button></div>';
  }

  function pickSheet(inPhone) {
    const q = (ui.modal.q || '').trim();
    const list = S.catalog.filter(c => c.cat !== 'שירות' && (!q || (c.name + ' ' + tx(c.name) + ' ' + c.sku + ' ' + c.cat).toLowerCase().includes(q.toLowerCase())));
    const inner = '<div class="modal-h"><div><h2>' + tx('הוספה מהמחירון') + '</h2><p>' + (inPhone ? tx('פריט שלא תוכנן מראש') : 'בוחרים פריט') + '</p></div><button class="x" data-a="close">' + ic('x') + '</button></div><div class="modal-b"><label class="search" style="max-width:none">' + ic('search') + '<input id="pickq" data-in="pickq" value="' + esc(ui.modal.q || '') + '" placeholder="' + tx('חיפוש פריט') + '"></label><div class="pick-list">' +
      list.map(c => '<button data-a="picked" data-arg="' + c.id + '"><span>' + esc(tx(c.name)) + '</span><small>' + esc(tx(c.cat)) + ' · ' + esc(tx(c.unit)) + '</small></button>').join('') + '</div></div>';
    if (inPhone) return '<div class="overlay" style="position:absolute;padding:60px 10px 10px;align-items:flex-end"><div class="modal">' + inner + '</div></div>';
    return '<div class="overlay" data-a="close-bg"><div class="modal narrow">' + inner + '</div></div>';
  }

  /* ---------------- report ---------------- */
  function reportView() {
    const j = job(ui.report), c = cust(j.customerId), e = equipOf(j), t = tech(j.techId), tt = totals(j);
    const used = j.items.filter(i => i.used > 0);
    return '<div class="report-wrap"><div class="report-ctl"><button class="btn" data-a="report-close">' + ic('right') + 'חזרה</button><button class="btn pri" data-a="print">' + ic('print') + 'הדפסה / שמירה כ-PDF</button></div><article class="paper">' +
      '<header><img src="logo.png" alt="שחר הנדסת מיזוג אוויר"><div><h1>דוח שירות</h1><p>קריאה #' + j.id + ' · ' + fDY(evAt(j, 'arrived') || j.due) + '</p></div></header>' +
      '<div class="two"><div><div class="muted small">לקוח</div><b style="font-size:17px">' + esc(c.name) + '</b><div>' + esc(c.address) + '</div><div>' + esc(c.contact) + '</div></div><div><div class="muted small">עבודה</div><b style="font-size:17px">' + esc(j.title) + '</b>' + (e ? '<div>' + esc(e.name) + ' · ' + esc(e.model) + '</div><div class="num">מס׳ סידורי ' + esc(e.serial) + '</div>' : '') + '</div></div>' +
      '<h2>ביקור</h2><table><tr><th>טכנאי</th><th>הגעה</th><th>תחילת עבודה</th><th>סיום</th><th>זמן עבודה</th></tr><tr><td>' + esc(t.name) + (j.partnerId ? ' + ' + esc(tech(j.partnerId).name) : '') + '</td><td>' + fT(evAt(j, 'arrived')) + '</td><td>' + fT(evAt(j, 'working')) + '</td><td>' + fT(evAt(j, 'done')) + '</td><td>' + dur(tt.work) + '</td></tr></table>' +
      '<h2>ממצאים ועבודה שבוצעה</h2><p class="pre"><b>אבחון: </b>' + esc(j.diagnosis || '—') + '</p><p class="pre" style="margin-top:6px"><b>בוצע: </b>' + esc(j.work || '—') + '</p>' +
      (j.checklist.length ? '<h2>' + esc(tpl(j.templateId).name) + '</h2><table><tr><th>סעיף</th><th style="width:150px">תוצאה</th></tr>' + j.checklist.map(r => '<tr><td>' + esc(r.text) + '</td><td>' + (r.type === 'check' ? (r.done ? '✓ בוצע' : '—') : esc(r.value || '—') + (r.type === 'num' && r.value ? ' ' + esc(r.unit) : '')) + '</td></tr>').join('') + '</table>' : '') +
      '<h2>חומרים וחלקים</h2>' + (used.length ? '<table><tr><th>פריט</th><th style="width:150px">כמות</th></tr>' + used.map(i => '<tr><td>' + esc(i.name) + '</td><td>' + i.used + ' ' + esc(i.unit) + '</td></tr>').join('') + '</table>' : '<p class="muted">לא נעשה שימוש בחומרים.</p>') +
      (j.photos.length ? '<h2>תמונות</h2><div class="photos">' + j.photos.map(p => '<img src="' + p + '" alt="">').join('') + '</div>' : '') +
      '<h2>אישור הלקוח</h2><div class="two"><div><div class="muted small">שם</div><b>' + esc(j.signer || '—') + '</b></div><div class="sig" style="min-height:70px">' + (j.signature ? '<img src="' + j.signature + '" alt="חתימה">' : '<span class="muted small">טרם נחתם</span>') + '</div></div>' +
      '<footer>שחר הנדסת מיזוג אוויר בע״מ · באר שבע · דוח שירות ללא מחירים</footer></article></div>';
  }

  /* ---------------- modals ---------------- */
  function modalHtml() {
    const m = ui.modal; if (!m) return '';
    if (m.type === 'pick') return m.target === 'tjob' ? '' : pickSheet(false);
    if (m.type === 'wa') return '<div class="overlay" data-a="close-bg"><div class="modal narrow"><div class="modal-h"><div><h2>' + esc(m.title) + '</h2><p>' + esc(m.sub) + '</p></div><button class="x" data-a="close">' + ic('x') + '</button></div><div class="modal-b"><div class="wa-phone"><div class="wa-top"><img src="icon.jpg" alt=""><div><b>' + esc(m.to) + '</b><small>מ: שחר הנדסת מיזוג אוויר · חשבון עסקי</small></div></div><div class="wa-body"><div class="wa-msg out">' + esc(m.text) + '<div class="wa-btns">' + (m.btns || []).map(b => '<span>' + esc(b) + '</span>').join('') + '</div><time>' + fT(Date.now()) + '</time></div>' + (m.reply ? '<div class="wa-msg in">' + esc(m.reply) + '<time>' + fT(Date.now() + 60000) + '</time></div>' : '') + '</div></div><p class="small muted mt">' + esc(m.note || 'נוסח קבוע שאישרתם מראש. אפשר לערוך בהגדרות.') + '</p></div><div class="modal-f">' + (m.sendAct ? '<button class="btn pri" data-a="' + m.sendAct + '" data-arg="' + m.arg + '">' + ic('wa') + 'שליחה</button>' : '') + '<button class="btn" data-a="close">סגירה</button></div></div></div>';
    if (m.type === 'transfer') { const j = job(m.jobId); return '<div class="overlay" data-a="close-bg"><div class="modal narrow"><div class="modal-h"><div><h2>העברה לטכנאי אחר</h2><p>הדיווחים והזמנים עד עכשיו נשמרים בקריאה</p></div><button class="x" data-a="close">' + ic('x') + '</button></div><div class="modal-b grid" style="gap:12px"><label class="f"><span>הטכנאי הבא</span><select id="tr-to">' + S.techs.filter(t => !t.helper && t.id !== j.techId).map(t => '<option value="' + t.id + '">' + esc(t.name) + ' · ' + esc(t.spec) + '</option>').join('') + '</select></label><label class="f"><span>מה נשאר לעשות?</span><textarea id="tr-why" rows="3" placeholder="למשל: נשאר לחבר בקרה ולבדוק חיישנים"></textarea></label></div><div class="modal-f"><button class="btn pri" data-a="do-transfer" data-arg="' + j.id + '">' + ic('swap') + 'העברה ושליחת התראה</button><button class="btn" data-a="close">ביטול</button></div></div></div>'; }
    if (m.type === 'newcust') return '<div class="overlay" data-a="close-bg"><div class="modal narrow"><div class="modal-h"><div><h2>לקוח חדש</h2></div><button class="x" data-a="close">' + ic('x') + '</button></div><div class="modal-b form-grid"><label class="f span"><span>שם הלקוח</span><input id="nc-name"></label><label class="f"><span>עיר</span><input id="nc-city" value="באר שבע"></label><label class="f"><span>סוג</span><select id="nc-kind"><option>חדש</option><option>לקוח קבוע</option><option>חוזה אחזקה</option></select></label><label class="f span"><span>כתובת</span><input id="nc-addr"></label><label class="f"><span>איש קשר</span><input id="nc-contact"></label><label class="f"><span>טלפון</span><input id="nc-phone" inputmode="tel"></label></div><div class="modal-f"><button class="btn pri" data-a="do-newcust">שמירה</button><button class="btn" data-a="close">ביטול</button></div></div></div>';
    if (m.type === 'newjob') return newJobModal(m);
    return '';
  }

  function suggestTech(equipType) { return ({ 'צ׳ילר': 't1', 'מערכת VRF': 't3', 'חדר קירור': 't5', 'יט״א': 't4' })[equipType] || 't1'; }
  function draftFromTemplate(dr) {
    const t = tpl(dr.templateId); if (!t) return;
    dr.items = t.items.map(x => { const c = catItem(x.catId); return { catId: c.id, name: c.name, unit: c.unit, price: c.price, qty: x.qty }; });
    const c = cust(dr.customerId), e = c.equipment.find(q => q.id === dr.equipId);
    dr.title = t.name.replace(/^[^·]+·\s*/, (e ? e.name : t.equip) + ' · ');
  }
  function newJobModal(m) {
    const dr = m.draft, c = cust(dr.customerId), e = c.equipment.find(q => q.id === dr.equipId);
    const tpls = S.templates.filter(t => !e || t.equip === e.type);
    return '<div class="overlay" data-a="close-bg"><div class="modal"><div class="modal-h"><div><h2>קריאת שירות חדשה</h2><p>מה שהטכנאי צריך לדעת, עוד לפני שהוא יוצא</p></div><button class="x" data-a="close">' + ic('x') + '</button></div><div class="modal-b form-grid">' +
      '<label class="f"><span>לקוח</span><select data-in="dr-cust">' + S.customers.map(x => '<option value="' + x.id + '"' + (x.id === c.id ? ' selected' : '') + '>' + esc(x.name) + '</option>').join('') + '</select></label>' +
      '<label class="f"><span>ציוד</span><select data-in="dr-equip"><option value="">כללי / לא ידוע</option>' + c.equipment.map(x => '<option value="' + x.id + '"' + (x.id === dr.equipId ? ' selected' : '') + '>' + esc(x.name) + ' · ' + esc(x.model) + '</option>').join('') + '</select></label>' +
      '<label class="f"><span>סוג קריאה</span><select data-in="dr-kind">' + ['תקלה', 'טיפול תקופתי', 'התקנה'].map(k => '<option' + (k === dr.kind ? ' selected' : '') + '>' + k + '</option>').join('') + '</select></label>' +
      (dr.kind === 'טיפול תקופתי' ? '<label class="f"><span>תבנית טיפול</span><select data-in="dr-tpl"><option value="">בחירה…</option>' + tpls.map(t => '<option value="' + t.id + '"' + (t.id === dr.templateId ? ' selected' : '') + '>' + esc(t.name) + '</option>').join('') + '</select>' + (dr.templateId ? '<small>' + tpl(dr.templateId).checklist.length + ' סעיפים בצ׳קליסט יעברו לטכנאי</small>' : '') + '</label>' : '<label class="f"><span>עדיפות</span><select data-in="dr-pri">' + Object.keys(PRI).map(k => '<option value="' + k + '"' + (k === dr.priority ? ' selected' : '') + '>' + PRI[k] + '</option>').join('') + '</select></label>') +
      '<label class="f span"><span>נושא</span><input id="dr-title" data-in="dr-title" value="' + esc(dr.title) + '" placeholder="למשל: הצ׳ילר לא מקרר"></label>' +
      '<label class="f span"><span>תיאור</span><textarea id="dr-desc" data-in="dr-desc" rows="2" placeholder="מה ידוע? מה לבדוק? עם מי לתאם?">' + esc(dr.desc) + '</textarea></label>' +
      '<label class="f"><span>טכנאי</span><select data-in="dr-tech">' + S.techs.filter(t => !t.helper).map(t => '<option value="' + t.id + '"' + (t.id === dr.techId ? ' selected' : '') + '>' + esc(t.name) + ' · ' + esc(t.spec) + '</option>').join('') + '</select></label>' +
      '<label class="f"><span>מועד</span><input type="datetime-local" data-in="dr-due" value="' + dr.due + '"></label>' +
      '<div class="span"><div class="row"><b style="color:var(--navy)">' + ic('box', 16) + ' מה לקחת</b><span class="spacer"></span><span class="small muted">' + (dr.templateId ? 'נטען מהתבנית' : 'מהמחירון') + '</span></div><div class="items mt-s">' +
      (dr.items.length ? dr.items.map((i, k) => '<div class="it"><div class="nm"><b>' + esc(i.name) + '</b><small>' + money(i.price) + ' ל' + esc(i.unit) + '</small></div><div class="stepper"><button data-a="dr-qty" data-arg="' + k + '" data-d="-1">−</button><span>' + i.qty + ' ' + esc(i.unit) + '</span><button data-a="dr-qty" data-arg="' + k + '" data-d="1">+</button></div><button class="icon-btn" data-a="dr-del" data-arg="' + k + '">' + ic('trash', 16) + '</button></div>').join('') : '<p class="muted small">עוד לא נבחרו פריטים.</p>') +
      '</div>' + (m.picking ? '<label class="search mt-s" style="max-width:none">' + ic('search') + '<input id="pickq" data-in="pickq" value="' + esc(m.q || '') + '" placeholder="חיפוש פריט במחירון"></label><div class="pick-list">' + S.catalog.filter(x => x.cat !== 'שירות' && (!m.q || (x.name + x.sku + x.cat).includes(m.q))).map(x => '<button data-a="dr-pick" data-arg="' + x.id + '"><span>' + esc(x.name) + '</span><small>' + esc(x.cat) + ' · ' + money(x.price) + '</small></button>').join('') + '</div>' : '<button class="btn ghost sm mt-s" data-a="dr-picking">' + ic('plus', 15) + 'הוספה מהמחירון</button>') + '</div>' +
      '</div><div class="modal-f"><button class="btn pri" data-a="dr-save">' + ic('check') + 'פתיחה ושליחה לטכנאי</button><button class="btn" data-a="close">ביטול</button></div></div></div>';
  }
  function localInput(x) { const t = d(x); return new Date(t.getTime() - t.getTimezoneOffset() * 60000).toISOString().slice(0, 16); }

  /* ---------------- render ---------------- */
  let toastTimer;
  function toast(msg) {
    let el = $('#toast'); if (el) el.remove();
    el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.innerHTML = ic('check') + '<span>' + esc(msg) + '</span>';
    document.body.appendChild(el); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.remove(), 3200);
  }
  function render() {
    const a = document.activeElement, fid = a && a.id, sel = a && 'selectionStart' in a ? [a.selectionStart, a.selectionEnd] : null;
    const pb = $('#phbody'), pscroll = pb ? pb.scrollTop : 0;
    let html = topbar();
    if (ui.report) html += reportView();
    else html += ui.mode === 'tech' ? techView() : office();
    html += modalHtml();
    $('#app').innerHTML = html;
    const pb2 = $('#phbody'); if (pb2) pb2.scrollTop = pscroll;
    if (fid) { const el = document.getElementById(fid); if (el) { el.focus(); try { if (sel && el.setSelectionRange) el.setSelectionRange(sel[0], sel[1]); } catch (e) { } } }
    initSig();
    save();
  }
  function go(v) { ui.view = v; ui.q = ''; ui.report = null; window.scrollTo(0, 0); render(); }

  /* ---------------- signature ---------------- */
  function initSig() {
    const cv = $('#sigpad'); if (!cv) return;
    const j = job(+cv.dataset.job); const r = cv.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1;
    cv.width = r.width * dpr; cv.height = r.height * dpr; const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#14316e';
    if (j.signature) { const im = new Image(); im.onload = () => ctx.drawImage(im, 0, 0, r.width, r.height); im.src = j.signature; }
    let drawing = false, last = null;
    const pos = ev => { const b = cv.getBoundingClientRect(); return [ev.clientX - b.left, ev.clientY - b.top]; };
    cv.onpointerdown = ev => { drawing = true; last = pos(ev); cv.setPointerCapture(ev.pointerId); };
    cv.onpointermove = ev => { if (!drawing) return; const p = pos(ev); ctx.beginPath(); ctx.moveTo(last[0], last[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); last = p; };
    cv.onpointerup = () => { if (!drawing) return; drawing = false; j.signature = cv.toDataURL('image/png'); save(); };
  }

  /* ---------------- voice ---------------- */
  const SAMPLE = {
    diagnosis: ['מצאתי לחץ יניקה נמוך במעגל שתיים, כנראה חוסר גז. המסנן המייבש סתום חלקית.', 'המפוח מרעיש בגלל מיסב שחוק. הרצועה רפויה.', 'הטמפרטורה בחדר תקינה, חיישן ההפשרה מחזיר ערכים לא נכונים.'],
    work: ['החלפתי מסנן מייבש, מילאתי שלושה קילו גז R410A וניקיתי את סוללות העיבוי. המים יוצאים עכשיו בשבע מעלות.', 'החלפתי מיסב ורצועה, שימנתי ובדקתי זרם במנוע. היחידה שקטה.', 'ניקיתי מסננים בכל היחידות, ניקיתי מגשי ניקוז ושמתי טבליות. אין תקלות בבקר.']
  };
  let recog = null, simTimer = null;
  function stopRec() { if (recog) { try { recog.stop(); } catch (e) { } recog = null; } clearInterval(simTimer); ui.rec = null; }
  function startRec(field) {
    const j = job(ui.tjob); const key = field + j.id;
    if (ui.rec === key) { stopRec(); render(); return; }
    stopRec(); ui.rec = key; render();
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const cur = tx(j[field], true); const base = cur ? cur.replace(/\s+$/, '') + ' ' : '';
    const simulate = () => {
      const e = equipOf(j), kindIdx = e && e.type === 'יט״א' ? 1 : e && e.type !== 'צ׳ילר' ? 2 : 0;
      const text = (ui.lang === 'ru' ? RUV : SAMPLE)[field][kindIdx]; let i = 0;
      clearInterval(simTimer);
      simTimer = setInterval(() => { i += 3; j[field] = base + text.slice(0, i); const ta = $(field === 'diagnosis' ? '#tr-diag' : '#tr-work'); if (ta) ta.value = j[field]; if (i >= text.length) { clearInterval(simTimer); ui.rec = null; save(); render(); toast(tx('ההקלטה תומללה ונוספה לדוח', true)); } }, 45);
    };
    if (!SR) { simulate(); return; }
    try {
      recog = new SR(); recog.lang = ui.lang === 'ru' ? 'ru-RU' : 'he-IL'; recog.interimResults = true; recog.continuous = true;
      let finalText = '', gotAny = false;
      recog.onresult = ev => { gotAny = true; let interim = ''; for (let k = ev.resultIndex; k < ev.results.length; k++) { const r = ev.results[k]; if (r.isFinal) finalText += r[0].transcript + ' '; else interim += r[0].transcript; } j[field] = base + finalText + interim; const ta = $(field === 'diagnosis' ? '#tr-diag' : '#tr-work'); if (ta) ta.value = j[field]; };
      recog.onerror = () => { recog = null; if (!gotAny) simulate(); };
      recog.onend = () => { if (gotAny) { recog = null; ui.rec = null; save(); render(); toast(tx('ההקלטה תומללה ונוספה לדוח', true)); } };
      recog.start();
    } catch (e) { recog = null; simulate(); }
  }

  /* ---------------- photos ---------------- */
  function addPhoto(file) {
    const j = job(ui.tjob); if (!file || !j) return;
    const fr = new FileReader();
    fr.onload = () => { const im = new Image(); im.onload = () => { const s = Math.min(1, 520 / Math.max(im.width, im.height)); const cv = document.createElement('canvas'); cv.width = im.width * s; cv.height = im.height * s; cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height); j.photos.push(cv.toDataURL('image/jpeg', .72)); render(); toast(tx('התמונה צורפה לקריאה', true)); }; im.src = fr.result; };
    fr.readAsDataURL(file);
  }

  /* ---------------- actions ---------------- */
  function step(j) {
    const n = nextStatus(j); if (!n) return;
    if (n === 'done') {
      if (j.checklist.some(c => c.type === 'check' && !c.done)) { ui.ttab = 'check'; render(); toast(tx('נשארו סעיפים לא מסומנים בצ׳קליסט', true)); return; }
      if (j.items.some(i => i.used == null)) { ui.ttab = 'items'; render(); toast(tx('סמנו לכל פריט אם השתמשתם בו', true)); return; }
      if (!String(j.work).trim()) { ui.ttab = 'report'; render(); toast(tx('כתבו או הקליטו מה בוצע', true)); return; }
      if (!j.signature) { ui.ttab = 'sign'; render(); toast(tx('חסרה חתימת לקוח', true)); return; }
      if (!String(j.signer).trim()) j.signer = cust(j.customerId).contact;
    }
    j.status = n; pushEvent(j, n);
    if (n === 'review' && S.settings.closeMode === 'close') { j.status = 'closed'; pushEvent(j, 'closed'); afterClose(j); }
    if (n === 'working') ui.ttab = j.checklist.length ? 'check' : 'report';
    render(); toast(tx(EVT[n], true) + ' · ' + fT(Date.now()) + ' · ' + tx('המיקום נרשם', true));
  }
  function afterClose(j) {
    if (!j.planId) return;
    const c = cust(j.customerId), p = c.plans.find(x => x.id === j.planId), t = tpl(p.templateId);
    p.last = new Date().toISOString(); const nx = new Date(); nx.setMonth(nx.getMonth() + (t.freq || 12)); p.next = nx.toISOString(); p.reminder = 'none';
  }
  function createJob(o) {
    const id = S.nextJobId++;
    const j = Object.assign({ id, checklist: [], items: [], events: [], diagnosis: '', work: '', photos: [], signature: null, signer: '', partnerId: '', priority: 'normal', status: 'assigned', createdAt: new Date().toISOString() }, o);
    S.jobs.push(j); return j;
  }
  function planToJob(pid) {
    const x = allPlans().find(y => y.p.id === pid);
    const due = new Date(Math.max(sod(x.p.next), sod(Date.now()) + DAY)); due.setHours(8, 30, 0, 0);
    const j = createJob({ customerId: x.c.id, equipId: x.e.id, kind: 'טיפול תקופתי', templateId: x.t.id, planId: pid, title: x.e.name + ' · ' + x.t.name.split('·').slice(1).join('·').trim(), priority: 'low', techId: suggestTech(x.e.type), due: due.toISOString(), desc: x.t.name + ' לפי ' + (x.c.contract ? 'חוזה האחזקה' : 'התוכנית') + '. לתאם עם ' + x.c.contact + '.', checklist: x.t.checklist.map(c => Object.assign({}, c, { done: false, value: '' })), items: x.t.items.map(i => { const c = catItem(i.catId); return { id: uid('i'), catId: c.id, name: c.name, unit: c.unit, price: c.price, planned: i.qty, used: null, added: false }; }) });
    j.events.push({ status: 'created', at: new Date().toISOString() });
    x.p.reminder = x.p.reminder === 'none' ? 'confirmed' : x.p.reminder;
    return j;
  }
  function waForPlan(pid) {
    const x = allPlans().find(y => y.p.id === pid);
    return { type: 'wa', title: 'תזכורת טיפול ללקוח', sub: x.c.name + ' · ' + x.e.name, to: x.c.contact, text: 'שלום ' + x.c.contact.split(' ')[0] + ', כאן שחר הנדסת מיזוג אוויר.\nמתקרב מועד ה' + x.t.name.split('·').slice(1).join('·').trim() + ' ב' + x.e.name + ' (' + x.e.place + ').\nהצענו את ' + WD[d(x.p.next).getDay()] + ' ' + fD(x.p.next) + ' בבוקר. מתאים?', btns: ['מתאים', 'צריך מועד אחר', 'לדבר עם המשרד'], reply: 'מתאים, תודה. שיתקשר כשהוא יוצא.', note: 'כשהלקוח עונה ״מתאים״, נפתחת קריאה עם הצ׳קליסט והפריטים, ונשאר רק לשבץ טכנאי.', sendAct: 'wa-send-plan', arg: pid };
  }
  function waForContract(cid) {
    const c = cust(cid), k = c.contract;
    if (!k) return { type: 'wa', title: 'הצעת חוזה אחזקה', sub: c.name, to: c.contact, text: 'שלום ' + c.contact.split(' ')[0] + ', כאן שחר הנדסת מיזוג אוויר.\nבעקבות הטיפול האחרון, נשמח להציע לכם חוזה אחזקה שנתי ל' + c.equipment.map(e => e.name).join(', ') + ': טיפולים קבועים לפי לוח זמנים, עדיפות בקריאות ותזכורת לפני כל טיפול.\nלשלוח הצעה מסודרת?', btns: ['כן, תשלחו', 'לא כרגע'], sendAct: 'wa-send-contract', arg: cid };
    return { type: 'wa', title: 'תזכורת לחידוש חוזה', sub: c.name + ' · מסתיים ' + fDY(k.end), to: c.contact, text: 'שלום ' + c.contact.split(' ')[0] + ', כאן שחר הנדסת מיזוג אוויר.\nחוזה האחזקה שלכם מסתיים ב-' + fDY(k.end) + '. השנה ביצענו ' + k.visits + ' טיפולים לפי החוזה.\nנשמח לקבוע שיחה קצרה לחידוש לשנה הבאה. מתי נוח?', btns: ['השבוע', 'שבוע הבא', 'תתקשרו אליי'], sendAct: 'wa-send-contract', arg: cid };
  }

  const A = {
    go: a => go(a), mode: a => { ui.mode = a; ui.report = null; ui.modal = null; stopRec(); window.scrollTo(0, 0); render(); },
    reset: () => { if (!confirm('לאפס את הדמו לנתונים ההתחלתיים?')) return; S = window.SHAHAR_SEED(); ui.view = 'today'; ui.tjob = null; render(); toast('הדמו אופס'); },
    'open-job': a => { ui.mode = 'office'; ui.view = 'job'; ui.jobId = +a; ui.report = null; window.scrollTo(0, 0); render(); },
    'office-job': a => A['open-job'](a),
    'open-cust': a => { ui.view = 'customer'; ui.custId = a; ui.report = null; window.scrollTo(0, 0); render(); },
    filter: a => { ui.filter = a; render(); }, plantab: a => { ui.planTab = a; render(); }, cat: a => { ui.cat = a; render(); },
    report: a => { ui.report = +a; window.scrollTo(0, 0); render(); }, 'report-close': () => { ui.report = null; render(); }, print: () => window.print(),
    approve: a => { const j = job(+a); j.status = 'closed'; pushEvent(j, 'closed'); afterClose(j); render(); toast('הדוח אושר והקריאה נסגרה'); },
    reopen: a => { const j = job(+a); j.status = 'accepted'; j.events.push({ status: 'reopen', at: new Date().toISOString() }); render(); toast('הקריאה חזרה לטכנאי להמשך טיפול'); },
    transfer: a => { ui.modal = { type: 'transfer', jobId: +a }; render(); },
    'do-transfer': a => { const j = job(+a), to = $('#tr-to').value, why = $('#tr-why').value.trim(); const from = tech(j.techId).name; j.techId = to; if (!['assigned', 'closed'].includes(j.status)) j.status = 'assigned'; j.events.push({ status: 'transfer', at: new Date().toISOString(), note: from + ' ← ' + tech(to).name + (why ? ': ' + why : '') }); ui.modal = null; render(); toast('הקריאה הועברה ל' + tech(to).name + ' והוא קיבל התראה'); },
    close: () => { ui.modal = null; render(); }, 'close-bg': (a, ev) => { if (ev.target.classList.contains('overlay')) { ui.modal = null; render(); } },
    'new-job': a => { const c = cust(a) || S.customers[0]; const due = new Date(Date.now() + 3 * 3600000); due.setMinutes(0); ui.modal = { type: 'newjob', draft: { customerId: c.id, equipId: c.equipment[0] ? c.equipment[0].id : '', kind: 'תקלה', templateId: '', priority: 'normal', title: '', desc: '', techId: suggestTech(c.equipment[0] && c.equipment[0].type), due: localInput(due), items: [] } }; render(); },
    'dr-qty': (a, ev, el) => { const it = ui.modal.draft.items[+a]; it.qty = Math.max(0, +(it.qty + (+el.dataset.d) * (it.unit === 'ק״ג' || it.unit === 'ליטר' ? .5 : 1)).toFixed(1)); render(); },
    'dr-del': a => { ui.modal.draft.items.splice(+a, 1); render(); },
    'dr-picking': () => { ui.modal.picking = true; ui.modal.q = ''; render(); const el = $('#pickq'); if (el) el.focus(); },
    'dr-pick': a => { const c = catItem(a); const ex = ui.modal.draft.items.find(i => i.catId === a); if (ex) ex.qty += 1; else ui.modal.draft.items.push({ catId: c.id, name: c.name, unit: c.unit, price: c.price, qty: 1 }); ui.modal.picking = false; render(); },
    'dr-save': () => {
      const dr = ui.modal.draft; if (!dr.title.trim()) { toast('חסר נושא לקריאה'); $('#dr-title').focus(); return; }
      if (dr.kind === 'טיפול תקופתי' && !dr.templateId) { toast('בחרו תבנית טיפול'); return; }
      const t = dr.templateId && tpl(dr.templateId);
      const c = cust(dr.customerId), plan = t && c.plans.find(p => p.equipId === dr.equipId && p.templateId === t.id);
      const j = createJob({ customerId: dr.customerId, equipId: dr.equipId, kind: dr.kind, templateId: t ? t.id : null, planId: plan ? plan.id : undefined, title: dr.title.trim(), desc: dr.desc.trim() || 'אין פרטים נוספים.', priority: dr.kind === 'טיפול תקופתי' ? 'low' : dr.priority, techId: dr.techId, due: new Date(dr.due).toISOString(), checklist: t ? t.checklist.map(x => Object.assign({}, x, { done: false, value: '' })) : [], items: dr.items.map(i => ({ id: uid('i'), catId: i.catId, name: i.name, unit: i.unit, price: i.price, planned: i.qty, used: null, added: false })) });
      j.events.push({ status: 'created', at: new Date().toISOString() });
      ui.modal = null; ui.view = 'job'; ui.jobId = j.id; render(); toast('קריאה #' + j.id + ' נפתחה. ' + tech(j.techId).name + ' קיבל התראה');
    },
    'plan-job': a => { const j = planToJob(a); ui.view = 'job'; ui.jobId = j.id; window.scrollTo(0, 0); render(); toast('קריאה #' + j.id + ' נפתחה עם הצ׳קליסט והפריטים מהתבנית'); },
    'wa-plan': a => { ui.modal = waForPlan(a); render(); },
    'wa-send-plan': a => { const x = allPlans().find(y => y.p.id === a); x.p.reminder = 'sent'; ui.modal = null; render(); toast('התזכורת נשלחה ל' + x.c.contact); },
    'wa-contract': a => { ui.modal = waForContract(a); render(); },
    'wa-send-contract': a => { const c = cust(a); if (c.contract) c.contract.status = 'נשלחה הצעה'; ui.modal = null; render(); toast('ההודעה נשלחה ל' + c.contact); },
    renew: a => { const c = cust(a); const k = c.contract; k.start = k.end; const e = d(k.end); e.setFullYear(e.getFullYear() + 1); k.end = e.toISOString(); k.status = 'חודש'; render(); toast('החוזה של ' + c.name + ' חודש עד ' + fDY(k.end)); },
    'new-cust': () => { ui.modal = { type: 'newcust' }; render(); setTimeout(() => { const el = $('#nc-name'); if (el) el.focus(); }, 0); },
    'do-newcust': () => { const name = $('#nc-name').value.trim(); if (!name) { toast('חסר שם לקוח'); return; } const c = { id: uid('c'), name, city: $('#nc-city').value.trim() || 'באר שבע', address: $('#nc-addr').value.trim() || $('#nc-city').value.trim(), contact: $('#nc-contact').value.trim() || 'איש קשר', phone: $('#nc-phone').value.trim(), kind: $('#nc-kind').value, lat: 31.25, lng: 34.79, equipment: [], plans: [], contract: null }; S.customers.push(c); ui.modal = null; ui.view = 'customer'; ui.custId = c.id; render(); toast('הלקוח נוסף'); },
    tpl: a => { ui.tplId = a; render(); },
    'tpl-new': () => { const t = { id: uid('tp'), name: 'תבנית חדשה', equip: 'צ׳ילר', freq: 6, checklist: [{ id: uid('r'), text: '', type: 'check' }], items: [] }; S.templates.push(t); ui.tplId = t.id; render(); const el = $('#tpl-name'); if (el) { el.focus(); el.select(); } },
    'tpl-dup': () => { const s = tpl(ui.tplId); const t = JSON.parse(JSON.stringify(s)); t.id = uid('tp'); t.name = s.name + ' (עותק)'; t.checklist.forEach(r => r.id = uid('r')); S.templates.push(t); ui.tplId = t.id; render(); toast('התבנית שוכפלה'); },
    'cl-add': () => { const r = { id: uid('r'), text: '', type: 'check' }; tpl(ui.tplId).checklist.push(r); render(); const el = $('#cl-' + r.id); if (el) el.focus(); },
    'cl-del': a => { const t = tpl(ui.tplId); t.checklist = t.checklist.filter(r => r.id !== a); render(); },
    'ti-qty': (a, ev, el) => { const it = tpl(ui.tplId).items[+a]; const u = catItem(it.catId).unit; it.qty = Math.max(0, +(it.qty + (+el.dataset.d) * (u === 'ק״ג' || u === 'ליטר' ? .5 : 1)).toFixed(1)); render(); },
    'ti-del': a => { tpl(ui.tplId).items.splice(+a, 1); render(); },
    pick: a => { ui.modal = { type: 'pick', target: a, q: '' }; render(); const el = $('#pickq'); if (el) el.focus(); },
    picked: a => {
      const m = ui.modal, c = catItem(a);
      if (m.target === 'tpl') { const t = tpl(ui.tplId); const ex = t.items.find(i => i.catId === a); if (ex) ex.qty += 1; else t.items.push({ catId: a, qty: 1 }); }
      else { const j = job(ui.tjob); j.items.push({ id: uid('i'), catId: c.id, name: c.name, unit: c.unit, price: c.price, planned: 0, used: 1, added: true }); }
      ui.modal = null; render(); toast(m.target === 'tjob' ? tx(c.name, true) + ' · ' + tx('נוסף', true) : c.name + ' נוסף');
    },
    'cat-new': () => { const c = { id: uid('k'), sku: 'NEW-' + (S.catalog.length + 1), name: '', cat: ui.cat !== 'הכל' ? ui.cat : 'חלקי חילוף', unit: 'יח׳', price: 0 }; S.catalog.unshift(c); ui.q = ''; render(); const el = $('#cn-' + c.id); if (el) el.focus(); },
    auto: a => { const x = S.automations.find(y => y.id === a); x.on = !x.on; render(); toast(x.title + (x.on ? ' · פעיל' : ' · כבוי')); },
    closemode: a => { S.settings.closeMode = a; render(); },
    /* technician */
    lang: () => { stopRec(); ui.lang = ui.lang === 'ru' ? 'he' : 'ru'; render(); },
    tjob: a => { ui.tjob = +a; ui.ttab = 'details'; render(); }, tback: () => { stopRec(); ui.tjob = null; render(); },
    ttab: a => { stopRec(); ui.ttab = a; render(); },
    step: a => step(job(+a)),
    tcheck: a => { const j = job(ui.tjob); const r = j.checklist.find(x => x.id === a); r.done = !r.done; render(); },
    iuse: a => { const i = job(ui.tjob).items.find(x => x.id === a); i.used = i.planned || 1; render(); },
    inouse: a => { const i = job(ui.tjob).items.find(x => x.id === a); i.used = 0; render(); },
    iundo: a => { const i = job(ui.tjob).items.find(x => x.id === a); i.used = null; render(); },
    iqty: (a, ev, el) => { const j = job(ui.tjob), i = j.items.find(x => x.id === a); const st = i.unit === 'ק״ג' || i.unit === 'ליטר' ? .5 : 1; i.used = Math.max(0, +(i.used + (+el.dataset.d) * st).toFixed(1)); if (i.used === 0 && i.added) j.items = j.items.filter(x => x !== i); render(); },
    mic: a => startRec(a),
    sigclear: () => { const j = job(ui.tjob); j.signature = null; render(); }
  };

  const INPUT = {
    q: v => { ui.q = v; render(); },
    note: (v, el) => { job(+el.dataset.arg).note = v; save(); },
    'add-plan': (v, el) => { if (!v) return; const c = cust(ui.custId); const t = tpl(v); const nx = new Date(); nx.setDate(nx.getDate() + 30); c.plans.push({ id: uid('pl'), equipId: el.dataset.arg, templateId: v, last: null, next: nx.toISOString(), reminder: 'none' }); render(); toast('התבנית שויכה. הטיפול הראשון בעוד 30 יום'); void t; },
    'tpl-name': v => { tpl(ui.tplId).name = v; save(); const b = $('.tpl-list button.on b'); if (b) b.textContent = v; },
    'tpl-equip': v => { tpl(ui.tplId).equip = v; save(); },
    'tpl-freq': v => { tpl(ui.tplId).freq = +v; render(); },
    'cl-text': (v, el) => { tpl(ui.tplId).checklist.find(r => r.id === el.dataset.arg).text = v; save(); },
    'cl-type': (v, el) => { const r = tpl(ui.tplId).checklist.find(r => r.id === el.dataset.arg); r.type = v; if (v === 'num' && !r.unit) r.unit = ''; render(); },
    'cl-unit': (v, el) => { tpl(ui.tplId).checklist.find(r => r.id === el.dataset.arg).unit = v; save(); },
    'cat-name': (v, el) => { catItem(el.dataset.arg).name = v; save(); },
    'cat-price': (v, el) => { catItem(el.dataset.arg).price = Math.max(0, +v || 0); save(); },
    'cat-cat': (v, el) => { catItem(el.dataset.arg).cat = v; render(); },
    'cat-unit': (v, el) => { catItem(el.dataset.arg).unit = v; save(); },
    pickq: v => { ui.modal.q = v; render(); },
    'dr-cust': v => { const dr = ui.modal.draft, c = cust(v); dr.customerId = v; dr.equipId = c.equipment[0] ? c.equipment[0].id : ''; dr.templateId = ''; dr.techId = suggestTech(c.equipment[0] && c.equipment[0].type); render(); },
    'dr-equip': v => { const dr = ui.modal.draft; dr.equipId = v; const e = cust(dr.customerId).equipment.find(q => q.id === v); if (e) dr.techId = suggestTech(e.type); if (dr.templateId && e && tpl(dr.templateId).equip !== e.type) { dr.templateId = ''; } render(); },
    'dr-kind': v => { const dr = ui.modal.draft; dr.kind = v; if (v === 'טיפול תקופתי') { const c = cust(dr.customerId), p = c.plans.find(x => x.equipId === dr.equipId); if (p) { dr.templateId = p.templateId; draftFromTemplate(dr); } } else { dr.templateId = ''; } render(); },
    'dr-tpl': v => { const dr = ui.modal.draft; dr.templateId = v; if (v) draftFromTemplate(dr); render(); },
    'dr-pri': v => { ui.modal.draft.priority = v; },
    'dr-title': v => { ui.modal.draft.title = v; },
    'dr-desc': v => { ui.modal.draft.desc = v; },
    'dr-tech': v => { ui.modal.draft.techId = v; },
    'dr-due': v => { ui.modal.draft.due = v; },
    techid: v => { ui.techId = v; ui.tjob = null; render(); },
    tnum: (v, el) => { job(ui.tjob).checklist.find(r => r.id === el.dataset.arg).value = v; save(); },
    tdiag: v => { job(ui.tjob).diagnosis = v; save(); },
    twork: v => { job(ui.tjob).work = v; save(); },
    tpartner: v => { job(ui.tjob).partnerId = v; save(); },
    tsigner: v => { job(ui.tjob).signer = v; save(); },
    tphoto: (v, el) => addPhoto(el.files && el.files[0])
  };
  const LIVE = new Set(['q', 'pickq']); // re-render on every keystroke
  const ON_CHANGE = new Set(['add-plan', 'tpl-freq', 'cl-type', 'cat-cat', 'cat-unit', 'dr-cust', 'dr-equip', 'dr-kind', 'dr-tpl', 'dr-pri', 'dr-tech', 'dr-due', 'techid', 'tpartner', 'tphoto']);

  document.addEventListener('click', ev => {
    const el = ev.target.closest('[data-a]'); if (!el || el.disabled) return;
    const a = el.dataset.a; if (!A[a]) return;
    if (el.tagName === 'A' && el.getAttribute('href') === '#') ev.preventDefault();
    if (a === 'close-bg' && el !== ev.target) return;
    A[a](el.dataset.arg, ev, el);
  });
  document.addEventListener('input', ev => { const el = ev.target, k = el.dataset && el.dataset.in; if (!k || ON_CHANGE.has(k)) return; INPUT[k](el.value, el); });
  document.addEventListener('change', ev => { const el = ev.target, k = el.dataset && el.dataset.in; if (!k || !ON_CHANGE.has(k)) return; INPUT[k](el.value, el); });
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && ui.modal) { ui.modal = null; render(); } });
  void LIVE;

  render();
})();
