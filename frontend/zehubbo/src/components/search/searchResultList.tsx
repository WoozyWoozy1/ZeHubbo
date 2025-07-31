import type { MediaItem } from '../../types';
import SearchResultCard from './searchResultCard';

interface SearchResultListProps {
  results: MediaItem[];
}

export default function SearchResultList({ results }: SearchResultListProps) {
  return (
    <div className="mt-6 grid gap-4">
      {results.map((item) => (
        <SearchResultCard key={item.id} item={item} />
      ))}
    </div>
  );
}
