# Daily Challenge: strings, lists, sorting, and functions.


# Challenge 1: sort comma-separated words alphabetically.
def sort_words(comma_separated_words):
	"""Return comma-separated words in alphabetical order."""
	# Split the input string wherever a comma appears.
	words = comma_separated_words.split(",")

	# Remove accidental spaces around each word.
	words = [word.strip() for word in words]

	# Sort the list alphabetically and join it back into one string.
	words.sort()
	return ",".join(words)


# Challenge 2: find the first longest word in a sentence.
def longest_word(sentence):
	"""Return the first word with the greatest length in sentence."""
	# split() separates the sentence into words and keeps punctuation attached.
	words = sentence.split()

	# Return an empty string when the sentence contains no words.
	if not words:
		return ""

	# Start with the first word so ties keep the first word encountered.
	longest = words[0]

	# Compare every later word with the current longest word.
	for word in words[1:]:
		if len(word) > len(longest):
			longest = word

	return longest


if __name__ == "__main__":
	# Get comma-separated words from the user for Challenge 1.
	words_input = input("Enter words separated by commas: ")
	print("Sorted words:", sort_words(words_input))

	# Demonstrate the expected Challenge 2 examples.
	print(longest_word("Margaret's toy is a pretty doll."))
	print(longest_word("A thing of beauty is a joy forever."))
	print(longest_word("Forgetfulness is by all means powerless!"))
