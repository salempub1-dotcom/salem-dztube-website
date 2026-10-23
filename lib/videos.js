import {escapeHTML as h} from './content.js';
export const validVideoId = value => /^[\w-]{11}$/.test(value || '');
export function videoThumbnail(video) {
  return /^\/assets\/videos\/[a-z0-9-]+\.webp$/.test(video.thumbnail || '')
    ? video.thumbnail
    : validVideoId(video.youtubeId) ? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg` : '/assets/video-placeholder.svg';
}
export function videoCard(v) {
  const hasVideo=validVideoId(v.youtubeId);
  const href=hasVideo?'https://www.youtube.com/watch?v='+v.youtubeId:'https://www.youtube.com/@SalemDZTube/videos';
  const thumb=`<div class="video-thumb"><img loading="lazy" decoding="async" alt="" width="720" height="405" src="${h(videoThumbnail(v))}" data-video-id="${hasVideo?h(v.youtubeId):''}"><span class="thumb-label">${h(v.tag)}</span><span class="thumb-play">▶</span>${v.duration?`<span class="duration">${h(v.duration)}</span>`:''}</div>`;
  return `<article class="video-card"><a class="video-click" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${hasVideo?'شاهد':'ابحث في القناة عن'} ${h(v.title)}">${thumb}</a><h3><a href="${href}" target="_blank" rel="noopener noreferrer">${h(v.title)}</a></h3><div class="video-meta"><span>${h(v.category)}</span>${!hasVideo?'<span>تصفّح القناة</span>':''}</div></article>`;
}
export function bindVideoThumbnailFallbacks(root) {
  root.querySelectorAll('.video-thumb img').forEach(img=>{
    let remoteTried=img.src.startsWith('https://img.youtube.com/');
    const recover=()=>{
      if(!remoteTried&&validVideoId(img.dataset.videoId)){
        remoteTried=true;
        img.src=`https://img.youtube.com/vi/${img.dataset.videoId}/hqdefault.jpg`;
      }else{
        img.removeEventListener('error',recover);
        img.src='/assets/video-placeholder.svg';
      }
    };
    img.addEventListener('error',recover);
    // A cached failure can fire before listeners are attached.
    if(img.complete&&!img.naturalWidth)recover();
  });
}
