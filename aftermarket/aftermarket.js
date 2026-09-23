(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Hero: a stack of example messages; the front one leaves and the next comes forward.
  var stack = document.getElementById('stack');
  if (stack) {
    var cards = Array.prototype.slice.call(stack.querySelectorAll('.msg'));
    var order = cards.map(function (_, i) { return i; });
    var paused = false;
    function layout() {
      order.forEach(function (cardIndex, pos) {
        var c = cards[cardIndex];
        var visible = pos < 3;
        c.style.zIndex = String(10 - pos);
        c.style.opacity = visible ? String(1 - pos * 0.3) : '0';
        c.style.transform = 'translateY(' + (pos * 24) + 'px) scale(' + (1 - pos * 0.05) + ')';
        c.setAttribute('aria-hidden', pos === 0 ? 'false' : 'true');
      });
    }
    function next() {
      if (paused || document.hidden) return;
      var front = cards[order[0]];
      front.style.transform = 'translateY(-26px) scale(1.02)';
      front.style.opacity = '0';
      setTimeout(function () {
        order.push(order.shift());
        layout();
      }, 450);
    }
    function fit() {
      var tallest = 0;
      cards.forEach(function (c) { tallest = Math.max(tallest, c.offsetHeight); });
      stack.style.height = (tallest + 40) + 'px';
    }
    layout();
    fit();
    window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    if (!reduce && cards.length > 1) {
      setInterval(next, 4200);
      stack.addEventListener('mouseenter', function () { paused = true; });
      stack.addEventListener('mouseleave', function () { paused = false; });
      stack.addEventListener('focusin', function () { paused = true; });
      stack.addEventListener('focusout', function () { paused = false; });
    }
  }

  // River: duplicate each lane once so the drift loops without a seam.
  var river = document.getElementById('river');
  if (river) {
    river.querySelectorAll('.lane').forEach(function (lane) {
      Array.prototype.slice.call(lane.children).forEach(function (b) {
        var clone = b.cloneNode(true);
        clone.classList.add('dup');
        clone.setAttribute('aria-hidden', 'true');
        lane.appendChild(clone);
      });
    });
    var toggle = document.getElementById('riverToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var isPaused = river.classList.toggle('paused');
        toggle.setAttribute('aria-pressed', String(isPaused));
        toggle.textContent = isPaused ? toggle.dataset.play : toggle.dataset.pause;
      });
    }
  }
})();
