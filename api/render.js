import {SITE,AUTHOR} from '../lib/config.js';
import {page,notFound} from '../lib/layout.js';
import {escapeHTML as h,articleCard,articleCover,articleCoverAlt,renderArticleIllustration,renderBody,renderTOC,readingMinutes,dateLabel,videoEmbed} from '../lib/content.js';
import {publicQuery,publishedParams,searchFilter} from '../lib/data.js';
const fields='*,categories(name,slug)';
const isSlug=s=>/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
const permanentPages=['/','/articles/','/about/','/contact/','/privacy/','/cookies/','/terms/','/videos/','/------/'];
export async function renderRequest(url,query=publicQuery) {
 const path=url.pathname.replace(/\/$/,'')||'/';
 if(path==='/page'){return {status:410,html:page({title:'الصفحة القديمة لم تعد متاحة',description:'صفحة المتجر القديمة لا تحتوي على خدمة نشطة في هذا الموقع.',path:'/page/',noindex:true,content:'<section class="wrap reading-layout"><h1>410 — الصفحة القديمة لم تعد متاحة</h1><p>صفحة المتجر في النسخة السابقة لم تكن تعرض منتجات. لا يوجد متجر بديل في SalemDZTube.</p><a class="text-link" href="/contact/">التواصل مع SalemDZTube</a></section>'})};}
 if(path==='/articles/read') {
  const slug=url.searchParams.get('slug');
  return isSlug(slug||'')?{status:308,location:`/articles/${slug}/`}:{status:404,html:notFound()};
 }
 if(path==='/sitemap.xml') {
  // Paginate: PostgREST may cap rows per request; never silently truncate the sitemap.
  let rows=[],offset=0;
  while(true){const {data}=await query('articles',{select:'slug,updated_at',...publishedParams(),order:'id.asc',limit:'500',offset:String(offset)});rows.push(...data);if(data.length<500)break;offset+=500;}
  const links=permanentPages.map(p=>`<url><loc>${SITE+p}</loc></url>`).concat(rows.map(a=>`<url><loc>${SITE}/articles/${h(a.slug)}/</loc>${a.updated_at?`<lastmod>${h(a.updated_at)}</lastmod>`:''}</url>`));
  return {status:200,type:'application/xml; charset=utf-8',html:`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${links.join('')}</urlset>`};
 }
 if(path==='/articles') {
  const q=(url.searchParams.get('q')||'').trim().slice(0,150),cat=url.searchParams.get('category')||'';
  const number=Number(url.searchParams.get('page')||1),current=Number.isSafeInteger(number)&&number>0&&number<100000?number:1;
  const {data:cats}=await query('categories',{select:'id,name,slug',order:'name'});
  const category=cats.find(c=>c.slug===cat);
  if(cat&&!category)return {status:404,html:notFound()};
  const params={select:fields,...publishedParams(),order:'published_at.desc,id.asc',limit:'12',offset:String((current-1)*12)};
  if(q)params.or=searchFilter(q);if(category)params.category_id='eq.'+category.id;
  const {data:articles,count}=await query('articles',params);
  if(current>1&&!articles.length)return {status:404,html:notFound()};
  const link=n=>'/articles/?'+new URLSearchParams({...q?{q}:{},...cat?{category:cat}:{},page:n});
  const canonicalPath=current>1?`/articles/?page=${current}`:'/articles/';
  const content=`<section class="wrap archive-head"><span class="kicker">المعرفة والتطبيق</span><h1 class="page-title">المقالات والشروحات</h1><p>شروحات عملية في التجارة الإلكترونية والتقنية في الجزائر.</p><form class="archive-toolbar" method="get" action="/articles/"><label class="search-label">البحث<input name="q" type="search" value="${h(q)}" maxlength="150" placeholder="ابحث عن مقال أو موضوع..."></label><label>التصنيف<select name="category"><option value="">كل التصنيفات</option>${cats.map(c=>`<option value="${h(c.slug)}" ${c.slug===cat?'selected':''}>${h(c.name)}</option>`).join('')}</select></label><button class="button" type="submit">بحث</button></form></section><section class="wrap archive-grid" aria-label="المقالات"><div class="article-grid">${articles.map(articleCard).join('')}</div>${articles.length?'':'<p class="empty-state">لا توجد مقالات منشورة مطابقة حالياً.</p>'}<nav class="pagination" aria-label="صفحات المقالات">${current>1?`<a class="button button-outline" href="${h(link(current-1))}">السابق</a>`:''}${count>12?`<span>الصفحة ${current} من ${Math.ceil(count/12)}</span>`:''}${current*12<count?`<a class="button" href="${h(link(current+1))}">التالي</a>`:''}</nav></section>`;
  return {status:200,html:page({title:category?`مقالات ${category.name}`:'المقالات والشروحات',description:'مقالات SalemDZTube حول التجارة الإلكترونية في الجزائر والإعلانات والذكاء الاصطناعي والدفع الإلكتروني والعمل الحر.',path:canonicalPath,noindex:!!(q||cat),content})};
 }
 const slug=path.match(/^\/articles\/([a-z0-9]+(?:-[a-z0-9]+)*)$/)?.[1];
 if(!slug)return {status:404,html:notFound()};
 const {data}=await query('articles',{select:fields,...publishedParams(),slug:'eq.'+slug,limit:'1'});
 const a=data[0];if(!a)return {status:404,html:notFound()};
 const cover=articleCover(a),canonical=SITE+`/articles/${a.slug}/`,seoImage=cover?new URL(cover,SITE).href:'';
 const {data:related}=await query('articles',{select:fields,...publishedParams(),id:'neq.'+a.id,...a.category_id?{category_id:'eq.'+a.category_id}:{},order:'published_at.desc',limit:'3'});
 const content=`<div class="wrap"><p class="breadcrumbs"><a href="/">الرئيسية</a> / <a href="/articles/">المقالات</a> / ${h(a.categories?.name||'مقال')}</p><article class="reading-layout"><h1 class="page-title">${h(a.title)}</h1><p class="reading-meta">بقلم ${AUTHOR} · نُشر ${dateLabel(a.published_at)} · آخر تحديث ${dateLabel(a.updated_at)} · ${readingMinutes(a.body)} دقائق قراءة</p>${cover?`<img class="article-cover" src="${h(cover)}" alt="${h(articleCoverAlt(a))}" width="1200" height="675" fetchpriority="high">`:''}<p><strong>${h(a.excerpt)}</strong></p>${renderTOC(a.body)}${renderArticleIllustration(a.slug)}${renderBody(a.body)}${videoEmbed(a.youtube_url)}<div class="share-links"><button type="button" class="button" id="share" data-url="${h(canonical)}">مشاركة المقال</button><button type="button" class="button button-outline" id="copy-link" data-url="${h(canonical)}">نسخ الرابط</button><span id="share-status" role="status"></span></div><p><a class="text-link" href="/contact/">أرسل تصحيحاً أو ملاحظة</a></p></article>${related.length?`<section class="archive-grid"><h2>مقالات ذات صلة</h2><div class="article-grid">${related.map(articleCard).join('')}</div></section>`:''}</div>`;
 const schema={'@context':'https://schema.org','@type':'Article',headline:a.title,description:a.seo_description||a.excerpt,mainEntityOfPage:canonical,datePublished:a.published_at,dateModified:a.updated_at,inLanguage:'ar-DZ',author:{'@type':'Person',name:AUTHOR,url:SITE+'/about/'},publisher:{'@type':'Organization',name:'SalemDZTube',url:SITE},...seoImage?{image:[seoImage]}:{}};
 return {status:200,html:page({title:a.seo_title||a.title,description:a.seo_description||a.excerpt,path:`/articles/${a.slug}/`,type:'article',...seoImage?{image:seoImage}:{},schema,content})};
}
export default async function handler(req,res) {
 res.setHeader('Cache-Control','no-store'); // Immediate unpublish: avoid serving a cached article after RLS hides it.
 res.setHeader('X-Content-Type-Options','nosniff');
 if(process.env.VERCEL_ENV==='preview')res.setHeader('X-Robots-Tag','noindex, nofollow');
 if(!['GET','HEAD'].includes(req.method)){res.setHeader('Allow','GET, HEAD');res.statusCode=405;return res.end();}
 try {
  const url=new URL(req.url,'https://local.invalid');
  // Rewrite uses a fixed route value; article slug is validated again in renderRequest.
  const route=url.searchParams.get('route');
  if(route){url.pathname='/'+route;url.searchParams.delete('route');}
  const result=await renderRequest(url);
  if(result.location){res.statusCode=result.status;res.setHeader('Location',result.location);return res.end();}
  res.statusCode=result.status;res.setHeader('Content-Type',result.type||'text/html; charset=utf-8');
  if(result.status!==200)res.setHeader('X-Robots-Tag','noindex');
  res.end(req.method==='HEAD'?'':result.html);
 }catch(error){console.error('Public content unavailable:',error.message);res.statusCode=503;res.setHeader('Retry-After','60');res.setHeader('X-Robots-Tag','noindex');res.setHeader('Content-Type','text/html; charset=utf-8');res.end(page({title:'المحتوى غير متاح مؤقتاً',description:'يرجى المحاولة بعد قليل.',path:'/articles/',noindex:true,content:'<section class="wrap reading-layout"><h1>تعذر تحميل المحتوى مؤقتاً</h1><p>يرجى إعادة المحاولة بعد قليل.</p><a class="button" href="/">الرئيسية</a></section>'}));}
}
