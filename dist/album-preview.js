(function(){
 var selected={"pranav-malini-wedding": ["../images/collections/pranav-malini-wedding/011-small.jpg", "../images/collections/pranav-malini-wedding/006-small.jpg", "../images/collections/pranav-malini-wedding/021-small.jpg"], "arushi-manoj": ["../images/collections/arushi-manoj/001-small.jpg", "../images/collections/arushi-manoj/034-small.jpg", "../images/collections/arushi-manoj/023-small.jpg"], "zainab-taher": ["../images/collections/zainab-taher/001-small.jpg", "../images/collections/zainab-taher/013-small.jpg", "../images/collections/zainab-taher/010-small.jpg"], "aditi-xavier": ["../images/collections/aditi-xavier/037-small.jpg", "../images/collections/aditi-xavier/049-small.jpg", "../images/collections/aditi-xavier/025-small.jpg"], "pranav-malini": ["../images/collections/pranav-malini/037-small.jpg", "../images/collections/pranav-malini/025-small.jpg", "../images/collections/pranav-malini/013-small.jpg"], "vatsala-aayush": ["../images/collections/vatsala-aayush/016-small.jpg", "../images/collections/vatsala-aayush/011-small.jpg", "../images/collections/vatsala-aayush/006-small.jpg"], "nigel-cyananda": ["../images/collections/nigel-cyananda/025-small.jpg", "../images/collections/nigel-cyananda/009-small.jpg", "../images/collections/nigel-cyananda/033-small.jpg"]};
 document.querySelectorAll('.folio-albums a').forEach(function(link){
  var album=link.getAttribute('href').replace(/\/$/,'').split('/').pop(),frame=selected[album];
  if(!frame)return;
  var cover=link.querySelector('img'),wrap=document.createElement('div');
  wrap.className='album-preview';cover.before(wrap);wrap.appendChild(cover);
  var preview=document.createElement('img');preview.className='album-preview__image';
  preview.src=frame[0];preview.alt='';preview.setAttribute('aria-hidden','true');
  wrap.appendChild(preview);
  var timer,index=0;
  function start(){clearInterval(timer);index=0;preview.src=frame[0];timer=setInterval(function(){index=(index+1)%frame.length;preview.src=frame[index];},1400);}
  function stop(){clearInterval(timer);}
  link.addEventListener('mouseenter',start);link.addEventListener('mouseleave',stop);
  link.addEventListener('focus',start);link.addEventListener('blur',stop);
 });
})();
