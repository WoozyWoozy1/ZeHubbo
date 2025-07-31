export async function search_Media(query, category) {
  const url = new URL('http://localhost:8000/search');
  url.searchParams.set('query', query);
  url.searchParams.set('category', category);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Search failed: ${res.statusText}`);
  }

  return res.json(); // should be an array of MediaItem objects
}
