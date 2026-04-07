# Fix Bible Overlap

Fix overlapping pericope verse ranges in Bible content files.

## Trigger

Use this skill when the user asks to fix a Bible pericope overlap, provides a chapter reference (book + chapter), and identifies which pericopes are overlapping.

## Input

The user will provide:
- **Book and chapter** (e.g., "Matei 8", "Psalmii 32")
- **Which pericopes overlap** (e.g., "pericopa 1 and pericopa 2")

## Workflow

### 1. Locate the files

Find the pericope files for the given book and chapter in `src/content/biblia/`. Files follow the naming pattern:
```
(NN BookName CC.PP) Pericope Title.md
```
Where NN = book number, CC = chapter, PP = pericope number.

### 2. Read and analyze

Read the overlapping pericope files. Extract from each:
- **Frontmatter**: `verses_start`, `verses_end`, `verses_total`
- **Body**: list all verse numbers actually present in the text (lines starting with `N.`)

### 3. Determine correct boundaries

The correct boundary rule is: **pericope N should end at `pericope (N+1).verses_start - 1`**.

Count the actual verses in the body to verify: if pericope 1 has verses 1–8 in the body but pericope 2 starts at verse 5, then pericope 1's correct range is verses 1–4.

### 4. Present Before/After for approval

Use a **diff-style visual format** so the user can instantly see what changes. The output must follow this exact template:

---

#### Suprapunere: Matei 8 — pericopa 1 / pericopa 2

| | P1: "Title" | tăietură | P2: "Title" |
|---|---|---|---|
| **BEFORE** | v1–8 (8 versete) | *8. Dar sutaşul, răspunzând...* \| *5. Pe când intra în Capernaum...* | v5–13 (9 versete) |
| **AFTER** | v1–**4** (**4** versete) | *4. Şi i-a zis Iisus: Vezi...* \| *5. Pe când intra în Capernaum...* | v5–13 (9 versete) |

---

Format rules:
- **Single table** with 4 columns: label, P1 range, cut point, P2 range
- **"tăietură" column** shows the boundary: last verse of P1 `|` first verse of P2 — show ~40 chars of each verse text so the user can verify the cut is correct
- Use **bold** for changed values in the AFTER row
- The cut point column is the most important — it lets the user instantly see "where does one pericope end and the next begin"
- If pericopa 2 is also being modified, its range and cut point change too
- End with a clear prompt: "Aprobi modificarea?"

### 5. Wait for user approval

Do NOT proceed with changes until the user explicitly approves. The user may:
- Approve as-is
- Suggest different boundaries (some pericopes intentionally share transitional verses)
- Ask to see the actual verse text before deciding

### 6. Apply the fix

Once approved, edit the affected pericope file(s):

**Frontmatter changes:**
- Update `verses_end` to the corrected value
- Update `verses_total` to `verses_end - verses_start + 1`

**Body changes:**
- Remove the extra verse lines that belong to the next pericope
- Keep only verses from `verses_start` to the corrected `verses_end`

### 7. Verify

After applying changes, re-read both files and confirm:
- No more overlap between the two pericopes
- Verse continuity is maintained (pericope 1 ends where pericope 2 begins)
- `verses_total` matches the actual verse count in the body

Report the result to the user.

## Important notes

- **Never auto-fix** — always show Before/After and wait for approval
- **Only fix what the user asks** — don't scan for other overlaps unless asked
- The overlap script is at `scripts/find-pericope-overlaps.cjs` if the user wants to find more overlaps
- Some overlaps may be intentional (transitional verses) — let the user decide
