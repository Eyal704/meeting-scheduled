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
