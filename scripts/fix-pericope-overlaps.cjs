// Fix overlapping pericope verse ranges.
// Root cause: pericope 1's `verses_end` was generated as the CHAPTER number
// instead of the real last verse, so its body duplicates the next pericope.
// Rule: pericope N must end at pericope (N+1).verses_start - 1.
//
// Usage: node scripts/fix-pericope-overlaps.cjs [--apply]

const fs = require('fs');
const path = require('path');

const BIBLIA_DIR = path.join(__dirname, '..', 'src', 'content', 'biblia');
const APPLY = process.argv.includes('--apply');

function parseFile(fp) {
  const raw = fs.readFileSync(fp, 'utf-8');
  const nl = raw.includes('\r\n') ? '\r\n' : '\n';
  const norm = raw.replace(/\r\n/g, '\n');
  const m = norm.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split('\n')) {
    const mm = line.match(/^(\w+):\s*(.+)$/);
    if (mm) {
      let v = mm[2].trim().replace(/^["']|["']$/g, '');
      if (/^\d+$/.test(v)) v = parseInt(v, 10);
      fm[mm[1]] = v;
    }
  }
  const bodyLines = m[2].split('\n');
  // A verse number can legitimately appear on more than one line in the source
  // data (duplicated numbering), so keep EVERY line index per verse number.
  const verses = new Map();
  bodyLines.forEach((l, i) => {
    const vm = l.match(/^(\d+)\.\s/);
    if (!vm) return;
    const v = parseInt(vm[1], 10);
    if (!verses.has(v)) verses.set(v, []);
    verses.get(v).push(i);
  });
  return { fp, nl, fmText: m[1], fm, bodyLines, verses };
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp, out);
    else if (e.name.endsWith('.md')) {
      const p = parseFile(fp);
      if (p && p.fm.book_romanian && p.fm.chapter !== undefined) out.push(p);
    }
  }
  return out;
}

const all = walk(BIBLIA_DIR);
const groups = {};
for (const p of all) {
  const k = `${p.fm.testament}|${p.fm.book_romanian}|${p.fm.chapter}`;
  (groups[k] ||= []).push(p);
}

const planned = [];   // {file, oldEnd, newEnd, droppedVerses}
const skipped = [];   // {key, reason}

for (const key of Object.keys(groups).sort()) {
  const ps = groups[key].sort((a, b) => a.fm.pericope - b.fm.pericope);

  // Collect candidate truncations for this chapter
  const cand = [];
  let emptySkip = false;
  for (let i = 0; i < ps.length - 1; i++) {
    const c = ps[i], n = ps[i + 1];
    if (c.fm.verses_end < n.fm.verses_start) continue;
    const newEnd = n.fm.verses_start - 1;
    if (newEnd < c.fm.verses_start) {
      skipped.push({ key, reason: `pericopa ${c.fm.pericope} ar rămâne goală (v${c.fm.verses_start}-${c.fm.verses_end}, următoarea începe la v${n.fm.verses_start})` });
      emptySkip = true;
      continue;
    }
    cand.push({ p: c, newEnd });
  }
  if (!cand.length) continue;

  // Guard: chapter-level verse coverage must not shrink
  const before = new Set();
  for (const p of ps) for (const v of p.verses.keys()) before.add(v);
  const limits = new Map(cand.map(c => [c.p.fm.pericope, c.newEnd]));
  const after = new Set();
  for (const p of ps) {
    const lim = limits.has(p.fm.pericope) ? limits.get(p.fm.pericope) : Infinity;
    for (const v of p.verses.keys()) if (v <= lim) after.add(v);
  }
  const lost = [...before].filter(v => !after.has(v)).sort((a, b) => a - b);
  if (lost.length) {
    skipped.push({ key, reason: `s-ar pierde v${lost.join(',')} — ultima pericopă nu acoperă finalul capitolului` });
    continue;
  }

  for (const c of cand) {
    const dropped = [...c.p.verses.keys()].filter(v => v > c.newEnd).sort((a, b) => a - b);
    planned.push({ p: c.p, oldEnd: c.p.fm.verses_end, newEnd: c.newEnd, dropped, key });
  }
}

console.log(`Planificate: ${planned.length} fișiere`);
console.log(`Sărite:      ${skipped.length} capitole/cazuri\n`);
for (const s of skipped) console.log(`  SKIP ${s.key} — ${s.reason}`);

if (!APPLY) {
  console.log('\n--- DRY RUN (fără --apply nu se scrie nimic) ---');
  for (const x of planned.slice(0, 10)) {
    console.log(`  ${path.basename(x.p.fp)}: v${x.p.fm.verses_start}-${x.oldEnd} → v${x.p.fm.verses_start}-${x.newEnd} (scot ${x.dropped.length} versete)`);
  }
  console.log(`  ... (${planned.length} total)`);
  process.exit(0);
}

let written = 0;
for (const x of planned) {
  const { p, newEnd } = x;
  const dropIdx = new Set();
  for (const [v, idxs] of p.verses) if (v > newEnd) for (const i of idxs) dropIdx.add(i);
  const newBody = p.bodyLines.filter((_, i) => !dropIdx.has(i));

  const remaining = newBody.filter(l => /^\d+\.\s/.test(l)).length;
  let fmText = p.fmText
    .replace(/^verses_end:\s*.+$/m, `verses_end: ${newEnd}`)
    .replace(/^verses_total:\s*.+$/m, `verses_total: ${remaining}`);

  const out = `---\n${fmText}\n---\n${newBody.join('\n')}`.replace(/\n/g, p.nl);
  fs.writeFileSync(p.fp, out, 'utf-8');
  written++;
}
console.log(`\nScrise: ${written} fișiere`);
