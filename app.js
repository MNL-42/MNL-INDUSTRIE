/* MNL INDUSTRIE — Motion & UI refinement
   Remplace l'ancien app.js. Compatible avec les pages HTML actuelles. */
(() => {
  "use strict";

  const divisions = [
    ["MNL Automobile", "Mobilité terrestre", "car"],
    ["MNL Aérospatiale", "Aéronautique et espace", "plane"],
    ["MNL Numérique", "Informatique et électronique", "chip"],
    ["MNL Technologies portables", "Technologies portables", "glasses"],
    ["MNL Robotique", "Robotique et automatisation", "robot"],
    ["MNL Énergie", "Énergie et stockage", "energy"],
    ["MNL Systèmes aériens", "Systèmes aériens", "radar"],
    ["MNL Habitat intelligent", "Habitat intelligent", "home"],
    ["MNL Microtechnologie", "Composants avancés", "microchip"],
    ["MNL Intelligence artificielle", "Intelligence artificielle artificielle", "neural"]
  ];

  const icons = {
    car: '<path d="m5 16 1.5-5h11L19 16"/><path d="M4 16h16v4H4z"/><path d="M7 11 9 7h6l2 4"/><circle cx="7.5" cy="20" r="1.5"/><circle cx="16.5" cy="20" r="1.5"/>',
    plane: '<path d="m3 13 8-2 3-8 2-1 1 1-1 8 5 3v2l-6-1-3 5-2 1v-6l-7-1z"/>',
    chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 9h6v6H9zM9 1v5m6-5v5M9 18v5m6-5v5M1 9h5m-5 6h5m12-6h5m-5 6h5"/>',
    glasses: '<path d="M2 12h3l2 6h4l2-6h2l2 6h4l2-6h3"/><path d="M7 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0Zm10 0a4 4 0 1 0 8 0 4 4 0 1 0-8 0Z"/>',
    robot: '<rect x="5" y="8" width="14" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9 17h6M3 12v5m18-5v5M9 3h6"/>',
    energy: '<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
    radar: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="m12 12 6-6M12 3v2M21 12h-2"/>',
    home: '<path d="m3 11 9-8 9 8v10h-6v-6H9v6H3z"/>',
    microchip: '<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9zM2 9h3m-3 6h3m14-6h3m-3 6h3M9 2v3m6-3v3m-6 14v3m6-3v3"/>',
    neural: '<circle cx="12" cy="12" r="2"/><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="m7 7 3.5 3.5M17 7l-3.5 3.5M7 17l3.5-3.5M17 17l-3.5-3.5"/>'
  };

  const $ = (id) => document.getElementById(id);
  const svgIcon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.chip}</svg>`;

  function renderDivisions() {
    const host = $("divisionGrid");
    if (!host) return;
    host.replaceChildren();
    divisions.forEach((division, index) => {
      const [name, subtitle, icon] = division;
      const card = document.createElement("article");
      card.className = "division reveal";
      card.style.setProperty("--reveal-delay", `${(index % 5) * 75}ms`);
      card.innerHTML = `
        <div class="division-topline"><span class="number">DIVISION / ${(index + 1).toString().padStart(2, "0")}</span><span class="division-index">0${index + 1}</span></div>
        <div class="division-symbol">${svgIcon(icon)}</div>
        <h3>${name}</h3><p>${subtitle}</p>
        <span class="division-link" aria-hidden="true">DÉCOUVRIR <b>↗</b></span>`;
      host.append(card);
    });
  }

  function productCard(product, index) {
    const card = document.createElement("article");
    card.className = "product reveal";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Découvrir ${product.name}`);
    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name} — rendu de concept" loading="lazy">
        <span class="product-number">MNL / ${String(index + 1).padStart(2, "0")}</span>
        <span class="product-view">VOIR LE CONCEPT <b>↗</b></span>
      </div>
      <div class="product-info">
        <small>${product.division} · ${product.tag}</small>
        <h3>${product.name}</h3><p>${product.type}</p>
        <div class="product-bottom"><span class="concept">CONCEPT VIRTUEL</span><span class="arrow">↗</span></div>
      </div>`;
    const open = () => openProduct(product);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); }
    });
    return card;
  }

  function renderProducts() {
    const host = $("productGrid");
    if (!host) return;
    const all = window.MNL_PRODUCTS || [];
    const query = ($("search")?.value || "").trim().toLowerCase();
    const filter = $("filter")?.value || "all";
    const sort = $("sort")?.value || "default";
    let products = all.filter((product) => {
      const matchesFilter = filter === "all" || product.division === filter || product.category === filter;
      const haystack = [product.name, product.division, product.category, product.type, product.description].join(" ").toLowerCase();
      return matchesFilter && haystack.includes(query);
    });
    if (sort === "az") products = [...products].sort((a, b) => a.name.localeCompare(b.name));
    host.replaceChildren(...products.map(productCard));
    if ($("empty")) $("empty").style.display = products.length ? "none" : "block";
    observeReveals(host);
  }

  function openProduct(product) {
    if (!$("modal")) return;
    $("modalImg").src = `${product.image}`;
    $("modalImg").alt = product.name;
    $("modalDivision").textContent = `${product.division} / MNL INDUSTRIE`;
    $("modalTitle").textContent = product.name;
    $("modalType").textContent = product.type;
    $("modalDesc").textContent = product.description;
    const specs = $("specs");
    specs.replaceChildren(...(product.specs || []).map(([label, value]) => {
      const row = document.createElement("div");
      row.className = "spec";
      const left = document.createElement("span");
      const right = document.createElement("b");
      left.textContent = label;
      right.textContent = value;
      row.append(left, right);
      return row;
    }));
    $("modal").classList.add("show");
    document.body.classList.add("modal-open");
    $("close")?.focus();
  }

  function closeModal() {
    $("modal")?.classList.remove("show");
    document.body.classList.remove("modal-open");
  }

  let revealObserver;
  function observeReveals(root = document) {
    const items = root.querySelectorAll?.(".reveal:not(.is-visible)");
    if (!items?.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    }
    items.forEach((item) => revealObserver.observe(item));
  }

  function initMotion() {
    document.documentElement.classList.add("motion-ready");
    observeReveals();

    // Subtle pointer parallax for large visual panels; disabled on touch screens.
    if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
      document.querySelectorAll(".product, .division, .eco").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          card.style.setProperty("--pointer-x", `${x * 16}px`);
          card.style.setProperty("--pointer-y", `${y * 16}px`);
        });
        card.addEventListener("pointerleave", () => {
          card.style.setProperty("--pointer-x", "0px");
          card.style.setProperty("--pointer-y", "0px");
        });
      });
    }

    // Header changes subtly after the hero has been crossed.
    const header = document.querySelector("header");
    if (header && "IntersectionObserver" in window) {
      const hero = document.querySelector(".hero");
      if (hero) new IntersectionObserver(([entry]) => {
        header.classList.toggle("header-scrolled", !entry.isIntersecting);
      }, { threshold: 0.05 }).observe(hero);
    }
  }

  function initControls() {
    ["search", "filter", "sort"].forEach((id) => {
      $(id)?.addEventListener(id === "search" ? "input" : "change", renderProducts);
    });
    $("close")?.addEventListener("click", closeModal);
    $("modal")?.addEventListener("click", (event) => { if (event.target === $("modal")) closeModal(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });
    $("hamb")?.addEventListener("click", () => {
      const nav = $("navlinks");
      const opened = nav?.classList.toggle("open");
      $("hamb")?.setAttribute("aria-expanded", String(Boolean(opened)));
    });
    document.querySelectorAll(".navlinks a").forEach((link) => link.addEventListener("click", () => $("navlinks")?.classList.remove("open")));
    if ($("year")) $("year").textContent = new Date().getFullYear();
    if ($("productCount")) $("productCount").textContent = String((window.MNL_PRODUCTS || []).length);
  }

  function initPWA() {
    if ("serviceWorker" in navigator && /^https?:/.test(location.protocol)) {
      window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
    }
  }

  renderDivisions();
  renderProducts();
  initControls();
  initMotion();
  initPWA();
})();
