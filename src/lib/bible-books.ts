/**
 * Orthodox Bible Book Metadata Registry
 * Complete catalog of all 71 canonical books (44 OT + 27 NT)
 * including deuterocanonical books from the Septuagint tradition
 */

export interface BookMetadata {
  code: number;
  slug: string;
  name_ro: string;
  name_en: string;
  chapters: number;
  tema_slug?: string;
}

export const BOOKS_METADATA: Record<'VT' | 'NT', BookMetadata[]> = {
  VT: [
    // Pentateuhul (Torah / Law)
    { code: 1, slug: 'facerea', name_ro: 'Facerea', name_en: 'Genesis', chapters: 50, tema_slug: 'cartea-facerea' },
    { code: 2, slug: 'iesirea', name_ro: 'Ieșirea', name_en: 'Exodus', chapters: 40, tema_slug: 'cartea-iesirea' },
    { code: 3, slug: 'leviticul', name_ro: 'Leviticul', name_en: 'Leviticus', chapters: 27, tema_slug: 'cartea-leviticul' },
    { code: 4, slug: 'numerii', name_ro: 'Numerii', name_en: 'Numbers', chapters: 36, tema_slug: 'cartea-numeri' },
    { code: 5, slug: 'deuteronomul', name_ro: 'Deuteronomul', name_en: 'Deuteronomy', chapters: 34, tema_slug: 'cartea-deuteronom' },

    // Cărți istorice (Historical Books)
    { code: 6, slug: 'iosua-navi', name_ro: 'Iosua Navi', name_en: 'Joshua', chapters: 24, tema_slug: 'cartea-iosua' },
    { code: 7, slug: 'judecatori', name_ro: 'Judecători', name_en: 'Judges', chapters: 21, tema_slug: 'cartea-judecatorilor' },
    { code: 8, slug: 'rut', name_ro: 'Rut', name_en: 'Ruth', chapters: 4, tema_slug: 'cartea-rut' },
    { code: 9, slug: '1-regi', name_ro: 'I Regi', name_en: '1 Samuel', chapters: 31, tema_slug: 'cartea-1-samuel' },
    { code: 10, slug: '2-regi', name_ro: 'II Regi', name_en: '2 Samuel', chapters: 24, tema_slug: 'cartea-2-samuel' },
    { code: 13, slug: '1-paralipomena', name_ro: 'I Paralipomena', name_en: '1 Chronicles', chapters: 29, tema_slug: 'cartea-1-cronici' },
    { code: 14, slug: '2-paralipomena', name_ro: 'II Paralipomena', name_en: '2 Chronicles', chapters: 36, tema_slug: 'cartea-2-cronici' },
    { code: 15, slug: '1-ezdra', name_ro: 'I Ezdra', name_en: 'Ezra', chapters: 10, tema_slug: 'cartea-ezra' },
    { code: 16, slug: 'neemia', name_ro: 'Neemia', name_en: 'Nehemiah', chapters: 13, tema_slug: 'cartea-neemia' },
    { code: 17, slug: 'esterei', name_ro: 'Esterei', name_en: 'Esther', chapters: 10, tema_slug: 'cartea-ester' },

    // Cărți poetice și de înțelepciune (Poetic & Wisdom Books)
    { code: 18, slug: 'iov', name_ro: 'Iov', name_en: 'Job', chapters: 42, tema_slug: 'cartea-iov' },
    { code: 19, slug: 'psalmi', name_ro: 'Psalmi', name_en: 'Psalms', chapters: 150, tema_slug: 'psalmi' },
    { code: 20, slug: 'pilde', name_ro: 'Pilde', name_en: 'Proverbs', chapters: 31, tema_slug: 'proverbe' },
    { code: 21, slug: 'ecclesiastul', name_ro: 'Ecclesiastul', name_en: 'Ecclesiastes', chapters: 12, tema_slug: 'ecclesiastul' },
    { code: 22, slug: 'cantari', name_ro: 'Cântări', name_en: 'Song of Solomon', chapters: 8, tema_slug: 'cantarea-cantarilor' },

    // Profeți mari (Major Prophets)
    { code: 23, slug: 'isaia', name_ro: 'Isaia', name_en: 'Isaiah', chapters: 66, tema_slug: 'cartea-isaia' },
    { code: 24, slug: 'ieremia', name_ro: 'Ieremia', name_en: 'Jeremiah', chapters: 52, tema_slug: 'cartea-ieremia' },
    { code: 25, slug: 'plangeri', name_ro: 'Plângeri', name_en: 'Lamentations', chapters: 5, tema_slug: 'plangerile-lui-ieremia' },
    { code: 26, slug: 'iezechiel', name_ro: 'Iezechiel', name_en: 'Ezekiel', chapters: 48, tema_slug: 'cartea-ezechiel' },
    { code: 27, slug: 'daniel', name_ro: 'Daniel', name_en: 'Daniel', chapters: 14, tema_slug: 'cartea-daniel' },

    // Profeți mici (Minor Prophets)
    { code: 28, slug: 'osea', name_ro: 'Osea', name_en: 'Hosea', chapters: 14, tema_slug: 'cartea-osea' },
    { code: 29, slug: 'amos', name_ro: 'Amos', name_en: 'Amos', chapters: 9, tema_slug: 'cartea-amos' },
    { code: 30, slug: 'miheia', name_ro: 'Miheia', name_en: 'Micah', chapters: 7, tema_slug: 'cartea-miheia' },
    { code: 31, slug: 'ioil', name_ro: 'Ioil', name_en: 'Joel', chapters: 3, tema_slug: 'cartea-ioil' },
    { code: 32, slug: 'avdie', name_ro: 'Avdie', name_en: 'Obadiah', chapters: 1, tema_slug: 'cartea-avdie' },
    { code: 33, slug: 'iona', name_ro: 'Iona', name_en: 'Jonah', chapters: 4, tema_slug: 'cartea-iona' },
    { code: 34, slug: 'naum', name_ro: 'Naum', name_en: 'Nahum', chapters: 3, tema_slug: 'cartea-naum' },
    { code: 35, slug: 'avacum', name_ro: 'Avacum', name_en: 'Habakkuk', chapters: 3, tema_slug: 'cartea-avacum' },
    { code: 36, slug: 'sofonie', name_ro: 'Sofonie', name_en: 'Zephaniah', chapters: 3, tema_slug: 'cartea-tefania' },
    { code: 37, slug: 'agheu', name_ro: 'Agheu', name_en: 'Haggai', chapters: 2, tema_slug: 'cartea-hagai' },
    { code: 38, slug: 'zaharia', name_ro: 'Zaharia', name_en: 'Zechariah', chapters: 14, tema_slug: 'cartea-zaharia' },
    { code: 39, slug: 'maleahi', name_ro: 'Maleahi', name_en: 'Malachi', chapters: 4, tema_slug: 'cartea-maleahi' },

    // Cărți deuterocanonice (Deuterocanonical Books)
    { code: 40, slug: 'tobit', name_ro: 'Tobit', name_en: 'Tobit', chapters: 14, tema_slug: 'cartea-tobit' },
    { code: 41, slug: 'iudita', name_ro: 'Iudita', name_en: 'Judith', chapters: 16, tema_slug: 'cartea-iudita' },
    { code: 42, slug: 'baruh', name_ro: 'Baruh', name_en: 'Baruch', chapters: 6, tema_slug: 'cartea-baruh' },
    { code: 45, slug: 'solomon', name_ro: 'Solomon', name_en: 'Wisdom of Solomon', chapters: 19, tema_slug: 'cartea-intelepciunii-lui-solomon' },
    { code: 46, slug: 'ecclesiasticul', name_ro: 'Ecclesiasticul', name_en: 'Sirach', chapters: 51, tema_slug: 'cartea-intelepciunii-lui-isus-sirah' },
    { code: 48, slug: '1-macabei', name_ro: 'I Macabei', name_en: '1 Maccabees', chapters: 16, tema_slug: 'cartea-1-macabei' },
    { code: 49, slug: '2-macabei', name_ro: 'II Macabei', name_en: '2 Maccabees', chapters: 15, tema_slug: 'cartea-2-macabei' },
  ],

  NT: [
    // Evanghelii (Gospels)
    { code: 52, slug: 'matei', name_ro: 'Matei', name_en: 'Matthew', chapters: 28, tema_slug: 'evanghelia-matei' },
    { code: 53, slug: 'marcu', name_ro: 'Marcu', name_en: 'Mark', chapters: 16, tema_slug: 'evanghelia-marcu' },
    { code: 54, slug: 'luca', name_ro: 'Luca', name_en: 'Luke', chapters: 24, tema_slug: 'evanghelia-luca' },
    { code: 55, slug: 'ioan', name_ro: 'Ioan', name_en: 'John', chapters: 21, tema_slug: 'evanghelia-ioan' },

    // Faptele Apostolilor (Acts)
    { code: 56, slug: 'faptele-apostolilor', name_ro: 'Faptele Apostolilor', name_en: 'Acts', chapters: 28, tema_slug: 'faptele-apostolilor' },

    // Epistole pauline (Pauline Epistles)
    { code: 57, slug: 'romani', name_ro: 'Romani', name_en: 'Romans', chapters: 16, tema_slug: 'epistola-romani' },
    { code: 58, slug: '1-corinteni', name_ro: 'I Corinteni', name_en: '1 Corinthians', chapters: 16, tema_slug: 'prima-epistola-corinteni' },
    { code: 59, slug: '2-corinteni', name_ro: 'II Corinteni', name_en: '2 Corinthians', chapters: 13, tema_slug: 'a-doua-epistola-corinteni' },
    { code: 60, slug: 'galateni', name_ro: 'Galateni', name_en: 'Galatians', chapters: 6, tema_slug: 'epistola-galateni' },
    { code: 61, slug: 'efeseni', name_ro: 'Efeseni', name_en: 'Ephesians', chapters: 6, tema_slug: 'epistola-efeseni' },
    { code: 62, slug: 'filipeni', name_ro: 'Filipeni', name_en: 'Philippians', chapters: 4, tema_slug: 'epistola-filipeni' },
    { code: 63, slug: 'coloseni', name_ro: 'Coloseni', name_en: 'Colossians', chapters: 4, tema_slug: 'epistola-coloseni' },
    { code: 64, slug: '1-tesaloniceni', name_ro: 'I Tesaloniceni', name_en: '1 Thessalonians', chapters: 5, tema_slug: 'prima-epistola-tesaloniceni' },
    { code: 65, slug: '2-tesaloniceni', name_ro: 'II Tesaloniceni', name_en: '2 Thessalonians', chapters: 3, tema_slug: 'a-doua-epistola-tesaloniceni' },
    { code: 66, slug: '1-timotei', name_ro: 'I Timotei', name_en: '1 Timothy', chapters: 6, tema_slug: 'prima-epistola-timotei' },
    { code: 67, slug: '2-timotei', name_ro: 'II Timotei', name_en: '2 Timothy', chapters: 4, tema_slug: 'a-doua-epistola-timotei' },
    { code: 68, slug: 'tit', name_ro: 'Tit', name_en: 'Titus', chapters: 3, tema_slug: 'epistola-tit' },
    { code: 69, slug: 'filimon', name_ro: 'Filimon', name_en: 'Philemon', chapters: 1, tema_slug: 'epistola-filimon' },

    // Evrei (Hebrews)
    { code: 70, slug: 'evrei', name_ro: 'Evrei', name_en: 'Hebrews', chapters: 13, tema_slug: 'epistola-evrei' },

    // Epistole generale (General Epistles)
    { code: 71, slug: 'iacov', name_ro: 'Iacov', name_en: 'James', chapters: 5, tema_slug: 'epistola-iacov' },
    { code: 72, slug: '1-petru', name_ro: 'I Petru', name_en: '1 Peter', chapters: 5, tema_slug: 'prima-epistola-petru' },
    { code: 73, slug: '2-petru', name_ro: 'II Petru', name_en: '2 Peter', chapters: 3, tema_slug: 'a-doua-epistola-petru' },
    { code: 74, slug: '1-ioan', name_ro: 'I Ioan', name_en: '1 John', chapters: 5, tema_slug: 'prima-epistola-ioan' },
    { code: 75, slug: '2-ioan', name_ro: 'II Ioan', name_en: '2 John', chapters: 1, tema_slug: 'a-doua-epistola-ioan' },
    { code: 76, slug: '3-ioan', name_ro: 'III Ioan', name_en: '3 John', chapters: 1, tema_slug: 'a-treia-epistola-ioan' },
    { code: 77, slug: 'iuda', name_ro: 'Iuda', name_en: 'Jude', chapters: 1, tema_slug: 'epistola-iuda' },

    // Apocalipsa (Revelation)
    { code: 78, slug: 'apocalipsa', name_ro: 'Apocalipsa', name_en: 'Revelation', chapters: 22, tema_slug: 'apocalipsa' },
  ],
};

