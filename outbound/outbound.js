document.getElementById('year').textContent = new Date().getFullYear();
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');
const iconOpen = document.getElementById('menuIconOpen');
const iconClose = document.getElementById('menuIconClose');
menuBtn.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(isOpen));
  iconOpen.style.display = isOpen ? 'none' : 'block';
  iconClose.style.display = isOpen ? 'block' : 'none';
});
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  iconOpen.style.display = 'block';
  iconClose.style.display = 'none';
}));
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = id ? document.getElementById(id) : null;
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
  });
});

(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var particleGroup = document.getElementById('lfParticles');
  if (particleGroup && !reduce) {
    var NS = 'http://www.w3.org/2000/svg';
    var pace = 24;
    var perLane = 4;
    var faceSize = 42;
    var pad = 2;
    var lanePhotos = [
      ['/assets/lead-faces/face-01.jpg','/assets/lead-faces/face-02.jpg','/assets/lead-faces/face-03.jpg','/assets/lead-faces/face-04.jpg'],
      ['/assets/lead-faces/face-05.jpg','/assets/lead-faces/face-06.jpg','/assets/lead-faces/face-07.jpg','/assets/lead-faces/face-08.jpg'],
      ['/assets/lead-faces/face-09.jpg','/assets/lead-faces/face-10.jpg','/assets/lead-faces/face-11.jpg','/assets/lead-faces/face-12.jpg']
    ];
    var paths = ['#lfBranchL', '#lfBranchC', '#lfBranchR'];
    var half = faceSize / 2;

    paths.forEach(function (pathId, lane) {
      lanePhotos[lane].forEach(function (src, i) {
        var g = document.createElementNS(NS, 'g');
        g.setAttribute('class', 'lf-face');
        g.setAttribute('transform', 'translate(' + (-half) + ',' + (-half) + ')');

        var border = document.createElementNS(NS, 'rect');
        border.setAttribute('class', 'lf-face__border');
        border.setAttribute('x', String(-pad));
        border.setAttribute('y', String(-pad));
        border.setAttribute('width', String(faceSize + pad * 2));
        border.setAttribute('height', String(faceSize + pad * 2));
        border.setAttribute('rx', '11');

        var img = document.createElementNS(NS, 'image');
        img.setAttribute('class', 'lf-face__img');
        img.setAttribute('width', String(faceSize));
        img.setAttribute('height', String(faceSize));
        img.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        img.addEventListener('error', function () {
          if (img.parentNode) img.parentNode.removeChild(img);
        });
        img.setAttribute('href', src);

        var motion = document.createElementNS(NS, 'animateMotion');
        motion.setAttribute('dur', pace + 's');
        motion.setAttribute('begin', (i * (pace / perLane)) + 's');
        motion.setAttribute('repeatCount', 'indefinite');
        motion.setAttribute('rotate', '0');
        motion.setAttribute('calcMode', 'linear');
        var mpath = document.createElementNS(NS, 'mpath');
        mpath.setAttribute('href', pathId);
        motion.appendChild(mpath);

        var fade = document.createElementNS(NS, 'animate');
        fade.setAttribute('attributeName', 'opacity');
        fade.setAttribute('dur', pace + 's');
        fade.setAttribute('begin', (i * (pace / perLane)) + 's');
        fade.setAttribute('repeatCount', 'indefinite');
        fade.setAttribute('calcMode', 'linear');
        fade.setAttribute('values', '0;1;1;0;0');
        fade.setAttribute('keyTimes', '0;0.03;0.72;0.8;1');

        g.appendChild(border);
        g.appendChild(img);
        g.appendChild(motion);
        g.appendChild(fade);
        particleGroup.appendChild(g);
      });
    });
  }

  var leadCardImages = Array.prototype.slice.call(document.querySelectorAll('#lead-flow-transplant .lf-card__avatar img'));
  leadCardImages.forEach(function (img) {
    function useGeneratedAvatar() {
      img.hidden = true;
      if (img.parentNode) img.parentNode.classList.add('is-generated');
    }
    img.addEventListener('error', useGeneratedAvatar);
    img.addEventListener('load', function () {
      if (img.parentNode) img.parentNode.classList.add('has-photo');
    });
    if (img.complete && img.naturalWidth === 0) useGeneratedAvatar();
  });
})();
