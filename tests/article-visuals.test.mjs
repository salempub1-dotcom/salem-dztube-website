import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {ARTICLE_VISUALS,articleVisual} from '../lib/article-visuals.js';
import {articleCover,articleCoverAlt,articleCard,renderArticleIllustration} from '../lib/content.js';
import {renderRequest} from '../api/render.js';
const site='https://salem-dztube-website.vercel.app';
test('trusted editorial assets exist in build and arbitrary slugs cannot resolve files',async()=>{
 for(const [slug,v] of Object.entries(ARTICLE_VISUALS)){
  assert.match(slug,/^[a-z0-9-]+$/);
  for(const path of [v.cover,v.diagram]){assert.ok((await stat('dist'+path)).size>0);assert.match(path,/^\/assets\/articles\/[a-z0-9-]+\.(webp|svg)$/);}
  assert.ok((await stat('dist'+v.cover)).size<100_000);
  const svg=await readFile('dist'+v.diagram,'utf8');assert.doesNotMatch(svg,/<script|<foreignObject|https?:\/\/(?!www.w3.org)/);assert.match(svg,/<title/);
 }
 for(const slug of ['toString','__proto__','../../etc/passwd','unknown'])assert.equal(articleVisual(slug),undefined);
 await stat('dist/lib/article-visuals.js');
});
test('CMS HTTPS cover overrides editorial art without accepting unsafe input',()=>{
 const a={slug:'cod-order-tracking-algeria',title:'مقال',categories:{name:'قسم'}};
 assert.equal(articleCover(a),ARTICLE_VISUALS[a.slug].cover);
 assert.equal(articleCover({...a,cover_image:'https://example.com/cover.webp'}),'https://example.com/cover.webp');
 assert.equal(articleCover({...a,cover_image:'javascript:alert(1)'}),ARTICLE_VISUALS[a.slug].cover);
 assert.equal(articleCover({slug:'unknown',cover_image:'/untrusted/image.svg'}),'');
 assert.match(articleCoverAlt(a),/توصيل/);assert.match(articleCard(a),/cod-tracking-cover.webp/);
 assert.equal(renderArticleIllustration('unknown'),'');assert.match(renderArticleIllustration(a.slug),/figcaption/);
});
test('article serves local cover and explanatory diagram with absolute SEO image URLs',async()=>{
 const article={id:'id',slug:'cod-order-tracking-algeria',title:'مقال',excerpt:'وصف',body:[{type:'paragraph',text:'المحتوى'}],published_at:'2026-10-22T12:00:00Z',updated_at:'2026-10-22T12:00:00Z'};
 const r=await renderRequest(new URL(site+'/articles/'+article.slug+'/'),async(table,p)=>({data:p.slug?[article]:[],count:1}));
 assert.equal(r.status,200);assert.match(r.html,/src="\/assets\/articles\/cod-tracking-cover.webp"/);assert.match(r.html,/cod-order-flow.svg/);
 const json=JSON.parse(r.html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);assert.equal(json.image[0],site+ARTICLE_VISUALS[article.slug].cover);
 assert.match(r.html,/property="og:image" content="https:\/\/salem-dztube-website.vercel.app\/assets\/articles\/cod-tracking-cover.webp"/);
});
