import './site.js';
import {SUPABASE_URL,SUPABASE_KEY} from './lib/config.js';
import {escapeHTML as h,articleCard} from './lib/content.js';
import {videoCard,bindVideoThumbnailFallbacks} from './lib/videos.js';
const $=selector=>document.querySelector(selector);
const state={videos:[],filter:'الكل',term:''};
$('#year').textContent=new Date().getFullYear();
function renderFilters(){const filters=['الكل',...new Set(state.videos.map(v=>v.category))];$('#video-filters').innerHTML=filters.map(f=>`<button type="button" class="chip ${state.filter===f?'selected':''}" aria-pressed="${state.filter===f}" data-filter="${h(f)}">${h(f)}</button>`).join('');$('#video-filters').querySelectorAll('button').forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;renderFilters();renderVideos()});}
function renderVideos(){const list=state.videos.filter(v=>(state.filter==='الكل'||v.category===state.filter)&&(v.title+' '+v.category).toLowerCase().includes(state.term));$('#video-grid').innerHTML=list.map(videoCard).join('');$('#video-empty').hidden=!!list.length;bindVideoThumbnailFallbacks($('#video-grid'));}
$('#video-search').addEventListener('input',e=>{state.term=e.target.value.trim().toLowerCase();renderVideos()});
async function videos(){try{const r=await fetch('/content/videos.json',{cache:'no-cache'});if(!r.ok)throw Error();state.videos=await r.json();renderFilters();renderVideos();}catch{if($('#video-grid .video-card')){bindVideoThumbnailFallbacks($('#video-grid'));return;}$('#video-grid').innerHTML='<p>تعذر تحميل الفيديوهات. <a class="text-link" href="https://www.youtube.com/@SalemDZTube/videos">تصفح القناة</a></p>';}}
async function articles(){try{const params=new URLSearchParams({select:'title,slug,excerpt,cover_image,published_at,categories(name)',status:'eq.published',published_at:'lte.'+new Date().toISOString(),order:'published_at.desc',limit:'3'});const r=await fetch(SUPABASE_URL+'/rest/v1/articles?'+params,{headers:{apikey:SUPABASE_KEY},signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error();const items=await r.json();$('#article-grid').innerHTML=items.length?items.map(articleCard).join(''):'<p class="empty-state">لا توجد مقالات منشورة حالياً. يمكنك متابعة الشروحات على القناة.</p>';}catch{$('#article-grid').innerHTML='<p>تعذر تحميل المقالات مؤقتاً. يرجى المحاولة لاحقاً.</p>';}}
bindVideoThumbnailFallbacks($('#video-grid'));
void videos();void articles();
