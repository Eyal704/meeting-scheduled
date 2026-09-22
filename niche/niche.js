(() => {
  const panels = Object.fromEntries(Array.from(document.querySelectorAll('article[id^="panel-"]')).map(panel => [panel.lang, panel]));
  const buttons = Array.from(document.querySelectorAll('[data-language]'));
  const valid = language => Object.prototype.hasOwnProperty.call(panels, language);
  const hashLanguage = () => location.hash.match(/^#(en|he|de)-/)?.[1];
  function selectLanguage(language, updateUrl = false, scroll = false) {
    if (!valid(language)) language = 'en';
    Object.entries(panels).forEach(([key, panel]) => { panel.hidden = key !== language; });
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
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
