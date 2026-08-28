import re
import string


class Text:
	def __init__(self, text):
		# Store the text so all analysis methods can use it.
		self.text = text

	# Part I, Step 2: Count a word in the text.
	def word_frequency(self, word):
		"""Return how many times word appears in the text."""
		words = self.text.split()
		count = words.count(word)
		return count if count else None

	# Part I, Step 3: Find the word used most often.
	def most_common_word(self):
		"""Return the word with the highest frequency, or None for empty text."""
		words = self.text.split()
		if not words:
			return None

		frequencies = {}
		for word in words:
			frequencies[word] = frequencies.get(word, 0) + 1

		return max(frequencies, key=frequencies.get)

	# Part I, Step 4: Return every different word.
	def unique_words(self):
		"""Return the unique words in the text as a list."""
		return list(set(self.text.split()))

	# Part II, Step 5: Build a Text object from a file.
	@classmethod
	def from_file(cls, file_path):
		"""Create a Text instance from the contents of a file."""
		with open(file_path, "r", encoding="utf-8") as text_file:
			return cls(text_file.read())


class TextModification(Text):
	# Step 7: Remove standard punctuation marks.
	def remove_punctuation(self):
		"""Return the text with punctuation characters removed."""
		return self.text.translate(str.maketrans("", "", string.punctuation))

	# Step 8: Remove common English words.
	def remove_stop_words(self):
		"""Return the text without common English stop words."""
		stop_words = {
			"a", "an", "and", "are", "as", "at", "be", "by", "for",
			"from", "has", "he", "in", "is", "it", "its", "of", "on",
			"or", "that", "the", "this", "to", "was", "were", "will",
			"with",
		}
		words = [word for word in self.text.split() if word.lower() not in stop_words]
		return " ".join(words)

	#  Step 9: Remove non-alphanumeric characters with a regex.
	def remove_special_characters(self):
		"""Return the text with non-alphanumeric characters removed."""
		return re.sub(r"[^a-zA-Z0-9\s]", "", self.text)


# Run examples when this file is executed directly.
if __name__ == "__main__":
	text = TextModification("The quick brown fox jumps over the quick dog.")
	print("Frequency of 'quick':", text.word_frequency("quick"))
	print("Most common word:", text.most_common_word())
	print("Unique words:", text.unique_words())
	print("Without punctuation:", text.remove_punctuation())
	print("Without stop words:", text.remove_stop_words())
	print("Without special characters:", text.remove_special_characters())
