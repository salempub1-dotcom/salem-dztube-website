import {SUPABASE_URL,SUPABASE_KEY} from './config.js';
export async function publicQuery(table,params,fetcher=fetch) {
  const response=await fetcher(`${SUPABASE_URL}/rest/v1/${table}?${new URLSearchParams(params)}`,{headers:{apikey:SUPABASE_KEY,Prefer:'count=exact'},signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw new Error(`Content API returned ${response.status}`);
  return {data:await response.json(),count:Number(response.headers.get('content-range')?.split('/')[1])||0};
}
export const publishedParams=()=>({status:'eq.published',published_at:'lte.'+new Date().toISOString()});
export function searchFilter(q) {
  const literal=q.replace(/[\\"%_*]/g,c=>'\\'+c);
  return `(title.ilike."*${literal}*",excerpt.ilike."*${literal}*")`;
}
