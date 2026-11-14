(function () {
 'use strict';
 var filters = document.querySelector('.mosaic-filter');
 if (!filters) return;
 var photos = Array.from(document.querySelectorAll('.portfolio-mosaic [data-artwork]'));
 var inscription = document.querySelector('.portfolio-mosaic .mosaic-inscription');
 var status = document.querySelector('.mosaic-count');
 filters.hidden = false;
 filters.addEventListener('click', function (event) {
  var button = event.target.closest('[data-filter]');
  if (!button) return;
  filters.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === button)); });
  var count = 0;
  photos.forEach(function (photo) {
   photo.hidden = button.dataset.filter !== 'all' && photo.dataset.collection !== button.dataset.filter;
   if (!photo.hidden) count++;
  });
  if (inscription) inscription.hidden = button.dataset.filter !== 'all';
  document.querySelector('.photo-mosaic').classList.toggle('is-filtered', button.dataset.filter !== 'all');
  status.textContent = count + ' photographs shown';
 });
})();
