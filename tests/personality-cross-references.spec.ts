import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const PERSONALITATI_DIR = path.resolve('src/content/personalitati');

/** Read all personality files and return { slug, content } for each */
function loadAllPersonalities() {
  const files = fs.readdirSync(PERSONALITATI_DIR).filter(f => f.endsWith('.md'));
  return files.map(filename => {
    const slug = filename.replace('.md', '');
    const content = fs.readFileSync(path.join(PERSONALITATI_DIR, filename), 'utf-8');
    return { slug, filename, content };
  });
}

/** Extract all [[personalitati/slug|...]] wiki-links from content */
function extractWikiLinks(content: string): Array<{ slug: string; display: string }> {
  const links: Array<{ slug: string; display: string }> = [];
  // With display text: [[personalitati/slug|display]]
  const withDisplay = /\[\[personalitati\/([^\]|]+)\|([^\]]+)\]\]/g;
  let match;
  while ((match = withDisplay.exec(content)) !== null) {
    links.push({ slug: match[1], display: match[2] });
  }
  // Without display text: [[personalitati/slug]]
  const withoutDisplay = /\[\[personalitati\/([^\]|]+)\]\]/g;
  while ((match = withoutDisplay.exec(content)) !== null) {
    // Skip if already captured by the with-display regex
    if (!links.some(l => l.slug === match[1])) {
      links.push({ slug: match[1], display: match[1] });
    }
  }
  return links;
}

/** Extract the "Contemporani și rude spirituale" section content */
function extractContemporariesSection(content: string): string {
  // Normalize line endings first
  const normalized = content.replace(/\r\n/g, '\n');
  const sectionRegex = /## Contemporani și rude spirituale\n([\s\S]*?)(?=\n## |\n---|$)/;
  const match = normalized.match(sectionRegex);
  return match ? match[1] : '';
}

/** Extract plain text mentions of apostles/personalities (without wiki-links) */
function extractPlainTextMentions(content: string): Array<{ mention: string; possibleSlug: string }> {
  const mentions: Array<{ mention: string; possibleSlug: string }> = [];

  // Common apostle name patterns that should be wiki-linked
  const patterns = [
    { regex: /Apostolul (Petru|Pavel|Ioan|Andrei|Filip|Bartolomeu|Toma|Matei|Iacob|Simon|Iuda|Tadeu)/g, prefix: '' },
    { regex: /Sfântul Apostol (Petru|Pavel|Ioan|Andrei|Filip|Bartolomeu|Toma|Matei|Iacob|Simon|Iuda)/g, prefix: 'Sfântul Apostol ' },
    { regex: /Profetul (Isaia|Ieremia|Iezechiel|Daniel|Osea|Ioil|Amos|Avdie|Iona|Miheia|Naum|Avacum|Sofonie|Agheu|Zaharia|Maleahi)/g, prefix: 'Profetul ' },
  ];

  for (const { regex, prefix } of patterns) {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const fullMatch = match[0];
      const name = match[1];

      // Skip if this mention is already inside a wiki-link
      const beforeMatch = content.substring(0, match.index);
      const afterMatch = content.substring(match.index + fullMatch.length);
      const insideWikiLink = beforeMatch.lastIndexOf('[[') > beforeMatch.lastIndexOf(']]') ||
                            afterMatch.indexOf(']]') < afterMatch.indexOf('[[');

      if (!insideWikiLink) {
        mentions.push({
          mention: fullMatch,
          possibleSlug: name.toLowerCase()
            .replace('petru', 'petru')
            .replace('pavel', 'pavel')
            .replace('ioan', 'ioan-evanghelistul')
            .replace('andrei', 'andrei-apostolul')
            .replace('filip', 'filip-apostolul')
            .replace('bartolomeu', 'bartolomeu')
            .replace('toma', 'toma')
            .replace('matei', 'matei-evanghelistul')
            .replace('iacob', 'iacob-zebedeu')  // Most common Iacob
            .replace('simon', 'simon-zilotul')
            .replace('iuda', 'iuda-tadeu')
            .replace('tadeu', 'iuda-tadeu')
        });
      }
    }
  }

  return mentions;
}

