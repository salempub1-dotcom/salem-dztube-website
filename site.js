const toggle=document.getElementById('menu-toggle'),nav=document.getElementById('main-nav');
if(toggle&&nav){toggle.addEventListener('click',()=>{toggle.setAttribute('aria-expanded',String(nav.classList.toggle('open')))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}});}
document.querySelectorAll('[data-video]').forEach(button=>button.addEventListener('click',()=>{
 const frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/'+button.dataset.video;frame.title='فيديو SalemDZTube';frame.className='read-video';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';button.replaceWith(frame);
}));
for(const id of ['share','copy-link'])document.getElementById(id)?.addEventListener('click',async e=>{
 const url=e.currentTarget.dataset.url,status=document.getElementById('share-status');
 try{if(id==='share'&&navigator.share){await navigator.share({title:document.title,url});}else{await navigator.clipboard.writeText(url);status.textContent='تم نسخ الرابط';}}catch(err){if(err.name!=='AbortError')status.textContent='تعذر النسخ؛ يمكنك نسخ رابط الصفحة من شريط العنوان.';}
});
