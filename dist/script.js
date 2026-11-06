const WHATSAPP_NUMBER = '918875005588';

function formatDate(dateStr) {
  if (!dateStr) return '';
  let match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return dateStr;
  let year = match[1];
  let monthNum = parseInt(match[2], 10);
  let day = parseInt(match[3], 10);
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let month = months[monthNum - 1];
  if (!month || isNaN(day)) return dateStr;
  return day + ' ' + month + ' ' + year;
}

function initInquiryForm() {
  let form = document.querySelector('.inquiry-form');
  if (!form) return;

  let submitBtn = form.querySelector('button[type="submit"]');
  let originalBtnText = submitBtn ? submitBtn.textContent : 'Send inquiry';
  let isSubmitting = false;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!form.checkValidity()) {
      if (form.reportValidity) {
        form.reportValidity();
      }
      return;
    }

    let honeypot = form.elements['website'];
    if (honeypot && honeypot.value.trim() !== '') {
      return;
    }

    isSubmitting = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Opening WhatsApp…';
    }

    try {
      let name = (form.elements['name'] ? form.elements['name'].value : '').trim();
      let email = (form.elements['email'] ? form.elements['email'].value : '').trim();
      let phone = (form.elements['phone'] ? form.elements['phone'].value : '').trim();
      let rawDate = (form.elements['date'] ? form.elements['date'].value : '').trim();
      let formattedDate = formatDate(rawDate);
      let venue = (form.elements['location'] ? form.elements['location'].value : '').trim();
      let messageText = (form.elements['message'] ? form.elements['message'].value : '').trim();

      let lines = [
        'Full name: ' + name,
        'Email: ' + email
      ];
      if (phone) {
        lines.push('Phone: ' + phone);
      }
      lines.push('Wedding date: ' + formattedDate);
      lines.push('Venue or city: ' + venue);
      lines.push('Tell us about your wedding: ' + messageText);

      let closingSentence = '';
      if (formattedDate && venue) {
        closingSentence = 'Please confirm your availability for ' + formattedDate + ' at ' + venue + ' and share your packages and further details.';
      } else if (formattedDate) {
        closingSentence = 'Please confirm your availability for ' + formattedDate + ' and share your packages and further details.';
      } else if (venue) {
        closingSentence = 'Please confirm your availability for a wedding at ' + venue + ' and share your packages and further details.';
      } else {
        closingSentence = 'Please confirm your availability and share your packages and further details.';
      }

      let fullMessage = lines.join('\n') + '\n\n' + closingSentence;
      let whatsappUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(fullMessage);

      window.location.href = whatsappUrl;
    } catch (err) {
      window.location.href = 'https://wa.me/' + WHATSAPP_NUMBER;
    } finally {
      setTimeout(function () {
        isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }, 2000);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInquiryForm);
} else {
  initInquiryForm();
}

