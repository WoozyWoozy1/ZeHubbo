from typing import Optional, Dict


class MediaItem:
    def __init__(
        self,
        title: str,
        description: Optional[str],
        release_date: Optional[str],  # Format: DD-MM-YYYY, MM-YYYY, YYYY, or None
        rating: Dict[str, float],     # e.g., {"TMDB": 8.4}
        image_url: Optional[str],
        source: str,                  
        id: str,
        media_type: str              
    ):
        self.title = str(title)
        self.description = str(description) if description else None
        self.release_date = str(release_date) if release_date else None
        self.rating = dict(rating) if rating else {}
        self.image_url = str(image_url) if image_url else None
        self.source = str(source)
        self.id = str(id)
        self.media_type = str(media_type)

    def to_dict(self) -> dict:
        return {
            "title": self.title,
            "description": self.description,
            "release_date": self.release_date,
            "rating": self.rating,
            "image_url": self.image_url,
            "source": self.source,
            "id": self.id,
            "media_type": self.media_type
        }

    def __str__(self):
        return f"{self.title} ({self.media_type}) — {self.source} — {self.release_date or 'Unknown'}"
