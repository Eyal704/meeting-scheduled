(() => {
  'use strict'

  const API_BASE = 'https://reach.meeting-scheduled.com/api/admin/call-recordings'
  const state = { numbers: [], recordings: [], selected: null, activeAudio: null }
  const els = {
    numberList: document.querySelector('#numberList'),
    numberCount: document.querySelector('#numberCount'),
    recordingList: document.querySelector('#recordingList'),
    recordingCount: document.querySelector('#recordingCount'),
    recordingCountLabel: document.querySelector('#recordingCountLabel'),
    selectedNumber: document.querySelector('#selectedNumber'),
    selectedFlag: document.querySelector('#selectedFlag'),
    search: document.querySelector('#searchInput'),
    range: document.querySelector('#rangeSelect'),
    refresh: document.querySelector('#refreshButton'),
    limitNotice: document.querySelector('#limitNotice'),
    template: document.querySelector('#recordingTemplate'),
  }

  const fetchWithRetry = async (url, options, attempts = 3) => {
    let response
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      try {
        response = await fetch(url, options)
        if (response.ok || response.status < 500 || attempt === attempts - 1) return response
      } catch (error) {
        if (attempt === attempts - 1) throw error
      }
      await new Promise((resolve) => setTimeout(resolve, 450 * (attempt + 1)))
    }
    return response
  }

  const api = async (path = '') => {
    const response = await fetchWithRetry(`${API_BASE}${path}`, { credentials: 'include', cache: 'no-store' })
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

  const safeFilePart = (value) => String(value || 'call').replace(/[^a-z0-9+_-]+/gi, '-').replace(/^-|-$/g, '')

  const saveBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const fetchAudioBlob = async (recordingSid) => {
    const response = await fetchWithRetry(`${API_BASE}/audio?recordingSid=${encodeURIComponent(recordingSid)}`, { credentials: 'include', cache: 'no-store' })
    if (!response.ok) throw new Error('audio_failed')
    return response.blob()
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

  const digitsOf = (value) => String(value || '').replace(/\D+/g, '')

  // Callers get typed the way people say them — 0660 111 2223 or 054-123-0000 —
  // while Twilio stores +436601112223 and +972541230000. Compare on digits, and
  // drop the national trunk prefix so a local-format search still matches.
  const searchDigits = (value) => digitsOf(value).replace(/^0+/, '')

  const filteredRecordings = () => {
    const query = els.search.value.trim().toLowerCase()
    if (!query) return state.recordings
    const queryDigits = searchDigits(query)
    return state.recordings.filter((item) => {
      const remote = String(item.remoteNumber || '')
      if (remote.toLowerCase().includes(query)) return true
      return queryDigits.length >= 3 && digitsOf(remote).includes(queryDigits)
    })
  }

  const stopActiveAudio = () => {
    if (!state.activeAudio) return
    state.activeAudio.audio.pause()
    state.activeAudio.button.classList.remove('playing')
    state.activeAudio = null
  }

  const wireAudio = (row, item) => {
    const button = row.querySelector('.play-button')
    const track = row.querySelector('.audio-track')
    const time = row.querySelector('.audio-time')
    const fallbackDuration = Math.max(0, Number(item.duration) || 0)
    let audio = null
    let audioPromise = null
    let isSeeking = false

    const knownDuration = () => {
      if (audio && Number.isFinite(audio.duration) && audio.duration > 0) return audio.duration
      return fallbackDuration
    }

    const renderPosition = (seconds) => {
      const duration = knownDuration()
      const position = Math.min(Math.max(0, Number(seconds) || 0), duration || 0)
      const ratio = duration ? position / duration : 0
      track.max = String(duration || 1)
      track.value = String(position)
      track.style.setProperty('--progress', `${ratio * 100}%`)
      track.setAttribute('aria-valuetext', `${formatDuration(Math.floor(position))} of ${formatDuration(Math.floor(duration))}`)
      time.textContent = `${formatDuration(Math.floor(position))} / ${formatDuration(Math.floor(duration))}`
    }

    const setAudioPosition = (loadedAudio, seconds) => {
      const applyPosition = () => {
        loadedAudio.currentTime = Math.min(Math.max(0, seconds), knownDuration())
        renderPosition(loadedAudio.currentTime)
      }
      if (loadedAudio.readyState >= 1) applyPosition()
      else loadedAudio.addEventListener('loadedmetadata', applyPosition, { once: true })
    }

    const loadAudio = async () => {
      if (audio) return audio
      if (audioPromise) return audioPromise

      audioPromise = (async () => {
        button.disabled = true
        track.disabled = true
        try {
          const loadedAudio = new Audio(URL.createObjectURL(await fetchAudioBlob(item.recordingSid)))
          loadedAudio.preload = 'metadata'
          loadedAudio.addEventListener('loadedmetadata', () => renderPosition(loadedAudio.currentTime))
          loadedAudio.addEventListener('durationchange', () => renderPosition(loadedAudio.currentTime))
          loadedAudio.addEventListener('timeupdate', () => {
            if (!isSeeking) renderPosition(loadedAudio.currentTime)
          })
          loadedAudio.addEventListener('ended', () => {
            button.classList.remove('playing')
            state.activeAudio = null
            loadedAudio.currentTime = 0
            renderPosition(0)
          })
          audio = loadedAudio
          return loadedAudio
        } catch (error) {
          time.textContent = 'Unavailable'
          track.disabled = true
          throw error
        } finally {
          button.disabled = false
          if (audio) track.disabled = false
        }
      })()

      try {
        return await audioPromise
      } finally {
        audioPromise = null
      }
    }

    renderPosition(0)

    track.addEventListener('pointerdown', () => { isSeeking = true })
    track.addEventListener('pointercancel', () => { isSeeking = false })
    track.addEventListener('input', () => {
      const target = Number(track.value)
      renderPosition(target)
      if (audio) setAudioPosition(audio, target)
    })
    track.addEventListener('change', async () => {
      const target = Number(track.value)
      try {
        const loadedAudio = await loadAudio()
        setAudioPosition(loadedAudio, target)
      } catch {
        // loadAudio already presents the unavailable state.
      } finally {
        isSeeking = false
      }
    })

    button.addEventListener('click', async () => {
      try {
        const loadedAudio = await loadAudio()
        if (!loadedAudio.paused) {
          loadedAudio.pause()
          button.classList.remove('playing')
          state.activeAudio = null
          return
        }
        stopActiveAudio()
        await loadedAudio.play()
        button.classList.add('playing')
        state.activeAudio = { audio: loadedAudio, button }
      } catch {
        // loadAudio presents fetch errors; play() failures leave the row paused.
      }
    })
  }

  const wireDownload = (row, item) => {
    const button = row.querySelector('.download-button')
    const label = button.querySelector('span')
    button.addEventListener('click', async () => {
      button.disabled = true
      button.classList.add('loading')
      label.textContent = 'Preparing…'
      try {
        const blob = await fetchAudioBlob(item.recordingSid)
        const extension = blob.type.includes('wav') ? 'wav' : 'mp3'
        const day = new Date(item.createdAt).toISOString().slice(0, 10)
        saveBlob(blob, `${day}-${safeFilePart(item.remoteNumber)}-${safeFilePart(item.recordingSid)}.${extension}`)
        label.textContent = 'Downloaded'
      } catch {
        label.textContent = 'Try again'
      } finally {
        button.disabled = false
        button.classList.remove('loading')
        setTimeout(() => { label.textContent = 'Download' }, 1800)
      }
    })
  }

  const wireTranscript = (row, item) => {
    const button = row.querySelector('.transcript-button')
    const panel = row.querySelector('.transcript-panel')
    const output = panel.querySelector('p')
    const copyButton = panel.querySelector('.copy-transcript-button')
    const downloadButton = panel.querySelector('.download-transcript-button')
    const cacheKey = `ms-recording-transcript:${item.recordingSid}`
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(output.textContent)
        copyButton.textContent = 'Copied'
      } catch {
        copyButton.textContent = 'Copy failed'
      }
      setTimeout(() => { copyButton.textContent = 'Copy' }, 1600)
    })
    downloadButton.addEventListener('click', () => {
      const day = new Date(item.createdAt).toISOString().slice(0, 10)
      saveBlob(new Blob([output.textContent], { type: 'text/plain;charset=utf-8' }), `${day}-${safeFilePart(item.remoteNumber)}-transcript.txt`)
    })
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

  // Twilio still stitching a just-ended call has no playable media yet, so the
  // row is shown as pending rather than dropped — an absent row reads as a lost
  // recording.
  const markPending = (row) => {
    row.classList.add('pending')
    row.querySelectorAll('button, input').forEach((control) => { control.disabled = true })
    row.querySelector('.audio-time').textContent = 'Processing'
    row.querySelector('.direction-label').textContent += ' · recording still processing'
  }

  const renderRecordings = () => {
    stopActiveAudio()
    const recordings = filteredRecordings()
    const total = state.recordings.length
    els.recordingCount.textContent = String(recordings.length)
    els.recordingCountLabel.textContent = recordings.length === total
      ? 'recordings in view'
      : `of ${total} recordings`
    els.recordingList.innerHTML = ''
    if (!recordings.length) {
      emptyState(
        total ? 'No matching caller' : 'No recordings found',
        total ? `Clear the search box to see all ${total} recordings for this number.` : 'Try a wider date range or refresh the page.',
      )
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
      if (item.ready === false) {
        markPending(row)
      } else {
        wireAudio(row, item)
        wireTranscript(row, item)
        wireDownload(row, item)
      }
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
    els.recordingCountLabel.textContent = 'recordings in view'
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
