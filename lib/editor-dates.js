// Admin date inputs use the explicitly labelled Algeria time zone (UTC+01:00).
export function toAlgiersInput(value){
 if(!value||!Number.isFinite(Date.parse(value)))return '';
 return new Date(Date.parse(value)+3600000).toISOString().slice(0,16);
}
export function fromAlgiersInput(value){
 if(!value)return null;
 if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))throw Error('تاريخ النشر غير صالح');
 const date=new Date(value+':00+01:00');
 if(!Number.isFinite(date.getTime())||toAlgiersInput(date.toISOString())!==value)throw Error('تاريخ النشر غير صالح');
 return date.toISOString();
}
