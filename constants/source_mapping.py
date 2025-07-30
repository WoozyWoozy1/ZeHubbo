SOURCE_MEDIA_TYPES = {
    "TMDB": ["Movie", "Show"],
    "AniList": ["Anime", "Manga", "Light Novel"], # Manga includes manhwa, manhua, oneshots, etc.
    "VNDB": ["Visual Novel"],
    "GoogleBooks": ["Book", "Novel"],
    "IGDB": ["Game"]
}

# Reverse mapping (category -> source)
MEDIA_TYPE_TO_SOURCE = {
    "Movie": "TMDB",
    "Show": "TMDB",
    "Anime": "AniList",
    "Manga": "AniList",
    "Light Novel": "AniList",
    "Visual Novel": "VNDB",
    "Book": "GoogleBooks",
    "Novel": "GoogleBooks",
    "Game": "IGDB"
}

