// Read-only verification. Never changes DNS, Vercel aliases, or Supabase.
import {SITE} from '../lib/config.js';
const input=process.argv[2];if(!input)throw Error('Usage: node scripts/check-domain.mjs https://deployment.example');
const target=new URL(input);if(!['https:','http:'].includes(target.protocol)||target.username||target.password)throw Error('Invalid target URL');
const base=target.origin,results=[];
async function request(path,options={}){const r=await fetch(base+path,{redirect:'manual',signal:AbortSignal.timeout(25000),...options});return {r,text:await r.text()};}
for(const path of ['/','/articles/','/admin/','/about/','/contact/','/privacy/','/cookies/','/terms/','/videos/','/------/','/robots.txt','/sitemap.xml','/ads.txt']){
 const {r,text}=await request(path);if(r.status!==200)throw Error(`${path}: expected200, got${r.status}. Check deployment protection before retrying.`);
 if(r.headers.get('location')||/Log in to Vercel|Vercel Authentication/.test(text))throw Error('Deployment protection blocks app verification');
 if(path==='/'){for(const id of ['home','topics','videos','articles','partnership'])if(!text.includes(`id="${id}"`))throw Error('Homepage section missing: '+id);}
 if(path==='/admin/'){if(!text.includes('noindex')||text.includes('adsbygoogle.js'))throw Error('Admin indexing/ads');}
 else if(!path.endsWith('.txt')&&!path.endsWith('.xml')){if(!text.includes(`rel="canonical" href="${SITE+path}"`))throw Error(path+': canonical mismatch');}
 if(path==='/sitemap.xml'){
  if(/salem-dztube-website\.vercel\.app|\/admin\//.test(text))throw Error('Sitemap origin/private path mismatch');
  const article=[...text.matchAll(/<loc>([^<]+\/articles\/[^<]+\/)<\/loc>/g)][0]?.[1];if(!article)throw Error('Expected a published article');
  const u=new URL(article);const a=await request(u.pathname);if(a.r.status!==200||!a.text.includes('application/ld+json')||!a.text.includes(SITE+u.pathname))throw Error('Article SSR/SEO failed');results.push({path:u.pathname,status:200});
 }
 results.push({path,status:r.status});
}
for(const [path,destination] of [['/almdwnh','/videos/'],['/page-7_fWx','/videos/'],['/page-4jdwt','/contact/']]){const {r}=await request(path);if(r.status!==301||new URL(r.headers.get('location'),base).pathname!==destination)throw Error('Legacy redirect mismatch: '+path);results.push({path,status:301,destination});}
const retired=await request('/page/');if(retired.r.status!==410)throw Error('Retired store should be410');
const missing=await request('/migration-missing-page/');if(missing.r.status!==404)throw Error('Unknown page should be404');
console.log(JSON.stringify({target:base,expectedCanonicalOrigin:SITE,results,retiredStore:410,unknown:404},null,2));
