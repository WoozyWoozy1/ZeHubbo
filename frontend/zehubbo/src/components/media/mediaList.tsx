import type { MediaItem } from '../../types';
import MediaCard from './mediaCard';
import use_saved_entries from '../../hooks/use_saved_entries';

type MediaListProps = {
  results: MediaItem[];
  onCardClick: () => void;
};

export default function MediaList({ results, onCardClick }: MediaListProps) {
  const { add_entry } = use_saved_entries();

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
    add_entry(saved);
    onCardClick(); // hides the dropdown
  };

  if (results.length === 0) return null;

  return (
    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
      {results.map((item, index) => (
        <MediaCard key={index} item={item} onClick={() => handleSaveClick(item)} />
      ))}
    </div>
  );
}
