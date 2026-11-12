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

  // Validate date format DD/MM/YYYY and valid calendar date
  function parseAndValidateDate(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return null;
    var trimmed = dateStr.trim();
    var match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) return null;

    var day = parseInt(match[1], 10);
    var month = parseInt(match[2], 10);
    var year = parseInt(match[3], 10);

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
        contactSection.scrollIntoView({ behavior: 'smooth' });
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
          contactSection.scrollIntoView({ behavior: 'smooth' });
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
        if (!val.trim()) return 'Enter the date as DD/MM/YYYY.';
        var formatted = parseAndValidateDate(val);
        if (!formatted) return 'Enter the date as DD/MM/YYYY.';
        return '';
      }
    },
    {
      id: 'field-days',
      errorId: 'error-days',
      validate: function (val) {
        if (!val || !val.trim()) return 'Please select number of days.';
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

      // UI state during redirection
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Opening WhatsApp\u2026';
      }
      if (statusEl) {
        statusEl.textContent = 'Opening WhatsApp with your enquiry\u2026';
      }

      try {
        window.location.href = whatsappUrl;
      } catch (err) {
        if (statusEl) {
          statusEl.innerHTML = '<a href="https://wa.me/' + WHATSAPP_NUMBER + '" target="_blank" rel="noopener noreferrer">WhatsApp didn\'t open. Message us at +91 88750 05588.</a>';
        }
      }

      setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'SUBMIT INQUIRY';
        }
      }, 2000);
    });
  }

  // Initialize deep link on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkDeepLink);
  } else {
    checkDeepLink();
  }
})();
