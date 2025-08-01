import { useState, useEffect } from 'react';
import type { SavedEntry } from '../types';

const STORAGE_KEY = 'zehubbo-saved';

export default function use_saved_entries() {
  const [saved_entries, set_saved_entries] = useState<SavedEntry[]>([]);

  // Load from localStorage on first load
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      set_saved_entries(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage and update state
  const _save_to_storage = (entries: SavedEntry[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    set_saved_entries(entries);
  };

  // Add a new entry if it doesn't exist
  const add_entry = (entry: SavedEntry) => {
    const unique_id = `${entry.source}:${entry.id}`;
    const exists = saved_entries.some(e => `${e.source}:${e.id}` === unique_id);
    if (exists) return;
    const updated = [...saved_entries, entry];
    _save_to_storage(updated);
  };

  // Remove an entry by combined source:id
  const remove_entry = (source: string, id: string) => {
    const unique_id = `${source}:${id}`;
    const updated = saved_entries.filter(e => `${e.source}:${e.id}` !== unique_id);
    _save_to_storage(updated);
  };

  // Toggle favorite status
  const toggle_favorite = (source: string, id: string) => {
    const updated = saved_entries.map(e =>
      e.source === source && e.id === id ? { ...e, favorite: !e.favorite } : e
    );
    _save_to_storage(updated);
  };

  // Update a full entry (e.g. new review, new rating, etc.)
  const update_entry = (updated_entry: SavedEntry) => {
    const updated = saved_entries.map(e =>
      e.source === updated_entry.source && e.id === updated_entry.id
        ? updated_entry
        : e
    );
    _save_to_storage(updated);
  };

  return {
    saved_entries,
    add_entry,
    remove_entry,
    toggle_favorite,
    update_entry,
  };
}
