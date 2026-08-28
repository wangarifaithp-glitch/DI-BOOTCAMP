import time

import requests


def webpage_load_time(url, timeout=10):
	"""Return the time in seconds needed to download a webpage response."""
	start_time = time.perf_counter()
	response = requests.get(url, timeout=timeout)
	response.raise_for_status()
	response.content
	return time.perf_counter() - start_time


def main():
	websites = {
		"Google": "https://www.google.com",
		"Ynet": "https://www.ynetnews.com",
		"IMDb": "https://www.imdb.com",
	}

	for name, url in websites.items():
		try:
			load_time = webpage_load_time(url)
			print(f"{name}: {load_time:.3f} seconds")
		except requests.RequestException as error:
			print(f"{name}: unable to load ({error})")


if __name__ == "__main__":
	main()
