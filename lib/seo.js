import {SITE,AUTHOR} from './config.js';
export const personSchema = () => ({'@type':'Person','@id':SITE+'/#creator',name:AUTHOR,alternateName:'SalemDZTube',url:SITE+'/about/',sameAs:['https://www.youtube.com/@SalemDZTube']});
export const publisherSchema = () => ({'@type':'Organization','@id':SITE+'/#publisher',name:'SalemDZTube',url:SITE,founder:{'@id':SITE+'/#creator'}});
export const websiteSchema = () => ({'@context':'https://schema.org','@graph':[personSchema(),publisherSchema(),{'@type':'WebSite','@id':SITE+'/#website',url:SITE+'/',name:'SalemDZTube',inLanguage:'ar-DZ',publisher:{'@id':SITE+'/#publisher'}}]});
export const breadcrumbSchema = article => ({'@type':'BreadcrumbList',itemListElement:[['الرئيسية','/'],['المقالات','/articles/'],[article.title,`/articles/${article.slug}/`]].map(([name,path],i)=>({'@type':'ListItem',position:i+1,name,item:SITE+path}))});
export const jsonLD = schema => `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`;
