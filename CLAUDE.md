# Apologetica — Project Guide

Orthodox apologetics static site built with Astro 5, Tailwind CSS 4, and Marked.

## Theological Standpoint

All content on this site is written exclusively from an **Eastern Orthodox** perspective. This applies to conversations, themes, personality pages, scripture interpretations, and any other content. Never use Protestant, Catholic, or secular theological frameworks when generating or editing content. Sources should prioritize the Church Fathers, the Philokalia, Orthodox liturgical tradition, and the Septuagint/Orthodox biblical canon (including deuterocanonical books). When referencing scripture, prefer the Orthodox Study Bible or Synodal translations where relevant.

## Git Workflow

**Never push to remote** unless the user explicitly tells you to. You may commit changes locally (after making changes or after receiving approval), but do not run `git push` under any circumstances until instructed.

---

## Validation Rules

After creating or editing any personality file in `src/content/personalitati/`, always run the cross-reference validation test:

```bash
npx playwright test tests/personality-cross-references.spec.ts
```

This test checks that:
- Every `[[personalitati/slug]]` wiki-link points to an existing `.md` file
- Every link in Contemporani is reciprocal (if A links to B, B must link back to A)
- Every link in Surse is reciprocal
- Any personality name mentioned in plain text that has a matching `.md` file is flagged (must use a wiki-link instead)
- Required sections (`## Bio`, `## Timeline`) and frontmatter fields (`name`, `title`, `image`, `order`) are present
- Image files referenced in frontmatter exist on disk

All 7 tests must pass before committing personality changes.

### Image rule

When creating new personality files, **skip image creation**. Use a placeholder path (`/images/personalitati/{slug}.jpg`) in frontmatter but do not generate or add actual image files.

---

## Content Architecture

Two collections defined in `src/content.config.ts`:

- **conversations** — `src/content/conversations/ro/[denomination]/*.md`
- **teme** — `src/content/teme/*.md`

### Denominations (slugs → labels)

| Slug | Label | Folder |
|------|-------|--------|
| `atheist` | Ateu | `ro/atheist/` |
| `baptist` | Baptist | `ro/baptist/` |
| `martorii-lui-iehova` | Martor al lui Iehova | `ro/martorii-lui-iehova/` |

When adding a new denomination, also update the `denominationLabels` map in `src/pages/conversatii/[denomination]/[topic].astro`.

---

## Conversation File Template

Path: `src/content/conversations/ro/{denomination}/{slug}.md`

Section headings must be **exactly** as shown — the page extracts them by regex.

```markdown
---
title: "Titlul conversației"
denomination: "atheist"
order: 1
---

## Ce spun ei

„Citatul exact al interlocutorului, între ghilimele românești."

## Răspunsul ortodox

Textul principal al răspunsului. Poate conține:
- Subtitluri `### Subtitlu`
- **Bold**, *italic*, liste
- Wiki-links: `[[teme/slug|Text afișat]]`, `[[personalitati/slug]]`, `[[locuri/slug]]`

## Versete cheie

- **Carte Capitol:Verset** — „Textul versetului aici."
- **Romani 1:20** — „Cele nevăzute ale Lui se văd de la facerea lumii."

## Argumente suplimentare

- **Titlu argument** — explicație.
- Citate, contra-argumente, surse suplimentare.
```

### Critical formatting rules

1. **Frontmatter**: `title` (string), `denomination` (string matching a slug above), `order` (number for sort within denomination)
2. **Claim quote**: Wrap in Romanian quotes `„..."` — the first quoted string in "Ce spun ei" becomes the displayed claim
3. **Scripture refs**: Must follow `- **Reference** — text` format (bold ref, em-dash `—`, then text). Quote marks around the text are stripped automatically
4. **Section headings**: Use exactly `## Ce spun ei`, `## Răspunsul ortodox`, `## Versete cheie`, `## Argumente suplimentare` — any typo = section won't render

---

## Theme (Temă) File Template

Path: `src/content/teme/{slug}.md`

```markdown
---
title: "Titlul temei"
summary: "O descriere scurtă (1-2 propoziții) afișată sub titlu pe pagina temei."
---

Conținut liber în Markdown. Subtitluri, liste, tabele, blockquotes — toate funcționează.
Wiki-links către alte teme sunt și ele acceptate în corpul fișierelor temă.
```

### Frontmatter: `title` (string), `summary` (string)

---

## Wiki-links

Obsidian-compatible folder-based syntax, resolved at build-time before Markdown rendering:

**Teme (theological themes):**
- `[[teme/slug|display text]]` → `[display text](/teme/slug)`
- `[[teme/slug]]` → `[slug](/teme/slug)`

**Personalități (personalities):**
- `[[personalitati/slug|display text]]` → `[display text](/personalitati/slug)`
- `[[personalitati/slug]]` → `[slug](/personalitati/slug)`

