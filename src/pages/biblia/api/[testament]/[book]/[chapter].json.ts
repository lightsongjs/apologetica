import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { BOOKS_METADATA } from '../../../../../lib/bible-books';
import { formatVerses } from '../../../../../lib/bible-format';

export const getStaticPaths: GetStaticPaths = async () => {
  const allPericopes = await getCollection('biblia');
  const paths = [];

  for (const [testamentKey, books] of Object.entries(BOOKS_METADATA)) {
    const testamentSlug = testamentKey === 'VT' ? 'vechiul-testament' : 'noul-testament';

    for (const book of books) {
      for (let chapter = 1; chapter <= book.chapters; chapter++) {
        const chapterPericopes = allPericopes
          .filter(
            (p) =>
              p.data.testament === (testamentKey === 'VT' ? 'OT' : 'NT') &&
              p.data.book_romanian === book.name_ro &&
              p.data.chapter === chapter
          )
          .sort((a, b) => a.data.pericope - b.data.pericope);

        paths.push({
          params: {
            testament: testamentSlug,
            book: book.slug,
            chapter: chapter.toString(),
          },
          props: {
            bookName: book.name_ro,
            bookSlug: book.slug,
            testament: testamentSlug,
            chapterNum: chapter,
            totalChapters: book.chapters,
            temaSlug: book.tema_slug || null,
            chapterPericopes,
          },
        });
      }
    }
  }

  return paths;
};

export const GET: APIRoute = async ({ props }) => {
  const { bookName, bookSlug, testament, chapterNum, totalChapters, temaSlug, chapterPericopes } =
    props as any;

  const pericopes = chapterPericopes.map((p: any) => ({
    title: p.data.pericope_title_ro,
    versesStart: p.data.verses_start,
    versesEnd: p.data.verses_end,
    versesHtml: formatVerses(p.body ?? ''),
  }));

  return new Response(
    JSON.stringify({
      bookName,
      bookSlug,
      testament,
      chapterNum,
      totalChapters,
      temaSlug,
      pericopes,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
