import { useState, useRef, useEffect } from 'react';
import SearchBar from './components/search/searchBar';
import MediaList from './components/media/mediaList';
import SettingsModal from './components/settings/settingsModal';
import SettingsButton from './components/settings/settingsButton';
import use_saved_entries from './hooks/use_saved_entries';
import { search_media } from './api/search_media';
import type { MediaItem } from './types';
import CategoryTabs from './components/library/categoryTabs';

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeCategory, setActiveCategory] = useState('global');

  const { saved_entries } = use_saved_entries();
  const searchAreaRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (newQuery: string, newCategory: string) => {
    setQuery(newQuery);
    setCategory(newCategory);
    try {
      const data = await search_media(newQuery, newCategory);
      setResults(data);
      setError(null);
      setShowResults(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Search failed');
      setResults([]);
      setShowResults(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(saved_entries, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zehubbo_saved_entries.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchAreaRef.current && !searchAreaRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-10 relative">
      <h1 className="text-3xl font-bold mb-6">ZeHubbo</h1>

      <SettingsButton onClick={() => setShowSettings(true)} />
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onDownload={handleDownload}
      />

      <div className="relative w-full max-w-3xl" ref={searchAreaRef}>
        <SearchBar onSearch={handleSearch} />
        {showResults && (
          <MediaList results={results} onCardClick={() => setShowResults(false)} />
        )}
      </div>

      <div className="mt-8 w-full max-w-4xl">
        <CategoryTabs selected={activeCategory} onSelect={setActiveCategory} />
        {/* status tabs and filtered results will go here next */}
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
