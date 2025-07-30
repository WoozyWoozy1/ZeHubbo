import pytest
from api_clients.igdb import search_igdb
from tests.test_helpers import validate_media_item

GAME_QUERIES = [
    "The Legend of Zelda: Breath of the Wild",
    "The Witcher 3",
    "Elden Ring",
    "Hollow Knight",
    "Red Dead Redemption 2"
]

@pytest.mark.parametrize("query", GAME_QUERIES)
def test_igdb_games(query):
    results = search_igdb(query)
    assert results, f"No results returned for IGDB query '{query}'"
    for item in results:
        assert validate_media_item(item, provider_name="IGDB"), f"Invalid MediaItem for game '{query}'"
