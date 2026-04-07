// Scan all Bible pericope files and find overlapping verse ranges
// Usage: node scripts/find-pericope-overlaps.js

const fs = require('fs');
const path = require('path');

const BIBLIA_DIR = path.join(__dirname, '..', 'src', 'content', 'biblia');

function parseFrontmatter(content) {
  const normalized = content.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) {
      let val = m[2].trim().replace(/^["']|["']$/g, '');
      if (/^\d+$/.test(val)) val = parseInt(val, 10);
      fm[m[1]] = val;
    }
  }
  return fm;
}

function collectPericopes(dir) {
  const pericopes = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      pericopes.push(...collectPericopes(fullPath));
    } else if (entry.name.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const fm = parseFrontmatter(content);
      if (fm && fm.book_romanian && fm.chapter !== undefined) {
        pericopes.push({ ...fm, file: entry.name });
      }
    }
  }
  return pericopes;
}

const all = collectPericopes(BIBLIA_DIR);

// Group by book + chapter
const groups = {};
for (const p of all) {
  const key = `${p.testament}|${p.book_romanian}|${p.chapter}`;
  if (!groups[key]) groups[key] = [];
  groups[key].push(p);
}

let overlapCount = 0;
let gapCount = 0;

for (const key of Object.keys(groups).sort()) {
  const pericopes = groups[key].sort((a, b) => a.pericope - b.pericope);

  for (let i = 0; i < pericopes.length - 1; i++) {
    const curr = pericopes[i];
    const next = pericopes[i + 1];

    if (curr.verses_end >= next.verses_start) {
      const overlapSize = curr.verses_end - next.verses_start + 1;
      console.log(
        `OVERLAP: ${curr.book_romanian} ${curr.chapter} — ` +
        `pericopa ${curr.pericope} (v${curr.verses_start}-${curr.verses_end}) ↔ ` +
        `pericopa ${next.pericope} (v${next.verses_start}-${next.verses_end}) — ` +
        `${overlapSize} versete suprapuse (v${next.verses_start}-${curr.verses_end})`
      );
      overlapCount++;
    } else if (next.verses_start > curr.verses_end + 1) {
      const gapSize = next.verses_start - curr.verses_end - 1;
      console.log(
        `GAP:     ${curr.book_romanian} ${curr.chapter} — ` +
        `pericopa ${curr.pericope} (v${curr.verses_start}-${curr.verses_end}) ↔ ` +
        `pericopa ${next.pericope} (v${next.verses_start}-${next.verses_end}) — ` +
        `${gapSize} versete lipsă (v${curr.verses_end + 1}-${next.verses_start - 1})`
      );
      gapCount++;
    }
  }
}

console.log(`\n=== TOTAL: ${overlapCount} suprapuneri, ${gapCount} goluri ===`);
