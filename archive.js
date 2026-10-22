const cfg=window.SALEM_SUPABASE;
const el=document.querySelector('#cards'),cat=document.querySelector('#category'),search=document.querySelector('#search'),empty=document.querySelector('#empty');
let items=[];
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){const q=search.value.toLowerCase().trim();const subset=items.filter(a=>(cat.value==='all'||a.category===cat.value)&&(a.title+' '+a.excerpt).toLowerCase().includes(q));el.innerHTML=subset.map(a=>`<article class="article-card"><div class="article-image">${h(a.tag)}</div><div class="article-content"><span class="article-meta">${h(a.category)} · ${h(a.date)}</span><h3>${h(a.title)}</h3><p>${h(a.excerpt)}</p><a class="button button-small article-read" href="read/?slug=${encodeURIComponent(a.slug)}">اقرأ المقال</a></div></article>`).join('');empty.hidden=subset.length>0;if(!subset.length)empty.textContent='لا توجد مقالات منشورة مطابقة حالياً.';}
async function init(){try{
 if (!cfg?.url || !cfg?.publishableKey) throw new Error('Missing Supabase config');
 const base=cfg.url+'/rest/v1/';const headers={'apikey':cfg.publishableKey};
 const [ar,cr]=await Promise.all([fetch(base+'articles?select=title,slug,excerpt,cover_image,published_at,category_id&status=eq.published&published_at=lte.'+encodeURIComponent(new Date().toISOString())+'&order=published_at.desc',{headers}),fetch(base+'categories?select=id,name',{headers})]);
 if(!ar.ok||!cr.ok)throw new Error('تعذر جلب البيانات');const [articles,cats]=await Promise.all([ar.json(),cr.json()]);const labels=Object.fromEntries(cats.map(c=>[c.id,c.name]));
 items=articles.map(a=>({...a,category:labels[a.category_id]||'مقالات',tag:labels[a.category_id]||'مقالات',date:a.published_at?new Intl.DateTimeFormat('ar-DZ',{dateStyle:'medium'}).format(new Date(a.published_at)):'',}));
 [...new Set(items.map(a=>a.category))].forEach(c=>cat.add(new Option(c,c)));render();
 }catch(err){el.textContent='تعذر تحميل المقالات. تحقق من اتصال الإنترنت وحاول مرة أخرى.';empty.hidden=true;console.error(err)}}
search.addEventListener('input',render);cat.addEventListener('change',render);init();
