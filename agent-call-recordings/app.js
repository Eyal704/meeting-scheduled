(() => {
  'use strict'

  const API_BASE = 'https://reach.meeting-scheduled.com/api/admin/call-recordings'
  const state = { numbers: [], recordings: [], selected: null, activeAudio: null }
  const els = {
    numberList: document.querySelector('#numberList'),
    numberCount: document.querySelector('#numberCount'),
    recordingList: document.querySelector('#recordingList'),
    recordingCount: document.querySelector('#recordingCount'),
    selectedNumber: document.querySelector('#selectedNumber'),
    selectedFlag: document.querySelector('#selectedFlag'),
    search: document.querySelector('#searchInput'),
    range: document.querySelector('#rangeSelect'),
    refresh: document.querySelector('#refreshButton'),
    limitNotice: document.querySelector('#limitNotice'),
    template: document.querySelector('#recordingTemplate'),
  }

  const api = async (path = '') => {
    const response = await fetch(`${API_BASE}${path}`, { credentials: 'include', cache: 'no-store' })
    const body = await response.json().catch(() => ({}))
    if (!response.ok) throw Object.assign(new Error(body.error || 'request_failed'), { status: response.status })
    return body
  }

  const flagFor = (number) => {
    if (number.startsWith('+43')) return '🇦🇹'
    if (number.startsWith('+972')) return '🇮🇱'
    if (number.startsWith('+1')) return '🇺🇸'
    if (number.startsWith('+44')) return '🇬🇧'
    if (number.startsWith('+49')) return '🇩🇪'
    return '🌐'
  }

  const formatDuration = (seconds) => {
    const value = Math.max(0, Number(seconds) || 0)
    return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`
  }

  const formatDate = (iso) => {
    const value = new Date(iso)
    return {
      day: new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(value),
      time: new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(value),
    }
  }

  const emptyState = (title, copy, error = false) => {
    els.recordingList.innerHTML = `
      <div class="empty-state ${error ? 'error-state' : ''}">
        <div class="empty-icon"><svg viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.3 3.8 2.5 18a2 2 0 0 0 1.75 3h15.5a2 2 0 0 0 1.75-3L13.7 3.8a2 2 0 0 0-3.4 0Z"/></svg></div>
        <h3>${title}</h3><p>${copy}</p>
        ${error ? '<a class="login-link" href="https://reach.meeting-scheduled.com/login?next=/admin" target="_blank" rel="noopener">Sign in to Reach</a>' : ''}
      </div>`
  }

  const renderNumbers = () => {
    els.numberCount.textContent = String(state.numbers.length)
    els.numberList.innerHTML = ''
    state.numbers.forEach((item) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = `number-button${state.selected?.number === item.number ? ' active' : ''}`
      button.innerHTML = `<span class="flag">${flagFor(item.number)}</span><span class="number-meta"><strong></strong><small></small></span>`
      button.querySelector('strong').textContent = item.label
      button.querySelector('small').textContent = `${item.number} · ${item.kind === 'purchased' ? 'Twilio number' : 'Verified caller ID'}`
      button.addEventListener('click', () => selectNumber(item))
      els.numberList.appendChild(button)
    })
  }

  const filteredRecordings = () => {
    const query = els.search.value.trim().toLowerCase()
    return query ? state.recordings.filter((item) => item.remoteNumber.toLowerCase().includes(query)) : state.recordings
  }

  const stopActiveAudio = () => {
    if (!state.activeAudio) return
    state.activeAudio.audio.pause()
    state.activeAudio.button.classList.remove('playing')
    state.activeAudio = null
  }

  const wireAudio = (row, item) => {
    const button = row.querySelector('.play-button')
    const progress = row.querySelector('.audio-track span')
    const time = row.querySelector('.audio-time')
    let audio = null
    button.addEventListener('click', async () => {
      if (!audio) {
        button.disabled = true
        try {
          const response = await fetch(`${API_BASE}/audio?recordingSid=${encodeURIComponent(item.recordingSid)}`, { credentials: 'include' })
          if (!response.ok) throw new Error('audio_failed')
          audio = new Audio(URL.createObjectURL(await response.blob()))
          audio.addEventListener('timeupdate', () => {
            const ratio = audio.duration ? audio.currentTime / audio.duration : 0
            progress.style.width = `${ratio * 100}%`
            time.textContent = formatDuration(Math.floor(audio.currentTime))
          })
          audio.addEventListener('ended', () => {
            button.classList.remove('playing'); progress.style.width = '0'; time.textContent = '0:00'; state.activeAudio = null
          })
        } catch {
          time.textContent = 'Unavailable'
          return
        } finally { button.disabled = false }
      }
      if (audio.paused) {
        stopActiveAudio()
        await audio.play()
        button.classList.add('playing')
        state.activeAudio = { audio, button }
      } else {
        audio.pause(); button.classList.remove('playing'); state.activeAudio = null
      }
    })
  }

  const wireTranscript = (row, item) => {
    const button = row.querySelector('.transcript-button')
    const panel = row.querySelector('.transcript-panel')
    const output = panel.querySelector('p')
    const cacheKey = `ms-recording-transcript:${item.recordingSid}`
    button.addEventListener('click', async () => {
      if (!panel.classList.contains('hidden')) { panel.classList.add('hidden'); return }
      const cached = localStorage.getItem(cacheKey)
      if (cached) { output.textContent = cached; panel.classList.remove('hidden'); return }
      button.classList.add('loading'); button.disabled = true; button.querySelector('span').textContent = 'Generating…'
      try {
        const result = await api(`/transcript?recordingSid=${encodeURIComponent(item.recordingSid)}`)
        output.textContent = result.text || 'No speech was detected in this recording.'
        localStorage.setItem(cacheKey, output.textContent)
        panel.classList.remove('hidden')
        button.querySelector('span').textContent = 'Transcript'
      } catch (error) {
        output.textContent = error.message === 'transcription_not_configured'
          ? 'Transcription is not configured yet. Add GROQ_API_KEY to the Reach environment.'
          : 'The transcript could not be generated. Please try again.'
        panel.classList.remove('hidden')
        button.querySelector('span').textContent = 'Try again'
      } finally { button.classList.remove('loading'); button.disabled = false }
    })
  }

  const renderRecordings = () => {
    stopActiveAudio()
    const recordings = filteredRecordings()
    els.recordingCount.textContent = String(recordings.length)
    els.recordingList.innerHTML = ''
    if (!recordings.length) {
      emptyState(state.recordings.length ? 'No matching caller' : 'No recordings found', state.recordings.length ? 'Try a different phone number.' : 'Try a wider date range or refresh the page.')
      return
    }
    recordings.forEach((item) => {
      const row = els.template.content.firstElementChild.cloneNode(true)
      row.classList.add(item.direction)
      row.querySelector('.remote-number').textContent = item.remoteNumber
      row.querySelector('.direction-label').textContent = item.direction === 'inbound' ? 'Incoming call' : 'Outgoing call'
      const date = formatDate(item.createdAt)
      row.querySelector('.date-cell strong').textContent = date.day
      row.querySelector('.date-cell small').textContent = date.time
      row.querySelector('.duration-cell').textContent = formatDuration(item.duration)
      row.querySelector('.audio-time').textContent = formatDuration(item.duration)
      wireAudio(row, item)
      wireTranscript(row, item)
      els.recordingList.appendChild(row)
    })
  }

  const selectNumber = async (item, force = false) => {
    if (!force && state.selected?.number === item.number) return
    state.selected = item
    renderNumbers()
    els.selectedNumber.textContent = item.number
    els.selectedFlag.textContent = flagFor(item.number)
    els.recordingCount.textContent = '—'
    els.limitNotice.classList.add('hidden')
    els.recordingList.innerHTML = '<div class="empty-state"><div class="number-skeleton" style="width:80%;max-width:560px"></div><p>Loading Twilio recordings…</p></div>'
    try {
      const data = await api(`?number=${encodeURIComponent(item.number)}&range=${encodeURIComponent(els.range.value)}`)
      state.recordings = data.recordings || []
      els.limitNotice.classList.toggle('hidden', !data.truncated)
      renderRecordings()
    } catch (error) {
      emptyState('Could not load recordings', error.status === 401 ? 'Sign in with an admin account in Reach, then refresh this page.' : 'Twilio could not return this number’s recordings. Please try again.', error.status === 401)
    }
  }

  const loadNumbers = async () => {
    els.refresh.classList.add('loading')
    try {
      const data = await api()
      state.numbers = data.numbers || []
      renderNumbers()
      if (!state.numbers.length) emptyState('No phone numbers found', 'Add a Twilio phone number or verified caller ID to this account.')
      else await selectNumber(state.numbers[0])
    } catch (error) {
      els.numberList.innerHTML = '<p style="padding:12px;color:#9a9aa0;font-size:11px;line-height:1.6">Admin session required.</p>'
      els.numberCount.textContent = '0'
      emptyState('Connect your admin session', 'Sign in with an admin account in Reach, then return here and refresh.', true)
    } finally { els.refresh.classList.remove('loading') }
  }

  els.search.addEventListener('input', renderRecordings)
  els.range.addEventListener('change', () => state.selected && selectNumber(state.selected, true))
  els.refresh.addEventListener('click', () => state.selected ? selectNumber(state.selected, true) : loadNumbers())
  loadNumbers()
})()
