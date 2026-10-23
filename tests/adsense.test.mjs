import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {adsenseVerificationMeta,adsenseAdsTxt} from '../lib/adsense.js';
import {page,notFound} from '../lib/layout.js';
test('publisher verification is present on public pages without loading advertising code',async()=>{
 const html=page({title:'عنوان',description:'وصف',path:'/articles/',content:'محتوى'});
 assert.match(html,/name="google-adsense-account" content="ca-pub-4932171916184035"/);
 assert.doesNotMatch(html,/adsbygoogle\.js|class="adsbygoogle"/);
 const home=await readFile('dist/index.html','utf8');assert.equal((home.match(/name="google-adsense-account"/g)||[]).length,1);
 assert.equal(await readFile('dist/ads.txt','utf8'),'google.com, pub-4932171916184035, DIRECT, f08c47fec0942fa0\n');
 assert.doesNotMatch(notFound(),/google-adsense-account/);assert.doesNotMatch(await readFile('dist/admin/index.html','utf8'),/google-adsense-account|adsbygoogle/);
});
test('preview deployments suppress publisher verification and authorized seller entries',()=>{
 const previous=process.env.VERCEL_ENV;process.env.VERCEL_ENV='preview';
 try{assert.equal(adsenseVerificationMeta(),'');assert.doesNotMatch(adsenseAdsTxt(),/google.com|pub-/);}finally{if(previous===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=previous;}
});
