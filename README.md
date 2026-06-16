# Quint Audio — Statische website export

Statische prototype-export van de Quint Audio website. Bevat drie pagina's, één CSS-bestand en één JS-bestand. Geen build-stap, geen dependencies — direct te openen in een browser.

---

## Bestandsstructuur

```
QuintAudio/
├── index.html           ← Homepage
├── producten.html       ← Productoverzicht (Loudspeakers + Electronics)
├── product-t24.html     ← Productdetailpagina (T24)
├── quint.css            ← Alle stijlen (design tokens, componenten, responsive)
├── quint.js             ← Alle interacties (menu, filters, vergelijken, carousel)
├── fonts-en-kleuren.md  ← Kleur- en typografiereference voor Elementor-migratie
├── assets/              ← Logo en productafbeeldingen
└── fonts/               ← Self-hosted Arial Rounded MT (.ttf)
```

## Lokaal bekijken

Open `index.html` direct in een browser, of start een lokale server om font-loading correct te laten werken:

```bash
npx serve .
# of
python3 -m http.server
```

## Functionaliteit

| Module | Beschrijving |
|---|---|
| Mega-menu | Hover op *Products* of *Resources* opent een dropdown |
| Categorietoggle | Wisselt tussen Loudspeakers en Electronics zonder paginalading |
| Filters + sorteren | Series, Type, Toepassing — werken per categorie onafhankelijk |
| Vergelijken | Selecteer tot 4 producten via de kaarten; status blijft behouden in `localStorage` |
| Carousel | Thumbnails en pijlknoppen op de productpagina |
| Video-modal | Speelknop op de homepage opent een overlay |

## Migratie naar WordPress / Elementor

Zie `fonts-en-kleuren.md` voor alle kleurwaarden, typografie-tokens en instructies voor het inladen van de huidige custom fonts in Elementor.