/** Extract the "Surse și scrieri" section content */
function extractSourcesSection(content: string): string {
  // Normalize line endings first
  const normalized = content.replace(/\r\n/g, '\n');
  const sectionRegex = /## Surse și scrieri\n([\s\S]*?)(?=\n## |\n---|$)/;
  const match = normalized.match(sectionRegex);
  return match ? match[1] : '';
}

const personalities = loadAllPersonalities();
const allSlugs = new Set(personalities.map(p => p.slug));

test.describe('Personality cross-references', () => {

  test('every wiki-linked personality file must exist', () => {
    const missing: string[] = [];
    for (const { slug, content } of personalities) {
      const links = extractWikiLinks(content);
      for (const link of links) {
        if (!allSlugs.has(link.slug)) {
          missing.push(`${slug} → [[personalitati:${link.slug}]] (file not found)`);
        }
      }
    }
    expect(missing, `Missing personality files:\n${missing.join('\n')}`).toHaveLength(0);
  });

  test('every wiki-link in Contemporani must be reciprocal (anywhere in file)', () => {
    const missingReciprocal: string[] = [];

    for (const { slug, content } of personalities) {
      const section = extractContemporariesSection(content);
      const links = extractWikiLinks(section);

      for (const link of links) {
        // Find the target file
        const target = personalities.find(p => p.slug === link.slug);
        if (!target) continue; // Covered by the "file must exist" test

        // Check if the target links back to this file (anywhere in the file)
        const targetLinks = extractWikiLinks(target.content);
        const linksBack = targetLinks.some(l => l.slug === slug);

        if (!linksBack) {
          missingReciprocal.push(
            `${slug} → ${link.slug} (${link.display}) but ${link.slug} does NOT link back to ${slug}`
          );
        }
      }
    }
    expect(
      missingReciprocal,
      `Missing reciprocal links:\n${missingReciprocal.join('\n')}`
    ).toHaveLength(0);
  });

  test('Contemporani links must be reciprocal IN THE CONTEMPORANI SECTION', () => {
    const missingReciprocal: string[] = [];

    for (const { slug, content } of personalities) {
      const section = extractContemporariesSection(content);
      const links = extractWikiLinks(section);

      for (const link of links) {
        // Find the target file
        const target = personalities.find(p => p.slug === link.slug);
        if (!target) continue; // Covered by the "file must exist" test

        // Check if the target links back to this file IN THEIR CONTEMPORANI SECTION
        const targetContemporariesSection = extractContemporariesSection(target.content);
        const targetContemporariesLinks = extractWikiLinks(targetContemporariesSection);
        const linksBackInContemporaries = targetContemporariesLinks.some(l => l.slug === slug);

        if (!linksBackInContemporaries) {
          // Check if target links back somewhere else (for better error message)
          const targetAllLinks = extractWikiLinks(target.content);
          const linksBackAnywhere = targetAllLinks.some(l => l.slug === slug);

          if (linksBackAnywhere) {
            missingReciprocal.push(
              `${slug} → ${link.slug} in Contemporani, but ${link.slug} links back to ${slug} OUTSIDE Contemporani section (should be IN Contemporani)`
            );
          } else {
            missingReciprocal.push(
              `${slug} → ${link.slug} in Contemporani, but ${link.slug} does NOT link back to ${slug} at all`
            );
          }
        }
      }
    }
    expect(
      missingReciprocal,
      `Missing reciprocal Contemporani links:\n${missingReciprocal.join('\n')}`
    ).toHaveLength(0);
  });

  test('wiki-links in Surse section should also be reciprocal', () => {
    const missingReciprocal: string[] = [];

    for (const { slug, content } of personalities) {
      const section = extractSourcesSection(content);
      const links = extractWikiLinks(section);

      for (const link of links) {
        const target = personalities.find(p => p.slug === link.slug);
        if (!target) continue;

        const targetLinks = extractWikiLinks(target.content);
        const linksBack = targetLinks.some(l => l.slug === slug);

        if (!linksBack) {
          missingReciprocal.push(
            `${slug} (Surse) → ${link.slug} (${link.display}) but ${link.slug} does NOT link back to ${slug}`
          );
        }
      }
    }
    expect(
      missingReciprocal,
      `Missing reciprocal links from Surse sections:\n${missingReciprocal.join('\n')}`
    ).toHaveLength(0);
  });

  test('Contemporani entries that mention an existing personality should use wiki-links', () => {
    // Build a map of slug → all name variants (from frontmatter)
    const nameMap = new Map<string, string[]>();
    for (const { slug, content } of personalities) {
      const nameMatch = content.match(/^name:\s*"(.+?)"/m);
      if (nameMatch) {
        const fullName = nameMatch[1];
        // Generate plausible name variants to search for
        const variants = [fullName];
        // Remove "Sfântul Proroc ", "Sfântul ", "Regele " prefixes
        const stripped = fullName
          .replace(/^Sfântul Proroc /, '')
          .replace(/^Sfântul /, '')
          .replace(/^Regele /, '');
        if (stripped !== fullName) variants.push(stripped);
        nameMap.set(slug, variants);
      }
    }

    const missingWikiLinks: string[] = [];

    for (const { slug, content } of personalities) {
      const section = extractContemporariesSection(content);
      if (!section) continue;

      // Which slugs are already wiki-linked in this section?
      const linked = new Set(extractWikiLinks(section).map(l => l.slug));

      // Check if any other personality's name appears in the section without a wiki-link
      for (const [otherSlug, variants] of nameMap) {
        if (otherSlug === slug) continue; // Skip self
        if (linked.has(otherSlug)) continue; // Already linked

        for (const variant of variants) {
          if (section.includes(variant)) {
            missingWikiLinks.push(
              `${slug} mentions "${variant}" in Contemporani but does not wiki-link to ${otherSlug}`
            );
            break;
          }
        }
      }
    }
    expect(
      missingWikiLinks,
      `Personality names mentioned without wiki-links:\n${missingWikiLinks.join('\n')}`
    ).toHaveLength(0);
  });

  test('every personality file has required sections', () => {
    const requiredSections = ['Bio', 'Timeline'];
    const missing: string[] = [];

    for (const { slug, content } of personalities) {
      for (const section of requiredSections) {
        if (!content.includes(`## ${section}`)) {
          missing.push(`${slug} is missing required section: ## ${section}`);
        }
      }
    }
    expect(missing, `Missing sections:\n${missing.join('\n')}`).toHaveLength(0);
  });

  test('every personality file has required frontmatter fields', () => {
    const issues: string[] = [];

    for (const { slug, content } of personalities) {
      if (!content.match(/^name:\s*".+"/m)) {
        issues.push(`${slug}: missing or empty 'name' field`);
      }
      if (!content.match(/^title:\s*".+"/m)) {
        issues.push(`${slug}: missing or empty 'title' field`);
      }
      if (!content.match(/^image:\s*".+"/m)) {
        issues.push(`${slug}: missing or empty 'image' field`);
      }
      if (!content.match(/^order:\s*\d+/m)) {
        issues.push(`${slug}: missing or invalid 'order' field`);
      }
    }
    expect(issues, `Frontmatter issues:\n${issues.join('\n')}`).toHaveLength(0);
  });

  test('every personality image file exists on disk', () => {
    const missing: string[] = [];

    for (const { slug, content } of personalities) {
      const imageMatch = content.match(/^image:\s*"(.+?)"/m);
      if (imageMatch) {
        const imagePath = path.resolve('public', imageMatch[1].replace(/^\//, ''));
        if (!fs.existsSync(imagePath)) {
          missing.push(`${slug}: image file not found at ${imagePath}`);
        }
      }
    }
    expect(missing, `Missing image files:\n${missing.join('\n')}`).toHaveLength(0);
  });

  test('common apostle/prophet names in Contemporani should have wiki-links', () => {
    const issues: string[] = [];
    const allSlugs = new Set(personalities.map(p => p.slug));

    for (const { slug, content } of personalities) {
      const section = extractContemporariesSection(content);
      if (!section) continue;

      const plainTextMentions = extractPlainTextMentions(section);

      for (const { mention, possibleSlug } of plainTextMentions) {
        // Check if a file exists for this personality
        if (allSlugs.has(possibleSlug)) {
          issues.push(
            `${slug}.md: "${mention}" should be wiki-linked as [[personalitati/${possibleSlug}|${mention}]]`
          );
        }
      }
    }

    expect(
      issues,
      `Common apostle/prophet names without wiki-links:\n${issues.join('\n')}`
    ).toHaveLength(0);
  });
});
