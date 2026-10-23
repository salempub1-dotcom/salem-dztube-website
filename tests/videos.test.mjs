import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {videoThumbnail,videoCard,bindVideoThumbnailFallbacks} from '../lib/videos.js';
test('all five homepage videos have verified IDs and local WebP thumbnails',async()=>{
 const videos=JSON.parse(await readFile('content/videos.json','utf8'));
 assert.equal(videos.length,5);assert.equal(new Set(videos.map(v=>v.youtubeId)).size,5);
 for(const v of videos){assert.match(v.youtubeId,/^[\w-]{11}$/);assert.match(v.thumbnail,/^\/assets\/videos\/[a-z0-9-]+\.webp$/);const bytes=await readFile('dist'+v.thumbnail);assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');assert.ok(bytes.length<150_000);assert.match(videoCard(v),new RegExp('watch\\?v='+v.youtubeId));assert.equal((videoCard(v).match(/href="https:\/\/www.youtube.com\/watch\?v=/g)||[]).length,2);}
 await stat('dist/lib/videos.js');
});
test('video thumbnail accepts only local allowlisted paths or a validated YouTube ID',()=>{
 assert.equal(videoThumbnail({thumbnail:'javascript:alert(1)',youtubeId:'DPVB2GNKNzQ'}),'https://img.youtube.com/vi/DPVB2GNKNzQ/hqdefault.jpg');
 assert.equal(videoThumbnail({thumbnail:'/assets/videos/../../admin/foo.webp',youtubeId:'bad'}),'/assets/video-placeholder.svg');
 assert.doesNotMatch(videoCard({title:'<script>',tag:'<img>',category:'x',youtubeId:'bad" onclick="x'}),/<script>|<img>/);
});
test('a missing local image falls back once to YouTube and then an explicit local placeholder',()=>{
 const listeners=new Map();const img={src:'https://example.test/assets/videos/make.webp',complete:false,naturalWidth:0,dataset:{videoId:'0HfcR4T7qDg'},addEventListener:(n,f)=>listeners.set(n,f),removeEventListener:n=>listeners.delete(n)};
 bindVideoThumbnailFallbacks({querySelectorAll:()=>[img]});listeners.get('error')();assert.equal(img.src,'https://img.youtube.com/vi/0HfcR4T7qDg/hqdefault.jpg');listeners.get('error')();assert.equal(img.src,'/assets/video-placeholder.svg');assert.equal(listeners.size,0);
});
