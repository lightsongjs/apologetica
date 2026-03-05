import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ContentMetadataSchema } from '../content-schema.js';

// Constants
const CONTENT_DIR = 'src/content/teme';
const OUTPUT_DIR = '.';
const COLLECTIONS: Record<string, string> = {
  teme: 'src/content/teme',
  personalitati: 'src/content/personalitati',
  locuri: 'src/content/locuri',
};

interface ValidationResult {
  errors: string[];
  warnings: string[];
  files: ContentFile[];
}

interface ContentFile {
  slug: string;
  metadata: any;
  wikiLinks: string[];
}

// Main validation logic
function validateContent(): ValidationResult {
  const result: ValidationResult = { errors: [], warnings: [], files: [] };

  // 1. Parse all files
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const slug = path.basename(file, '.md');
    const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
    const { data, content: body } = matter(content);

    // 2. Validate frontmatter with Zod
    const validation = ContentMetadataSchema.safeParse(data);
    if (!validation.success) {
      const errors = validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      result.errors.push(`${slug}: ${errors}`);
      continue;
    }

    // 3. Extract wiki-links from body
    const wikiLinks = extractWikiLinks(body);

    result.files.push({ slug, metadata: validation.data, wikiLinks });
  }

  // 4. Validate slug references
  for (const file of result.files) {
    validateSlugReferences(file, result);
  }

  // 5. Detect duplicate titles
  detectDuplicates(result.files, result);

  // 6. Check for missing optional fields (warnings)
  checkCompleteness(result.files, result);

  return result;
}

function extractWikiLinks(content: string): string[] {
  const links: string[] = [];
  // Regex from existing wiki-links.ts patterns
  const withDisplay = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;
  const withoutDisplay = /\[\[([^\]|]+)\]\]/g;

  let match;
  while ((match = withDisplay.exec(content)) !== null) {
    // Remove trailing backslash if present (from escaped pipes in tables: \|)
    let slug = match[1];
    if (slug.endsWith('\\')) {
      slug = slug.slice(0, -1);
    }
    links.push(slug); // collection/slug
  }
  // Reset regex for second pattern
  while ((match = withoutDisplay.exec(content)) !== null) {
    // Avoid duplicates from withDisplay pattern
    if (!content.substring(Math.max(0, match.index - 2), match.index + match[0].length + 2).includes('|')) {
      let slug = match[1];
      if (slug.endsWith('\\')) {
        slug = slug.slice(0, -1);
      }
      links.push(slug);
    }
  }

  return [...new Set(links)]; // Remove duplicates
}

function validateSlugReferences(file: ContentFile, result: ValidationResult) {
  const { metadata, slug } = file;

  // Check relations
  const relFields: Array<keyof typeof metadata> = ['related', 'opposed_to', 'defended_by'];
  for (const field of relFields) {
    if (metadata[field]) {
      for (const refSlug of metadata[field]) {
        if (!fileExists('teme', refSlug)) {
          result.errors.push(
            `${slug}: ${String(field)}['${refSlug}'] points to non-existent file`
          );
        }
      }
    }
  }

  // Check condemned_at
  if (metadata.condemned_at && !fileExists('teme', metadata.condemned_at)) {
    result.errors.push(
      `${slug}: condemned_at='${metadata.condemned_at}' points to non-existent file`
    );
  }

  // Validate wiki-links
  for (const link of file.wikiLinks) {
    const parts = link.split('/');
    if (parts.length === 2) {
      const [collection, linkSlug] = parts;
      if (!fileExists(collection, linkSlug)) {
        result.errors.push(`${slug}: wiki-link [[${link}]] points to non-existent file`);
      }
    }
  }
}

function fileExists(collection: string, slug: string): boolean {
  const dir = COLLECTIONS[collection];
  if (!dir) return false;
  return fs.existsSync(path.join(dir, `${slug}.md`));
}

