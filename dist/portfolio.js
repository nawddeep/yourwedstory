(function(){
 'use strict';
 var data=document.getElementById('highlight-data');if(!data)return;
 var photos=JSON.parse(data.textContent),links=Array.from(document.querySelectorAll('.folio-triptych a'));
 var controls=document.querySelector('.folio-controls'),index=0;
 controls.hidden=false;
 function show(step){index=(index+step+photos.length)%photos.length;links.forEach(function(link,i){var p=photos[(index+i)%photos.length],img=link.querySelector('img');link.href=p.src;link.dataset.title=p.title;img.removeAttribute('srcset');img.src=p.src;img.alt=p.alt;});controls.querySelector('[role=status]').textContent=(index+1)+' of '+photos.length;}
 controls.querySelector('[data-highlight=previous]').addEventListener('click',function(){show(-1);});
 controls.querySelector('[data-highlight=next]').addEventListener('click',function(){show(1);});
})();
