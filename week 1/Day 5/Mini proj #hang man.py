import random


# The computer chooses one word randomly from this list at the start of a game.
WORDS_LIST = [
	"correction",
	"childish",
	"beach",
	"python",
	"assertive",
	"interference",
	"complete",
	"share",
	"credit card",
	"rush",
	"south",
]

# Each item shows the gallows after a different number of incorrect guesses.
# Stage 0 is empty, and stage 6 shows all six body parts.
HANGMAN_STAGES = [
	"""
  +---+
  |   |
	  |
	  |
	  |
	  |
=========
""",
	"""
  +---+
  |   |
  O   |
	  |
	  |
	  |
=========
""",
	"""
  +---+
  |   |
  O   |
  |   |
	  |
	  |
=========
""",
	"""
  +---+
  |   |
  O   |
 /|   |
	  |
	  |
=========
""",
	"""
  +---+
  |   |
  O   |
 /|\\  |
	  |
	  |
=========
""",
	"""
  +---+
  |   |
  O   |
 /|\\  |
 /    |
	  |
=========
""",
	"""
  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
	  |
=========
""",
]


def display_word(word, guessed_letters):
	"""Show guessed letters and stars for letters not guessed yet."""
	# Spaces stay visible so phrases such as "credit card" keep their gap.
	return " ".join(
		# Show a letter that was guessed; otherwise show a star.
		character if character == " " or character in guessed_letters else "*"
		for character in word
	)


def display_hangman(wrong_guesses):
	"""Print the gallows with one more body part for each wrong guess."""
	# The number of wrong guesses selects the matching drawing.
	print(HANGMAN_STAGES[wrong_guesses])


def get_guess(guessed_letters):
	"""Read one new letter from the player and reject invalid repeats."""
	while True:
		# Strip spaces and convert uppercase input to lowercase.
		guess = input("Guess a letter: ").strip().lower()

		# A valid guess must be exactly one alphabetic character.
		if len(guess) != 1 or not guess.isalpha():
			print("Please enter one letter.")
		# Players cannot guess the same letter more than once.
		elif guess in guessed_letters:
			print("You already guessed that letter.")
		else:
			return guess


def play():
	"""Run one complete game of Hangman."""
	# Pick the hidden word and prepare the game's starting state.
	word = random.choice(WORDS_LIST).lower()
	guessed_letters = set()
	wrong_guesses = 0

	print("Welcome to Hangman!")
	print("Guess the word before all six body parts appear.")

	# Continue while the player has fewer than six incorrect guesses.
	while wrong_guesses < 6:
		# Show the current progress before asking for the next guess.
		display_hangman(wrong_guesses)
		print(f"Word: {display_word(word, guessed_letters)}")
		print(f"Guessed letters: {', '.join(sorted(guessed_letters)) or 'none'}")

		# Get a new guess and remember it for future turns.
		guess = get_guess(guessed_letters)
		guessed_letters.add(guess)

		# Correct guesses reveal every matching position automatically.
		if guess in word:
			print("Correct!")
		# Incorrect guesses add one body part to the gallows.
		else:
			wrong_guesses += 1
			print("That letter is not in the word.")

		# If every letter has been guessed, the player wins.
		if all(character == " " or character in guessed_letters for character in word):
			display_hangman(wrong_guesses)
			print(f"You solved it! The word was: {word}")
			return

	# Reaching six incorrect guesses ends the game.
	display_hangman(wrong_guesses)
	print(f"Game over! The word was: {word}")


# Run the game only when this file is executed directly.
if __name__ == "__main__":
	play()
