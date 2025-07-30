# core/search_engine.py

from typing import Literal
from models.media_item import MediaItem
from api_clients.tmdb import search_tmdb
from api_clients.anilist import search_anilist
from api_clients.vndb import search_vndb
from api_clients.googlebooks import search_google_books
from api_clients import search_igdb, get_access_token

MediaCategory = Literal["Movie", "Show", "Anime", "Manga", "Light Novel", "Book", "Game"]

def search_media(query: str, category: MediaCategory, page: int = 1) -> list[MediaItem]:
    if category == "Movie":
        return search_tmdb(query, media_type="movie", page=page)
    elif category == "Show":
        return search_tmdb(query, media_type="tv", page=page)
    elif category == "Anime":
        return search_anilist(query, media_type="ANIME", page=page)
    elif category == "Manga":
        return search_anilist(query, media_type="MANGA", formats=["MANGA", "ONE_SHOT"], page=page)
    elif category == "Light Novel":
        return search_anilist(query, media_type="MANGA", formats=["NOVEL"], page=page)
    elif category == "Book":
        return search_google_books(query, page=page)
    elif category == "Game":
        token = get_access_token()
        return search_igdb(query, token, page=page)
    else:
        raise ValueError(f"Unknown media category: {category}")
