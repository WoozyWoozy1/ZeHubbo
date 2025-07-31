import type { MediaItem } from '../../types';

interface SearchResultCardProps {
  item: MediaItem;
}

export default function SearchResultCard({ item }: SearchResultCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-xl shadow-sm">
      <img
        src={item.image_url || '/placeholder.png'}
        alt={item.title}
        className="w-16 h-24 object-cover rounded"
      />
      <div>
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.media_type}</p>
      </div>
    </div>
  );
}
