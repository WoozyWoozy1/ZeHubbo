import pytest
from httpx import AsyncClient, ASGITransport
from main_api import app

transport = ASGITransport(app=app)

@pytest.mark.asyncio
async def test_search_movie():
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/search", params={"query": "Inception", "category": "Movie"})
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert any("Inception" in item["title"] for item in data)

@pytest.mark.asyncio
async def test_search_anime():
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/search", params={"query": "Naruto", "category": "Anime"})
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert any("Naruto" in item["title"] for item in data)

@pytest.mark.asyncio
async def test_invalid_category():
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/search", params={"query": "Bleach", "category": "UnknownType"})
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
        assert "Unknown media category" in data["detail"]
