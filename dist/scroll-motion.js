(function () {
 'use strict';
 var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
 if (reduced.matches || !('IntersectionObserver' in window)) return;
 var elements = document.querySelectorAll('.atelier-spread > *, .signature-portfolio header, .signature-portfolio__card, .signature-portfolio__pair, .signature-portfolio__wide, .signature-portfolio__button, .atelier-panorama > p, .atelier-work header, .atelier-stories article, .atelier-note > *, .film, .inquiry-copy, .inquiry-form, .site-footer__top > *, .site-footer__gallery-item, .portfolio-title, .mosaic-photo');
 var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
   if (entry.isIntersecting) {
    entry.target.classList.add('motion-visible');
    observer.unobserve(entry.target);
   }
  });
 }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
 elements.forEach(function (element) {
  if (element.getBoundingClientRect().bottom < 0) return;
  element.classList.add('motion-reveal');
  var siblings = Array.from(element.parentElement.children);
  element.style.setProperty('--motion-delay', Math.min(siblings.indexOf(element) % 4, 3) * 85 + 'ms');
  observer.observe(element);
 });
 reduced.addEventListener('change', function () {
  if (reduced.matches) {
   observer.disconnect();
   elements.forEach(function (element) { element.classList.add('motion-visible'); });
  }
 });
})();
