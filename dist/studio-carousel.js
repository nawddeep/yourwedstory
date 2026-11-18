(function(){
 'use strict';
 var root=document.querySelector('.studio-carousel');if(!root)return;
 var slides=Array.from(root.querySelectorAll('.studio-carousel__slide'));
 var controls=root.querySelector('.studio-carousel__controls'),play=root.querySelector('[data-studio-play]');
 var reduce=matchMedia('(prefers-reduced-motion: reduce)'),paused=reduce.matches,index=0,timer=null,visible=false,hovered=false;
 slides.forEach(function(s,i){s.hidden=false;s.setAttribute('aria-hidden',String(i!==0));});controls.hidden=true;
 function schedule(){clearTimeout(timer);play.textContent=paused?'Play slideshow':'Pause slideshow';if(!paused&&visible&&!hovered&&!document.hidden)timer=setTimeout(function(){show(index+1,false);},2000);}
 function show(n,manual){index=(n+slides.length)%slides.length;slides.forEach(function(s,i){s.classList.toggle('is-active',i===index);s.setAttribute('aria-hidden',String(i!==index));});root.querySelector('.studio-carousel__count').textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');if(manual){paused=true;root.querySelector('[data-studio-status]').textContent='Photograph '+(index+1)+' of '+slides.length+': '+slides[index].alt;}schedule();}
 controls.querySelectorAll('[data-studio-step]').forEach(function(b){b.addEventListener('click',function(){show(index+Number(b.dataset.studioStep),true);});});
 play.addEventListener('click',function(){paused=!paused;schedule();});
 root.addEventListener('focusin',function(){paused=true;schedule();});
 root.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'&&matchMedia('(hover: hover)').matches){hovered=true;schedule();}});root.addEventListener('pointerleave',function(){hovered=false;schedule();});
 root.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1),true);}else if(e.code==='Space'){e.preventDefault();paused=!paused;schedule();}});
 var down=null,viewport=root.querySelector('.studio-carousel__viewport');
 viewport.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'){down={x:e.clientX,y:e.clientY};if(viewport.setPointerCapture)viewport.setPointerCapture(e.pointerId);}});
 viewport.addEventListener('pointerup',function(e){if(!down)return;var dx=e.clientX-down.x,dy=e.clientY-down.y;down=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){show(index+(dx<0?1:-1),true);paused=reduce.matches;schedule();}});viewport.addEventListener('pointercancel',function(){down=null;});
 document.addEventListener('visibilitychange',schedule);reduce.addEventListener('change',function(){paused=true;schedule();});
 if('IntersectionObserver' in window)new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;schedule();},{threshold:.15}).observe(root);else{visible=true;schedule();}
})();
