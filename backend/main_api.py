from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from core.search_engine import search_media
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

ANILIST_CLIENT_ID = os.getenv("ANILIST_CLIENT_ID")
ANILIST_CLIENT_SECRET = os.getenv("ANILIST_CLIENT_SECRET")
REDIRECT_URI = os.getenv("ANILIST_REDIRECT_URI")

app = FastAPI()

# Allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/search")
def search(query: str = Query(...), category: str = Query(...)):
    """
    Search endpoint: accepts a query and category, returns results as JSON.
    """
    try:
        results = search_media(query, category)
        return [item.to_dict() for item in results]
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/anilist/auth")
async def anilist_auth(request: Request):
    """
    Handles AniList OAuth token exchange.
    """
    data = await request.json()
    code = data.get("code")

    if not code:
        raise HTTPException(status_code=400, detail="No code provided")

    token_url = "https://anilist.co/api/v2/oauth/token"
    payload = {
        "grant_type": "authorization_code",
        "client_id": ANILIST_CLIENT_ID,
        "client_secret": ANILIST_CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "code": code,
    }

    response = requests.post(token_url, data=payload)
    if response.status_code != 200:
        print(response.text)
        raise HTTPException(status_code=500, detail="Failed to exchange code for token")

    return response.json()
