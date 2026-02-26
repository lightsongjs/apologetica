/**
 * Resolves Obsidian-style wiki-links to standard markdown links.
 *   [[slug|display text]]              → [display text](/teme/slug)
 *   [[slug]]                           → [slug](/teme/slug)
 *   [[personalitati:slug|display]]     → [display](/personalitati/slug)
 *   [[personalitati:slug]]             → [slug](/personalitati/slug)
 */
export function resolveWikiLinks(md: string): string {
  return md
    // Handle personalitati links with display text
    .replace(/\[\[personalitati:([^\]|]+)\|([^\]]+)\]\]/g, '[$2](/personalitati/$1)')
    // Handle personalitati links without display text
    .replace(/\[\[personalitati:([^\]]+)\]\]/g, '[$1](/personalitati/$1)')
    // Handle locuri links with display text
    .replace(/\[\[locuri:([^\]|]+)\|([^\]]+)\]\]/g, '[$2](/locuri/$1)')
    // Handle locuri links without display text
    .replace(/\[\[locuri:([^\]]+)\]\]/g, '[$1](/locuri/$1)')
    // Handle teme links with display text
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '[$2](/teme/$1)')
    // Handle teme links without display text
    .replace(/\[\[([^\]]+)\]\]/g, '[$1](/teme/$1)');
}
