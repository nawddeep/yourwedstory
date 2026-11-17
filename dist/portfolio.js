(function(){
 'use strict';
 var data=document.getElementById('highlight-data');if(!data)return;
 var photos=JSON.parse(data.textContent),links=Array.from(document.querySelectorAll('.folio-triptych a'));
 var controls=document.querySelector('.folio-controls'),index=0,timer,busy=false;
 var reduce=matchMedia('(prefers-reduced-motion: reduce)');
 controls.hidden=false;
 // Load the next frames before a transition, keeping every frame fully painted.
 function preload(p){return new Promise(function(resolve){var img=new Image();img.onload=img.onerror=resolve;img.src=p.src;});}
 photos.forEach(preload);
 function show(step){
  if(busy)return;busy=true;
  var next=(index+step+photos.length)%photos.length;
  Promise.all(links.map(function(_,i){return preload(photos[(next+i)%photos.length]);})).then(function(){
   index=next;
   var transitions=links.map(function(link,i){
    var p=photos[(index+i)%photos.length],img=link.querySelector('img'),old=img.cloneNode();
    old.removeAttribute('srcset');old.classList.add('highlight-outgoing');old.alt='';old.setAttribute('aria-hidden','true');
    link.appendChild(old);link.href=p.src;link.dataset.title=p.title;
    img.removeAttribute('srcset');img.src=p.src;img.alt=p.alt;
    if(reduce.matches){old.remove();return Promise.resolve();}
    var direction=step<0?-1:1;
    img.animate([{transform:'translateX('+direction*18+'px) scale(1.025)'},{transform:'translateX(0) scale(1)'}],{duration:1100,easing:'cubic-bezier(.22,1,.36,1)'});
    var fade=old.animate([{opacity:1,transform:'translateX(0) scale(1)'},{opacity:0,transform:'translateX('+(-direction*12)+'px) scale(1.015)'}],{duration:950,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
    return fade.finished.catch(function(){}).then(function(){old.remove();});
   });
   return Promise.all(transitions);
  }).finally(function(){busy=false;});
 }
 function start(){clearInterval(timer);if(!document.hidden)timer=setInterval(function(){if(!document.querySelector('dialog[open]'))show(1);},2000);}
 controls.querySelector('[data-highlight=previous]').addEventListener('click',function(){show(-1);start();});
 controls.querySelector('[data-highlight=next]').addEventListener('click',function(){show(1);start();});
 document.addEventListener('visibilitychange',start);start();
})();
