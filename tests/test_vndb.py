import pytest
from api_clients.vndb import search_vndb
from tests.test_helpers import validate_media_item

VN_QUERIES = ["Steins;Gate", "Clannad", "Fate/stay night", "Doki Doki Literature Club!", "Chaos;Head"]

@pytest.mark.parametrize("query", VN_QUERIES)
def test_vndb_visual_novels(query):
    results = search_vndb(query)
    assert results, f"No results returned for VNDB query '{query}'"
    for item in results:
        assert validate_media_item(item, provider_name="VNDB"), f"Invalid MediaItem for VN '{query}'"
