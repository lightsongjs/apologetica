# Add Personality

Create a new personality page for a saint, Church Father, biblical figure, or historical person.

## Trigger

Use this skill when the user asks to add, create, or write a personality page.

## Workflow

### 1. Determine slug and metadata

- Derive a URL slug from the name (e.g., "Sf. Sava cel Sfințit" → `sava-cel-sfintit`, "Sfântul Antonie cel Mare" → `antonie-cel-mare`)
- Drop honorifics like "Sf.", "Sfântul", "Sfânta" from the slug
- Find the next `order` number by scanning all `src/content/personalitati/*.md` frontmatter
- Determine the `tip` field: `apostol`, `evanghelist`, `profet`, `parinte`, `mucenic`, `rege`, `cuvios`, `patriarh`, `biblic`, `roman`, or other as appropriate

### 2. Create the file

Write to `src/content/personalitati/{slug}.md` with this exact structure:

```markdown
---
name: "Sfântul Nume Complet"
title: "Titlu scurt, date viață"
image: "/images/personalitati/{slug}.jpg"
order: {next_order}
tip: "{tip}"
---

## Bio

Paragraphs describing the person's life, significance, and legacy.
Use Romanian text, Eastern Orthodox perspective.
Bold important terms with **bold**.
Reference feast day: „Prăznuit la **ziua luna**."

## Timeline

### Event Name (year or date)
Description of event.

### Another Event (year)
Description.

## Surse și scrieri

### Work Title — by Author
Description of the source or writing.

## Contemporani și rude spirituale

- [[personalitati/slug|Display Name]] — relationship description

## Versete cheie

- **Book Chapter:Verse** — „Scripture text in Romanian quotes."
- **Book Chapter:Verse** — „Another verse."

## Semnificație teologică și istorică

Paragraphs on theological and historical significance.
```

### 3. Formatting rules

- All text in **Romanian**
- Use Romanian quotes: `„..."` (not `"..."`)
- Wiki-links for all personalities: `[[personalitati/slug|Display Name]]`
- Wiki-links for themes: `[[teme/slug|Display Text]]`
- Wiki-links for places: `[[locuri/slug|Display Text]]`
- Scripture format: `- **Reference** — „Text."`
- Timeline entries: `### Event Name (year)`
- Image: always use placeholder path `/images/personalitati/{slug}.jpg` — do NOT create actual image files
- Eastern Orthodox perspective exclusively — Church Fathers, Philokalia, Septuagint, Orthodox biblical canon

### 4. Add reciprocal links

- Search existing `src/content/personalitati/*.md` files for related personalities
- If this personality is mentioned in another's Contemporani section, add a reciprocal link
- If another personality should link to this one (teacher/student, contemporary, family), add links in both directions
- Links in Contemporani must be reciprocal: if A links to B, B must link back to A
- Links in Surse must also be reciprocal when applicable

### 5. Validate

Run the cross-reference validation test:

```bash
npx playwright test tests/personality-cross-references.spec.ts
```

All tests must pass (except the image existence test, which will fail for the placeholder). Fix any failures before considering the task complete.

### 6. Summary

After creation, report:
- File path created
- Order number assigned
- Reciprocal links added (list which files were modified)
- Test results
