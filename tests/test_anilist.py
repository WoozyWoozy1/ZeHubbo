import pytest
from api_clients.anilist import search_anilist
from tests.test_helpers import validate_media_item

ANIME_QUERIES = ["Naruto", "Attack on Titan", "Demon Slayer", "Death Note", "Fullmetal Alchemist"]
MANGA_QUERIES = ["One Piece", "Berserk", "Tokyo Ghoul", "Chainsaw Man", "Vagabond"]
LIGHT_NOVEL_QUERIES = ["Re:Zero", "Sword Art Online", "Overlord", "Mushoku Tensei", "No Game No Life"]

@pytest.mark.parametrize("query", ANIME_QUERIES)
def test_anilist_anime(query):
    results = search_anilist(query, media_type="anime")
    assert results, f"No results returned for anime query '{query}'"
    for item in results:
        assert validate_media_item(item, provider_name="AniList"), f"Invalid MediaItem for query '{query}'"

@pytest.mark.parametrize("query", MANGA_QUERIES)
def test_anilist_manga(query):
    results = search_anilist(query, media_type="manga")
    assert results, f"No results returned for manga query '{query}'"
    for item in results:
        assert validate_media_item(item, provider_name="AniList"), f"Invalid MediaItem for query '{query}'"

@pytest.mark.parametrize("query", LIGHT_NOVEL_QUERIES)
def test_anilist_light_novels(query):
    results = search_anilist(query, media_type="light_novel")
    assert results, f"No results returned for light novel query '{query}'"
    for item in results:
        assert validate_media_item(item, provider_name="AniList"), f"Invalid MediaItem for query '{query}'"
