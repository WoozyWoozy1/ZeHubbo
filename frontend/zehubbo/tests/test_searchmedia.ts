import { search_media } from '../src/api/search_media';

const testCases = [
  { query: "Inception", category: "Movie" },
  { query: "Breaking Bad", category: "Show" },
  { query: "Attack on Titan", category: "Anime" },
  { query: "Naruto", category: "Manga" },
  { query: "Mushoku Tensei", category: "Light Novel" },
  { query: "Steins;Gate", category: "Visual Novel" },
  { query: "The Great Gatsby", category: "Book" },
  { query: "Halo", category: "Game" }
];

async function runTests() {
  for (const { query, category } of testCases) {
    try {
      const results = await search_media(query, category);
      if (results.length > 0) {
        console.log(`✅ ${category} "${query}" returned ${results.length} result(s).`);
      } else {
        console.warn(`⚠️  ${category} "${query}" returned no results.`);
      }
    } catch (error) {
      console.error(`❌ Error searching ${category} "${query}":`, error);
    }
  }
}

runTests();
