# Add Conversation

Create a new apologetic conversation with a specific denomination.

## Trigger

Use this skill when the user asks to add, create, or write a conversation or discussion with a denomination (atheist, baptist, Jehovah's Witness).

## Workflow

### 1. Determine denomination and slug

- Map denomination to slug:
  - Ateu / Atheist → `atheist`
  - Baptist → `baptist`
  - Martor al lui Iehova / Jehovah's Witness → `martorii-lui-iehova`
- Derive a topic slug from the conversation subject (e.g., "existence of God" → `exista-dumnezeu`)
- Find the next `order` number by scanning `src/content/conversations/ro/{denomination}/*.md` frontmatter

### 2. Create the file

Write to `src/content/conversations/ro/{denomination}/{slug}.md` with this **exact** structure:

```markdown
---
title: "Titlul conversației"
denomination: "{denomination}"
order: {next_order}
---

## Ce spun ei

„Citatul exact al interlocutorului, între ghilimele românești. Aceasta este afirmația principală pe care o face interlocutorul."

## Răspunsul ortodox

Textul principal al răspunsului. Structurat cu subtitluri:

### Subtitlu 1

Argumentul dezvoltat, cu referințe la Sfinții Părinți.

### Subtitlu 2

Alt argument, cu citate din Scriptură și Tradiție.

### Ce spune Ortodoxia

Paragraful final care sintetizează poziția ortodoxă, cu referințe la Sfinții Părinți (Vasile cel Mare, Ioan Gură de Aur, Grigorie Teologul, etc.).

## Versete cheie

- **Carte Capitol:Verset** — „Textul versetului în ghilimele românești."
- **Carte Capitol:Verset** — „Alt verset relevant."

## Argumente suplimentare

- **Titlu argument** — explicație detaliată.
- **Alt argument** — cu surse și contra-argumente.
```

### 3. Critical formatting rules

These are **non-negotiable** — any deviation breaks the renderer:

- **Section headings** must be exactly: `## Ce spun ei`, `## Răspunsul ortodox`, `## Versete cheie`, `## Argumente suplimentare` — any typo means the section won't render
- **Claim quote**: The first `„..."` string in "Ce spun ei" becomes the displayed claim
- **Scripture format**: `- **Reference** — „Text."` (bold reference, em-dash `—`, Romanian quotes)
- **Frontmatter**: `title` (string), `denomination` (must match slug exactly), `order` (number)
- All text in **Romanian**
- Use Romanian quotes: `„..."` (not `"..."`)
- Wiki-links where relevant: `[[teme/slug|Text]]`, `[[personalitati/slug|Text]]`, `[[locuri/slug|Text]]`

### 4. Content guidelines

- **Eastern Orthodox perspective** exclusively
- Cite Church Fathers: Sf. Vasile cel Mare, Sf. Ioan Gură de Aur, Sf. Grigorie Teologul, Sf. Atanasie cel Mare, etc.
- Prefer Septuagint and Orthodox biblical canon (including deuterocanonical books)
- Include both theological arguments and logical/philosophical reasoning
- Address the specific claim directly — don't strawman
- Tone: respectful but firm, scholarly but accessible

### 5. Validate

Run the Astro build to verify the page generates correctly:

```bash
npx astro build
```

Check the build output for errors related to the new file.

### 6. Summary

After creation, report:
- File path created
- Denomination and order number
- Build result (success/failure)
