import { useState } from 'react';
import type { SavedEntry } from '../../types';
import use_saved_entries from '../../hooks/use_saved_entries';

type UserEntryCardProps = {
  entry: SavedEntry;
  onClick?: () => void;
};

const getStatusOptions = (mediaType: string): string[] => {
  const map: Record<string, string[]> = {
    movie: ['Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch'],
    show: ['Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch'],
    anime: ['Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch'],
    manga: ['Reading', 'Completed', 'On Hold', 'Dropped', 'Plan to Read'],
    'light novel': ['Reading', 'Completed', 'On Hold', 'Dropped', 'Plan to Read'],
    'visual novel': ['Reading', 'Completed', 'On Hold', 'Dropped', 'Plan to Read'],
    book: ['Reading', 'Completed', 'On Hold', 'Dropped', 'Plan to Read'],
    game: ['Playing', 'Completed', 'On Hold', 'Dropped', 'Plan to Play'],
  };

  return map[mediaType.toLowerCase()] || ['Experiencing', 'Completed', 'On Hold', 'Dropped', 'Plan to Experience'];
};

export default function UserEntryCard({ entry, onClick }: UserEntryCardProps) {
  const [showOptions, setShowOptions] = useState(false);
  const { update_entry, refresh_entries } = use_saved_entries();

  const handleStatusChange = (newStatus: string) => {
    // Fetch the latest version of this entry to avoid overwriting edits
    const latest = JSON.parse(localStorage.getItem('zehubbo-saved') || '[]')
      .find((e: SavedEntry) => e.source === entry.source && e.id === entry.id);

    if (latest) {
      update_entry({ ...latest, userStatus: newStatus.toLowerCase() });
    } else {
      update_entry({ ...entry, userStatus: newStatus.toLowerCase() });
    }

    refresh_entries();
    setShowOptions(false);
  };

  const statusOptions = getStatusOptions(entry.media_type);

  return (
    <div
      className="relative w-full max-w-[220px] aspect-[2/3] overflow-hidden rounded-2xl shadow-lg bg-gray-300 mx-auto cursor-pointer"
      onClick={onClick}
    >
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

      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 w-full px-3 py-2 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-white text-sm font-semibold truncate">{entry.title}</p>
      </div>

      {/* Status dropdown button */}
      <div className="absolute bottom-2 right-2 z-20" onClick={(e) => e.stopPropagation()}>
        <button
          className="bg-white/80 backdrop-blur px-2 py-1 rounded-full text-xs shadow hover:bg-white"
          onClick={() => setShowOptions(!showOptions)}
        >
          ✏️
        </button>

        {showOptions && (
          <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-300 rounded-md shadow-md z-50">
            {statusOptions.map((status) => (
              <div
                key={status}
                onClick={() => handleStatusChange(status)}
                className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer whitespace-nowrap"
              >
                {status}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