/**
 * Get book metadata by slug
 */
export function getBookBySlug(testament: 'VT' | 'NT', slug: string): BookMetadata | undefined {
  return BOOKS_METADATA[testament].find((book) => book.slug === slug);
}

/**
 * Get all books for a testament
 */
export function getBooksByTestament(testament: 'VT' | 'NT'): BookMetadata[] {
  return BOOKS_METADATA[testament];
}

/**
 * Map testament code from data (OT/NT) to routing slug (VT/NT)
 */
export function getTestamentSlug(code: 'OT' | 'NT'): 'VT' | 'NT' {
  return code === 'OT' ? 'VT' : 'NT';
}

/**
 * Map testament slug (vechiul-testament/noul-testament) to short code (VT/NT)
 */
export function getTestamentCode(slug: string): 'VT' | 'NT' {
  return slug === 'vechiul-testament' ? 'VT' : 'NT';
}

/**
 * Get testament display name in Romanian
 */
export function getTestamentName(testament: 'VT' | 'NT'): string {
  return testament === 'VT' ? 'Vechiul Testament' : 'Noul Testament';
}

/**
 * Get total count of books in each testament
 */
export const TESTAMENT_STATS = {
  VT: BOOKS_METADATA.VT.length,  // 44 books
  NT: BOOKS_METADATA.NT.length,  // 27 books
  total: BOOKS_METADATA.VT.length + BOOKS_METADATA.NT.length,  // 71 books
};
