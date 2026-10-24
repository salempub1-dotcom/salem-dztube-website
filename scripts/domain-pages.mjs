import {page} from '../lib/layout.js';
import {legacyWelcome} from '../lib/legacy-domain.js';
import {videoCard} from '../lib/videos.js';
import {readFile} from 'node:fs/promises';
export const domainPagePaths=['videos','------'];
export async function domainPageHTML(slug){
 if(slug==='------')return page({title:legacyWelcome.title,description:legacyWelcome.description,path:'/------/',content:`<article class="wrap reading-layout"><h1 class="page-title">${legacyWelcome.title}</h1><p>${legacyWelcome.description}</p><p>هذه المقدمة محفوظة من الموقع السابق. <a class="text-link" href="/articles/">تصفح الشروحات والمقالات الحالية</a>.</p></article>`});
 if(slug==='videos'){const videos=JSON.parse(await readFile('content/videos.json','utf8'));return page({title:'فيديوهات SalemDZTube',description:'مختارات من فيديوهات SalemDZTube حول التجارة الإلكترونية والإعلانات والأتمتة والدفع الإلكتروني.',path:'/videos/',content:`<section class="wrap archive-head"><h1 class="page-title">فيديوهات SalemDZTube</h1><p>شروحات القناة في التجارة الإلكترونية والتقنية. اضغط على الصورة أو العنوان لفتح الفيديو المطابق على YouTube.</p></section><section class="wrap archive-grid" aria-label="الفيديوهات"><div class="video-grid">${videos.map(videoCard).join('')}</div><p><a class="text-link" href="/">العودة إلى الرئيسية</a></p></section>`});}
 throw Error('Unknown migration page');
}
