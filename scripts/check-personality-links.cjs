#!/usr/bin/env node

/**
 * Comprehensive personality cross-reference checker
 *
 * This script:
 * 1. Reads ALL personality files
 * 2. Extracts ALL subsection headings in Contemporani sections
 * 3. Checks if each heading should be wiki-linked but isn't
 * 4. Provides exact recommendations for fixes
 */

const fs = require('fs');
const path = require('path');

const PERSONALITATI_DIR = path.resolve(__dirname, '../src/content/personalitati');

// Read all personality files
function loadAllPersonalities() {
  const files = fs.readdirSync(PERSONALITATI_DIR).filter(f => f.endsWith('.md'));
  return files.map(filename => {
    const slug = filename.replace('.md', '');
    const content = fs.readFileSync(path.join(PERSONALITATI_DIR, filename), 'utf-8');

    // Extract name from frontmatter
    const nameMatch = content.match(/^name:\s*"(.+?)"/m);
    const name = nameMatch ? nameMatch[1] : slug;

    return { slug, filename, content, name };
  });
}

// Extract Contemporani section
function extractContemporaniSection(content) {
  const normalized = content.replace(/\r\n/g, '\n');
  const sectionRegex = /## Contemporani și rude spirituale\n([\s\S]*?)(?=\n## |\n---|$)/;
  const match = normalized.match(sectionRegex);
  return match ? match[1] : '';
}

// Extract all subsection headings (### ...) from Contemporani
function extractSubsectionHeadings(contemporaniSection) {
  const headings = [];
  const lines = contemporaniSection.split('\n');

  for (const line of lines) {
    if (line.trim().startsWith('### ')) {
      const heading = line.trim().substring(4); // Remove "### "
      headings.push(heading);
    }
  }

  return headings;
}

// Check if a heading contains a wiki-link
function hasWikiLink(heading) {
  return /\[\[personalitati\//.test(heading);
}

// Extract the display text from a heading (with or without wiki-link)
function extractDisplayText(heading) {
  // If it has a wiki-link: [[personalitati/slug|Display Text]]
  const wikiLinkMatch = heading.match(/\[\[personalitati\/[^\]|]+\|([^\]]+)\]\]/);
  if (wikiLinkMatch) {
    return wikiLinkMatch[1];
  }

  // Otherwise, the whole heading is the display text
  return heading;
}

// Normalize a name for comparison (remove common prefixes, lowercase)
function normalizeName(name) {
  return name
    .replace(/^Sfântul\s+/i, '')
    .replace(/^Sfânta\s+/i, '')
    .replace(/^Proroc(ul)?\s+/i, '')
    .replace(/^Apostol(ul)?\s+/i, '')
    .replace(/^Regele\s+/i, '')
    .replace(/^Episcop(ul)?\s+/i, '')
    .toLowerCase()
    .trim();
}

// Find potential matches for a heading
function findPotentialMatches(headingText, allPersonalities, currentSlug) {
  const normalizedHeading = normalizeName(headingText);
  const matches = [];

  for (const pers of allPersonalities) {
    if (pers.slug === currentSlug) continue; // Skip self

    const normalizedName = normalizeName(pers.name);

    // Check if heading contains the personality name
    if (normalizedHeading.includes(normalizedName) || normalizedName.includes(normalizedHeading)) {
      matches.push(pers);
    }

    // Also check if the slug matches (e.g., "irineu" matches "Irineu de Lyon")
    if (normalizedHeading.includes(pers.slug)) {
      matches.push(pers);
    }
  }

  return [...new Set(matches)]; // Remove duplicates
}

// Main analysis
function analyzePersonalityLinks() {
  const personalities = loadAllPersonalities();
  const issues = [];

  console.log(`\n${'='.repeat(80)}`);
  console.log('COMPREHENSIVE PERSONALITY CROSS-REFERENCE ANALYSIS');
  console.log(`${'='.repeat(80)}\n`);
  console.log(`Analyzing ${personalities.length} personality files...\n`);

  for (const person of personalities) {
    const contemporaniSection = extractContemporaniSection(person.content);
    if (!contemporaniSection) continue;

    const headings = extractSubsectionHeadings(contemporaniSection);

    for (const heading of headings) {
      // Skip if already has a wiki-link
      if (hasWikiLink(heading)) continue;

      const displayText = extractDisplayText(heading);
      const matches = findPotentialMatches(displayText, personalities, person.slug);

      if (matches.length > 0) {
        for (const match of matches) {
          issues.push({
            file: person.filename,
            personName: person.name,
            heading: heading,
            matchedSlug: match.slug,
            matchedName: match.name,
            recommendation: `### [[personalitati/${match.slug}|${displayText}]]`
          });
        }
      }
    }
  }

  // Print results
  if (issues.length === 0) {
    console.log('✅ NO ISSUES FOUND! All personality mentions in Contemporani sections are properly wiki-linked.\n');
  } else {
    console.log(`❌ FOUND ${issues.length} POTENTIAL MISSING WIKI-LINKS:\n`);
    console.log(`${'='.repeat(80)}\n`);

    // Group by file
    const byFile = {};
    for (const issue of issues) {
      if (!byFile[issue.file]) byFile[issue.file] = [];
      byFile[issue.file].push(issue);
    }

    let count = 1;
    for (const [filename, fileIssues] of Object.entries(byFile)) {
      console.log(`${count}. FILE: ${filename}`);
      console.log(`   Person: ${fileIssues[0].personName}\n`);

      for (const issue of fileIssues) {
        console.log(`   ❌ Current:  ${issue.heading}`);
        console.log(`   ✅ Should be: ${issue.recommendation}`);
        console.log(`   → Links to: ${issue.matchedName} (${issue.matchedSlug}.md)\n`);
      }

      console.log(`${'-'.repeat(80)}\n`);
      count++;
    }
  }

  // Summary
  console.log(`${'='.repeat(80)}`);
  console.log('SUMMARY');
  console.log(`${'='.repeat(80)}`);
  console.log(`Total personality files: ${personalities.length}`);
  console.log(`Files with issues: ${Object.keys(issues.reduce((acc, i) => ({ ...acc, [i.file]: true }), {})).length}`);
  console.log(`Total missing wiki-links: ${issues.length}`);
  console.log(`${'='.repeat(80)}\n`);

  // Write to file
  const reportPath = path.resolve(__dirname, '../personality-links-report.txt');
  const reportContent = issues.map(i =>
    `${i.file}\t${i.heading}\t${i.recommendation}\t${i.matchedSlug}`
  ).join('\n');

  fs.writeFileSync(reportPath,
    `FILE\tCURRENT_HEADING\tRECOMMENDED_FIX\tMATCHED_SLUG\n${reportContent}`
  );

  console.log(`Report saved to: ${reportPath}\n`);

  return issues;
}

// Run the analysis
analyzePersonalityLinks();
