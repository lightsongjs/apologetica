// Complete pericope coverage against the raw Orthodox Bible source.
//
// The pericope structure came from the English NRSV, whose versification differs
// from the Romanian Orthodox text, so the last pericope of a chapter can stop
// before the chapter really ends, and a few verses NRSV omits fall between two
// pericopes. Both cases leave verses absent from the site.
//
// This script is ADDITIVE ONLY: it never deletes a verse line. Verses that are
// duplicated because of an overlap are removed separately by
// fix-pericope-overlaps.cjs, which must run AFTER this one.
//
// Usage: node scripts/complete-pericope-coverage.cjs [--apply] [--source <dir>]

const fs = require('fs');
const path = require('path');

const BIBLIA_DIR = path.join(__dirname, '..', 'src', 'content', 'biblia');
const APPLY = process.argv.includes('--apply');
const srcFlag = process.argv.indexOf('--source');
const SOURCE_DIR = srcFlag !== -1
  ? process.argv[srcFlag + 1]
  : path.join(__dirname, '..', '..', 'orthodox-bible-ro', 'source', 'bible_books');

if (!fs.existsSync(SOURCE_DIR)) {
  console.error(`Sursa nu există: ${SOURCE_DIR}\nClonează lightsongjs/orthodox-bible-ro lângă acest proiect sau dă --source <dir>.`);
  process.exit(1);
}

// Known defect in the scraped source: Iosua Navi 22 has no verse 30 and carries
// an extra verse numbered 80 whose text is verse 30 ("Iar preotul Finees...").
const RENUMBER = { 'Iosua Navi|22': { 80: 30 } };

// ---- source of truth: keep verses as a LIST, duplicates included ------------
const truth = new Map(); // "BookRo|chapter" -> [{verse, text}]
for (const f of fs.readdirSync(SOURCE_DIR).filter(n => n.endsWith('.json'))) {
  const d = JSON.parse(fs.readFileSync(path.join(SOURCE_DIR, f), 'utf-8'));
  for (const ch of d.chapters) {
    const key = `${d.name_ro}|${ch.chapter}`;
    const fix = RENUMBER[key] || {};
    const verses = ch.verses
      .map(v => ({ verse: fix[v.verse] !== undefined ? fix[v.verse] : v.verse, text: v.text.trim() }))
      .sort((a, b) => a.verse - b.verse);
    truth.set(key, verses);
  }
}

// ---- site content -----------------------------------------------------------
function parseFile(fp) {
  const raw = fs.readFileSync(fp, 'utf-8');
  const nl = raw.includes('\r\n') ? '\r\n' : '\n';
  const m = raw.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
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
  if (!fm.book_romanian || fm.chapter === undefined) return null;
  const bodyLines = m[2].split('\n');
  const verseIdx = [];
  bodyLines.forEach((l, i) => {
    const vm = l.match(/^(\d+)\.\s/);
    if (vm) verseIdx.push({ verse: parseInt(vm[1], 10), line: i });
  });
  return { fp, nl, fmText: m[1], fm, bodyLines, verseIdx };
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp, out);
    else if (e.name.endsWith('.md')) { const p = parseFile(fp); if (p) out.push(p); }
  }
  return out;
}

const groups = new Map();
for (const p of walk(BIBLIA_DIR)) {
  const k = `${p.fm.book_romanian}|${p.fm.chapter}`;
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(p);
}

const planned = [];  // {p, added:[{verse,text}], newEnd}
const skipped = [];
let noSource = 0;

for (const [key, list] of [...groups.entries()].sort()) {
  const src = truth.get(key);
  if (!src) { noSource++; continue; }
  const ps = list.sort((a, b) => a.fm.pericope - b.fm.pericope);
  const trueMax = Math.max(...src.map(v => v.verse));

  // Target ranges: each pericope runs up to the next one's start; the last one
  // runs to the real end of the chapter.
  const ends = [];
  for (let i = 0; i < ps.length; i++) {
    ends[i] = (i < ps.length - 1)
      ? ps[i + 1].fm.verses_start - 1
      : Math.max(ps[i].fm.verses_end, trueMax);
  }
  const bad = ps.findIndex((p, i) => p.fm.verses_start > ends[i]);
  if (bad !== -1) {
    skipped.push(`${key} — numerotarea se reia (pericopa ${ps[bad].fm.pericope}: v${ps[bad].fm.verses_start} > v${ends[bad]})`);
    continue;
  }

  for (let i = 0; i < ps.length; i++) {
    const p = ps[i];
    const have = new Set(p.verseIdx.map(v => v.verse));
    const want = src.filter(v => v.verse >= p.fm.verses_start && v.verse <= ends[i]);
    const seen = new Set();
    const added = [];
    for (const v of want) {
      if (have.has(v.verse) || seen.has(v.verse)) continue;
      seen.add(v.verse);
      added.push(v);
    }
    const newEnd = Math.max(p.fm.verses_end, ...(added.length ? added.map(a => a.verse) : [p.fm.verses_end]));
    if (!added.length && newEnd === p.fm.verses_end) continue;
    planned.push({ p, added, newEnd, key });
  }
}

const totalAdded = planned.reduce((s, x) => s + x.added.length, 0);
console.log(`Capitole fără corespondent în sursă: ${noSource}`);
console.log(`Sărite: ${skipped.length}`);
for (const s of skipped) console.log(`  SKIP ${s}`);
console.log(`\nPericope de completat: ${planned.length}`);
console.log(`Versete de adăugat:    ${totalAdded}\n`);

for (const x of planned) {
  const vs = x.added.map(a => a.verse);
  const rng = vs.length ? `v${vs[0]}${vs.length > 1 ? '-' + vs[vs.length - 1] : ''}` : '—';
  console.log(`  ${x.key.padEnd(26)} P${x.p.fm.pericope}  v${x.p.fm.verses_start}-${x.p.fm.verses_end} → v${x.p.fm.verses_start}-${x.newEnd}  (+${x.added.length}: ${rng})  „${x.p.fm.pericope_title_ro}”`);
}

if (!APPLY) { console.log('\n--- DRY RUN (fără --apply nu se scrie nimic) ---'); process.exit(0); }

let written = 0;
for (const x of planned) {
  const { p, added, newEnd } = x;
  let lines = p.bodyLines.slice();
  for (const a of added) {
    // insert after the last existing verse with a smaller number, else before
    // the first with a bigger one, else after the final verse line
    let insertAt = null;
    const idx = [];
    lines.forEach((l, i) => { const m = l.match(/^(\d+)\.\s/); if (m) idx.push({ verse: parseInt(m[1], 10), line: i }); });
    const before = idx.filter(v => v.verse < a.verse);
    const after = idx.filter(v => v.verse > a.verse);
    if (before.length) insertAt = before[before.length - 1].line + 1;
    else if (after.length) insertAt = after[0].line;
    else insertAt = idx.length ? idx[idx.length - 1].line + 1 : lines.length;
    lines.splice(insertAt, 0, `${a.verse}. ${a.text}`);
  }
  const remaining = lines.filter(l => /^\d+\.\s/.test(l)).length;
  const fmText = p.fmText
    .replace(/^verses_end:\s*.+$/m, `verses_end: ${newEnd}`)
    .replace(/^verses_total:\s*.+$/m, `verses_total: ${remaining}`);
  fs.writeFileSync(p.fp, `---\n${fmText}\n---\n${lines.join('\n')}`.replace(/\n/g, p.nl), 'utf-8');
  written++;
}
console.log(`\nScrise: ${written} fișiere, ${totalAdded} versete adăugate`);
