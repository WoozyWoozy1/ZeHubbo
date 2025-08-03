ANIME_STATUS_MAP = {
    "CURRENT": "Watching",
    "PLANNING": "Plan to Watch",
    "PAUSED": "On Hold",
    "DROPPED": "Dropped",
    "COMPLETED": "Completed"
}

MANGA_STATUS_MAP = {
    "CURRENT": "Reading",
    "PLANNING": "Plan to Read",
    "PAUSED": "On Hold",
    "DROPPED": "Dropped",
    "COMPLETED": "Completed"
}

def map_status(anilist_status: str, media_type: str = "anime") -> str:
    status = anilist_status.upper()
    if media_type == "manga" or media_type == "light novel":
        return MANGA_STATUS_MAP.get(status, "Default")
    return ANIME_STATUS_MAP.get(status, "Default")
