(function () {
  'use strict';
  var links = Array.from(document.querySelectorAll('[data-artwork]'));
  if (!links.length) return;
  var dialog = document.createElement('dialog');
  if (typeof dialog.showModal !== 'function') return;
  dialog.className = 'work-viewer';
  dialog.setAttribute('aria-label', 'Photograph viewer');
  var bar = document.createElement('div');
  bar.className = 'work-viewer__bar';
  var caption = document.createElement('p');
  caption.id = 'work-viewer-caption';
  caption.setAttribute('aria-live', 'polite');
  var controls = document.createElement('div');
  var image = document.createElement('img');
  var status = document.createElement('p');
  status.className = 'work-viewer__status';
  status.setAttribute('role', 'status');
  var original = document.createElement('a');
  original.textContent = 'Open photograph in new tab';
  original.target = '_blank';
  original.rel = 'noopener noreferrer';
  var previous = document.createElement('button');
  var next = document.createElement('button');
  var close = document.createElement('button');
  [previous, next, close].forEach(function (b) { b.type = 'button'; });
  previous.textContent = 'Previous'; next.textContent = 'Next'; close.textContent = 'Close';
  controls.append(previous, next, close);
  bar.append(caption, controls);
  dialog.append(bar, image, status, original);
  document.body.append(dialog);
  var activeLinks = links;
  var index = 0;
  var opener;
  var savedOverflow;
  function show(at) {
    index = (at + activeLinks.length) % activeLinks.length;
    var link = activeLinks[index];
    caption.textContent = link.dataset.title + ' · ' + (index + 1) + ' of ' + activeLinks.length;
    status.textContent = 'Loading photograph…';
    image.alt = link.querySelector('img').alt;
    image.src = link.href;
    original.href = link.href;
  }
  image.addEventListener('load', function () { status.textContent = ''; });
  image.addEventListener('error', function () { status.textContent = 'This photograph could not load. Open it in a new tab below, or choose another photograph.'; });
  links.forEach(function (link, at) {
    link.addEventListener('click', function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      opener = link;
      savedOverflow = document.documentElement.style.overflow;
      activeLinks = links.filter(function (item) { return !item.hidden; });
      show(activeLinks.indexOf(link));
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
      close.focus();
    });
  });
  previous.addEventListener('click', function () { show(index - 1); });
  next.addEventListener('click', function () { show(index + 1); });
  close.addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1); }
  });
  dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', function () {
    document.documentElement.style.overflow = savedOverflow || '';
    image.removeAttribute('src');
    if (opener) opener.focus();
  });
})();
