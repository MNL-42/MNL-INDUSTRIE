(() => {
'use strict';
const $=id=>document.getElementById(id);
const divisions=[['Mobilité','Mobilité terrestre, urbaine et nautique','01'],['Aérospatial','Aéronautique, spatial et systèmes aériens','02'],['Numérique','Informatique, logiciels, IA et cybersécurité','03'],['Robotique','Robotique, automatisation et microtechnologie','04'],['Énergie','Énergie, stockage et infrastructures connectées','05'],['Habitat & lifestyle','Habitat intelligent, accessoires et design','06'],['Image & audio','Photographie, création et systèmes audio','07']];
const all=Array.isArray(window.MNL_PRODUCTS)?window.MNL_PRODUCTS:[];
let fav=new Set();try{fav=new Set(JSON.parse(localStorage.getItem('mnl-favorites')||'[]'))}catch(e){}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function renderDivisions(){const h=$('divisionGrid');if(!h)return;h.innerHTML=divisions.map(d=>'<a class="division reveal" href="products.html?division='+encodeURIComponent(d[0])+'"><div class="division-topline"><span class="number">UNIVERS / '+d[2]+'</span><span class="division-index">MNL</span></div><div class="division-symbol" aria-hidden="true">✳</div><h3>'+d[0]+'</h3><p>'+d[1]+'</p><span class="division-link">EXPLORER <b>↗</b></span></a>').join('');}
function productVisual(p,i){const curated={'mnl-1':'apex-car.webp','mnl-5':'aerion-jet.webp','mnl-19':'mnl-atlas-robot.webp','mnl-9':'mnl-one-phone.webp','mnl-14':'mnl-sound-earbuds.webp','mnl-13':'mnl-vision-glasses.webp'};return curated[p.id]||p.image;}
function productCard(p,i){const visual=productVisual(p,i);return '<article class="product reveal" data-id="'+esc(p.id)+'"><div class="product-image"><img src="'+esc(visual)+'" alt="'+esc(p.name)+' — visuel éditorial" loading="lazy"><span class="product-number">MNL / '+String(i+1).padStart(2,'0')+'</span><button class="favorite '+(fav.has(p.id)?'is-favorite':'')+'" data-fav="'+esc(p.id)+'" aria-label="Ajouter aux favoris">'+(fav.has(p.id)?'♥':'♡')+'</button><span class="product-view">VOIR LA FICHE <b>↗</b></span></div><div class="product-info"><small>'+esc(p.division)+' · '+esc(p.tag)+'</small><h3>'+esc(p.name)+'</h3><p>'+esc(p.type)+'</p><div class="product-bottom"><span class="concept">ÉTUDE DE CONCEPT</span><span class="arrow">↗</span></div></div></article>';}
function openProduct(p){if(p&&p.id){location.href='product.html?id='+encodeURIComponent(p.id);return;}if(!$('modal'))return;$('modalImg').src=productVisual(p,0);$('modalImg').alt=p.name;$('modalDivision').textContent=p.division+' / MAISON MNL';$('modalTitle').textContent=p.name;$('modalType').textContent=p.type;$('modalDesc').textContent=p.description+' — Statut : '+(p.status||'Concept virtuel')+'.';$('specs').innerHTML=(p.specs||[]).map(s=>'<div class="spec"><span>'+esc(s[0])+'</span><b>'+esc(s[1])+'</b></div>').join('')+(p.steps||[]).map((s,i)=>'<div class="spec"><span>Étape '+(i+1)+'</span><b>'+esc(s)+'</b></div>').join('');$('modal').classList.add('show');document.body.classList.add('modal-open');}
function renderProducts(){const h=$('productGrid');if(!h)return;const q=($('search')?.value||'').trim().toLocaleLowerCase('fr');const f=$('filter')?.value||'all';const s=$('sort')?.value||'default';let list=all.filter(p=>(f==='all'||p.division===f)&&[p.name,p.division,p.category,p.type,p.tag,p.description].join(' ').toLocaleLowerCase('fr').includes(q));if(!$('search')&&!$('filter')&&!$('sort')){const featured=['mnl-1','mnl-5','mnl-19','mnl-9','mnl-14','mnl-13'];list=featured.map(id=>all.find(p=>p.id===id)).filter(Boolean);}if(s==='az')list.sort((a,b)=>a.name.localeCompare(b.name,'fr'));if(s==='fav')list=list.filter(p=>fav.has(p.id));h.innerHTML=list.map(productCard).join('');if($('empty'))$('empty').style.display=list.length?'none':'block';if($('resultsCount'))$('resultsCount').textContent=list.length+' références';h.querySelectorAll('[data-id]').forEach(el=>el.addEventListener('click',e=>{if(e.target.closest('[data-fav]'))return;const p=all.find(x=>x.id===el.dataset.id);if(p)openProduct(p)}));h.querySelectorAll('[data-fav]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const id=b.dataset.fav;fav.has(id)?fav.delete(id):fav.add(id);try{localStorage.setItem('mnl-favorites',JSON.stringify([...fav]))}catch(err){}renderProducts()}));observe(h);}
function setupFilters(){const f=$('filter');if(!f)return;const current=new URLSearchParams(location.search).get('division')||f.value||'all';const values=[...new Set(all.map(p=>p.division))].sort((a,b)=>a.localeCompare(b,'fr'));f.innerHTML='<option value="all">Tous les univers</option>'+values.map(v=>'<option value="'+esc(v)+'">'+esc(v)+'</option>').join('');f.value=values.includes(current)?current:'all';}
let observer;function observe(root=document){const els=root.querySelectorAll('.reveal:not(.is-visible)');if(!('IntersectionObserver'in window)){els.forEach(e=>e.classList.add('is-visible'));return;}observer=observer||new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('is-visible');observer.unobserve(x.target)}}),{threshold:.12,rootMargin:'0px 0px -35px 0px'});els.forEach(e=>observer.observe(e));}
function close(){ $('modal')?.classList.remove('show');document.body.classList.remove('modal-open');}
function renderEditorial(){const h=$('editorialGallery');if(!h)return;const ids=['mnl-1','mnl-5','mnl-19','mnl-9','mnl-14','mnl-13'];const picks=ids.map(id=>all.find(p=>p.id===id)).filter(Boolean);h.innerHTML=picks.map((p,i)=>'<a class="editorial-tile reveal tile-'+(i+1)+'" href="products.html?division='+encodeURIComponent(p.division)+'"><img src="'+esc(productVisual(p,i))+'" alt="'+esc(p.type)+'" loading="lazy"><span class="editorial-shade"></span><span class="editorial-meta"><small>MAISON MNL · '+String(i+1).padStart(2,'0')+'</small><b>'+esc(p.name)+'</b><em>'+esc(p.type)+'</em></span></a>').join('');observe(h);}
function setupMotion(){document.documentElement.classList.add('motion-ready');document.querySelectorAll('main section:not(.hero)').forEach(el=>el.classList.add('reveal'));const progress=$('scrollProgress');let ticking=false;const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;const p=max>0?scrollY/max:0;if(progress)progress.style.transform='scaleX('+p+')';document.body.style.setProperty('--scroll-progress',p);ticking=false;};window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true;}},{passive:true});update();observe();const pointer=matchMedia('(pointer:fine)').matches;if(pointer){document.querySelectorAll('.hero,.editorial-tile,.product').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');el.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');});});}}
function welcome(){
 if(location.pathname.endsWith('products.html')||location.pathname.endsWith('product.html'))return;
 let seen=false;try{seen=sessionStorage.getItem('mnl-welcome-v2')==='1';}catch(e){}
 if(seen||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 try{sessionStorage.setItem('mnl-welcome-v2','1');}catch(e){}
 const overlay=document.createElement('div');overlay.className='mnl-intro';overlay.setAttribute('aria-hidden','true');
 overlay.innerHTML='<div class="intro-screen"><svg class="intro-monogram" viewBox="0 0 100 100" aria-hidden="true"><path d="M12 82V18L50 66 88 18V82"/></svg></div>';
 document.body.appendChild(overlay);
 const hero=document.querySelector('.hero-inner');
 const title=hero?.querySelector('h1');
 if(title){
  const raw=title.innerText.replace(/\\s+/g,' ').trim();
  title.innerHTML=raw.split(' ').map((word,i)=>'<span class="word-mask"><span style="--word-delay:'+i*80+'ms">'+esc(word)+'</span></span>').join(' ');
 }
 requestAnimationFrame(()=>overlay.classList.add('intro-opening'));
 const started=performance.now();
 const finish=()=>{overlay.remove();document.body.classList.remove('intro-active');};
 const reveal=()=>{document.body.classList.add('intro-done');finish();};
 setTimeout(reveal,1350);
 if(performance.now()-started>1500)finish();
}
function setupHero(){
 const hero=document.querySelector('.hero#home'),photo=hero?.querySelector('.hero-bg');
 if(!hero||!photo)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let px=0,py=0,raf=0;
 const move=(x,y)=>{px=Math.max(-1,Math.min(1,x));py=Math.max(-1,Math.min(1,y));if(!raf)raf=requestAnimationFrame(()=>{photo.style.setProperty('--parallax-x',(px*7).toFixed(2)+'px');photo.style.setProperty('--parallax-y',(py*5).toFixed(2)+'px');raf=0;});};
 hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();move((e.clientX-r.left)/r.width-.5,(e.clientY-r.top)/r.height-.5);},{passive:true});
 hero.addEventListener('pointerleave',()=>move(0,0),{passive:true});
 if(!reduced && 'DeviceOrientationEvent'in window && typeof DeviceOrientationEvent.requestPermission==='function'){
  const opt=document.createElement('button');opt.type='button';opt.className='motion-optin';opt.textContent='Activer le mouvement';opt.setAttribute('aria-label','Autoriser le mouvement selon l’inclinaison du téléphone');
  opt.addEventListener('click',async()=>{try{const permission=await DeviceOrientationEvent.requestPermission();if(permission==='granted')window.addEventListener('deviceorientation',e=>move((e.gamma||0)/35,(e.beta||0)/55),{passive:true});opt.remove();}catch(e){opt.remove();}});
  hero.appendChild(opt);
 }
}
function setupMarquee(){
 const track=document.querySelector('.category-track');if(!track)return;
 if(!track.dataset.looped){Array.from(track.children).forEach(node=>{const clone=node.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.querySelectorAll('a').forEach(a=>a.setAttribute('tabindex','-1'));track.appendChild(clone);});track.dataset.looped='1';}
 track.classList.add('category-marquee');
 track.addEventListener('pointerdown',()=>track.classList.add('is-paused'));
 ['pointerup','pointercancel','pointerleave'].forEach(type=>track.addEventListener(type,()=>track.classList.remove('is-paused')));
}
function setupTilt(){
 const cards=document.querySelectorAll('.product');
 cards.forEach(card=>{
  const image=card.querySelector('.product-image');
  card.addEventListener('pointermove',e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.setProperty('--tilt-x',(-y*2.5).toFixed(2)+'deg');card.style.setProperty('--tilt-y',(x*3).toFixed(2)+'deg');});
  card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');});
  card.addEventListener('touchstart',()=>card.classList.add('touching'),{passive:true});
  card.addEventListener('touchend',()=>card.classList.remove('touching'),{passive:true});
 });
}
function setupCounters(){
 const nodes=document.querySelectorAll('[data-count]');if(!nodes.length)return;
 const run=el=>{if(el.dataset.counted)return;el.dataset.counted='1';const end=Number(el.dataset.count)||0;const begin=performance.now(),duration=850;const tick=now=>{const p=Math.min(1,(now-begin)/duration);el.textContent=Math.round(end*(1-Math.pow(1-p,3))).toLocaleString('fr-FR');if(p<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);};
 if(!('IntersectionObserver'in window)){nodes.forEach(run);return;}
 const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){run(e.target);io.unobserve(e.target);}}),{threshold:.5});nodes.forEach(n=>io.observe(n));
}
function setupKeynote(){
 const root=$('keynoteCountdown');if(!root)return;
 const update=()=>{const now=new Date(),target=new Date(now.getFullYear(),now.getMonth()+1,1,0,0,0),ms=Math.max(0,target-now);const values={days:Math.floor(ms/86400000),hours:Math.floor(ms%86400000/3600000),minutes:Math.floor(ms%3600000/60000),seconds:Math.floor(ms%60000/1000)};Object.keys(values).forEach(k=>{const el=root.querySelector('[data-unit="'+k+'"]');if(el)el.textContent=String(values[k]).padStart(2,'0');});};
 update();if(!matchMedia('(prefers-reduced-motion: reduce)').matches)setInterval(update,1000);
}
function setupFlow(){const nodes=document.querySelectorAll('.flow-node');if(!nodes.length)return;let step=0;const activate=()=>{nodes.forEach((n,i)=>n.classList.toggle('is-active',i===step));step=(step+1)%nodes.length;};activate();if(!matchMedia('(prefers-reduced-motion: reduce)').matches)setInterval(activate,2200);}
function init(){const menu=document.querySelector('.hamb');menu?.addEventListener('click',()=>{const nav=document.querySelector('.navlinks');const state=nav?.classList.toggle('open');menu?.setAttribute('aria-expanded',String(!!state));});renderDivisions();setupFilters();renderProducts();renderEditorial();['search','filter','sort'].forEach(id=>$(id)?.addEventListener(id==='search'?'input':'change',renderProducts));$('close')?.addEventListener('click',close);$('modal')?.addEventListener('click',e=>{if(e.target===$('modal'))close();});document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});document.querySelectorAll('.bottom-dock a').forEach(a=>{const target=a.dataset.page;if(location.pathname.endsWith(target)||(target==='index.html'&&(location.pathname.endsWith('/MNL-INDUSTRIE/')||location.pathname.endsWith('/'))))a.classList.add('active');});if($('year'))$('year').textContent=new Date().getFullYear();if($('catalogTotal'))$('catalogTotal').textContent=String(all.length);const header=document.querySelector('header');window.addEventListener('scroll',()=>header?.classList.toggle('header-scrolled',scrollY>35),{passive:true});setupMotion();setupFlow();welcome();setupHero();setupMarquee();setupTilt();setupCounters();setupKeynote();}
document.addEventListener('DOMContentLoaded',init);
})();