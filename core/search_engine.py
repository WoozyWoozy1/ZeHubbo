from typing import List, Literal
from models.media_item import MediaItem
from api_clients.tmdb import search_tmdb
from api_clients.anilist import search_anilist
from api_clients.vndb import search_vndb
from api_clients.googlebooks import search_googlebooks
from api_clients.igdb import search_igdb
from constants.source_mapping import MEDIA_TYPE_TO_SOURCE

def search_media(query: str, category: str) -> List[MediaItem]:
    """
    Dispatches the query to the appropriate provider based on media category.
    Returns a list of MediaItem instances.
    """
    category = category.strip().title()
    source = MEDIA_TYPE_TO_SOURCE.get(category)

    if not source:
        raise ValueError(f"Unknown media category: '{category}'")

    if source == "TMDB":
        if category == "Movie":
            return search_tmdb(query, media_type="movie")
        elif category == "Show":
            return search_tmdb(query, media_type="tv")

    elif source == "AniList":
        if category == "Anime":
            return search_anilist(query, media_type="anime")
        else:  # Manga, Manhwa, Light Novel
            return search_anilist(query, media_type="manga")

    elif source == "VNDB":
        return search_vndb(query)

    elif source == "GoogleBooks":
        return search_googlebooks(query)

    elif source == "IGDB":
        return search_igdb(query)

    raise RuntimeError(f"Search routing failed for category: {category}")
