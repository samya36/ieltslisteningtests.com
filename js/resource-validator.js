export function validateResources(list) {
  const items = Array.isArray(list) ? list : [];
  const logs = [];
  return Promise.all(items.map(src => fetch(src).then(r => {
    if (!r.ok) throw new Error(r.status + ' ' + r.statusText);
    logs.push({src, ok: true});
  }).catch(err => { console.error(`Resource missing: ${src}`, err); logs.push({src, ok:false, err:String(err)});}))).then(()=>logs);
}

