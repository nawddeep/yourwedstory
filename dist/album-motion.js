(function () {
 'use strict';
 var root=document.querySelector('.album-story');if(!root)return;
 var reduced=matchMedia('(prefers-reduced-motion: reduce)');
 var panels=Array.from(root.querySelectorAll('[data-album-parallax]'));
 var frame=0,observer=null,animations=[];
 var revealed=new WeakSet();
 function measure(){
  document.documentElement.style.setProperty('--album-scrollbar',Math.max(0,innerWidth-document.documentElement.clientWidth)+'px');
  panels.forEach(function(panel){panel.style.setProperty('--album-overscan',Math.round(Math.min(innerHeight*.23,panel.getBoundingClientRect().height*.3))+'px');});
  queue();
 }
 function update(){
  frame=0;if(reduced.matches)return;
  panels.forEach(function(panel){
   var rect=panel.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)return;
   var overscan=Math.round(Math.min(innerHeight*.23,rect.height*.3));
   var drift=Math.max(-overscan,Math.min(overscan,(innerHeight/2-(rect.top+rect.height/2))*.5));
   panel.style.setProperty('--album-drift',drift.toFixed(2)+'px');
  });
 }
 function queue(){if(!reduced.matches&&!frame)frame=requestAnimationFrame(update);}
 function configure(){
  if(frame){cancelAnimationFrame(frame);frame=0;}
  if(observer){observer.disconnect();observer=null;}
  animations.forEach(function(animation){animation.cancel();});animations=[];
  panels.forEach(function(panel){panel.classList.toggle('album-parallax-active',!reduced.matches);if(reduced.matches)panel.style.removeProperty('--album-drift');});
  if(!reduced.matches&&'IntersectionObserver' in window){
   observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){
    if(!entry.isIntersecting)return;var image=entry.target;observer.unobserve(image);
    function reveal(){if(reduced.matches||revealed.has(image))return;revealed.add(image);animations.push(image.animate([{opacity:0},{opacity:1}],{duration:850,easing:'ease-out'}));}
    if(image.complete&&image.naturalWidth)reveal();else image.addEventListener('load',reveal,{once:true});
   });},{threshold:.08});
   root.querySelectorAll('.album-edit .album-frame:not([data-album-parallax]) img').forEach(function(image){if(!revealed.has(image))observer.observe(image);});
  }
  measure();
 }
 addEventListener('scroll',queue,{passive:true});addEventListener('resize',measure,{passive:true});
 reduced.addEventListener('change',configure);addEventListener('pageshow',measure);
 configure();
})();
