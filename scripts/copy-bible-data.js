/**
 * Orthodox Bible Data Copy Script
 * Copies and transforms 2,745 pericope files from external directory
 * into src/content/biblia/ with proper structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SOURCE_DIR = 'C:\\Users\\User\\Documents\\GitHub\\orthodox_bible\\Biblia_Generata';
const TARGET_DIR = path.join(__dirname, '..', 'src', 'content', 'biblia');

// Testament mapping: source folder name → target folder name
const TESTAMENT_MAP = {
  'Old Testament': 'VT',
  'New Testament': 'NT',
};

/**
 * Clean pericope body: remove wiki-link navigation and English heading
 */
function cleanPericopeBody(body) {
  let cleaned = body;

  // Remove wiki-link navigation lines (both single and double arrow patterns)
  // Matches: ← [[...]] | [[...]] →
  // Or: [[...]] →
  cleaned = cleaned.replace(/^[←→]?\s*\[\[.*?\]\].*$/gm, '');

  // Remove English H1 heading (first line starting with #)
  cleaned = cleaned.replace(/^#\s+.+$/m, '');

  // Remove extra blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Trim whitespace
  cleaned = cleaned.trim();

  return cleaned;
}

/**
 * Transform book folder name to slug
 * "01 Facerea" → "01-facerea"
 * "52 Matei" → "52-matei"
 */
function bookFolderToSlug(folderName) {
  // Extract code and name, join with hyphen, lowercase the name part
  const match = folderName.match(/^(\d+)\s+(.+)/);
  if (!match) return folderName.toLowerCase().replace(/\s+/g, '-');

  const [, code, name] = match;

  // Remove parenthetical English names if present
  const cleanName = name.replace(/\s*\([^)]+\)$/, '');

  return `${code}-${cleanName.toLowerCase().replace(/\s+/g, '-')}`;
}

/**
 * Process a single pericope file
 */
function processPericopeFile(sourceFile, targetFile) {
  const content = fs.readFileSync(sourceFile, 'utf8');

  // Split frontmatter and body
  const parts = content.split(/^---$/m);

  if (parts.length < 3) {
    console.warn(`⚠️  Invalid format: ${sourceFile}`);
    return false;
  }

  const frontmatter = parts[1].trim();
  const body = parts.slice(2).join('---');

  // Clean the body
  const cleanedBody = cleanPericopeBody(body);

  // Reconstruct file
  const newContent = `---\n${frontmatter}\n---\n\n${cleanedBody}\n`;

  // Ensure target directory exists
  const targetDir = path.dirname(targetFile);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Write file
  fs.writeFileSync(targetFile, newContent, 'utf8');
  return true;
}

/**
 * Copy and transform all files
 */
function copyBibleData() {
  console.log('📖 Orthodox Bible Data Copy Script\n');
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Target: ${TARGET_DIR}\n`);

  // Check source exists
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  // Create target directory
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
    console.log(`✅ Created target directory: ${TARGET_DIR}\n`);
  }

  let totalFiles = 0;
  let successFiles = 0;
  let failedFiles = 0;

  // Process each testament
  for (const [sourceTestament, targetTestament] of Object.entries(TESTAMENT_MAP)) {
    const testamentSourceDir = path.join(SOURCE_DIR, sourceTestament);
    const testamentTargetDir = path.join(TARGET_DIR, targetTestament);

    if (!fs.existsSync(testamentSourceDir)) {
      console.warn(`⚠️  Testament not found: ${testamentSourceDir}`);
      continue;
    }

    console.log(`\n📚 Processing ${sourceTestament} → ${targetTestament}`);
    console.log('─'.repeat(60));

    // Get all book folders
    const bookFolders = fs.readdirSync(testamentSourceDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`Found ${bookFolders.length} books\n`);

    // Process each book
    for (const bookFolder of bookFolders) {
      const bookSourceDir = path.join(testamentSourceDir, bookFolder);
      const bookSlug = bookFolderToSlug(bookFolder);
      const bookTargetDir = path.join(testamentTargetDir, bookSlug);

      // Get all pericope files (*.md)
      const pericopeFiles = fs.readdirSync(bookSourceDir)
        .filter(file => file.endsWith('.md'));

      console.log(`  ${bookFolder} → ${bookSlug} (${pericopeFiles.length} pericopes)`);

      // Process each pericope
      for (const pericopeFile of pericopeFiles) {
        const sourceFile = path.join(bookSourceDir, pericopeFile);
        const targetFile = path.join(bookTargetDir, pericopeFile);

        totalFiles++;

        if (processPericopeFile(sourceFile, targetFile)) {
          successFiles++;
        } else {
          failedFiles++;
          console.error(`    ❌ Failed: ${pericopeFile}`);
        }
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Copy Summary');
  console.log('='.repeat(60));
  console.log(`Total files processed: ${totalFiles}`);
  console.log(`✅ Success: ${successFiles}`);
  console.log(`❌ Failed: ${failedFiles}`);
  console.log('='.repeat(60));

  if (successFiles === 2745) {
    console.log('\n🎉 All 2,745 pericope files copied successfully!');
  } else if (failedFiles > 0) {
    console.log(`\n⚠️  ${failedFiles} files failed to copy`);
  } else {
    console.log(`\n✅ Copy completed (${successFiles} files)`);
  }
}

// Run the script
try {
  copyBibleData();
} catch (error) {
  console.error('\n❌ Error during copy:');
  console.error(error);
  process.exit(1);
}
