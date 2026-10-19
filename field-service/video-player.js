// Pick the composition designed for this viewport, and retain position on rotation.
(function () {
  var query = window.matchMedia('(max-width: 700px)');
  document.querySelectorAll('video[data-mobile-src]').forEach(function (video) {
    var revision = 0;
    var restartTime = 0;
    var resumeAfterSwitch = false;
    function choose() {
      var mode = query.matches ? 'mobile' : 'desktop';
      var src = video.getAttribute('data-' + mode + '-src');
      if (video.getAttribute('src') === src) return;
      var hadSource = Boolean(video.getAttribute('src'));
      var time = video.readyState >= 1 ? video.currentTime : restartTime;
      var playing = !video.paused && !video.ended;
      resumeAfterSwitch = playing || resumeAfterSwitch;
      restartTime = time;
      revision += 1;
      var currentRevision = revision;
      video.pause();
      video.poster = video.getAttribute('data-' + mode + '-poster');
      video.src = src;
      if (hadSource && (time > 0 || resumeAfterSwitch)) {
        video.addEventListener('loadedmetadata', function restore() {
          if (currentRevision !== revision) return;
          video.currentTime = Math.min(restartTime, Math.max(0, video.duration - 0.1));
          if (resumeAfterSwitch) {
            resumeAfterSwitch = false;
            video.play().catch(function () {});
          }
        }, { once: true });
        video.load();
      }
    }
    choose();
    query.addEventListener('change', choose);
    var play = video.parentElement.querySelector('.video-play');
    if (play) {
      play.addEventListener('click', function () { video.play().catch(function () {}); });
      video.addEventListener('play', function () { play.hidden = true; });
      video.addEventListener('ended', function () { play.hidden = false; });
    }
    document.querySelectorAll('[data-play-video="' + video.id + '"]').forEach(function (link) {
      link.addEventListener('click', function () { video.play().catch(function () {}); });
    });
  });
})();