function detectDuplicates(files: ContentFile[], result: ValidationResult) {
  const titleMap = new Map<string, string[]>();

  for (const file of files) {
    const title = file.metadata.title.toLowerCase().trim();
    if (!titleMap.has(title)) {
      titleMap.set(title, []);
    }
    titleMap.get(title)!.push(file.slug);
  }

  for (const [title, slugs] of titleMap) {
    if (slugs.length > 1) {
      result.warnings.push(
        `Duplicate title "${title}" in files: ${slugs.join(', ')}`
      );
    }
  }
}

function checkCompleteness(files: ContentFile[], result: ValidationResult) {
  for (const file of files) {
    if (!file.metadata.related || file.metadata.related.length === 0) {
      result.warnings.push(`${file.slug}: Missing 'related' field`);
    }
    if (!file.metadata.last_updated) {
      result.warnings.push(`${file.slug}: Missing 'last_updated' field`);
    }
    if (!file.metadata.tags || file.metadata.tags.length === 0) {
      result.warnings.push(`${file.slug}: No tags specified`);
    }
  }
}

// Generate outputs
function generateOutputs(result: ValidationResult) {
  // CONTENT-INDEX.json
  const index = result.files.map(f => ({
    slug: f.slug,
    ...f.metadata,
  }));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'CONTENT-INDEX.json'), JSON.stringify(index, null, 2));

  // CONTENT-GRAPH.json
  const graph = {
    nodes: result.files.map(f => ({ id: f.slug, ...f.metadata })),
    edges: buildEdges(result.files),
  };
  fs.writeFileSync(path.join(OUTPUT_DIR, 'CONTENT-GRAPH.json'), JSON.stringify(graph, null, 2));

  // TAXONOMY.json
  const taxonomy = buildTaxonomy(result.files);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'TAXONOMY.json'), JSON.stringify(taxonomy, null, 2));

  // VALIDATION-REPORT.md
  const report = generateReport(result);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'VALIDATION-REPORT.md'), report);
}

function buildEdges(files: ContentFile[]) {
  const edges: Array<{ source: string; target: string; type: string }> = [];

  for (const file of files) {
    const { metadata, slug } = file;

    // Add edges for all relation fields
    if (metadata.related) {
      for (const target of metadata.related) {
        edges.push({ source: slug, target, type: 'related' });
      }
    }
    if (metadata.condemned_at) {
      edges.push({ source: slug, target: metadata.condemned_at, type: 'condemned_at' });
    }
    if (metadata.opposed_to) {
      for (const target of metadata.opposed_to) {
        edges.push({ source: slug, target, type: 'opposed_to' });
      }
    }
  }

  return edges;
}

function buildTaxonomy(files: ContentFile[]) {
  const types = new Set<string>();
  const categories = new Set<string>();
  const tags = new Set<string>();

  for (const file of files) {
    types.add(file.metadata.type);
    categories.add(file.metadata.category);
    if (file.metadata.tags) {
      file.metadata.tags.forEach((tag: string) => tags.add(tag));
    }
  }

  return {
    types: Array.from(types).sort(),
    categories: Array.from(categories).sort(),
    tags: Array.from(tags).sort(),
  };
}

function generateReport(result: ValidationResult): string {
  let report = '# Content Validation Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;

  report += `## Summary\n\n`;
  report += `- Total files: ${result.files.length}\n`;
  report += `- Errors: ${result.errors.length}\n`;
  report += `- Warnings: ${result.warnings.length}\n\n`;

  if (result.errors.length > 0) {
    report += `## Errors (blocking)\n\n`;
    for (const error of result.errors) {
      report += `- ❌ ${error}\n`;
    }
    report += '\n';
  }

  if (result.warnings.length > 0) {
    report += `## Warnings (non-blocking)\n\n`;
    for (const warning of result.warnings) {
      report += `- ⚠️  ${warning}\n`;
    }
  }

  return report;
}

// Main execution
const result = validateContent();
generateOutputs(result);

// Exit with appropriate code
if (result.errors.length > 0) {
  console.error(`❌ Validation failed with ${result.errors.length} errors`);
  console.error('See VALIDATION-REPORT.md for details');
  process.exit(1);
} else {
  console.log(`✅ Validation passed (${result.warnings.length} warnings)`);
  process.exit(0);
}
