(() => {
  const API = 'https://reach.meeting-scheduled.com/api/voice-agreements'
  const token = new URLSearchParams(location.search).get('offer') || ''
  const loading = document.querySelector('#loading')
  const errorBox = document.querySelector('#error')
  const app = document.querySelector('#app')
  let data = null
  let step = 0
  let receipt = null
  let paymentUrl = null
  let state = {
    signerName: '', signerTitle: '', signerEmail: '', signerPhone: '', customerAddress: '', signature: '',
    acceptedTerms: false, acceptedElectronicSignature: false, confirmedAuthority: false, confirmedCommercialTerms: false,
  }

  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))
  const money = cents => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD'}).format((cents || 0) / 100)
  const storageKey = () => `meeting-scheduled:agreement:${data.offer.offerId}`
  const phoneSetup = value => ({forward_existing:'Forward an existing line',provider_number:'MeetingScheduled-provided number',sip_or_other:'SIP or another agreed setup'}[value] || value)

  function fail(message) {
    loading.hidden = true
    app.hidden = true
    errorBox.hidden = false
    errorBox.innerHTML = `<strong>We could not open this agreement.</strong><br><br>${esc(message)}<br><br><a href="mailto:eyal@meeting-scheduled.com">Contact MeetingScheduled</a>`
  }

  function loadSaved() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey()) || 'null')
      if (saved && typeof saved === 'object') state = {...state, ...saved}
    } catch {}
    if (data.offer.customerEmail) state.signerEmail = data.offer.customerEmail
  }

  function save() {
    try { localStorage.setItem(storageKey(), JSON.stringify(state)) } catch {}
  }

  function bindField(id, key, type = 'text') {
    const el = document.querySelector(`#${id}`)
    if (!el) return
    if (type === 'checkbox') el.checked = Boolean(state[key])
    else el.value = state[key] || ''
    el.addEventListener(type === 'checkbox' ? 'change' : 'input', event => {
      state[key] = type === 'checkbox' ? event.target.checked : event.target.value
      save()
      updateButton()
    })
  }

  function valid() {
    if (step === 0) return state.signerName.trim().length > 1 && state.signerTitle.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.signerEmail) && state.signerPhone.trim().length > 4 && state.customerAddress.trim().length > 4
    if (step === 1) return state.acceptedTerms && state.confirmedCommercialTerms
    if (step === 2) return state.confirmedAuthority && state.acceptedElectronicSignature && state.signature.trim().toLowerCase() === state.signerName.trim().toLowerCase()
    return true
  }

  function updateButton() {
    const next = document.querySelector('[data-next]')
    if (next) next.disabled = !valid()
  }

  function summaryHtml() {
    const offer = data.offer
    const values = offer.agreementType === 'trial'
      ? [
          ['Price', `$0 for ${offer.trialLengthDays} days`],
          ['Included use', `${Number(offer.includedMinutes).toLocaleString()} call minutes`],
          ['End of trial', 'Stops automatically; no paid conversion'],
          ['Locations', String(offer.locations)],
        ]
      : [
          ['Setup fee', money(offer.setupFeeCents)],
          ['Monthly fee', money(offer.monthlyFeeCents)],
          ['Included use', `${Number(offer.includedMinutes).toLocaleString()} call minutes`],
          ['Extra use', `${money(offer.overagePerMinuteCents)} per minute`],
          ['Initial term', offer.initialTermMonths === 1 ? 'Month-to-month' : `${offer.initialTermMonths} months`],
          ['Locations', String(offer.locations)],
        ]
    return `<div class="summary">${values.map(([label,value]) => `<div><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('')}</div>`
  }

  function render() {
    document.querySelectorAll('.steps span').forEach((el, index) => {
      el.classList.toggle('active', index === step)
      el.classList.toggle('done', index < step)
    })
    document.querySelectorAll('.card').forEach((el, index) => { el.hidden = index !== step })
    const offer = data.offer

    if (step === 0) {
      document.querySelector('#step-0').innerHTML = `
        <p class="eyebrow">${offer.agreementType === 'trial' ? 'Free trial' : 'Voice agent service'}</p>
        <h1>${esc(data.title)}</h1>
        <p class="lead">Prepared for <strong>${esc(offer.customerLegalName)}</strong>. First, tell us who is signing for the business.</p>
        ${summaryHtml()}
        <div class="form-grid">
          <label class="field"><span>Full legal name</span><input id="signer-name" autocomplete="name"></label>
          <label class="field"><span>Job title</span><input id="signer-title" autocomplete="organization-title"></label>
          <label class="field"><span>Work email</span><input id="signer-email" type="email" autocomplete="email" ${offer.customerEmail ? 'readonly' : ''}>${offer.customerEmail ? '<small>This agreement was prepared for this email address.</small>' : ''}</label>
          <label class="field"><span>Phone number</span><input id="signer-phone" type="tel" autocomplete="tel"></label>
          <label class="field full"><span>Business address</span><textarea id="customer-address" autocomplete="street-address"></textarea></label>
        </div>
        <div class="actions"><span></span><button class="btn btn-primary" data-next>Review agreement →</button></div>`
      bindField('signer-name','signerName'); bindField('signer-title','signerTitle'); bindField('signer-email','signerEmail'); bindField('signer-phone','signerPhone'); bindField('customer-address','customerAddress')
    }

    if (step === 1) {
      document.querySelector('#step-1').innerHTML = `
        <p class="eyebrow">Plain-language agreement</p><h1>Review the terms</h1>
        <p class="lead">The commercial terms are shown first. The full sections below are all part of the agreement.</p>
        ${summaryHtml()}
        <div class="terms" tabindex="0">${data.sections.map(section => `<article class="term"><h3>${esc(section.title)}</h3>${section.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}</article>`).join('')}</div>
        <div class="notice">${offer.agreementType === 'trial' ? `This trial costs $0 and ends automatically after ${offer.trialLengthDays} days. It does not become a paid plan automatically.` : offer.initialTermMonths === 1 ? 'This is month-to-month service. You may cancel at any time, effective at the end of the current paid month.' : `This agreement has a ${offer.initialTermMonths}-month initial commitment, followed by monthly renewal.`}</div>
        <label class="check"><input id="accepted-terms" type="checkbox"> <span>I have read and agree to the full agreement.</span></label>
        <label class="check"><input id="commercial-terms" type="checkbox"> <span>I confirm the pricing, included minutes, extra-minute price, term, and cancellation terms shown above.</span></label>
        <div class="actions"><button class="btn btn-secondary" data-back>← Back</button><button class="btn btn-primary" data-next>Continue to signature →</button></div>`
      bindField('accepted-terms','acceptedTerms','checkbox'); bindField('commercial-terms','confirmedCommercialTerms','checkbox')
    }

    if (step === 2) {
      document.querySelector('#step-2').innerHTML = `
        <p class="eyebrow">Electronic signature</p><h1>Sign and accept</h1>
        <p class="lead">Type the same full legal name you entered earlier. Your signature and acceptance details will be recorded securely.</p>
        <div class="signer-card"><strong>${esc(state.signerName)} · ${esc(state.signerTitle)}</strong><span>${esc(offer.customerLegalName)} · ${esc(state.signerEmail)}</span></div>
        <div class="form-grid"><label class="field full signature"><span>Type your full legal name</span><input id="signature" placeholder="${esc(state.signerName)}"></label></div>
        <label class="check"><input id="authority" type="checkbox"> <span>I confirm that I am authorized to bind ${esc(offer.customerLegalName)}.</span></label>
        <label class="check"><input id="electronic" type="checkbox"> <span>I consent to electronic records and intend my typed name to be my legally binding electronic signature.</span></label>
        <p class="fine">Offer ${esc(offer.offerId)} · Link expires ${esc(offer.expiresOn)} · Phone setup: ${esc(phoneSetup(offer.phoneSetup))}</p>
        <div id="submit-error" class="submit-error"></div>
        <div class="actions"><button class="btn btn-secondary" data-back>← Back</button><button class="btn btn-primary" data-next>Accept & sign</button></div>`
      bindField('signature','signature'); bindField('authority','confirmedAuthority','checkbox'); bindField('electronic','acceptedElectronicSignature','checkbox')
    }

    if (step === 3) {
      const payment = paymentUrl ? `<a class="btn btn-primary" href="${esc(paymentUrl)}">Continue to payment →</a>` : ''
      document.querySelector('#step-3').innerHTML = `
        <div class="complete"><div class="seal">✓</div><p class="eyebrow">Agreement complete</p><h1>Signed successfully</h1>
        <p class="lead" style="margin-left:auto;margin-right:auto">Your acceptance was recorded on ${esc(new Date(receipt.acceptedAt).toLocaleString())}.</p>
        <div class="receipt"><div><span>Acceptance ID</span><strong>${esc(receipt.acceptanceId)}</strong></div><div><span>Agreement</span><strong>${esc(data.title)}</strong></div><div><span>Signer</span><strong>${esc(receipt.signer.name)}</strong></div><div><span>Record hash</span><strong>${esc(receipt.agreementHash)}</strong></div></div>
        <div class="actions"><button class="btn btn-secondary" id="download">Download copy</button>${payment}</div></div>`
      document.querySelector('#download').addEventListener('click', download)
      try { localStorage.removeItem(storageKey()) } catch {}
    }

    document.querySelector('[data-back]')?.addEventListener('click', () => { step -= 1; render(); scrollTo({top:0,behavior:'smooth'}) })
    document.querySelector('[data-next]')?.addEventListener('click', async event => {
      if (!valid()) return
      if (step < 2) { step += 1; render(); scrollTo({top:0,behavior:'smooth'}); return }
      await submit(event.currentTarget)
    })
    updateButton()
  }

  async function submit(button) {
    button.disabled = true
    button.textContent = 'Saving signature…'
    document.querySelector('#submit-error').textContent = ''
    try {
      const response = await fetch(`${API}/accept`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({offerToken:token,...state})})
      const result = await response.json()
      if (!response.ok || !result.receipt) throw new Error(result.error || 'Could not save the signature')
      receipt = result.receipt
      paymentUrl = result.paymentUrl
      step = 3
      render()
      scrollTo({top:0,behavior:'smooth'})
    } catch (error) {
      document.querySelector('#submit-error').textContent = error.message || 'Could not save the signature. Please try again.'
      button.disabled = false
      button.textContent = 'Accept & sign'
    }
  }

  function download() {
    const content = `${data.agreementText}\n\nACCEPTANCE\nAcceptance ID: ${receipt.acceptanceId}\nAccepted at: ${receipt.acceptedAt}\nSigner: ${receipt.signer.name}\nTitle: ${receipt.signer.title}\nEmail: ${receipt.signer.email}\nElectronic signature: ${receipt.signer.signature}\nAgreement hash: ${receipt.agreementHash}\n`
    const url = URL.createObjectURL(new Blob([content], {type:'text/plain;charset=utf-8'}))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `MeetingScheduled-agreement-${data.offer.offerId}.txt`; anchor.click(); URL.revokeObjectURL(url)
  }

  async function init() {
    if (token.length < 40) return fail('This link is incomplete. Please ask Eyal Taieb for a new agreement link.')
    try {
      const response = await fetch(`${API}/offer?offer=${encodeURIComponent(token)}`)
      const result = await response.json()
      if (!response.ok || !result.offer) throw new Error(result.error || 'Invalid agreement link')
      data = result
      loadSaved()
      loading.hidden = true
      app.hidden = false
      render()
    } catch (error) { fail(error.message || 'This agreement link is unavailable.') }
  }

  init()
})()
