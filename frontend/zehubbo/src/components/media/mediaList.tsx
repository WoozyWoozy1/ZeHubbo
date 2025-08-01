import type { MediaItem } from '../../types';
import MediaCard from './mediaCard';

type MediaListProps = {
  results: MediaItem[];
  onCardClick: () => void;
};

export default function MediaList({ results, onCardClick }: MediaListProps) {
  if (results.length === 0) return null;

  return (
    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
      {results.map((item, index) => (
        <div key={index} onClick={onCardClick}>
          <MediaCard item={item} />
        </div>
      ))}
    </div>
  );
}
