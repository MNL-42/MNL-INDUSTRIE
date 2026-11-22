(()=>{'use strict';
if(document.querySelector('.mnl-mobile-nav'))return;
const items=[['index.html','⌂','Accueil'],['products.html','▦','Catalogue'],['divisions.html','◇','Univers'],['about.html','○','À propos'],['contact.html','✉','Contact']];
const current=location.pathname.split('/').pop()||'index.html';
const nav=document.createElement('nav');nav.className='mnl-mobile-nav';nav.setAttribute('aria-label','Navigation principale mobile');
nav.innerHTML=items.map(([href,icon,label])=>'<a href="'+href+'" '+(current===href?'class="active" aria-current="page"':'')+'><span aria-hidden="true">'+icon+'</span><span>'+label+'</span></a>').join('');
document.body.appendChild(nav);
})();