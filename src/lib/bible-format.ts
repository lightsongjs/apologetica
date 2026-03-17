/**
 * Shared Bible verse formatting utilities.
 * Used by both the chapter page (SSG) and the JSON API endpoint.
 */

/**
 * Format verse body: remove navigation, heading, and format verse numbers.
 * Transforms raw pericope markdown body into display-ready HTML.
 */
export function formatVerses(body: string): string {
  let cleaned = body;

  // Remove wiki-link navigation lines
  cleaned = cleaned.replace(/^[←→]?\s*\[\[.*?\]\].*$/gm, '');

  // Remove English H1 heading
  cleaned = cleaned.replace(/^#\s+.+$/m, '');

  // Remove extra blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Format verse numbers: "1. Text" → "<sup>1</sup> Text"
  cleaned = cleaned.replace(
    /^(\d+)\.\s+/gm,
    '<sup class="font-semibold mr-1 opacity-60">$1</sup> '
  );

  // Trim whitespace
  cleaned = cleaned.trim();

  return cleaned;
}

/**
 * Filter out verses that have already been displayed (to handle pericope overlaps).
 * @param body - Raw markdown body with verses
 * @param displayedVerses - Set of verse numbers already displayed
 * @returns Filtered body with duplicate verses removed
 */
export function filterDuplicateVerses(body: string, displayedVerses: Set<number>): string {
  const lines = body.split('\n');
  const filteredLines: string[] = [];

  for (const line of lines) {
    // Check if line starts with a verse number (e.g., "1. Text" or "12. Text")
    const verseMatch = line.match(/^(\d+)\.\s+/);

    if (verseMatch) {
      const verseNum = parseInt(verseMatch[1], 10);

      // Only include if not already displayed
      if (!displayedVerses.has(verseNum)) {
        filteredLines.push(line);
        displayedVerses.add(verseNum);
      }
    } else {
      // Keep non-verse lines (blank lines, paragraphs, etc.)
      filteredLines.push(line);
    }
  }

  return filteredLines.join('\n');
}
