(function () {
  'use strict';
  document.documentElement.classList.add('js');

  function initEditorialMotion() {
    var editorial = document.querySelector('.editorial');
    if (!editorial) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      editorial.classList.add('is-visible');
      return;
    }

    if (!('IntersectionObserver' in window)) {
      editorial.classList.add('is-visible');
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            editorial.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(editorial);
  }

  function initMobileMenu() {
    var burger = document.querySelector('.masthead__burger');
    var menu = document.getElementById('mobile-menu');
    var closeBtn = document.getElementById('mobile-menu-close');
    if (!burger || !menu) return;

    var focusableSelector = 'a[href], button:not([disabled])';

    function openMenu() {
      menu.hidden = false;
      menu.removeAttribute('aria-hidden');
      // Force reflow for CSS opacity transition
      void menu.offsetHeight;
      menu.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('is-open');
      document.querySelectorAll('body > header, body > main, body > footer').forEach(function (el) { el.inert = true; });
      if (closeBtn) {
        try {
          closeBtn.focus();
        } catch (err) {}
      }
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('is-open');
      document.querySelectorAll('body > header, body > main, body > footer').forEach(function (el) { el.inert = false; });

      setTimeout(function () {
        if (!menu.classList.contains('is-open')) {
          menu.hidden = true;
          menu.setAttribute('aria-hidden', 'true');
        }
      }, 300);

      try {
        burger.focus();
      } catch (err) {}
    }

    burger.addEventListener('click', function () {
      var isExpanded = burger.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    // Escape key closes menu
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // Focus trap inside mobile menu
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusables = Array.prototype.slice.call(menu.querySelectorAll(focusableSelector));
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    });

    window.matchMedia('(min-width: 900px)').addEventListener('change', function (event) {
      if (event.matches && menu.classList.contains('is-open')) closeMenu();
    });

    // Clicking any link inside closes the menu
    menu.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (link) {
        closeMenu();
      }
    });
  }

  function initFilms() {
    document.querySelectorAll('[data-video]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube-nocookie.com/embed/' + link.dataset.video + '?autoplay=1';
        iframe.title = link.getAttribute('aria-label');
        iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        var fallback = link.cloneNode(true);
        fallback.removeAttribute('data-video');
        fallback.className = 'text-link';
        fallback.textContent = 'Watch on YouTube ↗';
        fallback.target = '_blank';
        fallback.rel = 'noopener noreferrer';
        link.replaceWith(iframe, fallback);
        iframe.focus();
      });
    });
  }

  function initGallery() {
    var dialog = document.createElement('dialog');
    if (typeof dialog.showModal !== 'function') return;
    dialog.className = 'photo-dialog';
    dialog.setAttribute('aria-label', 'Full photograph');
    var close = document.createElement('button');
    close.type = 'button';
    close.textContent = 'Close photograph ×';
    var image = document.createElement('img');
    dialog.append(close, image);
    document.body.append(dialog);
    var opener;
    close.addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', function () {
      document.documentElement.classList.remove('photo-open');
      if (opener) opener.focus();
    });
    document.querySelectorAll('.photo-grid img, .story-cover img').forEach(function (photo) {
      var button = document.createElement('button');
      button.className = 'photo-enlarge';
      button.type = 'button';
      button.setAttribute('aria-label', 'Enlarge: ' + photo.alt);
      photo.replaceWith(button);
      button.append(photo);
      button.addEventListener('click', function () {
        opener = button;
        image.src = photo.src;
        image.alt = photo.alt;
        dialog.showModal();
        document.documentElement.classList.add('photo-open');
        close.focus();
      });
    });
  }

  function initBackToTop() {
    var backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: 0,
        behavior: prefersReduced ? 'auto' : 'smooth'
      });
      if (window.history && window.history.pushState) {
        window.history.pushState(null, null, ' ');
      }
    });
  }

  function init() {
    initEditorialMotion();
    initMobileMenu();
    initGallery();
    initFilms();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
