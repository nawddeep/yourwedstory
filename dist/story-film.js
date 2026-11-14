(function () {
 'use strict';
 var video = document.querySelector('.story-film video');
 if (!video) return;
 var manuallyPaused = false;
 video.controls = false;
 video.removeAttribute("controls");
 video.muted = true;
 video.defaultMuted = true;
 video.loop = true;
 video.autoplay = true;
 video.playsInline = true;
 function start() {
  if (manuallyPaused || document.hidden) return;
  video.muted = true;
  var playback = video.play();
  if (playback) playback.catch(function () {});
 }
 video.addEventListener('canplay', start);
 document.addEventListener('visibilitychange', function () { if (!document.hidden) start(); });
 if ('IntersectionObserver' in window) {
  new IntersectionObserver(function (entries) { if (entries[0].isIntersecting) start(); }, { threshold: 0.1 }).observe(video);
 }
 document.addEventListener('pointerdown', start, { once: true });
 start();
})();
