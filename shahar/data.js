/* שחר הנדסת מיזוג אוויר — נתוני דוגמה. כל השמות, הלקוחות והמספרים בדויים. */
(function () {
  const MIN = 60000, HOUR = 60 * MIN, DAY = 24 * HOUR;

  function at(dayOffset, h, m) {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    d.setHours(h, m || 0, 0, 0);
    return d.toISOString();
  }
  function ago(minutes) { return new Date(Date.now() - minutes * MIN).toISOString(); }
  function dateOnly(dayOffset) {
    const d = new Date(); d.setDate(d.getDate() + dayOffset); d.setHours(9, 0, 0, 0);
    return d.toISOString();
  }

  const WORKSHOP = { lat: 31.2396, lng: 34.8164, addr: 'בית המלאכה · אזור התעשייה, באר שבע' };

  const techs = [
    { id: 't1', name: 'דניאל לוי', spec: 'צ׳ילרים וקירור', phone: '050-0000001' },
    { id: 't2', name: 'איתי כהן', spec: 'חשמל ובקרה', phone: '050-0000002' },
    { id: 't3', name: 'רועי ביטון', spec: 'מערכות VRF', phone: '050-0000003' },
    { id: 't4', name: 'יוסי אדרי', spec: 'מיזוג תעשייתי', phone: '050-0000004' },
    { id: 't5', name: 'אמיר פרץ', spec: 'אחזקה מונעת', phone: '050-0000005' },
    { id: 'p1', name: 'עידו ישראלי', spec: 'עוזר טכנאי', phone: '', helper: true },
    { id: 'p2', name: 'נדב מזרחי', spec: 'עוזר טכנאי', phone: '', helper: true }
  ];

  const catalog = [
    { id: 'g1', sku: 'GAS-410', name: 'גז R410A', cat: 'גזים', unit: 'ק״ג', price: 95 },
    { id: 'g2', sku: 'GAS-134', name: 'גז R134a', cat: 'גזים', unit: 'ק״ג', price: 85 },
    { id: 'g3', sku: 'GAS-32', name: 'גז R32', cat: 'גזים', unit: 'ק״ג', price: 80 },
    { id: 'g4', sku: 'GAS-407', name: 'גז R407C', cat: 'גזים', unit: 'ק״ג', price: 90 },
    { id: 'f1', sku: 'FLT-G4', name: 'מסנן אוויר G4 · 592×592', cat: 'מסננים', unit: 'יח׳', price: 65 },
    { id: 'f2', sku: 'FLT-F7', name: 'מסנן שקית F7', cat: 'מסננים', unit: 'יח׳', price: 180 },
    { id: 'f3', sku: 'FLT-DRY', name: 'מסנן מייבש לקו נוזל', cat: 'מסננים', unit: 'יח׳', price: 140 },
    { id: 'e1', sku: 'EL-CAP45', name: 'קבל התנעה 45µF', cat: 'חשמל', unit: 'יח׳', price: 75 },
    { id: 'e2', sku: 'EL-CON32', name: 'מגען 32A', cat: 'חשמל', unit: 'יח׳', price: 210 },
    { id: 'e3', sku: 'EL-SENS', name: 'חיישן טמפרטורה NTC', cat: 'חשמל', unit: 'יח׳', price: 120 },
    { id: 'p1', sku: 'PRT-BELT', name: 'רצועת הנעה A-48', cat: 'חלקי חילוף', unit: 'יח׳', price: 55 },
    { id: 'p2', sku: 'PRT-BRG', name: 'מיסב למנוע מפוח', cat: 'חלקי חילוף', unit: 'יח׳', price: 160 },
    { id: 'p3', sku: 'PRT-OIL', name: 'שמן מדחס POE', cat: 'חלקי חילוף', unit: 'ליטר', price: 130 },
    { id: 'c1', sku: 'CHM-COIL', name: 'חומר ניקוי סוללות', cat: 'חומרי ניקוי', unit: 'ליטר', price: 45 },
    { id: 'c2', sku: 'CHM-TAB', name: 'טבליות למגש ניקוז', cat: 'חומרי ניקוי', unit: 'יח׳', price: 12 },
    { id: 's1', sku: 'SRV-HR', name: 'שעת עבודה טכנאי', cat: 'שירות', unit: 'שעה', price: 280 },
    { id: 's2', sku: 'SRV-HLP', name: 'שעת עבודה עוזר', cat: 'שירות', unit: 'שעה', price: 160 },
    { id: 's3', sku: 'SRV-TRV', name: 'נסיעה (הלוך וחזור)', cat: 'שירות', unit: 'שעה', price: 180 }
  ];

  const templates = [
    {
      id: 'tp1', name: 'צ׳ילר · טיפול חצי שנתי', equip: 'צ׳ילר', freq: 6,
      checklist: [
        { id: 'a1', text: 'לחץ יניקה', type: 'num', unit: 'bar' },
        { id: 'a1b', text: 'לחץ דחיסה', type: 'num', unit: 'bar' },
        { id: 'a2', text: 'טמפרטורת מים נכנסים', type: 'num', unit: '°C' },
        { id: 'a2b', text: 'טמפרטורת מים יוצאים', type: 'num', unit: '°C' },
        { id: 'a3', text: 'ניקוי סוללות עיבוי', type: 'check' },
        { id: 'a4', text: 'בדיקת זרמי מדחסים', type: 'num', unit: 'A' },
        { id: 'a5', text: 'בדיקת דליפות גז בגלאי', type: 'check' },
        { id: 'a6', text: 'בדיקת מגענים וחיבורי חשמל', type: 'check' },
        { id: 'a7', text: 'הערות למצב הכללי של היחידה', type: 'text' }
      ],
      items: [{ catId: 'c1', qty: 2 }, { catId: 'g1', qty: 3 }, { catId: 'f3', qty: 1 }]
    },
    {
      id: 'tp2', name: 'צ׳ילר · טיפול שנתי', equip: 'צ׳ילר', freq: 12,
      checklist: [
        { id: 'b1', text: 'כל סעיפי הטיפול החצי שנתי', type: 'check' },
        { id: 'b2', text: 'בדיקת שמן מדחס והחלפה לפי הצורך', type: 'check' },
        { id: 'b3', text: 'בדיקת משאבות מים ומיסבים', type: 'check' },
        { id: 'b4', text: 'בדיקת בידוד מנועים (מגר)', type: 'num', unit: 'MΩ' },
        { id: 'b5', text: 'כיול חיישנים ובקר', type: 'check' },
        { id: 'b6', text: 'ניקוי מחליף חום (מאייד)', type: 'check' },
        { id: 'b7', text: 'הערות והמלצות ללקוח', type: 'text' }
      ],
      items: [{ catId: 'p3', qty: 4 }, { catId: 'f3', qty: 1 }, { catId: 'c1', qty: 3 }, { catId: 'e3', qty: 1 }]
    },
    {
      id: 'tp3', name: 'VRF · טיפול חצי שנתי', equip: 'מערכת VRF', freq: 6,
      checklist: [
        { id: 'c1', text: 'ניקוי מסננים ביחידות פנים', type: 'check' },
        { id: 'c2', text: 'ניקוי מגש ניקוז ובדיקת משאבת עיבוי', type: 'check' },
        { id: 'c3', text: 'קריאת תקלות מהבקר המרכזי', type: 'text' },
        { id: 'c4', text: 'לחץ עבודה ביחידת חוץ', type: 'num', unit: 'bar' },
        { id: 'c5', text: 'ניקוי סוללת יחידת חוץ', type: 'check' }
      ],
      items: [{ catId: 'c2', qty: 10 }, { catId: 'c1', qty: 1 }]
    },
    {
      id: 'tp4', name: 'חדר קירור · טיפול רבעוני', equip: 'חדר קירור', freq: 3,
      checklist: [
        { id: 'd1', text: 'טמפרטורת חדר', type: 'num', unit: '°C' },
        { id: 'd2', text: 'בדיקת אטימות דלת וגומיות', type: 'check' },
        { id: 'd3', text: 'בדיקת מחזור הפשרה', type: 'check' },
        { id: 'd4', text: 'ניקוי מאייד ומעבה', type: 'check' },
        { id: 'd5', text: 'בדיקת אזעקת טמפרטורה', type: 'check' }
      ],
      items: [{ catId: 'c1', qty: 1 }, { catId: 'g2', qty: 2 }]
    },
    {
      id: 'tp5', name: 'יחידת טיפול באוויר · חצי שנתי', equip: 'יט״א', freq: 6,
      checklist: [
        { id: 'e1', text: 'החלפת מסננים', type: 'check' },
        { id: 'e2', text: 'בדיקת מתח רצועות והחלפה לפי הצורך', type: 'check' },
        { id: 'e3', text: 'לחץ דיפרנציאלי על המסננים', type: 'num', unit: 'Pa' },
        { id: 'e4', text: 'שימון מיסבים', type: 'check' }
      ],
      items: [{ catId: 'f1', qty: 6 }, { catId: 'f2', qty: 6 }, { catId: 'p1', qty: 2 }]
    }
  ];

  const customers = [
    {
      id: 'c1', name: 'מפעל נגב מזון', city: 'באר שבע', address: 'אזור התעשייה עמק שרה, באר שבע',
      contact: 'משה אחראי אחזקה', phone: '050-1111111', email: 'moshe@example.co.il', kind: 'חוזה אחזקה', lat: 31.2285, lng: 34.8205,
      equipment: [
        { id: 'q1', name: 'צ׳ילר 01', type: 'צ׳ילר', model: 'קריר 120 טון', serial: 'CH-22841', place: 'גג אולם ייצור' },
        { id: 'q2', name: 'צ׳ילר 02', type: 'צ׳ילר', model: 'קריר 120 טון', serial: 'CH-22842', place: 'גג אולם ייצור' },
        { id: 'q3', name: 'חדר קירור חומרי גלם', type: 'חדר קירור', model: '40 מ״ר', serial: 'CR-1180', place: 'מחסן צפוני' }
      ],
      plans: [
        { id: 'pl1', equipId: 'q1', templateId: 'tp1', last: dateOnly(-176), next: dateOnly(4), reminder: 'confirmed' },
        { id: 'pl2', equipId: 'q2', templateId: 'tp2', last: dateOnly(-350), next: dateOnly(15), reminder: 'opened' },
        { id: 'pl3', equipId: 'q3', templateId: 'tp4', last: dateOnly(-95), next: dateOnly(-5), reminder: 'none' }
      ],
      contract: { start: dateOnly(-330), end: dateOnly(35), visits: 6, value: 38000, status: 'לחידוש' }
    },
    {
      id: 'c2', name: 'מרכז העסקים דרום', city: 'באר שבע', address: 'שדרות רגר, באר שבע',
      contact: 'רינה מנהלת הבניין', phone: '050-2222222', email: 'rina@example.co.il', kind: 'חוזה אחזקה', lat: 31.2518, lng: 34.7913,
      equipment: [
        { id: 'q4', name: 'VRF קומות 1–4', type: 'מערכת VRF', model: '48 יחידות פנים', serial: 'VRF-7781', place: 'גג' },
        { id: 'q5', name: 'יט״א לובי', type: 'יט״א', model: '12,000 CFM', serial: 'AHU-301', place: 'חדר מכונות' }
      ],
      plans: [
        { id: 'pl4', equipId: 'q4', templateId: 'tp3', last: dateOnly(-182), next: dateOnly(0), reminder: 'confirmed' },
        { id: 'pl5', equipId: 'q5', templateId: 'tp5', last: dateOnly(-150), next: dateOnly(30), reminder: 'none' }
      ],
      contract: { start: dateOnly(-300), end: dateOnly(64), visits: 4, value: 24000, status: 'פעיל' }
    },
    {
      id: 'c3', name: 'מעבדות אופק', city: 'עומר', address: 'פארק ההייטק, עומר',
      contact: 'ד״ר נועה מנהלת מעבדה', phone: '050-3333333', email: 'noa@example.co.il', kind: 'חוזה אחזקה', lat: 31.2683, lng: 34.8487,
      equipment: [
        { id: 'q6', name: 'יט״א חדר נקי', type: 'יט״א', model: 'HEPA · 8,000 CFM', serial: 'AHU-552', place: 'קומה 2' },
        { id: 'q7', name: 'צ׳ילר מעבדה', type: 'צ׳ילר', model: '60 טון', serial: 'CH-40917', place: 'חצר אחורית' }
      ],
      plans: [
        { id: 'pl6', equipId: 'q6', templateId: 'tp5', last: dateOnly(-170), next: dateOnly(1), reminder: 'confirmed' },
        { id: 'pl7', equipId: 'q7', templateId: 'tp1', last: dateOnly(-180), next: dateOnly(0), reminder: 'confirmed' }
      ],
      contract: { start: dateOnly(-345), end: dateOnly(20), visits: 4, value: 31000, status: 'נשלחה הצעה' }
    },
    {
      id: 'c4', name: 'מרכז לוגיסטי ערבה', city: 'דימונה', address: 'אזור התעשייה, דימונה',
      contact: 'אבי מנהל התפעול', phone: '050-4444444', email: 'avi@example.co.il', kind: 'לקוח קבוע', lat: 31.0700, lng: 35.0330,
      equipment: [
        { id: 'q8', name: 'חדר קירור 1', type: 'חדר קירור', model: '120 מ״ר', serial: 'CR-2210', place: 'מתחם A' },
        { id: 'q9', name: 'חדר קירור 2', type: 'חדר קירור', model: '120 מ״ר', serial: 'CR-2211', place: 'מתחם A' }
      ],
      plans: [
        { id: 'pl8', equipId: 'q8', templateId: 'tp4', last: dateOnly(-89), next: dateOnly(1), reminder: 'confirmed' },
        { id: 'pl9', equipId: 'q9', templateId: 'tp4', last: dateOnly(-89), next: dateOnly(1), reminder: 'confirmed' }
      ],
      contract: { start: dateOnly(-120), end: dateOnly(245), visits: 4, value: 18000, status: 'פעיל' }
    },
    {
      id: 'c5', name: 'בית אבות נווה מדבר', city: 'באר שבע', address: 'שכונה ה׳, באר שבע',
      contact: 'שושי אחראית משק', phone: '050-5555555', email: 'shoshi@example.co.il', kind: 'חוזה אחזקה', lat: 31.2602, lng: 34.8058,
      equipment: [
        { id: 'q10', name: 'צ׳ילר מרכזי', type: 'צ׳ילר', model: '80 טון', serial: 'CH-31105', place: 'גג' }
      ],
      plans: [
        { id: 'pl10', equipId: 'q10', templateId: 'tp2', last: dateOnly(-360), next: dateOnly(2), reminder: 'asked_later' }
      ],
      contract: { start: dateOnly(-355), end: dateOnly(12), visits: 2, value: 14500, status: 'לחידוש' }
    },
    {
      id: 'c6', name: 'מלון חולות', city: 'ירוחם', address: 'דרך המדבר, ירוחם',
      contact: 'גיל מנהל תחזוקה', phone: '050-6666666', email: 'gil@example.co.il', kind: 'חדש', lat: 30.9877, lng: 34.9306,
      equipment: [
        { id: 'q11', name: 'VRF אגף חדרים', type: 'מערכת VRF', model: '36 יחידות פנים', serial: 'VRF-9902', place: 'גג אגף מזרחי' }
      ],
      plans: [
        { id: 'pl11', equipId: 'q11', templateId: 'tp3', last: dateOnly(-178), next: dateOnly(2), reminder: 'confirmed' }
      ],
      contract: null
    }
  ];

  function item(catId, planned, used) {
    const c = catalog.find(x => x.id === catId);
    return { id: 'i' + Math.random().toString(36).slice(2, 8), catId, name: c.name, unit: c.unit, price: c.price, planned, used: used == null ? null : used, added: planned === 0 };
  }
  function checklistFrom(tplId, filled) {
    const t = templates.find(x => x.id === tplId);
    return t.checklist.map((c, i) => ({ ...c, done: !!filled && (filled === true || i < filled), value: '' }));
  }
  function ev(status, minutesAgo, loc) { return { status, at: ago(minutesAgo), loc }; }
  function custLoc(cid) { const c = customers.find(x => x.id === cid); return { lat: c.lat, lng: c.lng, addr: c.address }; }

  const jobs = [
    {
      id: 4101, customerId: 'c1', equipId: 'q2', kind: 'תקלה', templateId: null,
      title: 'צ׳ילר 02 לא מגיע לטמפרטורת היעד', priority: 'urgent', status: 'assigned',
      techId: 't1', partnerId: 'p1', due: at(0, 13, 0),
      desc: 'טמפרטורת המים היוצאים 11°C במקום 7°C. לבדוק לחץ גז, מסנן מייבש ותפקוד מדחס 2. איש הקשר באתר: משה.',
      checklist: [], items: [item('g1', 5), item('f3', 1), item('e1', 1)],
      events: [], diagnosis: '', work: '', photos: [], signature: null, signer: '', createdAt: ago(55)
    },
    {
      id: 4102, customerId: 'c2', equipId: 'q4', kind: 'טיפול תקופתי', templateId: 'tp3',
      title: 'VRF · טיפול חצי שנתי', priority: 'normal', status: 'working',
      techId: 't3', partnerId: 'p2', due: at(0, 8, 30),
      desc: 'טיפול חצי שנתי לפי החוזה. לתאם עם רינה כניסה לקומות 3–4.',
      checklist: checklistFrom('tp3', 2), items: [item('c2', 10, 8), item('c1', 1)],
      events: [ev('accepted', 150, WORKSHOP), ev('enroute', 128, WORKSHOP), ev('arrived', 112, custLoc('c2')), ev('working', 105, custLoc('c2'))],
      diagnosis: '', work: 'ניקוי מסננים בקומות 1–2 הסתיים.', photos: [], signature: null, signer: '', planId: 'pl4', createdAt: ago(1500)
    },
    {
      id: 4103, customerId: 'c3', equipId: 'q6', kind: 'תקלה', templateId: null,
      title: 'רעש חריג ביט״א של החדר הנקי', priority: 'normal', status: 'enroute',
      techId: 't4', partnerId: '', due: at(0, 11, 0),
      desc: 'הלקוחה מדווחת על חריקה מהמפוח מהבוקר. כנראה רצועה או מיסב.',
      checklist: [], items: [item('p1', 2), item('p2', 1)],
      events: [ev('accepted', 40, WORKSHOP), ev('enroute', 18, WORKSHOP)],
      diagnosis: '', work: '', photos: [], signature: null, signer: '', createdAt: ago(90)
    },
    {
      id: 4104, customerId: 'c4', equipId: 'q8', kind: 'תקלה', templateId: null,
      title: 'חדר קירור 1 מתחמם בלילות', priority: 'normal', status: 'review',
      techId: 't5', partnerId: 'p1', due: at(-1, 14, 0),
      desc: 'הטמפרטורה עולה ל-9°C בלילה. לבדוק מחזור הפשרה ואטימות דלת.',
      checklist: [], items: [item('e3', 1, 1), item('g2', 2, 1.5), item('c1', 0, 1)],
      events: [ev('accepted', 1530, WORKSHOP), ev('enroute', 1500, WORKSHOP), ev('arrived', 1440, custLoc('c4')), ev('working', 1435, custLoc('c4')), ev('done', 1330, custLoc('c4')), ev('returning', 1320, custLoc('c4')), ev('returned', 1262, WORKSHOP), ev('review', 1255, WORKSHOP)],
      diagnosis: 'חיישן טמפרטורה במאייד מקולקל, ההפשרה לא נעצרה בזמן. גומיית הדלת תקינה.',
      work: 'הוחלף חיישן NTC, מולאו 1.5 ק״ג גז R134a, נוקה המאייד. החדר ירד ל-2°C תוך 40 דקות.',
      photos: [], signature: null, signer: 'אבי מנהל התפעול', createdAt: ago(1700)
    },
    {
      id: 4105, customerId: 'c5', equipId: 'q10', kind: 'טיפול תקופתי', templateId: 'tp2',
      title: 'צ׳ילר מרכזי · טיפול שנתי', priority: 'low', status: 'accepted',
      techId: 't2', partnerId: '', due: at(0, 15, 30),
      desc: 'טיפול שנתי. ביקשו להגיע אחרי 15:00, אחרי ארוחת הצהריים של הדיירים.',
      checklist: checklistFrom('tp2'), items: [item('p3', 4), item('f3', 1), item('c1', 3), item('e3', 1)],
      events: [ev('accepted', 25, WORKSHOP)],
      diagnosis: '', work: '', photos: [], signature: null, signer: '', planId: 'pl10', createdAt: ago(300)
    },
    {
      id: 4106, customerId: 'c1', equipId: 'q1', kind: 'טיפול תקופתי', templateId: 'tp1',
      title: 'צ׳ילר 01 · טיפול חצי שנתי', priority: 'low', status: 'closed',
      techId: 't1', partnerId: 'p1', due: at(-176, 9, 0),
      desc: 'טיפול חצי שנתי לפי החוזה.',
      checklist: checklistFrom('tp1', true).map(c => ({ ...c, value: c.type === 'num' ? ({ a1: '4.2', a1b: '17.5', a2: '12', a2b: '7', a4: '86' })[c.id] || '' : c.type === 'text' ? 'היחידה במצב טוב. מומלץ להחליף מגען 2 בטיפול הבא.' : '' })),
      items: [item('c1', 2, 2), item('g1', 3, 2), item('f3', 1, 0)],
      events: [ev('accepted', 176 * 1440 + 60, WORKSHOP), ev('enroute', 176 * 1440 + 40, WORKSHOP), ev('arrived', 176 * 1440 + 20, custLoc('c1')), ev('working', 176 * 1440 + 15, custLoc('c1')), ev('done', 176 * 1440 - 150, custLoc('c1')), ev('returning', 176 * 1440 - 155, custLoc('c1')), ev('returned', 176 * 1440 - 175, WORKSHOP), ev('review', 176 * 1440 - 180, WORKSHOP), ev('closed', 176 * 1440 - 240, WORKSHOP)],
      diagnosis: 'ללא תקלות. לחצים תקינים.', work: 'בוצע טיפול חצי שנתי מלא לפי הצ׳קליסט. נוספו 2 ק״ג גז.',
      photos: [], signature: null, signer: 'משה אחראי אחזקה', createdAt: ago(177 * 1440)
    }
  ];

  function inH(h) { const t = new Date(Date.now() + h * HOUR); t.setMinutes(Math.round(t.getMinutes() / 15) * 15, 0, 0); return t.toISOString(); }
  function base(o) { return Object.assign({ checklist: [], items: [], events: [], diagnosis: '', work: '', photos: [], signature: null, signer: '', partnerId: '', createdAt: ago(240) }, o); }
  jobs.push(
    /* דניאל לוי */
    base({ id: 4107, customerId: 'c3', equipId: 'q7', kind: 'טיפול תקופתי', templateId: 'tp1', planId: 'pl7', title: 'צ׳ילר מעבדה · טיפול חצי שנתי', priority: 'low', status: 'accepted', techId: 't1', due: inH(3), desc: 'טיפול חצי שנתי לפי החוזה. כניסה דרך השער האחורי, לתאם עם ד״ר נועה.', checklist: checklistFrom('tp1'), items: [item('c1', 2), item('g1', 3), item('f3', 1)], events: [ev('accepted', 90, WORKSHOP)] }),
    base({ id: 4108, customerId: 'c1', equipId: 'q1', kind: 'תקלה', title: 'התראת לחץ גבוה בצ׳ילר 01', priority: 'normal', status: 'assigned', techId: 't1', partnerId: 'p1', due: at(1, 8, 0), desc: 'הצ׳ילר נכבה פעמיים אתמול בהתראת לחץ גבוה. לבדוק מאווררי עיבוי וניקיון סוללות.', items: [item('c1', 2), item('e1', 1)], createdAt: ago(35) }),
    base({ id: 4117, customerId: 'c1', equipId: 'q1', kind: 'תקלה', title: 'רעש במשאבת המים של צ׳ילר 01', priority: 'normal', status: 'closed', techId: 't1', partnerId: 'p1', due: inH(-6), desc: 'רעש חריג במשאבת המים הראשית.', items: [item('p2', 1, 1)], events: [ev('accepted', 420, WORKSHOP), ev('enroute', 400, WORKSHOP), ev('arrived', 375, custLoc('c1')), ev('working', 370, custLoc('c1')), ev('done', 300, custLoc('c1')), ev('returning', 295, custLoc('c1')), ev('returned', 270, WORKSHOP), ev('review', 265, WORKSHOP), ev('closed', 200, WORKSHOP)], diagnosis: 'מיסב שחוק במנוע המשאבה.', work: 'הוחלף מיסב, נבדק זרם המנוע. המשאבה שקטה.', signer: 'משה אחראי אחזקה', createdAt: ago(480) }),
    /* איתי כהן */
    base({ id: 4109, customerId: 'c2', equipId: 'q5', kind: 'תקלה', title: 'יט״א לובי לא מתניעה', priority: 'urgent', status: 'assigned', techId: 't2', due: inH(1), desc: 'היחידה לא עולה מהבוקר, הלובי חם. כנראה מגען או פיקוד. רינה מחכה בלובי.', items: [item('e2', 1), item('e1', 1)], createdAt: ago(20) }),
    base({ id: 4110, customerId: 'c6', equipId: 'q11', kind: 'התקנה', title: 'חיבור בקר מרכזי למערכת VRF', priority: 'low', status: 'accepted', techId: 't2', due: at(1, 10, 0), desc: 'חיבור הבקר המרכזי החדש בקבלה ובדיקת תקשורת לכל 36 היחידות.', items: [item('e3', 2)], events: [ev('accepted', 180, WORKSHOP)] }),
    /* רועי ביטון */
    base({ id: 4111, customerId: 'c2', equipId: 'q4', kind: 'תקלה', title: 'יחידת פנים בקומה 3 מטפטפת', priority: 'normal', status: 'assigned', techId: 't3', due: inH(2), desc: 'טפטוף מהתקרה במשרד 304. לבדוק ניקוז ומשאבת עיבוי. אפשר לטפל באותו ביקור של הטיפול.', items: [item('c2', 2)], createdAt: ago(45) }),
    base({ id: 4112, customerId: 'c6', equipId: 'q11', kind: 'טיפול תקופתי', templateId: 'tp3', planId: 'pl11', title: 'VRF אגף חדרים · טיפול חצי שנתי', priority: 'low', status: 'accepted', techId: 't3', partnerId: 'p2', due: at(2, 9, 0), desc: 'טיפול חצי שנתי. לתאם עם גיל, רק בחדרים פנויים.', checklist: checklistFrom('tp3'), items: [item('c2', 12), item('c1', 1)], events: [ev('accepted', 300, WORKSHOP)] }),
    /* יוסי אדרי */
    base({ id: 4113, customerId: 'c3', equipId: 'q6', kind: 'טיפול תקופתי', templateId: 'tp5', planId: 'pl6', title: 'יט״א חדר נקי · טיפול חצי שנתי', priority: 'low', status: 'accepted', techId: 't4', due: at(1, 8, 30), desc: 'החלפת מסננים בחדר הנקי. חובה חלוק וכיסוי נעליים, הציוד ממתין בכניסה.', checklist: checklistFrom('tp5'), items: [item('f1', 6), item('f2', 6), item('p1', 2)], events: [ev('accepted', 240, WORKSHOP)] }),
    base({ id: 4114, customerId: 'c1', equipId: 'q3', kind: 'תקלה', title: 'רעש חריג במדחס חדר הקירור', priority: 'normal', status: 'assigned', techId: 't4', due: inH(4), desc: 'רעש נקישות מהמדחס בלילה. לבדוק תושבות ולחצים.', items: [item('g2', 2)], createdAt: ago(60) }),
    /* אמיר פרץ */
    base({ id: 4115, customerId: 'c4', equipId: 'q8', kind: 'טיפול תקופתי', templateId: 'tp4', planId: 'pl8', title: 'חדר קירור 1 · טיפול רבעוני', priority: 'low', status: 'accepted', techId: 't5', due: at(1, 7, 30), desc: 'טיפול רבעוני. אבי פותח את המתחם ב-7:00.', checklist: checklistFrom('tp4'), items: [item('c1', 1), item('g2', 2)], events: [ev('accepted', 200, WORKSHOP)] }),
    base({ id: 4116, customerId: 'c4', equipId: 'q9', kind: 'טיפול תקופתי', templateId: 'tp4', planId: 'pl9', title: 'חדר קירור 2 · טיפול רבעוני', priority: 'low', status: 'assigned', techId: 't5', due: at(1, 9, 30), desc: 'באותו ביקור של חדר קירור 1.', checklist: checklistFrom('tp4'), items: [item('c1', 1), item('g2', 2)], createdAt: ago(50) })
  );

  const automations = [
    { id: 'au1', on: true, title: 'תזכורת ללקוח לפני טיפול תקופתי', desc: 'מייל 14 יום לפני המועד, עם שם הציוד, סוג הטיפול והמועד המוצע. הלקוח עונה בלחיצה: ״מתאים״ או ״צריך מועד אחר״.' },
    { id: 'au2', on: true, title: 'רואים מי פתח את המייל', desc: 'ליד כל תזכורת מופיע אם המייל נשלח, נפתח או נענה, כדי לדעת למי כדאי להתקשר.' },
    { id: 'au3', on: true, title: 'תזכורת שנייה למי שלא ענה', desc: '5 ימים אחרי הראשונה. מי שלא ענה גם אז מופיע אצלך ברשימה ״מחכה לך״.' },
    { id: 'au4', on: true, title: 'פתיחת קריאה אוטומטית', desc: 'כשהלקוח מאשר מועד, נפתחת קריאה עם הצ׳קליסט ורשימת הפריטים של התבנית. נשאר רק לשבץ טכנאי.' },
    { id: 'au5', on: true, title: 'חידוש חוזה אחזקה', desc: '60 יום לפני סוף החוזה מופיעה התראה במשרד, ואפשר לשלוח ללקוח מייל חידוש בלחיצה.' },
    { id: 'au6', on: true, title: 'התראה במייל כשדוח מגיע מהשטח', desc: 'כשטכנאי שולח דוח, מגיע אלייך מייל עם קישור לקריאה. הקריאה ממתינה לבדיקה שלך לפני סגירה.' },
    { id: 'au7', on: false, title: 'שליחת הדוח ללקוח אוטומטית', desc: 'אחרי שאישרת דוח, הוא נשלח ללקוח במייל כ-PDF בלי מחירים. כבוי עד שתחליטי. בינתיים אפשר לשלוח בלחיצה מתוך הקריאה.' }
  ];

  window.SHAHAR_SEED = function () {
    return JSON.parse(JSON.stringify({
      version: 6, me: 'פולינה', workshop: WORKSHOP,
      techs, catalog, templates, customers, jobs, automations,
      settings: { closeMode: 'review' }, nextJobId: 4118, notices: []
    }));
  };
})();
