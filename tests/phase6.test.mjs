import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parseBody,formatBody,renderBody,renderInline,safeLink} from '../lib/content.js';
import {fromAlgiersInput,toAlgiersInput} from '../lib/editor-dates.js';
import {renderRequest} from '../api/render.js';
test('editor renders safe internal/external links but rejects script, protocol-relative and credential URLs',()=>{
 assert.match(renderInline('[تتبّع الطلب](/articles/cod-order-tracking-algeria/)'),/href="\/articles\/cod-order-tracking-algeria\/"/);
 assert.match(renderInline('[مصدر](https://example.com/docs?a=1&b=2)'),/noopener noreferrer/);
 for(const href of ['javascript:alert','//evil.com','https://name:pass@evil.com','/admin/'])assert.equal(safeLink(href),'');
 const html=renderInline('<img onerror=alert(1)> [رابط](javascript:alert)');assert.doesNotMatch(html,/<img|href="javascript/);assert.match(html,/&lt;img/);
});
test('Arabic tables survive editing, escape cells, and retain semantic column headers',()=>{
 const source='| المهمة | النتيجة |\n| --- | --- |\n| فحص | <script> |\n| مراجعة | [مقال](/articles/real-example/) |';
 const body=parseBody(source);assert.equal(body[0].type,'table');assert.deepEqual(parseBody(formatBody(body)),body);const html=renderBody(body);assert.match(html,/<th scope="col">المهمة/);assert.match(html,/role="region"/);assert.doesNotMatch(html,/<script>/);assert.match(html,/&lt;script&gt;/);
 assert.doesNotMatch(renderBody([{type:'table',text:'A | B\n--- | ---\nA'}]),/<table>/);
});
test('publication date uses Algeria time and rejects invalid dates independently of browser time zone',()=>{
 assert.equal(fromAlgiersInput('2026-10-24T18:00'),'2026-10-24T17:00:00.000Z');assert.equal(toAlgiersInput('2026-10-24T17:00:00Z'),'2026-10-24T18:00');assert.equal(fromAlgiersInput(''),null);
 for(const date of ['invalid','2026-02-31T18:00','2026-10-24T25:00'])assert.throws(()=>fromAlgiersInput(date));
});
test('article schema has breadcrumbs matching visible navigation and a linked creator identity',async()=>{
 const a={id:'id',slug:'real-example',title:'مقال',body:[{text:'شرح'}],excerpt:'وصف',published_at:'2026-10-22T12:00:00Z',updated_at:'2026-10-24T12:00:00Z'};
 const r=await renderRequest(new URL('https://local/articles/real-example/'),async(t,p)=>({data:p.slug?[a]:[],count:1}));const data=JSON.parse(r.html.match(/application\/ld\+json">(.*?)<\/script>/s)[1]);assert.equal(data.author.alternateName,'SalemDZTube');assert.equal(data['@graph'][0]['@type'],'BreadcrumbList');assert.equal(data['@graph'][0].itemListElement[2].name,a.title);assert.match(r.html,/<time datetime="2026-10-22T12:00:00Z">/);assert.match(r.html,/العودة إلى المقالات/);
});
test('build includes five crawlable video cards, creator schema and a high-priority hero preload',async()=>{
 const home=await readFile('dist/index.html','utf8');assert.equal((home.match(/class="video-card"/g)||[]).length,5);assert.match(home,/"@type":"Person"/);assert.match(home,/rel="preload" as="image"/);assert.match(home,/<noscript>/);
});
test('archive pagination preserves filters, shows counts and rejects empty out-of-range pages',async()=>{
 const a={id:'1',slug:'real-example',title:'مقال',body:[],excerpt:'وصف'};
 const query=async(t,p)=>t==='categories'?{data:[{id:'c',slug:'tech',name:'تقنية'}],count:1}:{data:p.offset==='0'?[a]:[],count:13};
 const r=await renderRequest(new URL('https://local/articles/?q=Make&category=tech'),query);assert.match(r.html,/13 مقال/);assert.match(r.html,/q=Make&amp;category=tech&amp;page=2/);assert.match(r.html,/noindex/);
 assert.equal((await renderRequest(new URL('https://local/articles/?page=2'),query)).status,404);
});
