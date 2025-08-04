import { useState, useRef, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import SearchBar from './components/search/searchBar';
import MediaList from './components/media/mediaList';
import SettingsModal from './components/settings/settingsModal';
import SettingsButton from './components/settings/settingsButton';
import DarkModeToggle from './components/settings/darkModeToggle';
import { useSavedEntriesContext, SavedEntriesProvider } from './hooks/savedEntriesContext';
import { search_media } from './api/search_media';
import type { MediaItem, SavedEntry } from './types';
import CategoryTabs from './components/library/categoryTabs';
import StatusTabs from './components/library/statusTabs';
import UserEntryCard from './components/library/userEntryCard';
import EntryModal from './components/library/entryModal';
import EntrySearchBar from './components/library/entrySearchBar';

function InnerApp() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeCategory, setActiveCategory] = useState('movie');
  const [activeStatus, setActiveStatus] = useState('default');
  const [selectedEntry, setSelectedEntry] = useState<SavedEntry | null>(null);
  const [entrySearchQuery, setEntrySearchQuery] = useState('');

  const { savedEntries } = useSavedEntriesContext();
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
    const blob = new Blob([JSON.stringify(savedEntries, null, 2)], {
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

  const filteredEntries = savedEntries
    .filter((entry: SavedEntry) => {
      const categoryMatch = entry.media_type.toLowerCase() === activeCategory;
      const statusMatch = entry.userStatus.toLowerCase() === activeStatus;
      const searchMatch = entry.title.toLowerCase().includes(entrySearchQuery.toLowerCase());
      return categoryMatch && statusMatch && searchMatch;
    })
    .sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0) || a.title.localeCompare(b.title));

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white flex flex-col items-center justify-start p-10 relative transition-colors">
      <DarkModeToggle />
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
            setEntrySearchQuery('');
          }}
        />
        <StatusTabs
          selected={activeStatus}
          onSelect={(status) => {
            setActiveStatus(status);
            setEntrySearchQuery('');
          }}
          options={getStatusOptions(activeCategory)}
        />

        <EntrySearchBar
          value={entrySearchQuery}
          onChange={setEntrySearchQuery}
          placeholder={`Search ${activeCategory} - ${activeStatus}`}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
          {filteredEntries.map((entry, index) => (
            <UserEntryCard
              key={index}
              entry={entry}
              onClick={() => setSelectedEntry(entry)}
            />
          ))}
        </div>
      </div>

      {selectedEntry && (
        <EntryModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default function App() {
  return (
    <SavedEntriesProvider>
      <InnerApp />
      <Toaster position="top-right" />
    </SavedEntriesProvider>
  );
}
