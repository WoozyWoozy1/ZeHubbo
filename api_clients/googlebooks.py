import requests
from models.media_item import MediaItem
from utils.date_utils import standardize_date

BASE_URL = "https://www.googleapis.com/books/v1/volumes"

def search_googlebooks(query: str, page: int = 1) -> list[MediaItem]:
    max_results = 20
    start_index = (page - 1) * max_results

    params = {
        "q": query,
        "startIndex": start_index,
        "maxResults": max_results,
        "key" : ""
    }

    response = requests.get(BASE_URL, params=params)
    if response.status_code != 200:
        print(f"Error {response.status_code}: {response.text}")
        return []

    items = []
    for book in response.json().get("items", []):
        info = book.get("volumeInfo", {})

        rating = {}
        if "averageRating" in info:
            rating["GoogleBooks"] = round(float(info["averageRating"]), 2)

        item = MediaItem(
            title=info.get("title", "Unknown"),
            description=info.get("description", None),
            release_date=standardize_date(info.get("publishedDate", None)),
            rating=rating,
            image_url=info.get("imageLinks", {}).get("thumbnail", None),
            source="GoogleBooks",
            id=book.get("id", ""),
            media_type="Book"
        )

        items.append(item)

    return items
