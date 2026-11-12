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

    // Clicking any link inside closes the menu
    menu.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (link) {
        closeMenu();
      }
    });
  }

  const NEWSLETTER_ENDPOINT = "";   // TODO: paste a Mailchimp/Buttondown/Formspree endpoint

  function initNewsletter() {
    var form = document.querySelector('.newsletter-form');
    if (!form) return;

    var input = document.getElementById('newsletter-email');
    var submitBtn = form.querySelector('button[type="submit"]');
    var status = form.querySelector('.newsletter-status');
    if (!input || !status) return;

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid') === 'true') {
        input.removeAttribute('aria-invalid');
        status.textContent = '';
        status.classList.remove('is-error');
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailVal = (input.value || '').trim();

      if (!emailVal || !emailRegex.test(emailVal)) {
        input.setAttribute('aria-invalid', 'true');
        status.classList.add('is-error');
        status.textContent = 'Please enter a valid email address.';
        input.focus();
        return;
      }

      input.removeAttribute('aria-invalid');
      status.classList.remove('is-error');

      if (!NEWSLETTER_ENDPOINT) {
        status.innerHTML = 'Newsletter signup opens soon \u2014 follow us on <a href="https://www.instagram.com/yourwedstories/" target="_blank" rel="noopener noreferrer">@yourwedstories</a> in the meantime.';
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      status.textContent = 'Subscribing\u2026';

      fetch(NEWSLETTER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVal })
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Network error');
          return res.json().catch(function () { return {}; });
        })
        .then(function () {
          status.textContent = "You're on the list. Thank you.";
          input.value = '';
        })
        .catch(function () {
          status.classList.add('is-error');
          status.textContent = 'Something went wrong. Please try again.';
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
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
    initNewsletter();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
