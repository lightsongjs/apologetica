# NEXT STEPS: Content Organization & Validation System

## Context

Apologetica site - Orthodox apologetics content in Romanian. Currently:
- **4 collections**: `teme/`, `personalitati/`, `locuri/`, `conversatii/`
- **~100+ existing files**, growing to 1000s
- **Wiki-links** for cross-references: `[[teme/slug]]`, `[[personalitati/slug]]`
- **Risk**: At scale → duplicate content, broken links, inconsistent taxonomy

## Problem Statement

**Without automated validation:**
1. ❌ **Duplicate content** - multiple pages about same topic (e.g., "Iisus Hristos" in both `teme/` and `personalitati/`)
2. ❌ **Broken links** - `[[teme/monofizitism]]` when file is `monofizitismul.md`
3. ❌ **Missing connections** - page about Calcedon doesn't link to heresies it condemned
4. ❌ **No taxonomy** - can't query "all christological heresies condemned at Calcedon"
5. ❌ **Manual index** - CONTENT-INDEX.csv becomes out-of-sync

**At 1000+ pages, this becomes unmaintainable chaos.**

## Solution: Metadata + Automated Validation

### Architecture

```
┌─────────────────┐
│  Content Files  │  ← Single source of truth
│  (frontmatter)  │     Enhanced metadata
└────────┬────────┘
         │
    ┌────▼─────────────────┐
    │  Validation Script   │  ← Pre-commit hook
    │  - Parse frontmatter │
    │  - Validate refs     │
    │  - Generate indexes  │
    └────┬─────────────────┘
         │
    ┌────▼─────────────┐
    │  Auto-generated  │
    │  - INDEX.csv     │  ← For humans
    │  - GRAPH.json    │  ← For queries
    │  - TAXONOMY.json │
    └──────────────────┘
```

## Implementation Steps

### Phase 1: Define Metadata Schema

Create `content-schema.ts` with:

```typescript
// Enums (closed sets)
type ContentType =
  | "erezie"           // Heresies
  | "sinod"            // Councils
  | "doctrina"         // Doctrines
  | "personalitate"    // Historical figures
  | "loc"              // Biblical places
  | "conversatie"      // Apologetic dialogues
  | "tema-generala";   // General themes

type Category =
  | "hristologie"      // Christology
  | "pneumatologie"    // Pneumatology
  | "triadologie"      // Trinity
  | "soteriologie"     // Salvation
  | "eclesiologie"     // Church
  | "escatologie"      // End times
  | "apologetica";     // Apologetics

// Frontmatter interface
interface ContentMetadata {
  // Basic (existing)
  title: string;
  summary: string;

  // Taxonomy (NEW - add to ALL files)
  type: ContentType;
  category: Category;
  tags: string[];        // Free-form, but common ones

  // Relations (NEW - slug references, validated)
  related?: string[];           // General related content
  condemned_at?: string;        // For heresies → synod slug
  defended_by?: string[];       // Personalities
  opposed_to?: string[];        // Opposing heresies/doctrines
  see_also?: string[];          // Explicit cross-refs

  // Status (NEW - for content management)
  completeness: "draft" | "complete" | "needs-review" | "stub";
  last_updated?: string;        // YYYY-MM-DD
}
```

**Example application:**

```markdown
---
title: "Monofizitismul"
summary: "O singură fire în Hristos"

# Taxonomy
type: "erezie"
category: "hristologie"
tags: ["calcedon", "eutihie", "fire-unica"]

# Relations (all slugs validated at build time)
condemned_at: "sinodul-4-ecumenic"
opposed_to: ["nestorianismul"]
related: ["monotelismul", "natura-lui-hristos"]
defended_by: []  # No orthodox defenders

# Status
completeness: "complete"
last_updated: "2026-03-05"
---
```

### Phase 2: Build Validation Script

Create `scripts/validate-content.ts`:

**Features:**
1. **Parse all `.md` files** → extract frontmatter
2. **Validate schema**:
   - Required fields present
   - `type` in allowed enum
   - `category` in allowed enum
   - Slugs in relations exist (cross-check files)
3. **Detect duplicates**: Same `title` in multiple files
4. **Generate outputs**:
   - `CONTENT-INDEX.csv` (for human browsing)
   - `CONTENT-GRAPH.json` (for programmatic queries)
   - `TAXONOMY.json` (all types, categories, tags)
   - `VALIDATION-REPORT.md` (warnings, errors)
5. **Exit code**: 0 if valid, 1 if errors → block commits

**Tech stack:** Node.js + `gray-matter` (parse frontmatter) + `zod` (schema validation)

**Run:**
```bash
npm run validate-content
```

### Phase 3: Add Pre-commit Hook

Install Husky:
```bash
npm install husky --save-dev
npx husky init
```

