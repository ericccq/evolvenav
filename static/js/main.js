(function () {
  var carousel = document.getElementById('demoCarousel');
  if (!carousel) return;

  var track = carousel.querySelector('.carousel-track');
  var slides = Array.prototype.slice.call(track.querySelectorAll('.carousel-slide'));
  var prevBtn = carousel.querySelector('.carousel-prev');
  var nextBtn = carousel.querySelector('.carousel-next');
  var counter = document.getElementById('demoCounter');
  var total = slides.length;
  var active = 0;
  var replayTimer = null;

  function classFor(diff) {
    if (diff === 0) return 'is-active';
    if (diff === -1) return 'is-prev';
    if (diff === 1) return 'is-next';
    if (diff === -2) return 'is-prev-2';
    if (diff === 2) return 'is-next-2';
    return '';
  }

  function shortestDiff(i, a) {
    var d = i - a;
    if (d > total / 2) d -= total;
    else if (d < -total / 2) d += total;
    return d;
  }

  function pauseAllExcept(idx) {
    slides.forEach(function (s, i) {
      var v = s.querySelector('video');
      if (!v) return;
      if (i !== idx) {
        try { v.pause(); v.currentTime = 0; } catch (e) {}
      }
    });
  }

  function playActive() {
    var v = slides[active].querySelector('video');
    if (!v) return;
    try {
      v.currentTime = 0;
      var p = v.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    } catch (e) {}
  }

  function clearReplay() {
    if (replayTimer) { clearTimeout(replayTimer); replayTimer = null; }
  }

  function render() {
    slides.forEach(function (s, i) {
      var diff = shortestDiff(i, active);
      s.classList.remove('is-active', 'is-prev', 'is-next', 'is-prev-2', 'is-next-2');
      var cls = classFor(diff);
      if (cls) s.classList.add(cls);
    });
    if (counter) counter.textContent = String(active + 1);
    pauseAllExcept(active);
    clearReplay();
    playActive();
  }

  function go(delta) {
    active = (active + delta + total) % total;
    render();
  }

  prevBtn.addEventListener('click', function () { go(-1); });
  nextBtn.addEventListener('click', function () { go(1); });

  document.addEventListener('keydown', function (e) {
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.key === 'ArrowLeft') { go(-1); }
    else if (e.key === 'ArrowRight') { go(1); }
  });

  slides.forEach(function (s, i) {
    var v = s.querySelector('video');
    if (!v) return;
    v.addEventListener('ended', function () {
      if (i !== active) return;
      clearReplay();
      var delay = parseInt(v.dataset.replayDelay || '5000', 10);
      replayTimer = setTimeout(function () {
        if (i !== active) return;
        try {
          v.currentTime = 0;
          var p = v.play();
          if (p && typeof p.catch === 'function') p.catch(function () {});
        } catch (e) {}
      }, delay);
    });
    v.addEventListener('play', function () {
      if (i === active) clearReplay();
    });
  });

  render();
})();
