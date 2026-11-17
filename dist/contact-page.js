(function () {
 'use strict';
 var photos=Array.from(document.querySelectorAll('.contact-photos img'));
 var reduced=matchMedia('(prefers-reduced-motion: reduce)'), timer, index=0;
 photos.forEach(function(photo,i){photo.hidden=false;photo.setAttribute('aria-hidden',String(i!==0));});
 function schedule(){clearInterval(timer);if(!reduced.matches&&!document.hidden)timer=setInterval(function(){index=(index+1)%photos.length;photos.forEach(function(photo,i){photo.classList.toggle('is-active',i===index);photo.setAttribute('aria-hidden',String(i!==index));});},2000);}
 reduced.addEventListener('change',schedule);document.addEventListener('visibilitychange',schedule);schedule();
 var form=document.getElementById('studio-contact-form'), status=document.getElementById('contact-status'), submitted=false;
 var fields=Array.from(form.querySelectorAll('input:not([name="website"]),select,textarea'));
 function errorFor(field){var value=field.value.trim();if(field.required&&!value)return 'Please complete this field.';if(field.type==='email'&&!field.validity.valid)return 'Please enter a valid email address.';if(field.name==='phone'&&value.replace(/\D/g,'').length<7)return 'Please enter a valid phone number.';if(field.name==='date'&&value){var parts=/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);if(!parts)return 'Use DD/MM/YYYY.';var date=new Date(+parts[3],+parts[2]-1,+parts[1]);if(date.getFullYear()!==+parts[3]||date.getMonth()!==+parts[2]-1||date.getDate()!==+parts[1]||+parts[3]<1900||+parts[3]>2200)return 'Please enter a valid calendar date.';}return '';}
 function validate(field){var message=errorFor(field);field.setAttribute('aria-invalid',String(!!message));document.getElementById(field.id+'-error').textContent=message;return !message;}
 fields.forEach(function(field){field.addEventListener('input',function(){if(submitted)validate(field);});});
 form.addEventListener('submit',function(event){event.preventDefault();if(form.elements.website.value)return;submitted=true;status.replaceChildren();var invalid=fields.filter(function(field){return !validate(field);});if(invalid.length){status.textContent='Please check the highlighted fields.';invalid[0].focus();return;}
 var labels={name:'Names',email:'Email',phone:'Phone / WhatsApp',date:'Wedding / shoot date',location:'Location',days:'Number of days',planner:'Planner',source:'How you found us',why:'Why Your Wed Stories',message:'Vision / event flow / venues'};
 var lines=['Hello Your Wed Stories,'];fields.forEach(function(field){if(field.value.trim())lines.push(labels[field.name]+': '+field.value.trim());});lines.push('','Please confirm your availability and share further details.');
 var url='https://wa.me/918875005588?text='+encodeURIComponent(lines.join('\n'));
 var link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Open your prepared inquiry in WhatsApp';status.append('Your inquiry is ready. Review and send it in WhatsApp. ',link);
 window.open(url,'_blank','noopener,noreferrer');
 });
})();
