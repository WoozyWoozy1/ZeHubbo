import type { MediaItem } from '../types';

export async function search_media(query: string, category: string): Promise<MediaItem[]> {
  const url = new URL('http://localhost:8000/search');
  url.searchParams.set('query', query);
  url.searchParams.set('category', category);

  const res = await fetch(url);
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<MediaItem[]>;
}