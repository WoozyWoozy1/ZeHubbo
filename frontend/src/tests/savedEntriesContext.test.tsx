import { renderHook, act } from '@testing-library/react';
import { SavedEntriesProvider, useSavedEntriesContext } from '../hooks/savedEntriesContext';
import type { SavedEntry } from '../types';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SavedEntriesProvider>{children}</SavedEntriesProvider>
);

const baseEntry: SavedEntry = {
  id: '1',
  title: 'My Anime',
  media_type: 'anime',
  source: 'AniList',
  image_url: '',
  release_date: '2022',
  rating: {},
  userStatus: 'watching',
  userRating: 0,
  userReview: '',
  userNotes: '',
  favorite: false,
  savedAt: new Date().toISOString(),
};

describe('savedEntriesContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds a new entry', () => {
    const { result } = renderHook(() => useSavedEntriesContext(), { wrapper });

    act(() => {
      result.current.addEntry(baseEntry);
    });

    expect(result.current.savedEntries).toHaveLength(1);
    expect(result.current.savedEntries[0].title).toBe('My Anime');
  });

  it('prevents duplicate entries', () => {
    const { result } = renderHook(() => useSavedEntriesContext(), { wrapper });

    act(() => {
      result.current.addEntry(baseEntry);
      result.current.addEntry(baseEntry); // duplicate
    });

    expect(result.current.savedEntries).toHaveLength(1);
  });

  it('removes an entry by source and id', () => {
    const { result } = renderHook(() => useSavedEntriesContext(), { wrapper });

    act(() => {
      result.current.addEntry(baseEntry);
      result.current.removeEntry('AniList', '1');
    });

    expect(result.current.savedEntries).toHaveLength(0);
  });

  it('updates an existing entry', () => {
    const { result } = renderHook(() => useSavedEntriesContext(), { wrapper });

    act(() => {
      result.current.addEntry(baseEntry);
    });

    act(() => {
      result.current.updateEntry({ ...baseEntry, userNotes: 'Updated Note' });
    });

    const updated = result.current.savedEntries.find(e => e.id === '1');
    expect(updated?.userNotes).toBe('Updated Note');
  });

  it('replaces only AniList entries', () => {
    const oldAniList: SavedEntry = { ...baseEntry, id: '1', source: 'AniList', title: 'Old AniList' };
    const nonAniList: SavedEntry = { ...baseEntry, id: '2', source: 'TMDB', title: 'Non-AniList' };
    const newAniList: SavedEntry = { ...baseEntry, id: '3', source: 'AniList', title: 'New AniList' };

    const { result } = renderHook(() => useSavedEntriesContext(), { wrapper });

    act(() => {
      result.current.addEntry(oldAniList);
      result.current.addEntry(nonAniList);
    });

    act(() => {
      result.current.replaceAniListEntries([newAniList]);
    });

    const entries = result.current.savedEntries;
    expect(entries).toHaveLength(2);
    expect(entries.find(e => e.id === '2')?.title).toBe('Non-AniList'); // kept
    expect(entries.find(e => e.id === '3')?.title).toBe('New AniList'); // added
  });

  it('syncs with localStorage', () => {
    const { result } = renderHook(() => useSavedEntriesContext(), { wrapper });

    act(() => {
      result.current.addEntry(baseEntry);
    });

    const stored = JSON.parse(localStorage.getItem('zehubbo-saved') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe('My Anime');
  });
});
