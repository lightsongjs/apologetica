import fs from 'fs';
import matter from 'gray-matter';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<string> {
  return new Promise(resolve => rl.question(question, resolve));
}

function extractWikiLinks(content: string): string[] {
  const links: string[] = [];
  const withDisplay = /\[\[teme\/([^\]|]+)\|([^\]]+)\]\]/g;
  const withoutDisplay = /\[\[teme\/([^\]|]+)\]\]/g;

  let match;
  while ((match = withDisplay.exec(content)) !== null) {
    links.push(match[1]);
  }
  while ((match = withoutDisplay.exec(content)) !== null) {
    links.push(match[1]);
  }

  return [...new Set(links)]; // Remove duplicates
}

async function addMetadata(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);

  console.log(`\n📄 File: ${filePath}`);
  console.log(`Current: title="${data.title}", summary="${data.summary}"`);

  // Infer type
  const inferredType = inferType(body);
  const typeInput = await prompt(`Type? [${inferredType}]: `);
  const type = typeInput.trim() || inferredType;

  // Infer category
  const inferredCategory = inferCategory(body);
  const categoryInput = await prompt(`Category? [${inferredCategory}]: `);
  const category = categoryInput.trim() || inferredCategory;

  // Tags
  const suggestedTags = inferTags(body);
  const tagsInput = await prompt(`Tags? [${suggestedTags.join(', ')}]: `);
  const tags = tagsInput.trim()
    ? tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0)
    : suggestedTags;

  // Related (from wiki-links)
  const wikiLinks = extractWikiLinks(body);
  if (wikiLinks.length > 0) {
    console.log(`\nFound wiki-links: ${wikiLinks.join(', ')}`);
    const addRelatedInput = await prompt(`Add to 'related'? [y/n]: `);
    var related = addRelatedInput.toLowerCase() === 'y' ? wikiLinks : [];
  } else {
    var related: string[] = [];
  }

  // condemned_at (if type is erezie)
  let condemned_at: string | undefined;
  if (type === 'erezie') {
    const condemnedInput = await prompt(`condemned_at? (synod slug or leave empty): `);
    condemned_at = condemnedInput.trim() || undefined;
  }

  // opposed_to (if type is erezie or doctrina)
  let opposed_to: string[] | undefined;
  if (type === 'erezie' || type === 'doctrina') {
    const opposedInput = await prompt(`opposed_to? (comma-separated slugs or leave empty): `);
    opposed_to = opposedInput.trim()
      ? opposedInput.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : undefined;
  }

  // Update frontmatter
  const newData = {
    ...data,
    type,
    category,
    tags: tags.length > 0 ? tags : [],
    related: related.length > 0 ? related : undefined,
    condemned_at,
    opposed_to,
    completeness: 'draft',
    last_updated: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  };

  // Remove undefined fields
  Object.keys(newData).forEach(key => {
    if (newData[key] === undefined) {
      delete newData[key];
    }
  });

  // Write back
  const newContent = matter.stringify(body, newData);
  fs.writeFileSync(filePath, newContent, 'utf-8');

  console.log(`✅ Updated ${filePath}\n`);
}

function inferType(content: string): string {
  if (/\berezie|eretic/i.test(content)) return 'erezie';
  if (/\bsinod|conciliu/i.test(content)) return 'sinod';
  if (/\bdoctrină|învățătură/i.test(content)) return 'doctrina';
  return 'tema-generala';
}

function inferCategory(content: string): string {
  if (/\bhristos|hristologie|fir(e|i)|natur(ă|i)/i.test(content)) return 'hristologie';
  if (/\btreime|tată|fiu|duh/i.test(content)) return 'triadologie';
  if (/\bbiseric|eclesio/i.test(content)) return 'eclesiologie';
  if (/\bmântuire|răscumpăr|soterio/i.test(content)) return 'soteriologie';
  if (/\bduh sfânt|pneumato/i.test(content)) return 'pneumatologie';
  if (/\bsfârșit|escato|judecată/i.test(content)) return 'escatologie';
  return 'apologetica';
}

function inferTags(content: string): string[] {
  const tags: string[] = [];
  if (/calcedon/i.test(content)) tags.push('calcedon');
  if (/eutihie/i.test(content)) tags.push('eutihie');
  if (/nestorie/i.test(content)) tags.push('nestorie');
  if (/arian/i.test(content)) tags.push('arianism');
  if (/atanasie/i.test(content)) tags.push('atanasie');
  if (/niceea/i.test(content)) tags.push('niceea');
  if (/apostol/i.test(content)) tags.push('apostoli');
  if (/profeț/i.test(content)) tags.push('profeți');
  return tags;
}

// Run
const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: npm run add-metadata <file-path>');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`Error: File not found: ${filePath}`);
  process.exit(1);
}

addMetadata(filePath).then(() => rl.close());
