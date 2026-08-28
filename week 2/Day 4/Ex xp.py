import json
import random
from pathlib import Path


# Keep the data files beside this Python script.
WORDS_FILE = Path(__file__).with_name("words.txt")
JSON_OUTPUT_FILE = Path(__file__).with_name("modified_sample.json")


# Exercise 1: Random Sentence Generator
def get_words_from_file(file_path):
	"""Read a word list and return its words as a list."""
	# Read all text, then split it into individual words.
	with open(file_path, "r", encoding="utf-8") as words_file:
		return words_file.read().split()


def get_random_sentence(length):
	"""Return a lowercase sentence containing the requested number of words."""
	words = get_words_from_file(WORDS_FILE)
	# Choose one random word for each requested position in the sentence.
	selected_words = [random.choice(words) for _ in range(length)]
	return " ".join(selected_words).lower()


# Exercise 2: Working with JSON
def exercise_json():
	"""Read, update, and save the sample JSON data."""
	sample_json = """{
		"company": {
			"employee": {
				"name": "emma",
				"payable": {
					"salary": 7000,
					"bonus": 800
				}
			}
		}
	}"""

	# Convert the JSON string into a Python dictionary.
	data = json.loads(sample_json)
	# Access the salary through the nested company and employee dictionaries.
	salary = data["company"]["employee"]["payable"]["salary"]
	print(f"Salary: {salary}")

	# Add a birth date to the employee dictionary.
	data["company"]["employee"]["birth_date"] = "1990-01-01"
	# Save the updated dictionary as readable JSON.
	with open(JSON_OUTPUT_FILE, "w", encoding="utf-8") as json_file:
		json.dump(data, json_file, indent=4)


def main():
	print("This program generates a random sentence from a word list.")
	try:
		# Convert the user's input from text to an integer.
		length = int(input("Enter a sentence length from 2 to 20: "))
	except ValueError:
		print("Error: sentence length must be an integer.")
		return

	# Accept only sentence lengths from 2 through 20.
	if not 2 <= length <= 20:
		print("Error: sentence length must be between 2 and 20.")
		return

	try:
		print(get_random_sentence(length))
	# Report a helpful message if the word list cannot be opened.
	except OSError as error:
		print(f"Error reading the word list: {error}")
		return

	exercise_json()


if __name__ == "__main__":
	main()
