import { useState, useRef, useEffect } from 'react';
import SearchBar from './components/search/searchBar';
import MediaList from './components/media/mediaList';
import SettingsModal from './components/settings/settingsModal';
import SettingsButton from './components/settings/settingsButton';
import use_saved_entries from './hooks/use_saved_entries';
import { search_media } from './api/search_media';
import type { MediaItem, SavedEntry } from './types';
import CategoryTabs from './components/library/categoryTabs';
import StatusTabs from './components/library/statusTabs';
import UserEntryCard from './components/library/userEntryCard';

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeCategory, setActiveCategory] = useState('movie'); // default to movie
  const [activeStatus, setActiveStatus] = useState('default');

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

  const getStatusOptions = (category: string): string[] => {
    const defaults: Record<
      'movie' | 'show' | 'anime' | 'manga' | 'light novel' | 'visual novel' | 'book' | 'game',
      string[]
    > = {
      movie: ['Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch'],
      show: ['Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch'],
      anime: ['Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch'],
      manga: ['Reading', 'Completed', 'On Hold', 'Dropped', 'Plan to Read'],
      'light novel': ['Reading', 'Completed', 'On Hold', 'Dropped', 'Plan to Read'],
      'visual novel': ['Reading', 'Completed', 'On Hold', 'Dropped', 'Plan to Read'],
      book: ['Reading', 'Completed', 'On Hold', 'Dropped', 'Plan to Read'],
      game: ['Playing', 'Completed', 'On Hold', 'Dropped', 'Plan to Play'],
    };

    if (category in defaults) {
      return ['Default', ...defaults[category as keyof typeof defaults]];
    }

    return ['Default'];
  };

  const filteredEntries = saved_entries.filter((entry: SavedEntry) => {
    const categoryMatch = entry.media_type.toLowerCase() === activeCategory;
    const statusMatch = entry.userStatus.toLowerCase() === activeStatus;
    return categoryMatch && statusMatch;
  });

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

      <div className="mt-10 w-full max-w-5xl">
        <CategoryTabs
          selected={activeCategory}
          onSelect={(category) => {
            setActiveCategory(category);
            const firstStatus = getStatusOptions(category)[0].toLowerCase();
            setActiveStatus(firstStatus);
          }}
        />
        <StatusTabs
          selected={activeStatus}
          onSelect={setActiveStatus}
          options={getStatusOptions(activeCategory)}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
          {filteredEntries.map((entry, index) => (
            <UserEntryCard key={index} entry={entry} />
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
