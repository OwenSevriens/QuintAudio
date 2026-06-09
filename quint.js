/* ============================================================
   QUINT AUDIO — Website interactions (static export)
   Eén JS-bestand: mega-menu, filters, sorteren, vergelijken,
   carousel, video-modal. Vanilla JS, geen dependencies.
   ============================================================ */
(function () {
  "use strict";

  /* Product data — gebruikt door de vergelijk-modal (beide categorieën) */
  var PRODUCTS = {
    L10:{series:"L-series",type:"Line array module",drivers:'1×10" ND + 2×1.75"',use:"Touring",desc:"Full range line array module"},
    L20:{series:"L-series",type:"Line array module",drivers:'2×10" + 1×4" + 1×2.5"',use:"Touring",desc:"High performance full-range line array module"},
    Lsub:{series:"L-series",type:"Subwoofer",drivers:'1×21" ND',use:"Touring",desc:"Infrasub"},
    C6:{series:"C-series",type:"Full-range top",drivers:'6.5" + 1.7"',use:"Installation",desc:"Compact high power point source"},
    C15:{series:"C-series",type:"Full-range top",drivers:'15" + 4" + 2.5"',use:"Installation",desc:"Full range constant curvature"},
    C42:{series:"C-series",type:"Subwoofer",drivers:'2×21"',use:"Installation",desc:"High performance sub"},
    R12:{series:"R-series",type:"Full-range top",drivers:'12"',use:"Reference",desc:"State-of-the-art full range point source top"},
    Rsub:{series:"R-series",type:"Subwoofer",drivers:'21"',use:"Reference",desc:"State-of-the-art infra sub"},
    T12:{series:"T-series",type:"Full-range top",drivers:'12" + 5"',use:"Touring",desc:"Touring top"},
    T16:{series:"T-series",type:"Full-range top",drivers:'2×8" + 3.5"',use:"Touring",desc:"Compact high power top"},
    T24:{series:"T-series",type:"Full-range top",drivers:'2×12" + 4" + 2.5"',use:"Touring",desc:"High power top"},
    M6:{series:"M-series",type:"Monitor",drivers:'6.5" coaxial',use:"Touring · Installation",desc:"Compact coaxial monitor"},
    M14:{series:"M-series",type:"Monitor",drivers:'13.5" coaxial',use:"Touring · Installation",desc:"Compact full range coaxial monitor"},
    B15:{series:"B-series",type:"Subwoofer",drivers:'15"',use:"Touring · Installation",desc:"Super compact subwoofer"},
    B21:{series:"B-series",type:"Subwoofer",drivers:'21"',use:"Touring · Installation",desc:"Compact subwoofer"},
    U8:{series:"U-series",type:"Full-range top",drivers:'8" + 1.7"',use:"Touring · Installation",desc:"Universal full-range top"},
    "U12 MK2":{series:"U-series",type:"Full-range top",drivers:'12" + 2.5"',use:"Touring · Installation",desc:"Universal full-range top"},
    U15:{series:"U-series",type:"Full-range top",drivers:'15" + 2.5"',use:"Touring · Installation",desc:"Universal full-range top"},
    V36:{series:"V-series",type:"Line array module",drivers:'2×18" + 2×15" + 4×8"',use:"Touring",desc:"Active directivity control line array"},
    C36:{series:"C-series",type:"Line array module",drivers:'2×18" + 2×15" + 4×8"',use:"Installation",desc:"Active directivity control module"},
    A23:{series:"A-series",type:"Amplifier",drivers:"2×3000 W (8 Ω)",use:"Touring · Installation",desc:"High power compact amplifier"},
    A41:{series:"A-series",type:"Amplifier",drivers:"4×1000 W (8 Ω)",use:"Touring · Installation",desc:"Compact amplifier"},
    A42:{series:"A-series",type:"Amplifier",drivers:"4×2000 W (8 Ω)",use:"Touring · Installation",desc:"High power compact amplifier"},
    A4:{series:"A-series",type:"Amplifier",drivers:"4×1600 W (8 Ω)",use:"Touring · Installation",desc:"High fidelity amplifier"},
    A6:{series:"A-series",type:"Amplifier",drivers:"6×500 W (8 Ω)",use:"Touring · Installation",desc:"High fidelity amplifier"},
    P5:{series:"P-series",type:"Processor / DSP",drivers:"4× analog I/O",use:"Touring · Installation",desc:"Loudspeaker management processor"},
    P9:{series:"P-series",type:"Processor / DSP",drivers:"4/8× analog I/O",use:"Touring · Installation",desc:"Loudspeaker management processor"},
    D4:{series:"D-series",type:"Accessory",drivers:"4× I/O",use:"Touring · Installation",desc:"Connector panel for P-series"},
    D5:{series:"D-series",type:"Accessory",drivers:"Touchscreen",use:"Touring · Installation",desc:"Touchscreen interface for P-series"},
    D8:{series:"D-series",type:"Accessory",drivers:"4/8× I/O",use:"Touring · Installation",desc:"Connector panel for P-series"}
  };

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* electronics-series → om de "add more"-pool per categorie te filteren */
  var ELEC_SERIES = { "A-series": 1, "P-series": 1, "D-series": 1 };
  function isElec(name) { var p = PRODUCTS[name]; return !!(p && ELEC_SERIES[p.series]); }

  /* ========================================================
     NAVBAR — mega-menu (hover)
     ======================================================== */
  function initNavbar() {
    var nav = $(".q-nav");
    if (!nav) return;
    var drop = $(".q-nav-drop", nav);
    var groups = $$(".q-nav-drop-group", nav);
    var timer = null;

    function openMenu(name) {
      clearTimeout(timer);
      if (!name) return closeMenu();
      groups.forEach(function (g) { g.classList.toggle("is-active", g.getAttribute("data-group") === name); });
      drop && drop.classList.add("is-open");
      $$(".q-nav-item", nav).forEach(function (it) {
        it.classList.toggle("is-open", it.getAttribute("data-menu") === name);
      });
    }
    function closeMenu() {
      drop && drop.classList.remove("is-open");
      $$(".q-nav-item", nav).forEach(function (it) { it.classList.remove("is-open"); });
    }
    function scheduleClose() { clearTimeout(timer); timer = setTimeout(closeMenu, 120); }

    $$(".q-nav-item", nav).forEach(function (item) {
      var menu = item.getAttribute("data-menu");
      item.addEventListener("mouseenter", function () { openMenu(menu || null); });
      item.addEventListener("mouseleave", function () { if (menu) scheduleClose(); });
    });
    if (drop) {
      drop.addEventListener("mouseenter", function () { clearTimeout(timer); });
      drop.addEventListener("mouseleave", scheduleClose);
    }
  }

  /* ========================================================
     COMPARE — gedeelde state via localStorage
     ======================================================== */
  var COMPARE_KEY = "quint-compare";
  function getCompare() {
    try { return JSON.parse(localStorage.getItem(COMPARE_KEY)) || []; }
    catch (e) { return []; }
  }
  function setCompare(arr) {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(arr));
    renderCompare();
  }
  function toggleCompare(name) {
    var arr = getCompare();
    var i = arr.indexOf(name);
    if (i > -1) arr.splice(i, 1);
    else if (arr.length < 4) arr.push(name);
    setCompare(arr);
  }
  function removeCompare(name) {
    var arr = getCompare().filter(function (x) { return x !== name; });
    setCompare(arr);
  }
  function clearCompare() {
    setCompare([]);
    closeCompareModal();
  }

  function renderCompare() {
    var arr = getCompare();

    /* card-checkboxes synchroniseren */
    $$("[data-compare-card]").forEach(function (card) {
      var name = card.getAttribute("data-compare-card");
      card.classList.toggle("in-compare", arr.indexOf(name) > -1);
    });
    /* product-pagina knop */
    $$("[data-compare-toggle]").forEach(function (btn) {
      var name = btn.getAttribute("data-compare-toggle");
      var on = arr.indexOf(name) > -1;
      btn.classList.toggle("in-compare", on);
      var lbl = $(".prod-compare-label", btn);
      if (lbl) lbl.textContent = on ? "Added to compare" : "Add to compare";
      btn.classList.toggle("qbtn--navy", on);
      btn.classList.toggle("qbtn--ghost", !on);
    });

    var tray = $(".compare-tray");
    if (!tray) return;
    tray.classList.toggle("is-visible", arr.length > 0);
    var count = $(".compare-tray-count", tray);
    if (count) count.textContent = "Compare · " + arr.length + "/4";
    var chips = $(".compare-tray-chips", tray);
    if (chips) {
      chips.innerHTML = "";
      arr.forEach(function (name) {
        var chip = document.createElement("span");
        chip.className = "compare-chip";
        chip.appendChild(document.createTextNode(name + " "));
        var x = document.createElement("button");
        x.type = "button";
        x.setAttribute("aria-label", "Remove " + name);
        x.textContent = "×";
        x.addEventListener("click", function () { removeCompare(name); });
        chip.appendChild(x);
        chips.appendChild(chip);
      });
    }
    var openBtn = $(".compare-tray-open", tray);
    if (openBtn) {
      openBtn.disabled = arr.length < 2;
      openBtn.textContent = arr.length < 2 ? "Add another to compare" : "Compare →";
    }
  }

  function initCompare() {
    /* card checkboxes */
    $$("[data-compare-card]").forEach(function (card) {
      var name = card.getAttribute("data-compare-card");
      var box = $(".cat-card-compare", card);
      if (box) {
        box.addEventListener("click", function (e) {
          e.stopPropagation();
          toggleCompare(name);
        });
      }
    });
    /* product-pagina toggle */
    $$("[data-compare-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () { toggleCompare(btn.getAttribute("data-compare-toggle")); });
    });
    /* tray buttons */
    var tray = $(".compare-tray");
    if (tray) {
      var clearBtn = $(".compare-tray-clear", tray);
      var openBtn = $(".compare-tray-open", tray);
      if (clearBtn) clearBtn.addEventListener("click", clearCompare);
      if (openBtn) openBtn.addEventListener("click", openCompareModal);
    }
    renderCompare();
  }

  /* Vergelijk-modal opbouwen */
  function openCompareModal() {
    var arr = getCompare();
    if (arr.length < 2) return;
    var modal = $(".compare-modal");
    if (!modal) return;
    var products = arr.map(function (n) { return { name: n, p: PRODUCTS[n] }; }).filter(function (o) { return o.p; });
    var cols = products.length;
    var MAX = 4;

    $(".compare-modal-head h2").textContent = cols + (cols === 1 ? " product" : " products") + " side by side";

    var table = $(".compare-table", modal);
    table.style.gridTemplateColumns = "minmax(200px, 232px) repeat(" + MAX + ", minmax(180px, 1fr))";
    table.innerHTML = "";

    function cell(cls) { var d = document.createElement("div"); d.className = cls; return d; }

    /* 4 vaste slots: gevulde producten, daarna één "add"-slot, daarna leeg */
    var slots = [];
    for (var s = 0; s < MAX; s++) slots.push(products[s] || null);
    var addIndex = cols < MAX ? cols : -1;

    /* kaart-rij */
    table.appendChild(cell("compare-corner"));
    slots.forEach(function (o, i) {
      if (o) {
        var head = cell("compare-col-head");
        var img = cell("compare-col-img");
        img.textContent = o.name + " image";
        head.appendChild(img);
        var eb = document.createElement("span");
        eb.className = "q-eyebrow";
        eb.style.fontSize = "11px";
        eb.textContent = o.p.series;
        head.appendChild(eb);
        var nm = cell("compare-col-name");
        nm.textContent = o.name;
        head.appendChild(nm);
        var sub = cell("compare-col-sub");
        sub.textContent = o.p.type;
        head.appendChild(sub);
        var rm = document.createElement("button");
        rm.className = "compare-col-remove";
        rm.type = "button";
        rm.textContent = "Remove ×";
        rm.addEventListener("click", function () {
          removeCompare(o.name);
          if (getCompare().length < 2) closeCompareModal();
          else openCompareModal();
        });
        head.appendChild(rm);
        table.appendChild(head);
      } else {
        var empty = cell("compare-col-empty");
        if (i === addIndex) {
          var plus = cell("compare-add-plus");
          plus.textContent = "+";
          empty.appendChild(plus);
          var lbl = cell("compare-add-label");
          lbl.textContent = "Add product to slot " + (i + 1);
          empty.appendChild(lbl);
        }
        table.appendChild(empty);
      }
    });

    /* spec-rijen — oranje stip waar waarden verschillen */
    var rows = [["Type", "type"], ["Drivers / components", "drivers"], ["Application", "use"], ["Description", "desc"]];
    rows.forEach(function (r, ri) {
      var alt = ri % 2 === 0 ? " alt" : "";
      var seen = {}, uniq = 0;
      products.forEach(function (o) { var v = o.p[r[1]]; if (!(v in seen)) { seen[v] = 1; uniq++; } });
      var differs = cols > 1 && uniq > 1;

      var label = cell("compare-row-label" + alt);
      label.appendChild(document.createTextNode(r[0]));
      if (differs) {
        var dot = document.createElement("span");
        dot.className = "compare-diff-dot";
        dot.title = "Values differ";
        label.appendChild(dot);
      }
      table.appendChild(label);
      slots.forEach(function (o) {
        var c = cell("compare-cell" + alt + (o ? "" : " is-empty"));
        c.textContent = o ? o.p[r[1]] : "–";
        table.appendChild(c);
      });
    });

    /* add more to compare */
    var addmore = $(".compare-addmore", modal);
    if (addmore) {
      addmore.innerHTML = "";
      var firstElec = products[0] && isElec(products[0].name);
      var pool = Object.keys(PRODUCTS).filter(function (n) {
        return isElec(n) === !!firstElec && arr.indexOf(n) === -1 && n !== "T24";
      });
      if (pool.length) {
        var eb2 = document.createElement("span");
        eb2.className = "q-eyebrow";
        eb2.textContent = "Add more to compare";
        addmore.appendChild(eb2);
        var pills = cell("compare-addmore-pills");
        var VISIBLE = 14;
        var full = cols >= MAX;
        pool.slice(0, VISIBLE).forEach(function (n) {
          var pill = document.createElement("button");
          pill.type = "button";
          pill.className = "compare-pill";
          pill.disabled = full;
          var pl = document.createElement("span");
          pl.className = "compare-pill-plus";
          pl.textContent = "+";
          pill.appendChild(pl);
          pill.appendChild(document.createTextNode(" " + n + " "));
          var sr = document.createElement("span");
          sr.className = "compare-pill-series";
          sr.textContent = PRODUCTS[n].series;
          pill.appendChild(sr);
          pill.addEventListener("click", function () { toggleCompare(n); openCompareModal(); });
          pills.appendChild(pill);
        });
        var extra = pool.length - Math.min(pool.length, VISIBLE);
        if (extra > 0) {
          var more = document.createElement("span");
          more.className = "compare-pill-more";
          more.textContent = "+" + extra + " more in catalog";
          pills.appendChild(more);
        }
        addmore.appendChild(pills);
      }
    }

    modal.classList.add("is-open");
  }
  function closeCompareModal() {
    var modal = $(".compare-modal");
    if (modal) modal.classList.remove("is-open");
  }
  function initCompareModal() {
    var modal = $(".compare-modal");
    if (!modal) return;
    modal.addEventListener("click", function (e) { if (e.target === modal) closeCompareModal(); });
    var close = $(".compare-modal-close", modal);
    if (close) close.addEventListener("click", closeCompareModal);
    var printBtn = $(".compare-print", modal);
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });
    var clearAll = $(".compare-clear-all", modal);
    if (clearAll) clearAll.addEventListener("click", clearCompare);
  }

  /* ========================================================
     CATEGORY TOGGLE (Loudspeakers / Electronics op één pagina)
     ======================================================== */
  function initCategoryToggle() {
    var sections = $$(".cat[data-category]");
    if (sections.length < 2) return;
    function show(cat) {
      sections.forEach(function (s) { s.hidden = s.getAttribute("data-category") !== cat; });
      $$("[data-show-category]").forEach(function (b) {
        var on = b.getAttribute("data-show-category") === cat;
        b.classList.toggle("qbtn--navy", on);
        b.classList.toggle("qbtn--ghost", !on);
      });
      window.scrollTo(0, 0);
    }
    $$("[data-show-category]").forEach(function (btn) {
      btn.addEventListener("click", function () { show(btn.getAttribute("data-show-category")); });
    });
    /* deeplink #electronics */
    if (location.hash === "#electronics") show("electronics");
  }

  /* ========================================================
     CATALOG — filters, sorteren, resultaat-telling (per sectie)
     ======================================================== */
  function initCatalog() {
    $$(".cat-grid").forEach(initCatalogSection);
  }

  function initCatalogSection(grid) {
    var section = grid.closest(".cat") || document;
    var cards = $$(".cat-card", grid);
    var dropdowns = $$(".filter-dd", section);
    var sortSel = $(".cat-sort select", section);
    var countEl = $(".cat-count", section);
    var emptyEl = $(".cat-empty", section);
    var clearAllBtn = $(".cat-clear-all", section);

    /* dropdown open/dicht */
    dropdowns.forEach(function (dd) {
      var btn = $(".filter-dd-btn", dd);
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var wasOpen = dd.classList.contains("is-open");
        dropdowns.forEach(function (d) { d.classList.remove("is-open"); });
        dd.classList.toggle("is-open", !wasOpen);
      });
      $$(".filter-dd-menu input", dd).forEach(function (inp) {
        inp.addEventListener("change", function () { updateDropdownState(dd); apply(); });
      });
      var clr = $(".filter-dd-clear", dd);
      if (clr) clr.addEventListener("click", function () {
        $$(".filter-dd-menu input", dd).forEach(function (i) { i.checked = false; });
        updateDropdownState(dd); apply();
      });
    });
    document.addEventListener("click", function () { dropdowns.forEach(function (d) { d.classList.remove("is-open"); }); });

    function updateDropdownState(dd) {
      var n = $$(".filter-dd-menu input:checked", dd).length;
      dd.classList.toggle("has-count", n > 0);
      var badge = $(".filter-dd-count", dd);
      if (badge) badge.textContent = n;
    }

    function selectedFor(group) {
      var dd = dropdowns.filter(function (d) { return d.getAttribute("data-group") === group; })[0];
      if (!dd) return [];
      return $$(".filter-dd-menu input:checked", dd).map(function (i) { return i.value; });
    }

    function apply() {
      var series = selectedFor("Series");
      var types = selectedFor("Type");
      var apps = selectedFor("Application");
      var visible = [];

      cards.forEach(function (card) {
        var s = card.getAttribute("data-series");
        var t = card.getAttribute("data-type");
        var u = (card.getAttribute("data-use") || "").split("|");
        var ok = true;
        if (series.length && series.indexOf(s) === -1) ok = false;
        if (types.length && types.indexOf(t) === -1) ok = false;
        if (apps.length && !apps.some(function (a) { return u.indexOf(a) > -1; })) ok = false;
        card.style.display = ok ? "" : "none";
        if (ok) visible.push(card);
      });

      /* sorteren */
      var mode = sortSel ? sortSel.value : "Series";
      visible.sort(function (a, b) {
        if (mode === "Type") {
          return (a.getAttribute("data-type") || "").localeCompare(b.getAttribute("data-type") || "") ||
                 (a.getAttribute("data-name") || "").localeCompare(b.getAttribute("data-name") || "");
        }
        if (mode === "Name A–Z") {
          return (a.getAttribute("data-name") || "").localeCompare(b.getAttribute("data-name") || "");
        }
        return (parseInt(a.getAttribute("data-order"), 10) || 0) - (parseInt(b.getAttribute("data-order"), 10) || 0);
      });
      visible.forEach(function (c) { grid.appendChild(c); });

      /* tellingen + lege staat */
      var activeCount = series.length + types.length + apps.length;
      if (countEl) countEl.textContent = visible.length + (visible.length === 1 ? " result" : " results");
      if (emptyEl) emptyEl.style.display = visible.length === 0 ? "block" : "none";
      grid.style.display = visible.length === 0 ? "none" : "grid";
      if (clearAllBtn) {
        clearAllBtn.style.display = activeCount > 0 ? "inline-block" : "none";
        clearAllBtn.textContent = "Clear all (" + activeCount + ")";
      }
    }

    if (sortSel) sortSel.addEventListener("change", apply);
    if (clearAllBtn) clearAllBtn.addEventListener("click", function () {
      dropdowns.forEach(function (dd) {
        $$(".filter-dd-menu input", dd).forEach(function (i) { i.checked = false; });
        updateDropdownState(dd);
      });
      apply();
    });
    var emptyClear = $(".cat-empty .qbtn", section);
    if (emptyClear) emptyClear.addEventListener("click", function () {
      dropdowns.forEach(function (dd) {
        $$(".filter-dd-menu input", dd).forEach(function (i) { i.checked = false; });
        updateDropdownState(dd);
      });
      apply();
    });

    apply();
  }

  /* ========================================================
     CAROUSEL (product-pagina)
     ======================================================== */
  function initCarousel() {
    var car = $(".carousel");
    if (!car) return;
    var img = $(".carousel-stage img", car);
    var counter = $(".carousel-counter", car);
    var thumbs = $$(".carousel-thumb", car);
    var labels = thumbs.map(function (t) { return t.getAttribute("data-label") || ""; });
    var total = thumbs.length;
    var i = 0;

    function show(n) {
      i = (n + total) % total;
      thumbs.forEach(function (t, k) { t.classList.toggle("is-active", k === i); });
      if (counter) {
        counter.textContent = pad(i + 1) + " / " + pad(total) + " · " + labels[i].toUpperCase();
      }
      if (img) img.setAttribute("alt", "T24 " + labels[i]);
    }
    function pad(n) { return String(n).padStart(2, "0"); }

    thumbs.forEach(function (t, k) { t.addEventListener("click", function () { show(k); }); });
    var prev = $(".carousel-arrow.prev", car);
    var next = $(".carousel-arrow.next", car);
    if (prev) prev.addEventListener("click", function () { show(i - 1); });
    if (next) next.addEventListener("click", function () { show(i + 1); });
    show(0);
  }

  /* ========================================================
     VIDEO-MODAL (homepage)
     ======================================================== */
  function initVideoModal() {
    var modal = $(".q-modal");
    if (!modal) return;
    var play = $(".home-play");
    var close = $(".q-modal-close", modal);
    if (play) play.addEventListener("click", function () { modal.classList.add("is-open"); });
    if (close) close.addEventListener("click", function () { modal.classList.remove("is-open"); });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.classList.remove("is-open"); });
  }

  /* ========================================================
     INIT
     ======================================================== */
  function init() {
    initNavbar();
    initCompare();
    initCompareModal();
    initCategoryToggle();
    initCatalog();
    initCarousel();
    initVideoModal();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
