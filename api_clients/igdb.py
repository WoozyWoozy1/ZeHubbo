import requests
import os
from dotenv import load_dotenv
from models.media_item import MediaItem
from utils.date_utils import standardize_date
from config.settings import SETTINGS

load_dotenv()

CLIENT_ID = os.getenv("IGDB_CLIENT_ID")
CLIENT_SECRET = os.getenv("IGDB_CLIENT_SECRET")

BASE_URL = "https://api.igdb.com/v4/games"

def _get_access_token() -> str:
    auth_url = "https://id.twitch.tv/oauth2/token"
    params = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'client_credentials'
    }

    response = requests.post(auth_url, params=params)
    response.raise_for_status()
    return response.json().get('access_token')

def search_igdb(query: str, page: int = 1) -> list[MediaItem]:
    token = _get_access_token()
    offset = (page - 1) * 10

    headers = {
        "Client-ID": CLIENT_ID,
        "Authorization": f"Bearer {token}"
    }

    body = (
        f'search "{query}"; '
        f'fields name, summary, rating, first_release_date, cover.url; '
        f'limit 10; offset {offset};'
    )

    response = requests.post(BASE_URL, headers=headers, data=body)
    if response.status_code != 200:
        print(f"Error {response.status_code}: {response.text}")
        return []

    results = response.json()
    items = []

    for result in results:
        release_ts = result.get("first_release_date")
        release_date = standardize_date(str(release_ts)) if release_ts else None

        item = MediaItem(
            title=result.get("name", "Unknown"),
            description=result.get("summary"),
            release_date=release_date,
            rating={"IGDB": round(float(result["rating"]), 2)} if result.get("rating") else {},
            image_url=result.get("cover", {}).get("url") if result.get("cover") else None,
            source="IGDB",
            id=str(result.get("id")),
            media_type="Game"
        )
        items.append(item)

    return items