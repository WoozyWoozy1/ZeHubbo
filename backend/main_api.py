from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from core.search_engine import search_media

app = FastAPI()

# Optional: allow access from frontend (e.g., React)
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