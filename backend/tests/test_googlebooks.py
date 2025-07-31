import pytest
from api_clients.googlebooks import search_googlebooks
from tests.test_helpers import validate_media_item

BOOK_QUERIES = [
    "1984",
    "Harry Potter and the Philosopher's Stone",
    "The Catcher in the Rye",
    "Sapiens",
    "To Kill a Mockingbird"
]

@pytest.mark.parametrize("query", BOOK_QUERIES)
def test_google_books_search(query):
    results = search_googlebooks(query)
    assert results, f"No results returned for Google Books query '{query}'"
    for item in results:
        assert validate_media_item(item, provider_name="GoogleBooks"), f"Invalid MediaItem for book '{query}'"
