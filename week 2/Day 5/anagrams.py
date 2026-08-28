from anagram_checker import AnagramChecker


MENU = """
Anagram Checker
1 - Enter a word
2 - Exit
"""


def get_valid_word():
    """Read and validate one user-entered word."""
    word = input("Enter a word: ").strip()
    if not word:
        print("Error: please enter a word.")
    elif len(word.split()) != 1:
        print("Error: only one word is allowed.")
    elif not word.isalpha():
        print("Error: only alphabetic characters are allowed.")
    else:
        return word
    return None


def main():
    checker = AnagramChecker()

    while True:
        print(MENU)
        choice = input("Choose an option: ").strip()

        if choice == "2":
            print("Goodbye!")
            break
        if choice != "1":
            print("Error: choose 1 or 2.")
            continue

        word = get_valid_word()
        if word is None:
            continue

        normalized_word = word.lower()
        validity = "a valid" if checker.is_valid_word(normalized_word) else "not a valid"
        anagrams = checker.get_anagrams(normalized_word)
        anagram_text = ", ".join(anagrams) if anagrams else "none"

        print(f'\nYOUR WORD: "{word.upper()}"')
        print(f"This is {validity} English word.")
        print(f"Anagrams for your word: {anagram_text}.\n")


if __name__ == "__main__":
    main()
