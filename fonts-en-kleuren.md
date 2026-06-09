# Quint Audio — Fonts & kleuren

Referentie voor de WordPress / Elementor migratie. Alle waarden komen 1‑op‑1
overeen met `quint.css` (de CSS‑variabelen onder `:root`).

---

## Fonts

| Rol | Font-family | Gewichten | Bestanden |
|---|---|---|---|
| **Display & body** (alles) | `Arial Rounded MT` | 300 / 400 / 500 / 600 / 700 / 800 | `fonts/Arial_Rounded_MT_Light.ttf`, `Arial_Rounded_MT.ttf`, `Arial_Rounded_Bold.ttf`, `Arial_Rounded_MT_ExtraBold.ttf` |
| **Mono** (spec-waarden, labels, captions) | `JetBrains Mono` → systeem-mono fallback | 400 | systeemfont (`ui-monospace, SF Mono, Menlo, Consolas`) |

**Fallback-stack** (display & body): `"Arial Rounded MT", "Helvetica Neue", Helvetica, Arial, sans-serif`

> Let op: `Arial Rounded MT` is een self-hosted merk-font (de 4 `.ttf`-bestanden
> in `/fonts`). In WordPress: upload deze via een plugin als *Custom Fonts* of via
> Elementor → *Site Settings → Custom Fonts*, met dezelfde 6 gewicht-koppelingen.
> Er is géén Google Fonts-equivalent.

### Type-schaal (px)
| Token | Grootte | Gebruik |
|---|---|---|
| Display | 96 | Catalogus-hero ("Loudspeakers.") |
| H1 | 80 / 144* | Hero-titel / productnaam (*T24 = 144) |
| H2 | 56 | Sectietitels |
| H3 | 32 | Sub-secties |
| H4 | 24 | Card-titels |
| Lead | 20 | Inleidende paragraaf |
| Body | 16 | Lopende tekst |
| Klein | 14 / 13 | Dichte UI / meta |
| Mono | 13 | Spec-waarden |
| Eyebrow | 12 | Uppercase labels (oranje) |

---

## Kleuren (hexcodes)

### Merk
| Naam | Hex | Gebruik |
|---|---|---|
| Quint Navy | `#0E1030` | Primaire inkt, navbar, footer, knoppen |
| Quint Orange | `#FF5D05` | Accent — hairline, tags, actief, eyebrows |
| White | `#FFFFFF` | Pagina / cards |

### Navy-schaal
| Naam | Hex |
|---|---|
| navy-900 | `#0A0C24` |
| navy-800 (= merk) | `#0E1030` |
| navy-700 (panel) | `#1A1D3A` |
| navy-600 | `#2A2E4D` |

### Oranje-schaal
| Naam | Hex |
|---|---|
| orange-700 (pressed) | `#D94D00` |
| orange-600 (= merk) | `#FF5D05` |
| orange-300 (focus ring) | `#FFB088` |
| orange-050 (wash) | `#FFF0E8` |

### Inkt / tekst
| Naam | Hex | Gebruik |
|---|---|---|
| ink | `#0E1030` | Koppen, primaire tekst |
| ink-2 | `#4A4D62` | Lopende / secundaire tekst |
| ink-3 | `#8B8E9D` | Meta, captions, gedempt |

### Oppervlakken & lijnen
| Naam | Hex | Gebruik |
|---|---|---|
| bg | `#FFFFFF` | Pagina / cards |
| bg-alt | `#F5F5F3` | Sectie-wash (warm off-white) |
| bg-alt-2 | `#ECECEA` | Mega-menu band, diepere wash |
| placeholder | `#D9D9D6` | Afbeelding-placeholder vulling |
| line | `#ECECEA` | Hairline divider |
| line-2 | `#D8D8D3` | Sterkere rand |
| line-3 | `#D2D2D2` | Control-rand (inputs, knoppen) |

---

## Bestandsoverzicht (export)

```
export/
├── index.html          ← Homepage
├── producten.html      ← Productoverzicht (Loudspeakers + Electronics toggle)
├── product-t24.html    ← Productpagina (T24)
├── quint.css           ← Alle CSS (tokens + componenten + @font-face)
├── quint.js            ← Alle JavaScript (menu, filters, vergelijken, carousel)
├── fonts-en-kleuren.md ← Dit bestand
├── assets/             ← Logo (wit wordmark) + T24-render
└── fonts/              ← 4× Arial Rounded MT .ttf
```

## Interactie in `quint.js`
- **Mega-menu** in de navbar (hover op Products / Resources)
- **Filters** (Series / Type / Application) + **sorteren** + resultaat-telling op het productoverzicht
- **Categorie-toggle** Loudspeakers ↔ Electronics op één pagina
- **Vergelijken**: vink kaarten aan → sticky balk onderaan → vergelijk-modal (max. 4). Status bewaard in `localStorage`, werkt over pagina's heen
- **Carousel** met thumbnails op de productpagina
- **Video-modal** op de homepage

> Bij migratie naar Elementor kun je deze interacties vervangen door Elementor-
> widgets (bv. *Posts/Loop Grid* met filter voor het overzicht, *Image Carousel*
> voor de productgalerij). De HTML/CSS hierboven dient als pixel-referentie.
