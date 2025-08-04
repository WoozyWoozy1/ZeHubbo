import type { MediaItem } from '../../types';
import MediaCard from './mediaCard';
import { useSavedEntriesContext } from '../../hooks/savedEntriesContext';

type MediaListProps = {
  results: MediaItem[];
  onCardClick: () => void;
};

export default function MediaList({ results, onCardClick }: MediaListProps) {
  const { addEntry } = useSavedEntriesContext();

  const handleSaveClick = (item: MediaItem) => {
    const saved = {
      ...item,
      userStatus: 'default',
      userRating: 0,
      userReview: '',
      userNotes: '',
      favorite: false,
      savedAt: new Date().toISOString(),
    };
    addEntry(saved);
    onCardClick(); // hides the dropdown
  };

  if (results.length === 0) return null;

  return (
    <div className="absolute z-40 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto animate-fade-in">
      {results.map((item, index) => (
        <MediaCard key={index} item={item} onClick={() => handleSaveClick(item)} />
      ))}
    </div>
  );
}
