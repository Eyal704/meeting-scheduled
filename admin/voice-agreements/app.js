(() => {
  const API = 'https://reach.meeting-scheduled.com/api/admin/voice-agreements/link'
  const HISTORY_KEY = 'meeting-scheduled:voice-agreement-history:main-site:v1'
  const form = document.querySelector('#builder')
  const trialFields = document.querySelector('#trial-fields')
  const serviceFields = document.querySelector('#service-fields')
  const resultBox = document.querySelector('#result')
  const errorBox = document.querySelector('#form-error')
  const recentPanel = document.querySelector('#recent-panel')
  const recentBox = document.querySelector('#recent')
  const packages = {
    essential: { name: 'Essential', includedMinutes: 100, monthlyFeeDollars: 119, overagePerMinuteDollars: 0.99 },
    growth: { name: 'Growth', includedMinutes: 300, monthlyFeeDollars: 269, overagePerMinuteDollars: 0.79 },
    scale: { name: 'Scale', includedMinutes: 500, monthlyFeeDollars: 399, overagePerMinuteDollars: 0.69 },
  }
  let paidTerms = { ...packages.essential, setupFeeDollars: 0 }
  let recent = []

  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))
  const cents = dollars => Math.max(0, Math.round((Number(dollars) || 0) * 100))
  const value = name => form.elements[name].value
  const number = name => Number(value(name))
  const type = () => form.elements.freeTrial.checked ? 'trial' : 'service'

  function today() { return new Date().toISOString().slice(0,10) }
  function expiry() { const date = new Date(); date.setDate(date.getDate()+30); return date.toISOString().slice(0,10) }

  function updateMode() {
    const trial = type() === 'trial'
    trialFields.hidden = !trial
    serviceFields.hidden = trial
    updateSummary()
  }

  function matchingPackage() {
    return Object.values(packages).find(plan =>
      number('includedMinutes') === plan.includedMinutes &&
      number('monthlyFeeDollars') === plan.monthlyFeeDollars &&
      number('overagePerMinuteDollars') === plan.overagePerMinuteDollars
    )
  }

  function updatePackageSelection() {
    const selected = matchingPackage()
    document.querySelectorAll('[data-package]').forEach(button => {
      button.classList.toggle('selected', button.dataset.package === selected?.name.toLowerCase())
    })
  }

  function applyPackage(id) {
    const plan = packages[id]
    paidTerms = { ...plan, setupFeeDollars: 0 }
    form.elements.includedMinutes.value = plan.includedMinutes
    form.elements.setupFeeDollars.value = 0
    form.elements.monthlyFeeDollars.value = plan.monthlyFeeDollars
    form.elements.overagePerMinuteDollars.value = plan.overagePerMinuteDollars
    updatePackageSelection()
    updateSummary()
  }

  function setFreeTrial(enabled) {
    if (enabled) {
      paidTerms = {
        includedMinutes: number('includedMinutes'),
        setupFeeDollars: number('setupFeeDollars'),
        monthlyFeeDollars: number('monthlyFeeDollars'),
        overagePerMinuteDollars: number('overagePerMinuteDollars'),
      }
      form.elements.includedMinutes.value = 100
    } else {
      form.elements.includedMinutes.value = paidTerms.includedMinutes
      form.elements.setupFeeDollars.value = paidTerms.setupFeeDollars
      form.elements.monthlyFeeDollars.value = paidTerms.monthlyFeeDollars
      form.elements.overagePerMinuteDollars.value = paidTerms.overagePerMinuteDollars
      updatePackageSelection()
    }
    updateMode()
  }

  function updateSummary() {
    const name = value('customerLegalName').trim() || 'New client'
    document.querySelector('#summary-client').textContent = name
    const selected = matchingPackage()
    document.querySelector('#summary-line').textContent = type() === 'trial'
      ? `30-day free trial · 100 included minutes · no auto-conversion`
      : `${selected ? `${selected.name} · ` : 'Custom · '}$${(number('monthlyFeeDollars') || 0).toFixed(2)}/month · ${(number('includedMinutes') || 0).toLocaleString()} minutes · ${number('initialTermMonths') === 1 ? 'month-to-month' : `${number('initialTermMonths')}-month initial term`}`
  }

  function payload() {
    const trial = type() === 'trial'
    return {
      agreementType: type(),
      providerLegalName: value('providerLegalName').trim(), providerEmail: value('providerEmail').trim(),
      customerLegalName: value('customerLegalName').trim(), customerEmail: value('customerEmail').trim(),
      issuedOn: today(), expiresOn: expiry(), activationDate: value('activationDate'),
      agentPurpose: value('agentPurpose').trim(), locations: number('locations'), phoneSetup: value('phoneSetup'),
      businessPhone: value('businessPhone').trim(), coverage: value('coverage').trim(), includedMinutes: number('includedMinutes'),
      trialLengthDays: number('trialLengthDays') || 30, initialTermMonths: number('initialTermMonths') || 1,
      dataRetentionDays: number('dataRetentionDays'), setupFeeCents: trial ? 0 : cents(number('setupFeeDollars')),
      monthlyFeeCents: trial ? 0 : cents(number('monthlyFeeDollars')), overagePerMinuteCents: trial ? 0 : cents(number('overagePerMinuteDollars')),
      paymentUrl: value('paymentUrl').trim() || undefined, governingLaw: value('governingLaw').trim(), venue: value('venue').trim(),
    }
  }

  function mailto(record) {
    const subject = `${record.agreementType === 'trial' ? 'Your voice-agent trial agreement' : 'Your voice-agent service agreement'} — ${record.customer}`
    const body = `Hi ${record.customer},\n\nHere is your personalized voice-agent agreement. Please review and sign it using this secure link:\n${record.url}\n\nBest,\nEyal Taieb\nMeetingScheduled`
    return `mailto:${encodeURIComponent(record.email || '')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  async function copy(url, button) {
    await navigator.clipboard.writeText(url)
    const old = button.textContent; button.textContent = 'Copied'; setTimeout(() => { button.textContent = old }, 1500)
  }

  function saveRecent() {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(recent.slice(0,25))) } catch {}
    renderRecent()
  }

  function renderRecent() {
    recentPanel.hidden = !recent.length
    recentBox.innerHTML = recent.map((record,index) => `<article class="recent-item"><h3>${esc(record.customer)} · ${record.agreementType === 'trial' ? 'Trial' : 'Paid'}</h3><p>Created ${esc(new Date(record.createdAt).toLocaleString())}${record.email ? ` · ${esc(record.email)}` : ''}</p><button type="button" class="button secondary" data-copy="${index}">Copy</button><a class="button secondary" href="${esc(record.url)}" target="_blank" rel="noreferrer">Open</a>${record.email ? `<a class="button secondary" href="${esc(mailto(record))}">Email</a>` : ''}</article>`).join('')
    recentBox.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', () => copy(recent[Number(button.dataset.copy)].url, button)))
  }

  function showResult(record) {
    resultBox.hidden = false
    resultBox.innerHTML = `<h2>Private signing link ready</h2><p>This link is fixed to the terms you entered. Create a new link if anything changes.</p><div class="url">${esc(record.url)}</div><div class="actions"><button type="button" class="button primary" id="copy-result">Copy link</button><a class="button secondary" href="${esc(record.url)}" target="_blank" rel="noreferrer">Open</a>${record.email ? `<a class="button secondary" href="${esc(mailto(record))}">Send by email</a>` : ''}</div>`
    document.querySelector('#copy-result').addEventListener('click', event => copy(record.url,event.currentTarget))
    resultBox.scrollIntoView({behavior:'smooth',block:'center'})
  }

  form.addEventListener('submit', async event => {
    event.preventDefault()
    if (!form.reportValidity()) return
    const button = form.querySelector('.generate')
    button.disabled = true; button.textContent = 'Generating…'; errorBox.hidden = true; resultBox.hidden = true
    try {
      const response = await fetch(API,{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload())})
      const body = await response.json()
      if (!response.ok || !body.url) throw new Error(body.error || 'Could not generate the agreement link')
      const record = {offerId:body.offerId,url:body.url,createdAt:new Date().toISOString(),agreementType:type(),customer:value('customerLegalName').trim(),email:value('customerEmail').trim()}
      recent = [record,...recent.filter(item => item.offerId !== record.offerId)].slice(0,25)
      saveRecent(); showResult(record)
    } catch (error) {
      errorBox.hidden = false
      errorBox.innerHTML = `${esc(error.message || 'Could not generate the link.')} If you are not signed in, <a href="https://reach.meeting-scheduled.com/admin" target="_blank" rel="noreferrer">sign in to Reach</a>, complete MFA, and try again.`
    } finally { button.disabled = false; button.textContent = 'Generate private agreement link' }
  })

  form.elements.freeTrial.addEventListener('change', event => setFreeTrial(event.target.checked))
  document.querySelectorAll('[data-package]').forEach(button => button.addEventListener('click', () => applyPackage(button.dataset.package)))
  form.addEventListener('input', () => { updatePackageSelection(); updateSummary() })
  document.querySelector('#new-client').addEventListener('click', () => {
    const provider = value('providerLegalName'), email = value('providerEmail'), law = value('governingLaw'), venue = value('venue')
    form.reset(); form.elements.activationDate.value = today(); form.elements.providerLegalName.value = provider; form.elements.providerEmail.value = email; form.elements.governingLaw.value = law; form.elements.venue.value = venue
    paidTerms = { ...packages.essential, setupFeeDollars: 0 }
    resultBox.hidden = true; errorBox.hidden = true; updatePackageSelection(); updateMode(); scrollTo({top:0,behavior:'smooth'})
  })

  form.elements.activationDate.value = today()
  try { recent = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { recent = [] }
  renderRecent(); updatePackageSelection(); updateMode()
})()
