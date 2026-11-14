(function () {
 'use strict';
 var hero=document.querySelector('.hero-slider'); if(!hero)return;
 var slides=Array.from(hero.querySelectorAll(':scope > img'));
 var controls=hero.querySelector('.hero-slider__controls');
 var buttons=Array.from(controls.querySelectorAll('[data-slide]'));
 var play=controls.querySelector('.slider-play');
 var reduced=matchMedia('(prefers-reduced-motion: reduce)');
 var paused=reduced.matches, index=0, timer;
 slides.forEach(function(s,i){s.hidden=false;s.classList.add('hero-slide');s.classList.toggle('is-active',i===0);s.setAttribute('aria-hidden',String(i!==0));});
 controls.hidden=false;
 function schedule(){clearInterval(timer);if(!paused&&!document.hidden)timer=setInterval(function(){show((index+1)%slides.length,false);},6500);play.textContent=paused?'Play':'Pause';}
 function show(n,manual){index=n;slides.forEach(function(s,i){s.classList.toggle('is-active',i===n);s.setAttribute('aria-hidden',String(i!==n));});buttons.forEach(function(b,i){b.setAttribute('aria-pressed',String(i===n));});if(manual){hero.querySelector('.slider-status').textContent='Photograph '+(n+1)+' of '+slides.length;paused=true;}schedule();}
 buttons.forEach(function(b,i){b.addEventListener('click',function(){show(i,true);});});
 play.addEventListener('click',function(){paused=!paused;schedule();});
 hero.addEventListener('focusin',function(){paused=true;schedule();});
 document.addEventListener('visibilitychange',schedule);
 reduced.addEventListener('change',function(){paused=true;schedule();});
 schedule();
})();
