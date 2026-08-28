from pathlib import Path


class AnagramChecker:
    """Load a word list and find anagrams without handling user interface output."""

    def __init__(self, word_list_path=None):
        path = Path(word_list_path) if word_list_path else Path(__file__).with_name("sowpods.txt")
        with path.open("r", encoding="utf-8") as word_file:
            self.word_list = {word.strip().lower() for word in word_file if word.strip()}

    def is_valid_word(self, word):
        """Return whether word appears in the loaded word list."""
        return word.strip().lower() in self.word_list

    def is_anagram(self, word1, word2):
        """Return whether two words contain the same letters."""
        return sorted(word1.lower()) == sorted(word2.lower())

    def get_anagrams(self, word):
        """Return every different word in the list that is an anagram."""
        normalized_word = word.strip().lower()
        return sorted(
            candidate
            for candidate in self.word_list
            if candidate != normalized_word and self.is_anagram(normalized_word, candidate)
        )
