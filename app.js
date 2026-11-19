const divisions=[
["MNL Automotive","Mobilité terrestre","🚘","Imaginer les prochaines expériences de mobilité."],
["MNL Aerospace","Aéronautique et espace","✈","Explorer les futurs de l'aviation."],
["MNL Digital","Informatique et électronique","▣","Concevoir les appareils numériques de demain."],
["MNL Wearables","Technologies portables","◉","Relier le numérique aux usages quotidiens."],
["MNL Robotics","Robotique et automatisation","🤖","Imaginer des systèmes robotiques utiles."],
["MNL Energy","Énergie et stockage","ϟ","Explorer les solutions énergétiques avancées."],
["MNL Aviation Systems","Systèmes aériens","✧","Étudier les technologies aériennes civiles."],
["MNL Living","Habitat intelligent","⌂","Réinventer les environnements connectés."],
["MNL Semiconductor","Composants avancés","▦","Explorer les architectures électroniques."],
["MNL Intelligence","Intelligence artificielle","✳","Concevoir des expériences logicielles intelligentes."]
];
const $=id=>document.getElementById(id);
function renderDivisions(){const host=$("divisionGrid");if(!host)return;divisions.forEach((d,i)=>{const el=document.createElement("article");el.className="division";el.innerHTML=`<div class="number">DIVISION / ${(i+1).toString().padStart(2,"0")}</div><div class="symbol">${d[2]}</div><h3>${d[0]}</h3><p>${d[1]}</p>`;host.append(el)})}
function card(p,i){const el=document.createElement("article");el.className="product";el.innerHTML=`<div class="product-image"><img src="assets/${p.image}" alt="${p.name} — rendu de concept" loading="lazy"><span class="product-number">MNL / ${String(i+1).padStart(2,"0")}</span></div><div class="product-info"><small>${p.division} · ${p.tag}</small><h3>${p.name}</h3><p>${p.type}</p><div class="product-bottom"><span class="concept">Concept virtuel</span><span class="arrow">↗</span></div></div>`;el.addEventListener("click",()=>openProduct(p));return el}
function renderProducts(){const host=$("productGrid");if(!host)return;let list=window.MNL_PRODUCTS||[];const q=($("search")?.value||"").toLowerCase();const f=$("filter")?.value||"all";list=list.filter(p=>(f==="all"||p.division===f||p.category===f)&&[p.name,p.division,p.category,p.type,p.description].join(" ").toLowerCase().includes(q));if($("sort")?.value==="az")list.sort((a,b)=>a.name.localeCompare(b.name));host.replaceChildren(...list.map(card));if($("empty"))$("empty").style.display=list.length?"none":"block"}
function openProduct(p){$("modalImg").src="assets/"+p.image;$("modalImg").alt=p.name;$("modalDivision").textContent=p.division+" / MNL INDUSTRIE";$("modalTitle").textContent=p.name;$("modalType").textContent=p.type;$("modalDesc").textContent=p.description;$("specs").replaceChildren(...p.specs.map(s=>{const row=document.createElement("div");row.className="spec";row.innerHTML=`<span>${s[0]}</span><b>${s[1]}</b>`;return row}));$("modal").classList.add("show")}
renderDivisions();renderProducts();
["search","filter","sort"].forEach(id=>$(id)?.addEventListener(id==="search"?"input":"change",renderProducts));
$("close")?.addEventListener("click",()=>$("modal").classList.remove("show"));$("modal")?.addEventListener("click",e=>{if(e.target===$("modal"))$("modal").classList.remove("show")});
$("hamb")?.addEventListener("click",()=>$("navlinks").classList.toggle("open"));document.querySelectorAll(".navlinks a").forEach(a=>a.addEventListener("click",()=>$("navlinks").classList.remove("open")));
$("year").textContent=new Date().getFullYear();if($("productCount"))$("productCount").textContent=(window.MNL_PRODUCTS||[]).length;
if("serviceWorker"in navigator&&location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
