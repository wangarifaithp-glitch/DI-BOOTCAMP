import os
from urllib.parse import urlencode

import requests


API_KEY = os.getenv("GIPHY_API_KEY", "hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My")
BASE_URL = "https://api.giphy.com/v1/gifs/search"


def search_gifs(query, limit=10, min_height=100):
    """Return up to limit GIFs whose original image height exceeds min_height."""
    rating = "g"
    url = f"{BASE_URL}?{urlencode({'q': query, 'rating': rating, 'api_key': API_KEY, 'limit': limit})}"
    response = requests.get(url, timeout=10)
    if response.status_code != 200:
        return []

    gifs = [
        gif
        for gif in response.json().get("data", [])
        if int(gif.get("images", {}).get("original", {}).get("height", 0)) > min_height
    ]
    return gifs[:limit]


def main():
    gifs = search_gifs("hilarious")
    print(f"GIFs returned: {len(gifs)}")
    for gif in gifs:
        print(gif.get("url", "No URL"))


if __name__ == "__main__":
    try:
        main()
    except requests.RequestException as error:
        print(f"Giphy request failed: {error}")
