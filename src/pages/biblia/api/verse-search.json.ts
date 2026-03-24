import { getCollection } from 'astro:content';
import { BOOKS_METADATA } from '../../../lib/bible-books';

// Build a compact verse search index: [{b,c,v,t}]
// b = book slug, c = chapter, v = verse number, t = verse text (plain)
export async function GET() {
  const allPericopes = await getCollection('biblia');

  // Build book lookup: book_romanian → { slug, testament }
  const bookLookup: Record<string, { slug: string; testament: string }> = {};
  for (const testament of ['VT', 'NT'] as const) {
    for (const book of BOOKS_METADATA[testament]) {
      bookLookup[book.name_ro] = {
        slug: book.slug,
        testament: testament === 'VT' ? 'vechiul-testament' : 'noul-testament',
      };
    }
  }

  const verses: { b: string; c: number; v: number; t: string; n: string }[] = [];

  for (const pericope of allPericopes) {
    const bookRo = pericope.data.book_romanian;
    const bookInfo = bookLookup[bookRo];
    if (!bookInfo) continue;

    const chapter = pericope.data.chapter;
    const body = pericope.body || '';

    // Parse "1. Text here" format — each line starting with number + dot
    const lines = body.split('\n');
    for (const line of lines) {
      const match = line.match(/^(\d+)\.\s+(.+)/);
      if (match) {
        const verseNum = parseInt(match[1], 10);
        // Strip any remaining markdown/wiki-links
        const text = match[2]
          .replace(/\[\[.*?\|(.*?)\]\]/g, '$1')
          .replace(/\[\[(.*?)\]\]/g, '$1')
          .replace(/[*_`]/g, '')
          .trim();
        if (text) {
          verses.push({
            b: bookInfo.slug,
            c: chapter,
            v: verseNum,
            t: text,
            n: bookRo,
          });
        }
      }
    }
  }

  // Sort by book code, chapter, verse
  const slugOrder: Record<string, number> = {};
  for (const testament of ['VT', 'NT'] as const) {
    for (const book of BOOKS_METADATA[testament]) {
      slugOrder[book.slug] = book.code;
    }
  }

  verses.sort((a, b) => {
    const codeA = slugOrder[a.b] || 0;
    const codeB = slugOrder[b.b] || 0;
    if (codeA !== codeB) return codeA - codeB;
    if (a.c !== b.c) return a.c - b.c;
    return a.v - b.v;
  });

  return new Response(JSON.stringify(verses), {
    headers: { 'Content-Type': 'application/json' },
  });
}
