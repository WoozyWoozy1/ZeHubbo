# MediaHub

A unified media search engine that aggregates content across multiple APIs including:
- 🎬 **TMDb** (Movies & TV Shows)
- 📺 **AniList** (Anime, Manga, Light Novels)
- 📚 **Google Books** (Books)
- 📖 **VNDB** (Visual Novels)
- 🎮 **IGDB** (Games)

## 🚀 Features

- Unified `MediaItem` data structure across all providers
- Custom API clients for each source
- Clean date formatting and rating normalization
- Scrollable, clickable frontend (in progress)
- Full pytest suite to validate API responses

## 📁 Project Structure

```
MediaHub/
│
├── api_clients/         # Handles communication with external APIs
│   ├── tmdb.py
│   ├── anilist.py
│   ├── vndb.py
│   ├── google_books.py
│   └── igdb.py
│
├── models/
│   └── media_item.py    # Unified MediaItem class
│
├── tests/               # Pytest test suites for each provider
│   ├── test_tmdb.py
│   ├── test_anilist.py
│   ├── test_vndb.py
│   ├── test_google_books.py
│   ├── test_igdb.py
│   └── test_helpers.py
│
├── utils/
│   └── date_utils.py    # Standardizes dates (UNIX, ISO, etc.)
│
├── main.py              # For testing or demo execution
├── requirements.txt     # Python dependencies
└── README.md
```

## 🧪 Running Tests

```bash
pytest
```

## 🔧 Setup

1. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

2. Set up your `.env` file if needed (e.g. for TMDB or IGDB API keys)

3. Run tests or develop locally with your preferred Python version (3.12+ recommended)

---

## 📌 Status

✅ All providers integrated and tested  
🛠 Frontend and local DB save features: *In progress*
