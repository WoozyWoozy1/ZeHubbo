import React, { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import type { SavedEntry } from '../types';

const STORAGE_KEY = 'zehubbo-saved';

type SavedEntriesContextType = {
  savedEntries: SavedEntry[];
  addEntry: (entry: SavedEntry) => void;
  removeEntry: (source: string, id: string) => void;
  updateEntry: (updated: SavedEntry) => void;
};

const SavedEntriesContext = createContext<SavedEntriesContextType | undefined>(undefined);

export const SavedEntriesProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedEntries, setSavedEntries] = useState<SavedEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSavedEntries(JSON.parse(stored));
    }
  }, []);

  const saveToStorage = (entries: SavedEntry[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    setSavedEntries(entries);
  };

  const addEntry = (entry: SavedEntry) => {
    const exists = savedEntries.some(e => e.source === entry.source && e.id === entry.id);
    if (!exists) {
      const updated = [...savedEntries, entry];
      saveToStorage(updated);
    }
  };

  const removeEntry = (source: string, id: string) => {
    const updated = savedEntries.filter(e => !(e.source === source && e.id === id));
    saveToStorage(updated);
  };

  const updateEntry = (updatedEntry: SavedEntry) => {
    const updated = savedEntries.map(e =>
      e.source === updatedEntry.source && e.id === updatedEntry.id ? updatedEntry : e
    );
    saveToStorage(updated);
  };

  return (
    <SavedEntriesContext.Provider value={{ savedEntries, addEntry, removeEntry, updateEntry }}>
      {children}
    </SavedEntriesContext.Provider>
  );
};

export const useSavedEntriesContext = (): SavedEntriesContextType => {
  const context = useContext(SavedEntriesContext);
  if (!context) {
    throw new Error('useSavedEntriesContext must be used within a SavedEntriesProvider');
  }
  return context;
};