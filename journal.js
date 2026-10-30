(()=>{
 'use strict';
 const entries=[...document.querySelectorAll('.entry')];
 const buttons=[...document.querySelectorAll('[data-filter]')];
 const status=document.getElementById('filter-status');
 document.querySelector('.filters').hidden=false;
 status.hidden=false;
 const applyFilter=category=>{
  let count=0;
  for(const entry of entries){entry.hidden=category!=='all'&&entry.dataset.category!==category;if(!entry.hidden)count++;}
  for(const button of buttons)button.setAttribute('aria-pressed',String(button.dataset.filter===category));
  status.textContent=count+'件の記事';
 };
 for(const button of buttons)button.addEventListener('click',()=>applyFilter(button.dataset.filter));
 const syncLabel=entry=>entry.querySelector('summary').setAttribute('aria-label',entry.querySelector('.entry-title').textContent+'を'+(entry.open?'閉じる':'開く'));
 for(const entry of entries){syncLabel(entry);entry.addEventListener('toggle',()=>syncLabel(entry));}
 const revealHash=()=>{
  const entry=entries.find(item=>'#'+item.id===location.hash);
  if(!entry)return;
  applyFilter('all');entry.open=true;syncLabel(entry);
  requestAnimationFrame(()=>entry.scrollIntoView({block:'start'}));
 };
 window.addEventListener('hashchange',revealHash);
 document.getElementById('first-note-link').addEventListener('click',()=>{
  applyFilter('all');const entry=document.getElementById('note-01');entry.open=true;syncLabel(entry);
 });
 revealHash();
 const target=Date.parse('2027-03-26T00:00:00+09:00');
 const days=Math.ceil((target-Date.now())/86400000);
 document.getElementById('countdown').textContent=days>0?'開幕まであと '+days+' 日':days===0?'いよいよ開幕予定日':'2027年開幕予定日を経過';
})();
