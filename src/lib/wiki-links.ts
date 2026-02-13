/**
 * Resolves Obsidian-style wiki-links to standard markdown links.
 *   [[slug|display text]] → [display text](/teme/slug)
 *   [[slug]]              → [slug](/teme/slug)
 */
export function resolveWikiLinks(md: string): string {
  return md
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '[$2](/teme/$1)')
    .replace(/\[\[([^\]]+)\]\]/g, '[$1](/teme/$1)');
}
