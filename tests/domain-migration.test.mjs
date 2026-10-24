import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {SITE} from '../lib/config.js';import {LEGACY_REDIRECTS,legacyWelcome} from '../lib/legacy-domain.js';import {renderRequest} from '../api/render.js';
test('official origin is consistent across homepage, policies, robots and article metadata',async()=>{
 assert.equal(SITE,'https://salemdztube.com');for(const f of ['index.html','about/index.html','contact/index.html','privacy/index.html','cookies/index.html','terms/index.html','videos/index.html','------/index.html']){const html=await readFile('dist/'+f,'utf8');assert.match(html,/rel="canonical" href="https:\/\/salemdztube.com\//);assert.doesNotMatch(html,/https:\/\/salem-dztube-website.vercel.app/);}assert.match(await readFile('dist/robots.txt','utf8'),/Sitemap: https:\/\/salemdztube.com\/sitemap.xml/);
});
test('legacy 301s point to real semantic alternatives, never a catch-all homepage',async()=>{
 const config=JSON.parse(await readFile('vercel.json','utf8'));assert.deepEqual(config.redirects,LEGACY_REDIRECTS);for(const r of LEGACY_REDIRECTS){assert.equal(r.statusCode,301);assert.ok(['/videos/','/contact/'].includes(r.destination));await readFile('dist'+r.destination+'index.html');assert.doesNotMatch(r.source,/:path|\(\.\*\)/);}
});
test('old welcome content remains available without copying old trackers or placeholder contact details',async()=>{
 const html=await readFile('dist/------/index.html','utf8');assert.ok(html.includes(legacyWelcome.title));assert.ok(html.includes(legacyWelcome.description));assert.doesNotMatch(html,/الرياض، السعودية|\+213555242690|adsbygoogle\.js|zyrosite/);
});
test('empty old store is a real 410 with noindex, not a misleading redirect',async()=>{
 const r=await renderRequest(new URL(SITE+'/page/'),()=>{throw Error('Database not needed for retired page')});assert.equal(r.status,410);assert.match(r.html,/noindex/);assert.match(r.html,/410/);assert.equal(r.location,undefined);
});
test('sitemap adds preserved pages and never includes retired store or administration',async()=>{
 const r=await renderRequest(new URL(SITE+'/sitemap.xml'),async()=>({data:[],count:0}));assert.match(r.html,/<loc>https:\/\/salemdztube.com\/------\/<\/loc>/);assert.match(r.html,/<loc>https:\/\/salemdztube.com\/videos\/<\/loc>/);assert.doesNotMatch(r.html,/<loc>[^<]+\/page\/|\/admin\/|vercel.app/);
});
