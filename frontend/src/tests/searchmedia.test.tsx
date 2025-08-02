import { describe, it, expect } from 'vitest';
import { search_media } from '../api/search_media';

const testCases = [
  { query: 'Inception', category: 'Movie' },
  { query: 'Breaking Bad', category: 'Show' },
  { query: 'Attack on Titan', category: 'Anime' },
  { query: 'Naruto', category: 'Manga' },
  { query: 'Mushoku Tensei', category: 'Light Novel' },
  { query: 'Steins;Gate', category: 'Visual Novel' },
  { query: 'The Great Gatsby', category: 'Book' },
  { query: 'Halo', category: 'Game' },
];

describe('search_media API integration', () => {
  for (const { query, category } of testCases) {
    it(`should return results for ${category} "${query}"`, async () => {
      const results = await search_media(query, category);
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });
  }
});
