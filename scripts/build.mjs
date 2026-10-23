import {rm,mkdir,cp,readFile,writeFile} from 'node:fs/promises';
import {build} from 'esbuild';
import {legalPages,legalHTML} from './legal.mjs';
import {notFound} from '../lib/layout.js';
import {adsenseVerificationMeta,adsenseAdsTxt} from '../lib/adsense.js';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
for(const file of ['index.html','styles.css','site.js','main.js','assets','content','config','lib/content.js','lib/article-visuals.js','lib/videos.js','lib/config.js','admin/index.html','admin/admin.css']){await mkdir('dist/'+file.split('/').slice(0,-1).join('/'),{recursive:true});await cp(file,'dist/'+file,{recursive:true});}
await build({entryPoints:['admin/admin.js'],bundle:true,minify:true,format:'esm',target:['es2022'],outfile:'dist/admin/admin.js'});
const home=await readFile('dist/index.html','utf8');
await writeFile('dist/index.html',home.replace('</head>',adsenseVerificationMeta()+'</head>'));
await writeFile('dist/ads.txt',adsenseAdsTxt());
for(const slug of Object.keys(legalPages)){await mkdir(`dist/${slug}`,{recursive:true});await writeFile(`dist/${slug}/index.html`,legalHTML(slug));}
await writeFile('dist/404.html',notFound());
await writeFile('dist/robots.txt',process.env.VERCEL_ENV==='preview'?'User-agent: *\nDisallow: /\n':'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nDisallow: /articles/read/\nSitemap: https://salem-dztube-website.vercel.app/sitemap.xml\n');
if(process.env.VERCEL_ENV==='preview'){
 for(const file of ['index.html','404.html','admin/index.html',...Object.keys(legalPages).map(s=>s+'/index.html')]){let t=await readFile('dist/'+file,'utf8');t=t.replace(/<meta name="robots"[^>]*>/g,'');await writeFile('dist/'+file,t.replace('</head>','<meta name="robots" content="noindex,nofollow"></head>'));}
}
console.log('Built static homepage, admin, legal pages and local assets. Articles and sitemap render at request time.');
