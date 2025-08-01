import type { SavedEntry } from '../../types';

type UserEntryCardProps = {
  entry: SavedEntry;
};

export default function UserEntryCard({ entry }: UserEntryCardProps) {
  return (
    <div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl shadow-md bg-gray-200">
      {entry.image_url ? (
        <img
          src={entry.image_url}
          alt={entry.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
          No image
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
        <p className="text-white text-sm font-semibold truncate">{entry.title}</p>
      </div>
    </div>
  );
}
