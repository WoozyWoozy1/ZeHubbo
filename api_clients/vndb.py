# VNDB/vndb_api.py

import requests
from models.media_item import MediaItem
from utils.date_utils import standardize_date

API_URL = "https://api.vndb.org/kana/vn"
HEADERS = {
    "Content-Type": "application/json"
}


def search_vndb(query: str, page: int = 1, results: int = 10) -> list[MediaItem]:
    payload = {
        "filters": ["search", "=", query],
        "fields": "id,title,released,languages,platforms,image.url,rating,votecount,length",
        "results": results,
        "page": page
    }

    response = requests.post(API_URL, json=payload, headers=HEADERS)

    if response.status_code != 200:
        print(f"Error {response.status_code}: {response.text}")
        return []

    raw_results = response.json().get("results", [])
    items = []

    for result in raw_results:
        item = MediaItem(
            title=result.get("title"),
            description=None,
            release_date=standardize_date(result.get("released")),
            rating={"VNDB": round(float(result["rating"]), 2)} if result.get("rating") else {},
            image_url=result.get("image", {}).get("url") if result.get("image") else None,
            source="VNDB",
            id=str(result.get("id")),
            media_type="Visual Novel"
        )
        items.append(item)

    return items
