# Apologetica — Project Guide

Orthodox apologetics static site built with Astro 5, Tailwind CSS 4, and Marked.

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
- Wiki-links: [[slug-tema|Text afișat]] sau [[slug-tema]]

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

Syntax Obsidian-style, resolved before Markdown rendering in conversations:

- `[[slug|display text]]` → `[display text](/teme/slug)`
- `[[slug]]` → `[slug](/teme/slug)`

The slug must match a filename (without `.md`) in `src/content/teme/`.

Implementation: `src/lib/wiki-links.ts` — applied to "Răspunsul ortodox" and "Argumente suplimentare" sections.

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

- **Astro 5** (static output)
- **Tailwind CSS 4** + Typography plugin
- **Marked** for markdown → HTML (not Astro's `<Content />`)
- **Newsreader** serif font, Material Symbols Outlined icons
- Primary color: `#1754cf`
