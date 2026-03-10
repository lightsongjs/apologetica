import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const conversations = await getCollection('conversations');
  const teme = await getCollection('teme');
  const personalitati = await getCollection('personalitati');
  const locuri = await getCollection('locuri');

  const denominationLabels: Record<string, string> = {
    'atheist': 'Ateu',
    'baptist': 'Baptist',
    'martorii-lui-iehova': 'Martor al lui Iehova',
  };

  // Transform data to only include what's needed for search
  const searchData = {
    conversations: conversations.map(conv => ({
      id: conv.id,
      title: conv.data.title,
      denomination: conv.data.denomination,
    })),
    teme: teme.map(tema => ({
      id: tema.id,
      title: tema.data.title,
      summary: tema.data.summary,
    })),
    personalitati: personalitati.map(pers => ({
      id: pers.id,
      name: pers.data.name,
      title: pers.data.title,
      image: pers.data.image,
    })),
    locuri: locuri.map(loc => ({
      id: loc.id,
      name: loc.data.name,
      title: loc.data.title,
    })),
    denominationLabels,
  };

  return new Response(JSON.stringify(searchData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
