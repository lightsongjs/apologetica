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

  // Format verse lines: "1. Text" → "<span data-v="1"><sup>1</sup> Text</span>"
  // (one verse per line; data-v lets search results jump to the verse via #v1)
  cleaned = cleaned.replace(
    /^(\d+)\.\s+(.*)$/gm,
    '<span class="verse" data-v="$1"><sup class="font-semibold mr-1 opacity-60">$1</sup> $2</span>'
  );

  // Trim whitespace
  cleaned = cleaned.trim();

  return cleaned;
}
