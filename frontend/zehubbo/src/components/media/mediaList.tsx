import type { MediaItem } from '../../types';
import MediaCard from './mediaCard';

type MediaListProps = {
  results: MediaItem[];
};

export default function MediaList({ results }: MediaListProps) {
  if (results.length === 0) return null;

  return (
    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
      {results.map((item, index) => (
        <MediaCard key={index} item={item} />
      ))}
    </div>
  );
}