Create `.husky/pre-commit`:
```bash
#!/bin/sh
npm run validate-content || exit 1
```

**Result:** Can't commit if validation fails.

### Phase 4: Bulk Metadata Addition

**Goal:** Add metadata to ~100 existing files.

**Approach:**
1. Create `scripts/add-metadata.ts`:
   - Reads existing file
   - Infers `type` from collection (`teme/erezii/*` → type: "erezie")
   - Prompts for `category`, `tags`, `relations` (semi-automated)
   - Updates frontmatter
2. Run interactively or batch with AI assistance

**Example workflow:**
```bash
npm run add-metadata src/content/teme/monofizitismul.md

# Prompts:
# Detected type: "erezie" (from content pattern)
# Category? [hristologie] (detected from keywords)
# Tags? calcedon, eutihie, fire-unica
# Condemned at? sinodul-4-ecumenic (found in text)
# Related? [scanning wiki-links...] natura-lui-hristos, nestorianismul
#
# ✅ Updated monofizitismul.md
```

**Alternative:** Use Claude to batch process - give it schema + file, generate metadata.

### Phase 5: Use Metadata in Site

**Astro integration** - auto-generate "Vezi și" sections:

```astro
---
import { getCollection } from 'astro:content';

const { entry } = Astro.props;
const related = entry.data.related || [];
const relatedEntries = await Promise.all(
  related.map(slug => getEntryBySlug('teme', slug))
);
---

{relatedEntries.length > 0 && (
  <section class="related-content">
    <h2>Vezi și</h2>
    <ul>
      {relatedEntries.map(e => (
        <li><a href={`/teme/${e.slug}`}>{e.data.title}</a></li>
      ))}
    </ul>
  </section>
)}
```

**Query examples:**
```typescript
// All christological heresies
const heresies = await getCollection('teme', entry =>
  entry.data.type === 'erezie' &&
  entry.data.category === 'hristologie'
);

// Everything condemned at Calcedon
const calcedonTargets = await getCollection('teme', entry =>
  entry.data.condemned_at === 'sinodul-4-ecumenic'
);
```

## Files to Create

1. `content-schema.ts` - TypeScript interfaces and enums
2. `scripts/validate-content.ts` - Main validation script
3. `scripts/add-metadata.ts` - Helper for bulk metadata addition
4. `.husky/pre-commit` - Git hook
5. `CONTENT-INDEX.csv` - Auto-generated index (gitignored or committed)
6. `VALIDATION-REPORT.md` - Auto-generated report

## Testing Plan

1. **Test validation fails correctly**:
   ```bash
   # Create broken reference
   echo "related: ['non-existent-page']" >> test.md
   npm run validate-content
   # Expected: EXIT 1, error message
   ```

2. **Test duplicate detection**:
   ```bash
   # Create duplicate title
   cp monofizitismul.md monofizitism-copy.md
   npm run validate-content
   # Expected: Warning about duplicate "Monofizitismul"
   ```

3. **Test schema validation**:
   ```bash
   # Invalid type
   echo "type: 'invalid'" >> test.md
   npm run validate-content
   # Expected: Schema validation error
   ```

## Maintenance Workflow (After Implementation)

**When creating new content:**
1. Write `.md` file with full metadata
2. Commit → validation runs automatically
3. If fails → fix broken refs, add missing metadata
4. INDEX.csv auto-updates on successful commit

**When editing metadata:**
1. Edit frontmatter directly in `.md` file
2. Commit → validation ensures consistency
3. No manual CSV editing needed

**Periodic audits:**
```bash
npm run validate-content -- --strict --report
# Generates detailed report of:
# - Stub pages (completeness: "stub")
# - Missing cross-references
# - Orphaned pages (no incoming links)
```

## Notes for AI Implementer

- **Use existing tools**: `gray-matter`, `zod`, `fast-csv`
- **Keep it simple**: Script should be <500 lines
- **Fail fast**: Validation errors should be clear and actionable
- **Orthodox context**: All content is apologetic - understand theological relationships matter
- **Romanian**: All content in Romanian, but metadata keys in English
- **Astro 5**: Use latest Astro content collections API

## Success Criteria

✅ Can't commit file with broken wiki-link
✅ Can query "all heresies condemned at Calcedon" programmatically
✅ INDEX.csv always reflects current content state
✅ Adding new page doesn't break existing links
✅ Taxonomy is consistent (no "hristology" vs "christology" typos)

## Questions for Implementer

- Should validation be **warning** or **blocking** for missing optional fields?
- How to handle bi-directional links? (A links to B → should B auto-link to A?)
- CSV format vs JSON for human-readable index?
- Generate visual graph (Graphviz/Mermaid) of content relationships?

---

**STATUS**: Ready for implementation
**PRIORITY**: High (before content grows beyond 200 pages)
**ESTIMATED EFFORT**: 8-12 hours for full implementation + testing
