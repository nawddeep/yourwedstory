(function () {
  'use strict';

  var hero = document.querySelector('.home .hero');
  if (!hero) return;

  var canvas = document.createElement('canvas');
  var tile = document.createElement('canvas');
  var context = canvas.getContext('2d');
  var noiseContext = tile.getContext('2d');
  if (!context || !noiseContext) return;

  // Generate only a small seamless noise tile; never read or modify the photo.
  tile.width = tile.height = 256;
  var noise = noiseContext.createImageData(256, 256);
  canvas.className = 'hero-grain';
  canvas.setAttribute('aria-hidden', 'true');
  hero.appendChild(canvas);

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var timer = null;
  var visible = true;
  var frames = [];

  // Cache a handful of patterns rather than allocating pixels every frame.
  for (var frame = 0; frame < 6; frame++) {
    for (var i = 0; i < noise.data.length; i += 4) {
      var value = Math.floor(Math.random() * 256);
      noise.data[i] = noise.data[i + 1] = noise.data[i + 2] = value;
      noise.data[i + 3] = 255;
    }
    noiseContext.putImageData(noise, 0, 0);
    var pattern = context.createPattern(tile, 'repeat');
    if (pattern) frames.push(pattern);
  }
  if (!frames.length) { canvas.remove(); return; }
  var currentFrame = 0;

  function draw() {
    context.fillStyle = frames[currentFrame++ % frames.length];
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  function resize() {
    // One pixel per CSS pixel bounds the cost on high-density mobile displays.
    canvas.width = Math.max(1, Math.round(hero.clientWidth));
    canvas.height = Math.max(1, Math.round(hero.clientHeight));
    draw();
  }

  function updatePlayback() {
    if (timer !== null) { clearInterval(timer); timer = null; }
    // Retain a static grain texture when motion is reduced.
    if (visible && !document.hidden && !reducedMotion.matches) {
      timer = setInterval(draw, 1000 / 12);
    }
  }

  resize();
  updatePlayback();
  if ('ResizeObserver' in window) {
    new ResizeObserver(resize).observe(hero);
  } else {
    window.addEventListener('resize', resize, { passive: true });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      updatePlayback();
    }).observe(hero);
  }
  document.addEventListener('visibilitychange', updatePlayback);
  reducedMotion.addEventListener('change', updatePlayback);
  window.addEventListener('pagehide', function () {
    if (timer !== null) { clearInterval(timer); timer = null; }
  });
  window.addEventListener('pageshow', updatePlayback);
})();
