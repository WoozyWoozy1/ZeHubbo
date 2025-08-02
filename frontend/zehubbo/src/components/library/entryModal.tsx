import { useState } from 'react';
import type { SavedEntry } from '../../types';
import use_saved_entries from '../../hooks/use_saved_entries';

type EntryModalProps = {
  entry: SavedEntry;
  onClose: () => void;
};

export default function EntryModal({ entry, onClose }: EntryModalProps) {
  const { update_entry } = use_saved_entries();

  const [userRating, setUserRating] = useState(entry.userRating ?? 0);
  const [userReview, setUserReview] = useState(entry.userReview ?? '');

  const handleSave = () => {
    update_entry({ ...entry, userRating, userReview });
    onClose();
  };

  const ratingDisplay = Object.entries(entry.rating || {})
    .map(([source, value]) => `${value} (${source})`)
    .join(', ');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✖
        </button>

        <div className="flex gap-4">
          {entry.image_url && (
            <img
              src={entry.image_url}
              alt={entry.title}
              className="w-32 h-48 object-cover rounded-lg"
            />
          )}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">{entry.title}</h2>
            <p className="text-sm text-gray-600">{entry.description || 'No description.'}</p>
            <p className="text-sm mt-1">Release: {entry.release_date || 'Unknown'}</p>
            <p className="text-sm">Source: {entry.source}</p>
            <p className="text-sm">Ratings: {ratingDisplay || 'N/A'}</p>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium block mb-1">Your Rating</label>
          <select
            className="w-full border border-gray-300 rounded p-2"
            value={userRating}
            onChange={(e) => setUserRating(Number(e.target.value))}
          >
            {Array.from({ length: 11 }, (_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium block mb-1">Your Review / Notes</label>
          <textarea
            className="w-full border border-gray-300 rounded p-2"
            rows={4}
            value={userReview}
            onChange={(e) => setUserReview(e.target.value)}
            placeholder="Write your thoughts..."
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
