begin;
-- Additive only: keep existing requests, states, and admin RLS policies.
alter table public.collaboration_requests
 add column if not exists website text,
 add column if not exists phone text,
 add column if not exists package text,
 add column if not exists budget text,
 add column if not exists target_date date,
 add column if not exists consent_at timestamptz,
 add column if not exists request_token uuid;
create unique index if not exists collaboration_request_token_unique on public.collaboration_requests(request_token);
create index if not exists collaboration_requests_email_created on public.collaboration_requests(lower(email),created_at desc);
create schema if not exists collaboration_private;
revoke all on schema collaboration_private from public;
grant usage on schema collaboration_private to anon,authenticated;
-- Narrow insert capability, not table access. Private schema is not exposed via REST.
create or replace function collaboration_private.submit_request(payload jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
 n text:=trim(payload->>'name'); e text:=lower(trim(payload->>'email'));
 c text:=trim(payload->>'company'); m text:=trim(payload->>'message');
 w text:=trim(payload->>'website'); ph text:=nullif(trim(payload->>'phone'),'');
 pack text:=payload->>'package'; b text:=payload->>'budget';
 d date; token uuid; result_id uuid;
begin
 if payload is null or pg_catalog.octet_length(payload::text)>16000
 or coalesce(payload->>'fax','')<>'' or coalesce(payload->>'consent','')<>'true'
 or coalesce(length(n),0) not between 2 and 100
 or coalesce(length(e),0) not between 5 and 254 or e !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
 or coalesce(length(c),0) not between 1 and 160
 or coalesce(length(m),0) not between 30 and 5000
 or coalesce(length(w),0) not between 10 and 500 or w !~ '^https?://[^[:space:]<>/@]+(\.[^[:space:]<>/@]+)(/[^[:space:]<>]*)?$'
 or length(coalesce(ph,''))>30 or coalesce(ph,'') !~ '^[0-9+() .-]*$'
 or coalesce(pack,'') not in ('shorts','integration','dedicated','bundle','custom')
 or coalesce(b,'') not in ('under-15000','15000-35000','35000-60000','over-60000','discuss')
 or concat(n,c,m,w,ph) ~ '[<>]'
 then raise exception 'invalid_request' using errcode='22023'; end if;
 begin
 token:=(payload->>'request_token')::uuid;
 d:=nullif(payload->>'target_date','')::date;
 exception when others then raise exception 'invalid_request' using errcode='22023'; end;
 if token is null or (d is not null and (d<current_date or d>current_date+interval '3 years')) then raise exception 'invalid_request' using errcode='22023'; end if;
 -- Locks serialize submissions for the same email, including concurrent retries.
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(e,0));
 select id into result_id from public.collaboration_requests where request_token=token and lower(email)=e;
 if result_id is not null then return jsonb_build_object('id',result_id); end if;
 if exists(select 1 from public.collaboration_requests where lower(email)=e and created_at>now()-interval '10 minutes')
 then raise exception 'request_rate_limited' using errcode='P0001'; end if;
 insert into public.collaboration_requests(name,email,company,message,website,phone,package,budget,target_date,consent_at,request_token)
 values(n,e,c,m,w,ph,pack,b,d,now(),token) returning id into result_id;
 return jsonb_build_object('id',result_id);
end $$;
revoke all on function collaboration_private.submit_request(jsonb) from public,anon,authenticated;
grant execute on function collaboration_private.submit_request(jsonb) to anon,authenticated;
create or replace function public.submit_collaboration_request(payload jsonb)
returns jsonb language sql security invoker set search_path='' as $$
 select collaboration_private.submit_request(payload);
$$;
revoke all on function public.submit_collaboration_request(jsonb) from public;
grant execute on function public.submit_collaboration_request(jsonb) to anon,authenticated;
-- Visitors cannot insert outside validation or read/update other people's requests.
revoke insert,delete on public.collaboration_requests from anon,authenticated;
alter table public.collaboration_requests enable row level security;
commit;