**Locuri (biblical places):**
- `[[locuri/slug|display text]]` → `[display text](/locuri/slug)`
- `[[locuri/slug]]` → `[slug](/locuri/slug)`

The slug must match a filename (without `.md`) in the respective collection folder (`src/content/teme/`, `src/content/personalitati/`, `src/content/locuri/`).

**Editor compatibility**: Using folder-based paths (`collection/slug`) instead of colon separators enables direct file navigation in Obsidian and LazyVim (via `gf` or Telescope). The `/` syntax is compatible with Windows filesystems and standard markdown editors.

Implementation: `src/lib/wiki-links.ts` — applied to conversation responses, personality pages, theme pages, and place pages.

---

## Routing

| URL | Source |
|-----|--------|
| `/` | `src/pages/index.astro` |
| `/conversatii` | `src/pages/conversatii/index.astro` |
| `/conversatii/{denomination}` | `src/pages/conversatii/[denomination].astro` |
| `/conversatii/{denomination}/{topic}` | `src/pages/conversatii/[denomination]/[topic].astro` |
| `/teme/{slug}` | `src/pages/teme/[tema].astro` |

## Tech Stack

- **Astro 5** (static output, PWA-enabled)
- **Tailwind CSS 4** + Typography plugin
- **Marked** for markdown → HTML (not Astro's `<Content />`)
- **Literata** serif font (primary, everywhere), Material Symbols Outlined icons
- Primary color: `#1A237E` (oxford-navy)

---

## PWA (Progressive Web App)

The site is a fully offline-capable PWA. Users can install it to their home screen.

### Key files

| File | Purpose |
|------|---------|
| `public/manifest.webmanifest` | App name, icons, theme color, display mode |
| `public/sw.js` | Service worker — caching strategies |
| `public/pwa-192x192.png` | App icon (192×192) |
| `public/pwa-512x512.png` | App icon (512×512) |
| `scripts/generate-sw-precache.js` | Post-build script — generates `dist/sw-precache.json` URL list |

### How caching works

1. **Install**: precaches core shell (homepage, icons, search data)
2. **Activate**: background-downloads all pages + CSS/JS assets (batches of 10)
3. **Fetch**: stale-while-revalidate — serves from cache instantly, updates in background

### Cache versioning

The cache name in `public/sw.js` controls cache invalidation:

```js
const CACHE_NAME = 'apologetica-v1';
```

**Bump the version** (e.g., `v1` → `v2`) after major deploys (redesigns, structural changes). This wipes the old cache and re-downloads everything. For normal content updates (new pages, edited text), no version bump is needed — stale-while-revalidate handles it automatically.

### Build

`npm run build` runs `astro build` then `generate-sw-precache.js` to produce the URL manifest.

---

## Design System — Scholarly Editorial

Design mockups are in `stitch_extracted/stitch/` with `screen.png` + `code.html` per page. Design rules in `stitch_extracted/stitch/oxford_scholarly/DESIGN.md`.

### Core Decisions (apply to all pages)

| Decision | Rule |
|----------|------|
| **Primary color** | `#1A237E` (oxford-navy), not `#1754cf` |
| **Font** | Literata serif everywhere (body + headlines) |
| **Body text color** | `#29343a` (on-surface), never pure black |
| **Header title** | Always "Apologetica" — section is indicated by bottom nav active state |
| **Header left** | Back button (arrow_back) on inner pages, menu_book icon on home |
| **Header right** | Search icon + Settings icon (gear dropdown with theme toggle) |
| **Bottom nav** | 5 tabs: Biblia, Discuții, Teme, Persoane, Locuri — no CAUTĂ tab |
| **Bottom nav style** | Frosted glass (`bg-white/95 backdrop-blur-md`), thin top border, no pill container |
| **Bottom nav active** | Primary color + filled icon (`FILL 1`), inactive = `slate-400` |
| **No borders** | Prefer tonal shifts (background color changes) over 1px borders for sectioning |
| **Shadows** | Ambient shadows only (6% opacity, 24px blur), no harsh drop shadows |
| **Image placeholders** | Missing images show `person` / `location_on` icon on slate-100 background |

### List Page Pattern (Persoane, Locuri, Teme, Discuții)

| Element | Rule |
|---------|------|
| **Search bar** | On page (not pinned), header search icon scrolls to it + auto-focus |
| **Card images** | `rounded-2xl` (rounded square), `grayscale` filter, 80×80px area |
| **Card name** | `text-sm font-bold text-primary`, truncate |
| **Card description** | `text-[11px] text-on-surface-variant`, `line-clamp-2` |
| **Load more** | "Încarcă mai multe..." italic link, first 20 items shown |
| **Card spacing** | `gap-3` between cards |

### Exceptions

- **Biblia page** has its own layout (3-column grid, search toggles, VT/NT tabs) — treat separately
- Each page gets redesigned individually — do not batch-apply changes without reviewing mockup
