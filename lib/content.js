import {articleVisual} from './article-visuals.js';
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function safeImage(value) {
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.href : ''; } catch { return ''; }
}
export function youtubeId(value) {
  try {
    const u = new URL(value);
    if (u.protocol !== 'https:') return '';
    let id = '';
    if (u.hostname === 'youtu.be') id = u.pathname.slice(1);
    if (['youtube.com','www.youtube.com','m.youtube.com'].includes(u.hostname)) id = u.searchParams.get('v') || u.pathname.match(/^\/(?:embed|shorts)\/([^/]+)$/)?.[1];
    return /^[\w-]{11}$/.test(id || '') ? id : '';
  } catch { return ''; }
}
export const blocksOf = body => Array.isArray(body) ? body.filter(b => b && typeof b.text === 'string').map(b => ({type:['h2','h3','list','quote','table'].includes(b.type) ? b.type : 'paragraph',text:b.text})) : [];
export const readingMinutes = body => Math.max(1, Math.ceil(blocksOf(body).map(b=>b.text).join(' ').split(/\s+/).filter(Boolean).length / 200));
export function parseBody(text) {
  return text.split(/\n\s*\n/).map(t=>t.trim()).filter(Boolean).map(text=>{
    if(text.split('\n').length>=3 && /^\|?\s*:?-{3,}/.test(text.split('\n')[1])) return {type:'table',text};
    if(text.startsWith('### ')) return {type:'h3',text:text.slice(4)};
    if(text.startsWith('## ')) return {type:'h2',text:text.slice(3)};
    if(text.startsWith('> ')) return {type:'quote',text:text.slice(2)};
    if(text.split('\n').every(l=>l.startsWith('- '))) return {type:'list',text:text.split('\n').map(l=>l.slice(2)).join('\n')};
    return {type:'paragraph',text};
  });
}
export function formatBody(body) {
  return blocksOf(body).map(b => ({h2:'## ',h3:'### ',quote:'> '}[b.type]||'') + (b.type==='list' ? b.text.split('\n').map(l=>'- '+l).join('\n') : b.text)).join('\n\n');
}
// Markdown-style links are parsed before escaping; only safe destinations survive.
export function safeLink(value) {
  if (/^\/articles\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(value) || ['/', '/articles/', '/about/', '/contact/', '/privacy/', '/cookies/', '/terms/'].includes(value)) return value;
  try { const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:''; } catch {return '';}
}
export function renderInline(text) {
  let output='',last=0;
  for(const match of text.matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)){
    output+=escapeHTML(text.slice(last,match.index));const url=safeLink(match[2]);
    output+=url?`<a class="text-link" href="${escapeHTML(url)}"${url.startsWith('https:')?' rel="noopener noreferrer" target="_blank"':''}>${escapeHTML(match[1])}</a>`:escapeHTML(match[1]);
    last=match.index+match[0].length;
  }
  return (output+escapeHTML(text.slice(last))).replace(/\n/g,'<br>');
}
function renderTable(text) {
  const rows=text.split('\n').map(row=>row.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim()));
  const [heads,,...body]=rows;
  if(heads.length<2||!body.length||body.some(r=>r.length!==heads.length))return `<p>${renderInline(text)}</p>`;
  return `<div class="table-scroll" tabindex="0" role="region" aria-label="جدول في المقال"><table><thead><tr>${heads.map(c=>`<th scope="col">${renderInline(c)}</th>`).join('')}</tr></thead><tbody>${body.map(row=>`<tr>${row.map(c=>`<td>${renderInline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
export function renderBody(body) {
  return blocksOf(body).map((b,i)=>{
    const t=renderInline(b.text);
    if(b.type==='table')return renderTable(b.text);
    if(b.type==='h2'||b.type==='h3') return `<${b.type} id="section-${i}">${t}</${b.type}>`;
    if(b.type==='quote') return `<blockquote>${t}</blockquote>`;
    if(b.type==='list') return `<ul>${b.text.split('\n').map(t=>`<li>${renderInline(t)}</li>`).join('')}</ul>`;
    return `<p>${t}</p>`;
  }).join('');
}
export function renderTOC(body) {
  const heads=blocksOf(body).map((b,i)=>({...b,i})).filter(b=>b.type==='h2'||b.type==='h3');
  return heads.length<3?'':`<nav class="toc" aria-label="جدول المحتويات"><h2>محتويات المقال</h2><ul>${heads.map(b=>`<li><a href="#section-${b.i}">${escapeHTML(b.text)}</a></li>`).join('')}</ul></nav>`;
}
export function dateLabel(value) { return value && Number.isFinite(Date.parse(value)) ? new Intl.DateTimeFormat('ar-DZ',{dateStyle:'long',timeZone:'Africa/Algiers'}).format(new Date(value)) : ''; }
export function articleCard(a) {
  const cover=articleCover(a),category=a.categories?.name||'مقالات';
  return `<article class="article-card"><a href="/articles/${encodeURIComponent(a.slug)}/" tabindex="-1" aria-hidden="true"><div class="article-image">${cover?`<img src="${escapeHTML(cover)}" alt="" loading="lazy" width="640" height="360">`:escapeHTML(category)}</div></a><div class="article-content"><span class="article-meta">${escapeHTML(category)} · ${dateLabel(a.published_at)}</span><h3><a href="/articles/${encodeURIComponent(a.slug)}/">${escapeHTML(a.title)}</a></h3><p>${escapeHTML(a.excerpt)}</p><a class="button button-small article-read" href="/articles/${encodeURIComponent(a.slug)}/">اقرأ المقال</a></div></article>`;
}
export const articleCover = article => safeImage(article.cover_image) || articleVisual(article.slug)?.cover || '';
export const articleCoverAlt = article => safeImage(article.cover_image) ? article.title : articleVisual(article.slug)?.alt || article.title;
export function renderArticleIllustration(slug) {
  const visual=articleVisual(slug);
  if(!visual)return '';
  return `<figure class="article-illustration"><img src="${escapeHTML(visual.diagram)}" alt="${escapeHTML(visual.diagramAlt)}" width="720" height="1040" loading="lazy" decoding="async"><figcaption>${escapeHTML(visual.caption)}</figcaption></figure>`;
}
export function videoEmbed(value) {
  const id=youtubeId(value);
  return id?`<section class="video-consent"><h2>شاهد الشرح بالفيديو</h2><p>تحميل المشغّل يتصل بخدمة YouTube الخارجية. يمكنك أيضاً <a class="text-link" href="https://www.youtube.com/watch?v=${id}" rel="noopener noreferrer" target="_blank">المشاهدة على YouTube</a>.</p><button class="button" type="button" data-video="${id}">السماح بتحميل الفيديو</button></section>`:'';
}
