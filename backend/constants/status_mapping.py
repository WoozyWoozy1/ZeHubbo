STATUS_MAP = {
    "CURRENT": "Watching",
    "PLANNING": "Plan to Watch",
    "PAUSED": "On Hold",
    "DROPPED": "Dropped",
    "COMPLETED": "Completed"
}

def map_status(anilist_status: str) -> str:
    return STATUS_MAP.get(anilist_status.upper(), "Default")
