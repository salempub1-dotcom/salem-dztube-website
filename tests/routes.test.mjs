import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/render.js';
const response=()=>({headers:{},setHeader(k,v){this.headers[k]=v},end(v){this.body=v}});
test('content route rejects writes and never caches a published response',async()=>{const res=response();await handler({method:'POST',url:'/articles/'},res);assert.equal(res.statusCode,405);assert.equal(res.headers['Cache-Control'],'no-store');assert.equal(res.headers.Allow,'GET, HEAD');});
test('API unknown path is a real 404',async()=>{const res=response();await handler({method:'GET',url:'/api/render'},res);assert.equal(res.statusCode,404);assert.equal(res.headers['X-Robots-Tag'],'noindex');});

// Vercel injects dynamic path parameters into the query string. The legacy
// reader must match an explicit rule before :slug to preserve ?slug=article.
test('legacy reader rewrite precedes dynamic article slugs',async()=>{const {readFile}=await import('node:fs/promises');const config=JSON.parse(await readFile('vercel.json','utf8'));for(const path of ['/articles/read','/articles/read/']){const first=config.rewrites.find(r=>r.source===path||r.source==='/articles/:slug'+(path.endsWith('/')?'/':''));assert.equal(first.source,path);assert.equal(first.destination,'/api/render?route=articles/read');}});
