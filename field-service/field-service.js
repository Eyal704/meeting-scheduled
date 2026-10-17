(function () {
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // "How it works" tabs: click or arrow keys switch the step.
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  if (!tabs.length) return;
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(tab, false); });
    tab.addEventListener('keydown', function (e) {
      var rtl = document.documentElement.dir === 'rtl';
      var step = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[e.key];
      if (step) { e.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length], true); }
      if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
      if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
    });
  });
})();

// "Send me one form": upload straight to private storage, then file the lead.
(function () {
  var form = document.getElementById('form-upload');
  if (!form) return;
  var done = document.getElementById('form-upload-done');
  var lang = form.getAttribute('data-lang') === 'he' ? 'he' : 'en';
  var T = {
    en: {
      preparing: 'Preparing your files…', uploading: 'Uploading file {i} of {n}…', finishing: 'Almost done…',
      remove: 'Remove', send: 'Send my form', sending: 'Sending…',
      errors: {
        invalid_email: 'Please enter a valid email so I can send you the example.',
        missing_file: 'Please add a photo or PDF of your form.',
        too_many_files: 'You can add up to 3 files.',
        file_too_large: 'That file is over 20 MB. A phone photo of the form works well.',
        bad_file_type: 'Please add a photo or a PDF.',
        invalid_phone: 'That phone number looks incomplete.',
        rate_limited: 'Too many tries in a short time. Please try again in an hour, or email it to eyal@meeting-scheduled.com.',
        server_error: 'Something went wrong while sending. Please try again, or email it to eyal@meeting-scheduled.com.'
      }
    },
    he: {
      preparing: 'מכין את הקבצים…', uploading: 'מעלה קובץ {i} מתוך {n}…', finishing: 'כמעט סיימנו…',
      remove: 'הסרה', send: 'שליחת הטופס', sending: 'שולח…',
      errors: {
        invalid_email: 'נא להזין כתובת אימייל תקינה, כדי שאוכל לשלוח לכם את הדוגמה.',
        missing_file: 'נא להוסיף צילום או PDF של הטופס.',
        too_many_files: 'אפשר לצרף עד 3 קבצים.',
        file_too_large: 'הקובץ גדול מ-20MB. צילום של הטופס מהטלפון יספיק.',
        bad_file_type: 'אפשר להעלות רק תמונה או PDF.',
        invalid_phone: 'מספר הטלפון לא נראה מלא.',
        rate_limited: 'היו יותר מדי ניסיונות. נסו שוב בעוד שעה, או שלחו לי בוואטסאפ.',
        server_error: 'משהו השתבש בשליחה. נסו שוב, או שלחו לי בוואטסאפ.'
      }
    }
  }[lang];

  var API = 'https://reach.meeting-scheduled.com';
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
    var m = /[?&]api=([^&]+)/.exec(location.search);
    API = m ? decodeURIComponent(m[1]) : 'http://localhost:3000';
  }

  var MAX_FILES = 3, MAX_BYTES = 20 * 1024 * 1024, SHRINK_OVER = 2.5 * 1024 * 1024;
  var input = form.querySelector('input[type=file]');
  var drop = form.querySelector('.fu-drop');
  var list = form.querySelector('.fu-list');
  var status = form.querySelector('.fu-status');
  var button = form.querySelector('button[type=submit]');
  var email = form.elements.email;
  var step2 = form.querySelector('.fu-step2');
  var files = [];
  function val(name) { var el = form.elements[name]; return el ? el.value : ''; }

  function say(text, isError) {
    status.textContent = text || '';
    status.classList.toggle('err', !!isError);
  }
  function size(b) { return b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
  function okType(f) { return f.type === 'application/pdf' || /^image\//.test(f.type); }

  function render() {
    list.innerHTML = '';
    files.forEach(function (f, i) {
      var li = document.createElement('li');
      var n = document.createElement('span'); n.className = 'n'; n.textContent = f.name;
      var s = document.createElement('span'); s.className = 's'; s.textContent = size(f.size);
      var x = document.createElement('button'); x.type = 'button'; x.textContent = '×';
      x.setAttribute('aria-label', T.remove + ' ' + f.name);
      x.addEventListener('click', function () { files.splice(i, 1); render(); });
      li.appendChild(n); li.appendChild(s); li.appendChild(x);
      list.appendChild(li);
    });
    // Step 2 (where to send the example) only appears once a form is picked.
    if (step2) step2.hidden = files.length === 0;
  }

  function add(picked) {
    say('');
    Array.prototype.forEach.call(picked || [], function (f) {
      if (!okType(f)) return say(T.errors.bad_file_type, true);
      if (files.length >= MAX_FILES) return say(T.errors.too_many_files, true);
      files.push(f);
    });
    var opened = step2 && step2.hidden;
    input.value = '';
    render();
    if (opened && files.length) email.focus();
  }

  input.addEventListener('change', function () { add(input.files); });
  ['dragenter', 'dragover'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('drag'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    drop.addEventListener(ev, function () { drop.classList.remove('drag'); });
  });
  drop.addEventListener('drop', function (e) { e.preventDefault(); add(e.dataTransfer && e.dataTransfer.files); });

  // Phone photos are often 3–8 MB; shrink them so the upload is quick on site.
  // Anything the browser cannot decode (e.g. HEIC outside Safari) goes as is.
  function shrink(file) {
    if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(file.type) || file.size <= SHRINK_OVER || !window.createImageBitmap) {
      return Promise.resolve(file);
    }
    return createImageBitmap(file).then(function (bmp) {
      var k = Math.min(1, 2400 / Math.max(bmp.width, bmp.height));
      var c = document.createElement('canvas');
      c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
      c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
      return new Promise(function (resolve) {
        c.toBlob(function (blob) {
          if (!blob || blob.size >= file.size) return resolve(file);
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.85);
      });
    }).catch(function () { return file; });
  }

  function post(body) {
    return fetch(API + '/api/field-service-forms', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok || !j.ok) throw new Error(j.error || 'server_error');
        return j;
      });
    });
  }

  function put(url, file) {
    var fd = new FormData();
    fd.append('cacheControl', '3600');
    fd.append('', file);
    return fetch(url, { method: 'PUT', body: fd, headers: { 'x-upsert': 'false' } }).then(function (r) {
      if (!r.ok) throw new Error('server_error');
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (button.disabled) return;
    email.removeAttribute('aria-invalid');
    if (!files.length) return say(T.errors.missing_file, true);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.setAttribute('aria-invalid', 'true'); email.focus();
      return say(T.errors.invalid_email, true);
    }

    button.disabled = true; button.textContent = T.sending;
    say(T.preparing);
    var ready;
    Promise.all(files.map(shrink)).then(function (shrunk) {
      ready = shrunk;
      if (ready.some(function (f) { return f.size > MAX_BYTES; })) throw new Error('file_too_large');
      return post({
        action: 'start', lang: lang,
        email: email.value, phone: val('phone'), name: val('name'),
        company: val('company'), note: val('note'), website: val('website'),
        files: ready.map(function (f) { return { name: f.name, type: f.type, size: f.size }; })
      });
    }).then(function (started) {
      var chain = Promise.resolve();
      (started.uploads || []).forEach(function (u, i) {
        chain = chain.then(function () {
          say(T.uploading.replace('{i}', i + 1).replace('{n}', started.uploads.length));
          return put(u.url, ready[i]);
        });
      });
      return chain.then(function () {
        say(T.finishing);
        return started.uploads && started.uploads.length ? post({ action: 'complete', id: started.id }) : null;
      });
    }).then(function () {
      form.hidden = true;
      done.hidden = false;
      done.focus();
    }).catch(function (err) {
      var code = err && err.message;
      say(T.errors[code] || T.errors.server_error, true);
      button.disabled = false; button.textContent = T.send;
    });
  });
})();
