import { economics } from './model.mjs';
const grid = document.querySelector('#case-grid');
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  const filter=button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
  let visible=0;grid.querySelectorAll('.case').forEach(c=>{c.hidden=filter!=='all'&&c.dataset.group!==filter;if(!c.hidden)visible++;});
  document.querySelector('#case-count').textContent=`${visible} selected vendor case ${visible===1?'study':'studies'}`;
}));
const form=document.querySelector('#calculator-form');
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n === 0 ? 0 : n);
function update(){
  const valid=form.checkValidity();
  document.querySelector("#input-error").hidden=valid;
  if(!valid)return;
  const v=Object.fromEntries([...new FormData(form)].map(([k,x])=>[k,Number(x)]));
  const r=economics(v);
  const outputs={members:r.members,gross:money(r.gross),fees:money(-r.fees),tools:money(-v.tools),hours:`${r.hours.toFixed(1)} hours / month`,labor:money(-r.labor),displaced:money(-v.displaced),contribution:money(r.contribution),first:money(r.firstMonth),breakeven:r.breakEven??'Not viable at this scope',month3:money(r.month3),replacements:`${r.replacements.toFixed(1)} clients`};
  for(const [k,x] of Object.entries(outputs))document.querySelector(`#result-${k}`).textContent=x;
}
form.addEventListener('input',update);form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('reset',()=>setTimeout(update,0));update();
document.querySelector('#print-page').addEventListener('click',()=>{const details=[...document.querySelectorAll('details')];const old=details.map(d=>d.open);details.forEach(d=>d.open=true);window.print();details.forEach((d,i)=>d.open=old[i]);});
