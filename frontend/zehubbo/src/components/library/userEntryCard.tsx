import type { SavedEntry } from '../../types';

type UserEntryCardProps = {
  entry: SavedEntry;
};

export default function UserEntryCard({ entry }: UserEntryCardProps) {
  return (
    <div className="relative w-full max-w-[220px] aspect-[2/3] overflow-hidden rounded-2xl shadow-lg bg-gray-300 mx-auto">
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

      {/* Overlay at bottom left */}
      <div className="absolute bottom-0 left-0 w-full px-3 py-2 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-white text-sm font-semibold truncate">{entry.title}</p>
      </div>
    </div>
  );
}
