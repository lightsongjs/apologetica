# Review Content

Review content files for quality, formatting, and correctness.

## Trigger

Use this skill when the user asks to review, check, verify, or audit content quality, language, or formatting.

## Workflow

### 1. Determine scope

- **Single file**: review the specified file
- **Folder**: review all `.md` files in the specified folder
- **Entire content**: review all files in `src/content/`

### 2. Romanian language quality

- Flag any non-Romanian terms that have standard Romanian equivalents
- Check for natural, fluent Romanian — flag overly academic or stilted sentences
- Suggest clearer alternatives for a general Orthodox audience
- Verify theological terms use established Romanian Orthodox terminology

### 3. Diacritics check

- Flag old-style diacritics: `ş` (must be `ș`), `ţ` (must be `ț`)
- Flag missing diacritics on common words: `în`, `și`, `că`, `să`, `ă`, `â`, `î`

### 4. Quote marks

- All quotes must use Romanian style: `„..."` (opening „ and closing ")
- Flag ASCII quotes `"..."` or other non-Romanian quote styles
- Exception: quotes inside code blocks or frontmatter values are fine

### 5. Wiki-links validation

- Scan for `[[personalitati/slug]]` and `[[personalitati/slug|text]]` — verify each slug has a matching `.md` file in `src/content/personalitati/`
- Scan for `[[teme/slug]]` and `[[teme/slug|text]]` — verify each slug has a matching `.md` file in `src/content/teme/`
- Scan for `[[locuri/slug]]` and `[[locuri/slug|text]]` — verify each slug has a matching `.md` file in `src/content/locuri/`
- Flag any broken links

### 6. Reciprocal links (personality files only)

Run the cross-reference test:

```bash
npx playwright test tests/personality-cross-references.spec.ts
```

Report any failures.

### 7. Section headings

**For conversation files** (`src/content/conversations/`):
- Must have exactly: `## Ce spun ei`, `## Răspunsul ortodox`, `## Versete cheie`, `## Argumente suplimentare`
- Flag any misspelled or missing section headings

**For personality files** (`src/content/personalitati/`):
- Must have: `## Bio`, `## Timeline`
- Should have: `## Surse și scrieri`, `## Contemporani și rude spirituale`, `## Versete cheie`, `## Semnificație teologică și istorică`

### 8. Frontmatter validation

**Conversations**: required fields `title` (string), `denomination` (string matching `atheist`, `baptist`, or `martorii-lui-iehova`), `order` (number)

**Personalities**: required fields `name` (string), `title` (string), `image` (string), `order` (number)

**Themes**: required fields `title` (string), `summary` (string)

### 9. Scripture format

- Must follow: `- **Book Chapter:Verse** — „Text."`
- Bold reference, em-dash `—` (not hyphen `-`), Romanian quotes around text
- Flag any deviations

### 10. Report

Present findings organized by category:
1. **Errors** (must fix) — broken links, wrong section headings, missing frontmatter, wrong quote marks
2. **Warnings** (should fix) — old diacritics, non-Romanian terms, format deviations
3. **Suggestions** (optional) — readability improvements, missing reciprocal links, additional scripture references
