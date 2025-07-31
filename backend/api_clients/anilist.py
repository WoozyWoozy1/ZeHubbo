import requests
from models.media_item import MediaItem
from utils.date_utils import standardize_date
from config.settings import SETTINGS


API_URL = 'https://graphql.anilist.co'


def search_anilist(query: str, media_type: str = "anime", page: int = 1) -> list[MediaItem]:
    if media_type.lower() == "anime":
        return _search_anime(query, page)
    elif media_type.lower() == "manga": # Includes manhwa and such
        return _search_manga(query, page)
    elif media_type.lower() == "light_novel" or media_type.lower() == "ln":
        return _search_light_novel(query, page)
    else:
        raise ValueError("media_type must be 'anime', 'manga', or 'light_novel'")


def _search_anime(query: str, page: int) -> list[MediaItem]:
    formats = ["TV", "TV_SHORT", "MOVIE", "SPECIAL", "OVA", "ONA", "MUSIC"]
    gql_type = "ANIME" # GraphQL Type
    media_label = "Anime"
    return _execute_query(query, page, gql_type, formats, media_label)


def _search_manga(query: str, page: int) -> list[MediaItem]:
    formats = ["MANGA", "ONE_SHOT"]
    gql_type = "MANGA"
    media_label = "Manga"
    return _execute_query(query, page, gql_type, formats, media_label)


def _search_light_novel(query: str, page: int) -> list[MediaItem]:
    formats = ["NOVEL"]
    gql_type = "MANGA"
    media_label = "Light Novel"
    return _execute_query(query, page, gql_type, formats, media_label)


def _execute_query(query: str, page: int, gql_type: str, formats: list[str], media_label: str) -> list[MediaItem]:
    query_string = '''
    query ($search: String, $page: Int, $type: MediaType, $formats: [MediaFormat]) {
      Page(page: $page, perPage: 10) {
        media(search: $search, type: $type, format_in: $formats) {
          id
          title {
            romaji
            english
            native
          }
          format
          description(asHtml: false)
          startDate {
            year
            month
            day
          }
          averageScore
          coverImage {
            large
          }
        }
      }
    }
    '''

    variables = {
        'search': query,
        'page': page,
        'type': gql_type,
        'formats': formats
    }

    response = requests.post(API_URL, json={'query': query_string, 'variables': variables})
    if response.status_code != 200:
        print("Error:", response.status_code, response.text)
        return []

    results = response.json()['data']['Page']['media']
    items = []

    for result in results:
        titles = result.get("title", {})
        title = titles.get("english") or titles.get("romaji") or titles.get("native") or "Unknown Title"

        # Construct date string (will be standardized)
        year = result.get("startDate", {}).get("year")
        month = result.get("startDate", {}).get("month")
        day = result.get("startDate", {}).get("day")
        date_str = (
            f"{day:02d}-{month:02d}-{year}" if day and month and year else
            f"{month:02d}-{year}" if month and year else
            f"{year}" if year else None
        )

        item = MediaItem(
            title=title,
            description=result.get("description"),
            release_date=standardize_date(date_str),
            rating={"AniList": round(result["averageScore"] / 10, 2)} if result.get("averageScore") else {},
            image_url=result.get("coverImage", {}).get("large"),
            source="AniList",
            id=str(result.get("id")),
            media_type=media_label
        )
        items.append(item)

    return items