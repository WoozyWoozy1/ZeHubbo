import { useState } from 'react';
import SearchBar from './components/search/searchBar';
import MediaList from './components/media/mediaList';
import { search_media } from './api/search_media';
import type { MediaItem } from './types';

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (newQuery: string, newCategory: string) => {
    setQuery(newQuery);
    setCategory(newCategory);
    try {
      const data = await search_media(newQuery, newCategory);
      setResults(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Search failed');
      setResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-10">
      <h1 className="text-3xl font-bold mb-6">ZeHubbo</h1>
      <div className="relative w-full max-w-3xl">
        <SearchBar onSearch={handleSearch} />
        <MediaList results={results} />
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
