from fastapi import FastAPI, HTTPException, Query, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from core.search_engine import search_media
import requests
import os
from dotenv import load_dotenv
from constants.status_mapping import map_status

load_dotenv()

ANILIST_CLIENT_ID = os.getenv("ANILIST_CLIENT_ID")
ANILIST_CLIENT_SECRET = os.getenv("ANILIST_CLIENT_SECRET")
ANILIST_REDIRECT_URI = os.getenv("ANILIST_REDIRECT_URI")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/search")
def search(query: str = Query(...), category: str = Query(...)):
    try:
        results = search_media(query, category)
        return [item.to_dict() for item in results]
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/anilist/auth")
async def anilist_auth(request: Request):
    data = await request.json()
    code = data.get("code")

    if not code:
        raise HTTPException(status_code=400, detail="No code provided")

    token_url = "https://anilist.co/api/v2/oauth/token"
    payload = {
        "grant_type": "authorization_code",
        "client_id": ANILIST_CLIENT_ID,
        "client_secret": ANILIST_CLIENT_SECRET,
        "redirect_uri": ANILIST_REDIRECT_URI,
        "code": code,
    }

    response = requests.post(token_url, data=payload)
    if response.status_code != 200:
        print(response.text)
        raise HTTPException(status_code=500, detail="Failed to exchange code for token")

    return response.json()

@app.post("/anilist/sync")
def sync_anilist_entries(data: dict = Body(...)):
    token = data.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Missing token")

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    # Step 1: get user ID
    viewer_query = """
    query {
      Viewer {
        id
      }
    }
    """
    viewer_res = requests.post("https://graphql.anilist.co", json={"query": viewer_query}, headers=headers)
    if viewer_res.status_code != 200:
        print("Viewer fetch failed:", viewer_res.text)
        raise HTTPException(status_code=viewer_res.status_code, detail="Failed to fetch user ID")

    user_id = viewer_res.json()["data"]["Viewer"]["id"]

    # Step 2: get media list
    media_query = """
    query ($userId: Int) {
      MediaListCollection(userId: $userId, type: ANIME) {
        lists {
          name
          entries {
            media {
              id
              title {
                english
                romaji
              }
              coverImage {
                large
              }
              averageScore
              startDate {
                year
                month
                day
              }
            }
            status
            score
            notes
          }
        }
      }
    }
    """

    payload = {
        "query": media_query,
        "variables": {"userId": user_id}
    }

    media_res = requests.post("https://graphql.anilist.co", json=payload, headers=headers)
    if media_res.status_code != 200:
        print("AniList API Error:", media_res.status_code)
        print("Response Text:", media_res.text)
        raise HTTPException(status_code=media_res.status_code, detail="Failed to fetch user media list")

    raw = media_res.json()
    entries = []

    for lst in raw["data"]["MediaListCollection"]["lists"]:
        for entry in lst["entries"]:
            media = entry.get("media", {})
            media_id = media.get("id")
            if not media_id:
                continue

            titles = media.get("title", {})
            title = titles.get("english") or titles.get("romaji") or "Untitled"
            image_url = media.get("coverImage", {}).get("large", "")
            rating = round(media["averageScore"] / 10, 2) if media.get("averageScore") else None
            start = media.get("startDate", {})
            year, month, day = start.get("year"), start.get("month"), start.get("day")
            release_date = (
                f"{day:02d}-{month:02d}-{year}" if day and month and year else
                f"{month:02d}-{year}" if month and year else
                f"{year}" if year else None
            )

            entries.append({
                "title": title,
                "description": entry.get("notes") or "",
                "release_date": release_date,
                "rating": {"AniList": rating} if rating else {},
                "image_url": image_url,
                "source": "AniList",
                "id": str(media_id),
                "media_type": "anime",
                "userStatus": map_status(entry.get("status", "")),
                "userRating": entry.get("score", 0),
                "favorite": False
            })

    return entries
