const WHATSAPP_NUMBER = '918875005588';

(function () {
  'use strict';

  var form = document.getElementById('inquiry-form');
  var submitBtn = document.getElementById('inquiry-submit');
  var statusEl = document.getElementById('inquiry-status');
  var hasSubmitted = false;

  var MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Validate a local ISO calendar date and reject past wedding dates.
  function parseAndValidateDate(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return null;
    var trimmed = dateStr.trim();
    var match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    var year = Number(match[1]);
    var month = Number(match[2]);
    var day = Number(match[3]);

    if (month < 1 || month > 12) return null;
    if (year < 1900 || year > 2200) return null;

    var dateObj = new Date(year, month - 1, day);
    if (
      dateObj.getFullYear() !== year ||
      dateObj.getMonth() + 1 !== month ||
      dateObj.getDate() !== day
    ) {
      return null;
    }

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateObj < today) return null;
    var dayFormatted = day < 10 ? '0' + day : '' + day;
    return dayFormatted + ' ' + MONTH_NAMES[month - 1] + ' ' + year;
  }

  // Email format check
  function isValidEmail(emailStr) {
    if (!emailStr) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr.trim());
  }

  // Navigation & smooth scroll to #contact on click
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-open-inquiry], a[href="#contact"], a[href$="/#contact"], a[href="#inquire"], a[href$="/#inquire"]');
    if (trigger) {
      var contactSection = document.getElementById('contact');
      if (contactSection) {
        e.preventDefault();
        contactSection.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        if (window.history && window.history.pushState) {
          window.history.pushState(null, null, '#contact');
        }
        var firstInput = document.getElementById('field-name');
        if (firstInput) {
          setTimeout(function () {
            try {
              firstInput.focus({ preventScroll: true });
            } catch (err) {}
          }, 600);
        }
      }
    }
  });

  // Deep linking scroll on page load or hash change
  function checkDeepLink() {
    var hash = window.location.hash;
    if (hash === '#contact' || hash === '#inquire') {
      var contactSection = document.getElementById('contact');
      if (contactSection) {
        setTimeout(function () {
          contactSection.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
          var firstInput = document.getElementById('field-name');
          if (firstInput) {
            try {
              firstInput.focus({ preventScroll: true });
            } catch (err) {}
          }
        }, 300);
      }
    }
  }

  window.addEventListener('hashchange', checkDeepLink);

  // Field validation configuration
  var fieldsToValidate = [
    {
      id: 'field-name',
      errorId: 'error-name',
      validate: function (val) {
        if (!val.trim()) return 'Please enter your name.';
        return '';
      }
    },
    {
      id: 'field-email',
      errorId: 'error-email',
      validate: function (val) {
        if (!val.trim()) return 'Please enter your email.';
        if (!isValidEmail(val)) return 'Please enter a valid email address.';
        return '';
      }
    },
    {
      id: 'field-phone',
      errorId: 'error-phone',
      validate: function (val) {
        if (!val.trim()) return 'Please enter your WhatsApp number.';
        var digits = val.replace(/\D/g, '');
        if (!/^\+?[\d\s().-]+$/.test(val.trim()) || digits.length < 7 || digits.length > 15) return 'Enter a phone number with 7–15 digits, including your country code.';
        return '';
      }
    },
    {
      id: 'field-message',
      errorId: 'error-message',
      validate: function (val) {
        if (!val.trim()) return 'Please tell us about your wedding.';
        return '';
      }
    },
    {
      id: 'field-location',
      errorId: 'error-location',
      validate: function (val) {
        if (!val.trim()) return 'Please enter the location of the wedding.';
        return '';
      }
    },
    {
      id: 'field-date',
      errorId: 'error-date',
      validate: function (val) {
        if (!val.trim()) return 'Choose today or a future wedding date.';
        var formatted = parseAndValidateDate(val);
        if (!formatted) return 'Choose today or a future wedding date.';
        return '';
      }
    },
    {
      id: 'field-days',
      errorId: 'error-days',
      validate: function (val) {
        if (!['1', '2', '3', '4', '5', '6+'].includes(val)) return 'Please select number of days.';
        return '';
      }
    }
  ];

  function validateSingleField(cfg) {
    var el = document.getElementById(cfg.id);
    var errEl = document.getElementById(cfg.errorId);
    if (!el) return true;

    var errorMsg = cfg.validate(el.value || '');
    if (errorMsg) {
      el.setAttribute('aria-invalid', 'true');
      el.setAttribute('aria-describedby', cfg.errorId);
      if (errEl) {
        errEl.textContent = errorMsg;
      }
      return false;
    } else {
      el.removeAttribute('aria-invalid');
      if (errEl) {
        errEl.textContent = '';
      }
      return true;
    }
  }

  // Attach blur and input validation
  fieldsToValidate.forEach(function (cfg) {
    var el = document.getElementById(cfg.id);
    if (!el) return;

    el.addEventListener('blur', function () {
      if (hasSubmitted || el.value.trim() !== '') {
        validateSingleField(cfg);
      }
    });

    el.addEventListener('input', function () {
      if (hasSubmitted) {
        validateSingleField(cfg);
      }
    });

    if (el.tagName === 'SELECT') {
      el.addEventListener('change', function () {
        if (hasSubmitted) {
          validateSingleField(cfg);
        }
      });
    }
  });

  // Form submit handler
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hasSubmitted = true;

      // Check honeypot field
      var honeypot = document.getElementById('field-website');
      if (honeypot && honeypot.value.trim() !== '') {
        return;
      }

      var firstInvalid = null;
      var isAllValid = true;

      fieldsToValidate.forEach(function (cfg) {
        var valid = validateSingleField(cfg);
        if (!valid) {
          isAllValid = false;
          if (!firstInvalid) {
            firstInvalid = document.getElementById(cfg.id);
          }
        }
      });

      if (!isAllValid) {
        if (firstInvalid && typeof firstInvalid.focus === 'function') {
          firstInvalid.focus();
        }
        return;
      }

      // Collect field values
      var nameVal = (document.getElementById('field-name').value || '').trim();
      var emailVal = (document.getElementById('field-email').value || '').trim();
      var phoneVal = (document.getElementById('field-phone').value || '').trim();
      var messageVal = (document.getElementById('field-message').value || '').trim();
      var locationVal = (document.getElementById('field-location').value || '').trim();
      var dateRaw = (document.getElementById('field-date').value || '').trim();
      var formattedDate = parseAndValidateDate(dateRaw) || dateRaw;
      var daysVal = (document.getElementById('field-days').value || '').trim();

      // Build message according to exact specification
      var lines = [
        'Name: ' + nameVal,
        'Email: ' + emailVal,
        'WhatsApp no.: ' + phoneVal,
        'Location of the wedding: ' + locationVal,
        'Wedding date: ' + formattedDate,
        'No. of days: ' + daysVal,
        'Tell us more about your wedding \u2014 event flow, venues: ' + messageVal
      ];

      var closingSentence = '';
      if (formattedDate && locationVal) {
        closingSentence = 'Please confirm your availability for ' + formattedDate + ' at ' + locationVal + ' and share your packages and further details.';
      } else {
        closingSentence = 'Please confirm your availability and share your packages and further details.';
      }

      var fullMessage = lines.join('\n') + '\n\n' + closingSentence;
      var whatsappUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(fullMessage);

      // Keep the draft on this page. Opening WhatsApp is a separate, explicit action.
      statusEl.replaceChildren();
      var explanation = document.createElement('p');
      explanation.textContent = 'Your message is ready. Open WhatsApp, review it and press Send to deliver your inquiry.';
      var link = document.createElement('a');
      link.href = whatsappUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'action-link';
      link.textContent = 'Open WhatsApp draft ↗';
      statusEl.append(explanation, link);
      link.focus();

    });
  }

  if (form) {
    form.hidden = false;
    var dateInput = document.getElementById('field-date');
    var now = new Date();
    dateInput.min = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
    form.addEventListener('input', function () { statusEl.replaceChildren(); });
    form.addEventListener('change', function () { statusEl.replaceChildren(); });
  }

  // Initialize deep link on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkDeepLink);
  } else {
    checkDeepLink();
  }
})();
