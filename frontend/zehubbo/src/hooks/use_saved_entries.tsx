import { useState, useEffect } from 'react';
import type { SavedEntry } from '../types';

const STORAGE_KEY = 'zehubbo-saved';

export default function use_saved_entries() {
  const [saved_entries, set_saved_entries] = useState<SavedEntry[]>([]);

  const load_from_storage = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      set_saved_entries(JSON.parse(stored));
    }
  };

  useEffect(() => {
    load_from_storage();
  }, []);

  const _save_to_storage = (entries: SavedEntry[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    set_saved_entries(entries);
  };

  const add_entry = (entry: SavedEntry) => {
    const unique_id = `${entry.source}:${entry.id}`;
    const exists = saved_entries.some(e => `${e.source}:${e.id}` === unique_id);
    if (exists) return;
    const updated = [...saved_entries, entry];
    _save_to_storage(updated);
  };

  const remove_entry = (source: string, id: string) => {
    const unique_id = `${source}:${id}`;
    const updated = saved_entries.filter(e => `${e.source}:${e.id}` !== unique_id);
    _save_to_storage(updated);
  };

  const toggle_favorite = (source: string, id: string) => {
    const updated = saved_entries.map(e =>
      e.source === source && e.id === id ? { ...e, favorite: !e.favorite } : e
    );
    _save_to_storage(updated);
  };

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
    refresh_entries: load_from_storage,
  };
}
