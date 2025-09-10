const CONFIG={boyfriendName:'Malachi',passcode:'heart'};
const form=document.querySelector('#grievanceForm');
if(form){document.querySelector('#toName').textContent=CONFIG.boyfriendName;
form.addEventListener('submit',async e=>{e.preventDefault();const fd=new FormData(form);
let imgData='';const file=fd.get('image');if(file&&file.size){imgData=await toBase64(file);} 
const it={id:crypto.randomUUID(),title:fd.get('title'),name:'love',message:fd.get('message'),
mood:fd.get('mood'),severity:Number(fd.get('severity')),response:fd.get('response'),
image:imgData,createdAt:new Date().toISOString()};
const arr=JSON.parse(localStorage.getItem('grievances')||'[]');arr.unshift(it);
localStorage.setItem('grievances',JSON.stringify(arr));
document.querySelector('#who').textContent=it.name;form.classList.add('hidden');document.querySelector('#success').classList.remove('hidden');});
document.querySelector('#another').addEventListener('click',()=>{form.reset();form.classList.remove('hidden');document.querySelector('#success').classList.add('hidden');});}
async function toBase64(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=err=>rej(err);r.readAsDataURL(file);});}
const unlock=document.querySelector('#unlock');if(unlock){unlock.addEventListener('click',()=>{if(document.querySelector('#passcode').value===CONFIG.passcode){document.querySelector('#gate').classList.add('hidden');document.querySelector('#inbox').classList.remove('hidden');render();}else alert('Wrong passcode 💔');});}
function render(){const list=document.querySelector('#items');const arr=JSON.parse(localStorage.getItem('grievances')||'[]');list.innerHTML='';if(!arr.length){list.innerHTML='<p>No messages yet.</p>';return;}arr.forEach(it=>{const sev=Number(it.severity);const sevStyle=sev<=3?'background:#d4f8d4;color:#155724':(sev<=6?'background:#fff3cd;color:#856404':'background:#f8d7da;color:#721c24');list.innerHTML+=`<div class="item"><h3>${escape(it.title||'(no title)')}</h3><p>${escape(it.message||'')}</p>${it.image?`<img src="${it.image}" style="max-width:100%;border-radius:10px;margin:.5rem 0">`:''}<p>${it.mood} | <span style="padding:2px 6px;border-radius:6px;${sevStyle}">Severity: ${sev}</span> | From: ${escape(it.name)} | ${escape(it.response||'')}</p><div class="tiny">${new Date(it.createdAt).toLocaleString()}</div><button class="btn small" onclick="removeItem('${it.id}')">Resolve & Remove</button></div>`;});}
function escape(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function removeItem(id){let arr=JSON.parse(localStorage.getItem('grievances')||'[]');arr=arr.filter(x=>x.id!==id);localStorage.setItem('grievances',JSON.stringify(arr));render();}

// New resolve actions
function moveToResolvedById(id){
  const act=getActive(); const idx=act.findIndex(x=>x.id===id);
  if(idx>-1){ const it=act.splice(idx,1)[0]; setActive(act); const res=getResolved(); res.unshift(it); setResolved(res); }
}
$$('.resolve-keep', document).forEach(b=>b.addEventListener('click',()=>{
  moveToResolvedById(b.dataset.id); render();
}));
$$('.resolve-delete', document).forEach(b=>b.addEventListener('click',()=>{
  moveToResolvedById(b.dataset.id);
  // now delete from resolved immediately
  const id=b.dataset.id;
  const res=getResolved().filter(x=>x.id!==id); setResolved(res);
  render();
}));
