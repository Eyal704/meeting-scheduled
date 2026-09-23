(() => {
  // Casual-visitor gate only. These static files and their source remain public.
  const accessKey = 'niche-access-v1';
  const accessCopy = {
    en: { title: 'Internal guide', description: 'Enter the password to continue.', password: 'Password', enter: 'Open guide', error: 'Incorrect password. Try again.', lock: 'Lock' },
    he: { title: 'מדריך פנימי', description: 'כדי להמשיך, יש להזין סיסמה.', password: 'סיסמה', enter: 'כניסה למדריך', error: 'הסיסמה שגויה. נסו שוב.', lock: 'נעילה' },
    de: { title: 'Interner Leitfaden', description: 'Bitte geben Sie das Passwort ein.', password: 'Passwort', enter: 'Leitfaden öffnen', error: 'Das Passwort ist falsch. Bitte versuchen Sie es erneut.', lock: 'Sperren' }
  };
  const gate = document.createElement('section');
  gate.className = 'access-gate';
  gate.setAttribute('aria-labelledby', 'access-title');
  gate.innerHTML = `
    <div class="access-card">
      <p class="access-brand" dir="ltr">MeetingScheduled</p>
      <div class="langs access-langs" role="group" aria-label="Language">
        <button type="button" data-language="en">English</button>
        <button type="button" data-language="he">עברית</button>
        <button type="button" data-language="de">Deutsch</button>
      </div>
      <h1 id="access-title"></h1>
      <p id="access-description"></p>
      <form class="access-form">
        <label for="access-password"></label>
        <input id="access-password" type="password" dir="ltr" autocomplete="current-password" required aria-describedby="access-error">
        <p id="access-error" role="alert" hidden></p>
        <button type="submit"></button>
      </form>
    </div>`;
  document.body.prepend(gate);
  const passwordInput = gate.querySelector('input');
  const accessError = gate.querySelector('#access-error');
  const lockButton = document.createElement('button');
  lockButton.type = 'button';
  lockButton.className = 'access-lock';
  document.querySelector('.bar-inner').append(lockButton);
  function translateAccess(language) {
    const copy = accessCopy[language] || accessCopy.en;
    gate.querySelector('h1').textContent = copy.title;
    gate.querySelector('#access-description').textContent = copy.description;
    gate.querySelector('label').textContent = copy.password;
    gate.querySelector('[type="submit"]').textContent = copy.enter;
    accessError.textContent = copy.error;
    lockButton.textContent = copy.lock;
  }
  function setAccess(unlocked, moveFocus = false) {
    document.documentElement.classList.toggle('niche-locked', !unlocked);
    gate.hidden = unlocked;
    lockButton.hidden = !unlocked;
    passwordInput.value = '';
    passwordInput.removeAttribute('aria-invalid');
    accessError.hidden = true;
    if (!moveFocus) return;
    if (unlocked) {
      const heading = document.querySelector('article:not([hidden]) h1');
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
      const anchor = document.getElementById(location.hash.slice(1));
      if (anchor) anchor.scrollIntoView();
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
      passwordInput.focus({ preventScroll: true });
    }
  }
  function hasAccess() {
    try { return sessionStorage.getItem(accessKey) === 'unlocked'; } catch { return false; }
  }
  gate.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    if (passwordInput.value !== 'niche') {
      accessError.hidden = false;
      passwordInput.setAttribute('aria-invalid', 'true');
      passwordInput.focus();
      passwordInput.select();
      return;
    }
    try { sessionStorage.setItem(accessKey, 'unlocked'); } catch {}
    setAccess(true, true);
  });
  lockButton.addEventListener('click', () => {
    try { sessionStorage.removeItem(accessKey); } catch {}
    setAccess(false, true);
  });
  window.addEventListener('pageshow', event => { if (event.persisted) setAccess(hasAccess()); });
  setAccess(hasAccess());
  const panels = Object.fromEntries(Array.from(document.querySelectorAll('article[id^="panel-"]')).map(panel => [panel.lang, panel]));
  const buttons = Array.from(document.querySelectorAll('[data-language]'));
  const valid = language => Object.prototype.hasOwnProperty.call(panels, language);
  const hashLanguage = () => location.hash.match(/^#(en|he|de)-/)?.[1];
  function selectLanguage(language, updateUrl = false, scroll = false) {
    if (!valid(language)) language = 'en';
    Object.entries(panels).forEach(([key, panel]) => { panel.hidden = key !== language; });
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    translateAccess(language);
    document.title = panels[language].dataset.title || panels[language].querySelector('h1').textContent;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    try { localStorage.setItem('niche-language', language); } catch {}
    let anchor = location.hash.replace(/^#(en|he|de)-/, '#' + language + '-');
    if (anchor && !document.getElementById(anchor.slice(1))) anchor = '';
    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set('lang', language);
      url.hash = anchor;
      try { history.replaceState(null, '', url); } catch {}
    }
    if (scroll) {
      const target = anchor && document.getElementById(anchor.slice(1));
      if (target) target.scrollIntoView();
      else window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }
  let stored;
  try { stored = localStorage.getItem('niche-language'); } catch {}
  const requested = new URL(location.href).searchParams.get('lang');
  selectLanguage(valid(requested) ? requested : valid(hashLanguage()) ? hashLanguage() : valid(stored) ? stored : 'en');
  buttons.forEach(button => button.addEventListener('click', () => selectLanguage(button.dataset.language, true, true)));
  window.addEventListener('hashchange', () => { if (valid(hashLanguage())) selectLanguage(hashLanguage()); });
  const bar = document.querySelector('.bar');
  if (bar && 'ResizeObserver' in window) new ResizeObserver(() => document.documentElement.style.setProperty('--bar-height', bar.offsetHeight + 'px')).observe(bar);
  const links = Array.from(document.querySelectorAll('.toc a[href^="#"]'));
  const byId = new Map(links.map(link => [link.hash.slice(1), link]));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const link = byId.get(entry.target.id);
        if (!link) return;
        link.closest('ol').querySelectorAll('a').forEach(other => other.classList.toggle('active', other === link));
      });
    }, { rootMargin: '-100px 0px -65% 0px' });
    byId.forEach((_, id) => { const element = document.getElementById(id); if (element) observer.observe(element); });
  }
  let printStates = [];
  window.addEventListener('beforeprint', () => {
    printStates = Array.from(document.querySelectorAll('article:not([hidden]) details')).map(detail => [detail, detail.open]);
    printStates.forEach(([detail]) => { detail.open = true; });
  });
  window.addEventListener('afterprint', () => printStates.forEach(([detail, open]) => { detail.open = open; }));
})();
