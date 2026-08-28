import requests

from giphy_search import API_KEY


SEARCH_URL = "https://api.giphy.com/v1/gifs/search"
TRENDING_URL = "https://api.giphy.com/v1/gifs/trending"


def fetch_gifs(url, **params):
    """Fetch GIF data from a Giphy endpoint."""
    response = requests.get(
        url,
        params={"api_key": API_KEY, "rating": "g", **params},
        timeout=10,
    )
    response.raise_for_status()
    return response.json().get("data", [])


def main():
    query = input("Enter a GIF search term: ").strip()
    if not query:
        print("No search term entered. Showing today's trending GIFs.")
        gifs = fetch_gifs(TRENDING_URL)
    else:
        gifs = fetch_gifs(SEARCH_URL, q=query)
        if not gifs:
            print(f'No GIFs found for "{query}". Showing today\'s trending GIFs.')
            gifs = fetch_gifs(TRENDING_URL)

    for gif in gifs:
        print(gif.get("url", "No URL"))


if __name__ == "__main__":
    try:
        main()
    except requests.RequestException as error:
        print(f"Giphy request failed: {error}")
