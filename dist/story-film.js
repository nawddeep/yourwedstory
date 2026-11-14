(function () {
 'use strict';
 var video = document.querySelector('.story-film video');
 var button = document.querySelector('.story-film__toggle');
 if (!video) return;
 var manuallyPaused = false;
 video.muted = true;
 video.defaultMuted = true;
 video.loop = true;
 video.autoplay = true;
 video.playsInline = true;
 function sync() {
  button.textContent = video.paused ? 'Play' : 'Pause';
  button.setAttribute('aria-label', (video.paused ? 'Play' : 'Pause') + ' wedding highlights');
 }
 function start() {
  if (manuallyPaused || document.hidden) return;
  video.muted = true;
  var playback = video.play();
  if (playback) playback.catch(sync);
 }
 button.addEventListener('click', function () {
  manuallyPaused = !video.paused;
  if (manuallyPaused) video.pause(); else start();
 });
 video.addEventListener('canplay', start);
 video.addEventListener('play', sync);
 video.addEventListener('pause', sync);
 document.addEventListener('visibilitychange', function () { if (!document.hidden) start(); });
 if ('IntersectionObserver' in window) {
  new IntersectionObserver(function (entries) { if (entries[0].isIntersecting) start(); }, { threshold: 0.1 }).observe(video);
 }
 document.addEventListener('pointerdown', start, { once: true });
 start();
 sync();
})();
