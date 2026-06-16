/* ============================================================
   QUINT AUDIO — Website interactions (static export)
   Eén JS-bestand: mega-menu, filters, sorteren, vergelijken,
   carousel, video-modal. Vanilla JS, geen dependencies.
   ============================================================ */
(function () {
  "use strict";

  /* Productdata — alle Quint Audio producten met hun eigenschappen.
     Wordt gebruikt door de vergelijk-modal om spec-rijen op te bouwen. */
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

  /* Handige querySelector-helpers zodat de code korter en leesbaarder blijft */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* Electronics-series — gebruikt om de vergelijk-pool te splitsen:
     speakers en elektronica mogen niet door elkaar worden vergeleken */
  var ELEC_SERIES = { "A-series": 1, "P-series": 1, "D-series": 1 };
  function isElec(name) { var p = PRODUCTS[name]; return !!(p && ELEC_SERIES[p.series]); }

  /* ========================================================
     NAVBAR — mega-menu opent bij hover op een nav-item
     Sluit na een korte vertraging zodat de muis naar het
     dropdown-panel kan bewegen zonder dat het direct verdwijnt.
     ======================================================== */
  function initNavbar() {
    var nav = $(".q-nav");
    if (!nav) return;
    var drop = $(".q-nav-drop", nav);
    var groups = $$(".q-nav-drop-group", nav);
    var timer = null;

    /* Toon de dropdown-groep die bij het gehovered nav-item hoort */
    function openMenu(name) {
      clearTimeout(timer);
      if (!name) return closeMenu();
      groups.forEach(function (g) { g.classList.toggle("is-active", g.getAttribute("data-group") === name); });
      drop && drop.classList.add("is-open");
      $$(".q-nav-item", nav).forEach(function (it) {
        it.classList.toggle("is-open", it.getAttribute("data-menu") === name);
      });
    }
    /* Verberg de dropdown en verwijder de actieve klasse van alle items */
    function closeMenu() {
      drop && drop.classList.remove("is-open");
      $$(".q-nav-item", nav).forEach(function (it) { it.classList.remove("is-open"); });
    }
    /* Wacht 120 ms voor sluiten — geeft de muis tijd om naar het panel te bewegen */
    function scheduleClose() { clearTimeout(timer); timer = setTimeout(closeMenu, 120); }

    /* Koppel hover-events aan elk nav-item: openen bij binnenkomst, sluiten bij verlaten */
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
     COMPARE — vergelijkstatus opslaan in localStorage
     zodat de selectie behouden blijft als je tussen pagina's
     navigeert (bijv. van catalogus naar productpagina).
     ======================================================== */
  var COMPARE_KEY = "quint-compare";

  /* Haal de huidige vergelijklijst op uit localStorage */
  function getCompare() {
    try { return JSON.parse(localStorage.getItem(COMPARE_KEY)) || []; }
    catch (e) { return []; }
  }
  /* Sla de vergelijklijst op en herrender alle UI-elementen */
  function setCompare(arr) {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(arr));
    renderCompare();
  }
  /* Voeg een product toe of verwijder het (maximaal 4 producten tegelijk) */
  function toggleCompare(name) {
    var arr = getCompare();
    var i = arr.indexOf(name);
    if (i > -1) arr.splice(i, 1);
    else if (arr.length < 4) arr.push(name);
    setCompare(arr);
  }
  /* Verwijder één specifiek product uit de vergelijking */
  function removeCompare(name) {
    var arr = getCompare().filter(function (x) { return x !== name; });
    setCompare(arr);
  }
  /* Leeg de hele vergelijklijst en sluit de modal */
  function clearCompare() {
    setCompare([]);
    closeCompareModal();
  }

  /* Synchroniseer alle vergelijk-UI: kaart-checkboxes, productpagina-knop en de tray onderaan */
  function renderCompare() {
    var arr = getCompare();

    /* Zet de "in-compare" klasse op de cataloguskaart als het product geselecteerd is */
    $$("[data-compare-card]").forEach(function (card) {
      var name = card.getAttribute("data-compare-card");
      card.classList.toggle("in-compare", arr.indexOf(name) > -1);
    });

    /* Update de knoptekst en stijl op de productdetailpagina */
    $$("[data-compare-toggle]").forEach(function (btn) {
      var name = btn.getAttribute("data-compare-toggle");
      var on = arr.indexOf(name) > -1;
      btn.classList.toggle("in-compare", on);
      var lbl = $(".prod-compare-label", btn);
      if (lbl) lbl.textContent = on ? "Added to compare" : "Add to compare";
      btn.classList.toggle("qbtn--navy", on);
      btn.classList.toggle("qbtn--ghost", !on);
    });

    /* Toon of verberg de vergelijk-tray onderaan het scherm */
    var tray = $(".compare-tray");
    if (!tray) return;
    tray.classList.toggle("is-visible", arr.length > 0);

    /* Update de teller (bijv. "Compare · 2/4") */
    var count = $(".compare-tray-count", tray);
    if (count) count.textContent = "Compare · " + arr.length + "/4";

    /* Bouw de chips (productnaam + verwijderknop) opnieuw op */
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

    /* Schakel de "Compare →"-knop in zodra er minstens 2 producten geselecteerd zijn */
    var openBtn = $(".compare-tray-open", tray);
    if (openBtn) {
      openBtn.disabled = arr.length < 2;
      openBtn.textContent = arr.length < 2 ? "Add another to compare" : "Compare →";
    }
  }

  /* Koppel alle klik-events voor vergelijken: kaartcheckboxes, productknop en trayknoppen */
  function initCompare() {
    /* Checkbox op elke cataloguskaart — stopPropagation zodat de kaart zelf niet ook navigeert */
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

    /* Knop op de productdetailpagina */
    $$("[data-compare-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () { toggleCompare(btn.getAttribute("data-compare-toggle")); });
    });

    /* Knoppen in de tray: alles wissen of modal openen */
    var tray = $(".compare-tray");
    if (tray) {
      var clearBtn = $(".compare-tray-clear", tray);
      var openBtn = $(".compare-tray-open", tray);
      if (clearBtn) clearBtn.addEventListener("click", clearCompare);
      if (openBtn) openBtn.addEventListener("click", openCompareModal);
    }
    renderCompare();
  }

  /* ========================================================
     VERGELIJK-MODAL — bouw de vergelijktabel dynamisch op
     op basis van de geselecteerde producten in localStorage.
     ======================================================== */
  function openCompareModal() {
    var arr = getCompare();
    if (arr.length < 2) return; /* Minimaal 2 producten nodig */
    var modal = $(".compare-modal");
    if (!modal) return;

    /* Haal productobjecten op; filter ongeldige namen eruit */
    var products = arr.map(function (n) { return { name: n, p: PRODUCTS[n] }; }).filter(function (o) { return o.p; });
    var cols = products.length;
    var MAX = 4; /* Maximaal 4 producten naast elkaar */

    /* Pas de koptekst aan op basis van het aantal producten */
    $(".compare-modal-head h2").textContent = cols + (cols === 1 ? " product" : " products") + " side by side";

    /* Stel het CSS-grid in: labelkolom + MAX productkolommen */
    var table = $(".compare-table", modal);
    table.style.gridTemplateColumns = "minmax(200px, 232px) repeat(" + MAX + ", minmax(180px, 1fr))";
    table.innerHTML = "";

    /* Hulpfunctie om een div met een klasse aan te maken */
    function cell(cls) { var d = document.createElement("div"); d.className = cls; return d; }

    /* Maak slots: gevulde producten, dan één "voeg toe"-slot, dan lege slots */
    var slots = [];
    for (var s = 0; s < MAX; s++) slots.push(products[s] || null);
    var addIndex = cols < MAX ? cols : -1;

    /* Bouw de koptijdrij: lege hoek + een kolom per slot */
    table.appendChild(cell("compare-corner"));
    slots.forEach(function (o, i) {
      if (o) {
        /* Gevuld slot: toon afbeelding, naam, type en verwijderknop */
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
          /* Sluit de modal als er nog maar 1 product over is */
          if (getCompare().length < 2) closeCompareModal();
          else openCompareModal();
        });
        head.appendChild(rm);
        table.appendChild(head);
      } else {
        /* Leeg slot: toon een "+" als het het volgende beschikbare slot is */
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

    /* Bouw de spec-rijen op — een oranje stip verschijnt als waarden verschillen */
    var rows = [["Type", "type"], ["Drivers / components", "drivers"], ["Application", "use"], ["Description", "desc"]];
    rows.forEach(function (r, ri) {
      var alt = ri % 2 === 0 ? " alt" : ""; /* Afwisselende achtergrondkleur */
      /* Tel unieke waarden om te bepalen of producten op dit punt verschillen */
      var seen = {}, uniq = 0;
      products.forEach(function (o) { var v = o.p[r[1]]; if (!(v in seen)) { seen[v] = 1; uniq++; } });
      var differs = cols > 1 && uniq > 1;

      var label = cell("compare-row-label" + alt);
      label.appendChild(document.createTextNode(r[0]));
      if (differs) {
        /* Voeg een oranje stip toe als indicator dat de waarden niet gelijk zijn */
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

    /* "Voeg meer toe aan vergelijking"-sectie: filter op dezelfde categorie (speakers of elektronica) */
    var addmore = $(".compare-addmore", modal);
    if (addmore) {
      addmore.innerHTML = "";
      var firstElec = products[0] && isElec(products[0].name);
      /* Toon alleen producten uit dezelfde categorie die nog niet geselecteerd zijn */
      var pool = Object.keys(PRODUCTS).filter(function (n) {
        return isElec(n) === !!firstElec && arr.indexOf(n) === -1 && n !== "T24";
      });
      if (pool.length) {
        var eb2 = document.createElement("span");
        eb2.className = "q-eyebrow";
        eb2.textContent = "Add more to compare";
        addmore.appendChild(eb2);
        var pills = cell("compare-addmore-pills");
        var VISIBLE = 14; /* Maximaal 14 pills tonen, de rest achter "+X more" */
        var full = cols >= MAX;
        pool.slice(0, VISIBLE).forEach(function (n) {
          var pill = document.createElement("button");
          pill.type = "button";
          pill.className = "compare-pill";
          pill.disabled = full; /* Uitgeschakeld als de vergelijking al vol is */
          var pl = document.createElement("span");
          pl.className = "compare-pill-plus";
          pl.textContent = "+";
          pill.appendChild(pl);
          pill.appendChild(document.createTextNode(" " + n + " "));
          var sr = document.createElement("span");
          sr.className = "compare-pill-series";
          sr.textContent = PRODUCTS[n].series;
          pill.appendChild(sr);
          /* Voeg toe aan vergelijking en herlaad de modal */
          pill.addEventListener("click", function () { toggleCompare(n); openCompareModal(); });
          pills.appendChild(pill);
        });
        /* Toon hoeveel producten er buiten de zichtbare pills vallen */
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

  /* Sluit de vergelijk-modal */
  function closeCompareModal() {
    var modal = $(".compare-modal");
    if (modal) modal.classList.remove("is-open");
  }

  /* Koppel sluit- en printknop aan de vergelijk-modal */
  function initCompareModal() {
    var modal = $(".compare-modal");
    if (!modal) return;
    /* Klik buiten het modal-panel sluit de modal */
    modal.addEventListener("click", function (e) { if (e.target === modal) closeCompareModal(); });
    var close = $(".compare-modal-close", modal);
    if (close) close.addEventListener("click", closeCompareModal);
    /* Printknop roept de native browser-printdialoog aan */
    var printBtn = $(".compare-print", modal);
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });
    var clearAll = $(".compare-clear-all", modal);
    if (clearAll) clearAll.addEventListener("click", clearCompare);
  }

  /* ========================================================
     CATEGORIETOGGLE — schakel tussen Loudspeakers en Electronics
     op de cataloguspagina zonder een paginalading.
     ======================================================== */
  function initCategoryToggle() {
    var sections = $$(".cat[data-category]");
    if (sections.length < 2) return; /* Alleen relevant als er twee categorieën zijn */

    function show(cat) {
      /* Verberg alle secties behalve de geselecteerde categorie */
      sections.forEach(function (s) { s.hidden = s.getAttribute("data-category") !== cat; });
      /* Update de actieve stijl op de toggle-knoppen */
      $$("[data-show-category]").forEach(function (b) {
        var on = b.getAttribute("data-show-category") === cat;
        b.classList.toggle("qbtn--navy", on);
        b.classList.toggle("qbtn--ghost", !on);
      });
      window.scrollTo(0, 0);
    }
    /* Koppel klik-events aan de categorietoggle-knoppen */
    $$("[data-show-category]").forEach(function (btn) {
      btn.addEventListener("click", function () { show(btn.getAttribute("data-show-category")); });
    });
    /* Ondersteuning voor deeplink: quint.com/producten#electronics */
    if (location.hash === "#electronics") show("electronics");
  }

  /* ========================================================
     CATALOGUSFILTER — filter, sorteren en resultaattelling
     Werkt per sectie zodat Loudspeakers en Electronics
     elk hun eigen filterstate hebben.
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

    /* Toggle de dropdown open/dicht; sluit andere open dropdowns */
    dropdowns.forEach(function (dd) {
      var btn = $(".filter-dd-btn", dd);
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var wasOpen = dd.classList.contains("is-open");
        dropdowns.forEach(function (d) { d.classList.remove("is-open"); });
        dd.classList.toggle("is-open", !wasOpen);
      });
      /* Herfilter bij elke checkbox-wijziging */
      $$(".filter-dd-menu input", dd).forEach(function (inp) {
        inp.addEventListener("change", function () { updateDropdownState(dd); apply(); });
      });
      /* "Clear"-knop binnen het dropdown-menu */
      var clr = $(".filter-dd-clear", dd);
      if (clr) clr.addEventListener("click", function () {
        $$(".filter-dd-menu input", dd).forEach(function (i) { i.checked = false; });
        updateDropdownState(dd); apply();
      });
    });
    /* Klik buiten een dropdown sluit hem */
    document.addEventListener("click", function () { dropdowns.forEach(function (d) { d.classList.remove("is-open"); }); });

    /* Update de badge (aantal geselecteerde opties) op de dropdownknop */
    function updateDropdownState(dd) {
      var n = $$(".filter-dd-menu input:checked", dd).length;
      dd.classList.toggle("has-count", n > 0);
      var badge = $(".filter-dd-count", dd);
      if (badge) badge.textContent = n;
    }

    /* Geef de geselecteerde waarden terug voor een bepaalde filtergroep */
    function selectedFor(group) {
      var dd = dropdowns.filter(function (d) { return d.getAttribute("data-group") === group; })[0];
      if (!dd) return [];
      return $$(".filter-dd-menu input:checked", dd).map(function (i) { return i.value; });
    }

    /* Pas filters en sortering toe en update de zichtbare kaarten */
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
        /* Verberg kaart als die niet voldoet aan de actieve filters */
        if (series.length && series.indexOf(s) === -1) ok = false;
        if (types.length && types.indexOf(t) === -1) ok = false;
        if (apps.length && !apps.some(function (a) { return u.indexOf(a) > -1; })) ok = false;
        card.style.display = ok ? "" : "none";
        if (ok) visible.push(card);
      });

      /* Sorteer de zichtbare kaarten op basis van de geselecteerde sorteeroptie */
      var mode = sortSel ? sortSel.value : "Series";
      visible.sort(function (a, b) {
        if (mode === "Type") {
          return (a.getAttribute("data-type") || "").localeCompare(b.getAttribute("data-type") || "") ||
                 (a.getAttribute("data-name") || "").localeCompare(b.getAttribute("data-name") || "");
        }
        if (mode === "Name A–Z") {
          return (a.getAttribute("data-name") || "").localeCompare(b.getAttribute("data-name") || "");
        }
        /* Standaard: volgorde op basis van data-order attribuut (= redactionele volgorde) */
        return (parseInt(a.getAttribute("data-order"), 10) || 0) - (parseInt(b.getAttribute("data-order"), 10) || 0);
      });
      /* Herplaats kaarten in de gesorteerde volgorde in de DOM */
      visible.forEach(function (c) { grid.appendChild(c); });

      /* Update de resultaattelling en toon de lege staat als er niets te zien is */
      var activeCount = series.length + types.length + apps.length;
      if (countEl) countEl.textContent = visible.length + (visible.length === 1 ? " result" : " results");
      if (emptyEl) emptyEl.style.display = visible.length === 0 ? "block" : "none";
      grid.style.display = visible.length === 0 ? "none" : "grid";
      if (clearAllBtn) {
        clearAllBtn.style.display = activeCount > 0 ? "inline-block" : "none";
        clearAllBtn.textContent = "Clear all (" + activeCount + ")";
      }
    }

    /* Herfilter direct als de sorteeroptie verandert */
    if (sortSel) sortSel.addEventListener("change", apply);
    /* "Clear all"-knop: wis alle filters in alle dropdowns */
    if (clearAllBtn) clearAllBtn.addEventListener("click", function () {
      dropdowns.forEach(function (dd) {
        $$(".filter-dd-menu input", dd).forEach(function (i) { i.checked = false; });
        updateDropdownState(dd);
      });
      apply();
    });
    /* "Clear filters"-knop in de lege staat */
    var emptyClear = $(".cat-empty .qbtn", section);
    if (emptyClear) emptyClear.addEventListener("click", function () {
      dropdowns.forEach(function (dd) {
        $$(".filter-dd-menu input", dd).forEach(function (i) { i.checked = false; });
        updateDropdownState(dd);
      });
      apply();
    });

    apply(); /* Initiële render bij paginalading */
  }

  /* ========================================================
     CAROUSEL — productafbeeldingen op de productdetailpagina
     Ondersteunt pijlknoppen, thumbnailklikken en een teller.
     ======================================================== */
  function initCarousel() {
    var car = $(".carousel");
    if (!car) return;
    var img = $(".carousel-stage img", car);
    var counter = $(".carousel-counter", car);
    var thumbs = $$(".carousel-thumb", car);
    var labels = thumbs.map(function (t) { return t.getAttribute("data-label") || ""; });
    var total = thumbs.length;
    var i = 0; /* Huidige afbeeldingsindex */

    /* Ga naar afbeelding n (wraps rond aan begin en einde) */
    function show(n) {
      i = (n + total) % total;
      thumbs.forEach(function (t, k) { t.classList.toggle("is-active", k === i); });
      if (counter) {
        counter.textContent = pad(i + 1) + " / " + pad(total) + " · " + labels[i].toUpperCase();
      }
      if (img) img.setAttribute("alt", "T24 " + labels[i]);
    }
    /* Voeg een voorloopnul toe (01, 02, ...) */
    function pad(n) { return String(n).padStart(2, "0"); }

    thumbs.forEach(function (t, k) { t.addEventListener("click", function () { show(k); }); });
    var prev = $(".carousel-arrow.prev", car);
    var next = $(".carousel-arrow.next", car);
    if (prev) prev.addEventListener("click", function () { show(i - 1); });
    if (next) next.addEventListener("click", function () { show(i + 1); });
    show(0); /* Start op de eerste afbeelding */
  }

  /* ========================================================
     VIDEO-MODAL — speelknop op de homepage opent een
     overlay waarin een video-embed wordt getoond.
     ======================================================== */
  function initVideoModal() {
    var modal = $(".q-modal");
    if (!modal) return;
    var play = $(".home-play");
    var close = $(".q-modal-close", modal);
    if (play) play.addEventListener("click", function () { modal.classList.add("is-open"); });
    if (close) close.addEventListener("click", function () { modal.classList.remove("is-open"); });
    /* Klik buiten het video-venster sluit de modal */
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.classList.remove("is-open"); });
  }

  /* ========================================================
     INIT — initialiseer alle modules zodra de DOM klaar is
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