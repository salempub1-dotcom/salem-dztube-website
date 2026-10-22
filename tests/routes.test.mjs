import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/render.js';
const response=()=>({headers:{},setHeader(k,v){this.headers[k]=v},end(v){this.body=v}});
test('content route rejects writes and never caches a published response',async()=>{const res=response();await handler({method:'POST',url:'/articles/'},res);assert.equal(res.statusCode,405);assert.equal(res.headers['Cache-Control'],'no-store');assert.equal(res.headers.Allow,'GET, HEAD');});
test('API unknown path is a real 404',async()=>{const res=response();await handler({method:'GET',url:'/api/render'},res);assert.equal(res.statusCode,404);assert.equal(res.headers['X-Robots-Tag'],'noindex');});
