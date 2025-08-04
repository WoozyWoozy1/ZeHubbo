import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import type { SavedEntry } from '../../types';
import { useSavedEntriesContext } from '../../hooks/savedEntriesContext';

type EntryModalProps = {
  entry: SavedEntry;
  onClose: () => void;
};

export default function EntryModal({ entry, onClose }: EntryModalProps) {
  const { updateEntry, removeEntry } = useSavedEntriesContext();

  const [userRating, setUserRating] = useState<number | null>(
    entry.userRating === 0 ? null : entry.userRating ?? null
  );
  const [userReview, setUserReview] = useState(entry.userReview ?? '');
  const [userNotes, setUserNotes] = useState(entry.userNotes ?? '');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = () => {
    updateEntry({ ...entry, userRating, userReview, userNotes });
    toast.success('Changes saved!');
    onClose();
  };

  const handleDelete = () => {
    removeEntry(entry.source, entry.id);
    toast.success('Entry deleted.');
    setShowConfirm(false);
    onClose();
  };

  const ratingDisplay = Object.entries(entry.rating || {})
    .map(([source, value]) => `${value} (${source})`)
    .join(', ');

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl relative"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
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
              value={userRating ?? ''}
              onChange={(e) =>
                setUserRating(e.target.value === '' ? null : Number(e.target.value))
              }
            >
              <option value="">Unrated</option>
              {Array.from({ length: 11 }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium block mb-1">Your Review</label>
            <textarea
              className="w-full border border-gray-300 rounded p-2"
              rows={4}
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              placeholder="Write your thoughts..."
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium block mb-1">Your Notes</label>
            <textarea
              className="w-full border border-gray-300 rounded p-2"
              rows={2}
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Quick notes, tags, reminders..."
            />
          </div>

          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </motion.div>

        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-lg font-semibold mb-4">
                Are you sure you want to delete this entry?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
