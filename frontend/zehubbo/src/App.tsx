import { useState, useEffect, useRef } from 'react';
import SearchBar from './components/search/searchBar';
import MediaList from './components/media/mediaList';
import { search_media } from './api/search_media';
import type { MediaItem } from './types';

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (newQuery: string, newCategory: string) => {
    setQuery(newQuery);
    setCategory(newCategory);
    try {
      const data = await search_media(newQuery, newCategory);
      setResults(data);
      setError(null);
      setShowResults(true); // show results on search
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Search failed');
      setResults([]);
      setShowResults(false);
    }
  };

  const handleCardClick = () => {
    setShowResults(false); // hide dropdown on card click
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-10">
      <h1 className="text-3xl font-bold mb-6">ZeHubbo</h1>
      <div ref={containerRef} className="relative w-full max-w-3xl">
        <SearchBar onSearch={handleSearch} />
        {showResults && <MediaList results={results} onCardClick={handleCardClick} />}
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
