import pytest
from api_clients.tmdb import search_tmdb
from tests.test_helpers import validate_media_item

# 🧪 Sample search queries for testing
MOVIE_QUERIES = ["Inception", "The Matrix", "Interstellar", "Gladiator", "Titanic"]
SHOW_QUERIES = ["Breaking Bad", "Stranger Things", "The Office", "Friends", "Game of Thrones"]

@pytest.mark.parametrize("query", MOVIE_QUERIES)
def test_tmdb_movies(query):
    results = search_tmdb(query, media_type="movie")
    assert results, f"No results returned for movie query '{query}'"
    for item in results:
        assert validate_media_item(item, provider_name="TMDB"), f"Invalid MediaItem for query '{query}'"

@pytest.mark.parametrize("query", SHOW_QUERIES)
def test_tmdb_shows(query):
    results = search_tmdb(query, media_type="tv")
    assert results, f"No results returned for show query '{query}'"
    for item in results:
        assert validate_media_item(item, provider_name="TMDB"), f"Invalid MediaItem for query '{query}'"
