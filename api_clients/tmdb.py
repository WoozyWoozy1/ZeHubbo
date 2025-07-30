import requests, os
from dotenv import load_dotenv
from models.media_item import MediaItem
from utils.date_utils import standardize_date 
from config.settings import SETTINGS

load_dotenv()

API_KEY = os.getenv("TMDB_API_KEY")
BASE_URL = 'https://api.themoviedb.org/3'
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"


def search_tmdb(query: str, media_type: str = "movie", page: int = 1) -> list[MediaItem]:
    if media_type == "movie":
        return _search_tmdb_movies(query, page)
    elif media_type == "tv":
        return _search_tmdb_shows(query, page)
    else:
        raise ValueError("media_type must be either 'movie' or 'tv'")


def _search_tmdb_movies(query: str, page: int = 1) -> list[MediaItem]:
    url = f"{BASE_URL}/search/movie"
    params = {
        'api_key': API_KEY,
        'query': query,
        'language': 'en-US',
        'page': page,
        'include_adult': SETTINGS.get("include_adult", False)
    }

    response = requests.get(url, params=params)
    if response.status_code != 200:
        print(f"Error {response.status_code}: {response.text}")
        return []

    results = response.json().get("results", [])
    items = []

    for result in results:
        item = MediaItem(
            title=result.get("title"),
            description=result.get("overview"),
            release_date=standardize_date(result.get("release_date")),
            rating={"TMDB": round(float(result["vote_average"]), 2)} if result.get("vote_average") else {},
            image_url=f"{IMAGE_BASE_URL}{result['poster_path']}" if result.get("poster_path") else None,
            source="TMDB",
            id=str(result.get("id")),
            media_type="Movie"
        )
        items.append(item)

    return items


def _search_tmdb_shows(query: str, page: int = 1) -> list[MediaItem]:
    url = f"{BASE_URL}/search/tv"
    params = {
        'api_key': API_KEY,
        'query': query,
        'language': 'en-US',
        'page': page,
        'include_adult': SETTINGS.get("include_adult", False)
    }

    response = requests.get(url, params=params)
    if response.status_code != 200:
        print(f"Error {response.status_code}: {response.text}")
        return []

    results = response.json().get("results", [])
    items = []

    for result in results:
        item = MediaItem(
            title=result.get("name"),
            description=result.get("overview"),
            release_date=standardize_date(result.get("first_air_date")),
            rating={"TMDB": round(float(result["vote_average"]), 2)} if result.get("vote_average") else {},
            image_url=f"{IMAGE_BASE_URL}{result['poster_path']}" if result.get("poster_path") else None,
            source="TMDB",
            id=str(result.get("id")),
            media_type="Show"
        )
        items.append(item)

    return items