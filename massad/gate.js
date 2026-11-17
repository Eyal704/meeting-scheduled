'use strict';
(() => {
  const sessionName='massad-access';
  const input=document.querySelector('#access-password');
  const button=document.querySelector('#access-submit');
  const error=document.querySelector('#access-error');
  const form=document.querySelector('#access-form');
  const bytes=value=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
  let box, opening=false;
  const getBox=async()=>{
    if(box)return box;
    const response=await fetch('./app.enc.json?v=8',{cache:'no-store'});
    if(!response.ok)throw Error('load');
    box=await response.json();
    return box;
  };
  async function open(key, remember){
    const data=await getBox();
    const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(data.iv)},key,bytes(data.ciphertext));
    const payload=JSON.parse(new TextDecoder().decode(plain));
    if(remember){
      const raw=new Uint8Array(await crypto.subtle.exportKey('raw',key));
      try{sessionStorage.setItem(sessionName,JSON.stringify({salt:data.salt,key:btoa(String.fromCharCode(...raw))}));}catch{}
    }
    input.value='';
    document.body.innerHTML=payload.body;
    for(const code of payload.scripts){const script=document.createElement('script');script.textContent=code;document.head.append(script);}
    document.querySelector('[data-lock]').addEventListener('click',async event=>{
      event.currentTarget.disabled=true;
      const saved=await window.massadBeforeLock?.();
      if(saved===false){document.querySelector('[data-lock]').disabled=false;return;}
      try{sessionStorage.removeItem(sessionName);}catch{}
      location.reload();
    });
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(opening||!form.reportValidity())return;
    opening=true;button.disabled=true;button.textContent='טוען…';error.textContent='';
    try{
      const data=await getBox();
      const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(input.value),'PBKDF2',false,['deriveKey']);
      const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes(data.salt),iterations:data.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},true,['decrypt']);
      await open(key,true);
    }catch(err){
      error.textContent=err.name==='OperationError'?'הסיסמה שגויה.':'לא ניתן לטעון את המערכת. בדקו את החיבור ונסו שוב.';
      button.disabled=false;button.textContent='כניסה';input.focus();
    }finally{opening=false;}
  });
  (async()=>{
    let remembered;
    try{remembered=JSON.parse(sessionStorage.getItem(sessionName)||'null');}catch{}
    if(!remembered)return;
    opening=true;button.disabled=true;button.textContent='טוען…';
    try{
      const data=await getBox();
      if(data.salt!==remembered.salt)throw Error('changed');
      const key=await crypto.subtle.importKey('raw',bytes(remembered.key),{name:'AES-GCM'},false,['decrypt']);
      await open(key,false);
    }catch{
      try{sessionStorage.removeItem(sessionName);}catch{}
      button.disabled=false;button.textContent='כניסה';
    }finally{opening=false;}
  })();
})();
