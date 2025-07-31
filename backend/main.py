from api_clients.tmdb import search_tmdb
from api_clients.anilist import search_anilist
from api_clients.vndb import search_vndb
from api_clients.googlebooks import search_googlebooks
from api_clients.igdb import search_igdb

if __name__ == "__main__":
    # TMDB
    # results = search_tmdb("Breaking Bad", media_type="tv")
    # results = search_tmdb("Interstellar", media_type="movie")

    # Anilist
    results = search_anilist("konosuba", media_type="anime")
    # results = search_anilist("ember knight", media_type="manga")
    # results = search_anilist("konosuba", media_type="ln")

    # VNDB
    # results = search_vndb("fata morgana")

    # Google Books
    # results = search_googlebooks("wonder")

    # IGDB
    # results = search_igdb("Freedom Fighters")
    
    for x in results:
        print(x)