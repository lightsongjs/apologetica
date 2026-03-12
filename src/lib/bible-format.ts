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
    '<sup class="text-primary font-semibold mr-1">$1</sup> '
  );

  // Trim whitespace
  cleaned = cleaned.trim();

  return cleaned;
}
