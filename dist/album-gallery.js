(function(){
 'use strict';
 var strip=document.querySelector('.album-filmstrip');if(!strip)return;
 var photos=Array.from(strip.querySelectorAll('[data-artwork]')),returnTo=null;
 function openFrom(trigger,photo){returnTo={element:trigger,x:scrollX,y:scrollY};photo.click();}
 document.querySelectorAll('[data-gallery-open]').forEach(function(link){link.addEventListener('click',function(event){if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;var photo=photos[Number(link.dataset.galleryOpen)];if(!photo)return;event.preventDefault();openFrom(link,photo);});});
 document.querySelector('[data-open-full-story]').addEventListener('click',function(){if(photos[0])openFrom(this,photos[0]);});
 var viewer=document.querySelector('.work-viewer');if(viewer)viewer.addEventListener('close',function(){if(!returnTo)return;var saved=returnTo;returnTo=null;saved.element.focus({preventScroll:true});window.scrollTo({left:saved.x,top:saved.y,behavior:'instant'});});
 document.querySelectorAll('[data-strip-step]').forEach(function(button){button.addEventListener('click',function(){strip.scrollBy({left:Number(button.dataset.stripStep)*strip.clientWidth*.8,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});});
})();
