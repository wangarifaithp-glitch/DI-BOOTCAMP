import string


# Exercise 1: build a full name with an optional middle name.
def get_full_name(first_name, last_name, middle_name=None):
	name_parts = [first_name, middle_name, last_name]
	return " ".join(part.capitalize() for part in name_parts if part)


print(get_full_name("john", "lee", "hooker"))
print(get_full_name("bruce", "lee"))


# Exercise 2: translate letters and digits between English and Morse code.
MORSE_CODE = {
	"a": ".-", "b": "-...", "c": "-.-.", "d": "-..", "e": ".",
	"f": "..-.", "g": "--.", "h": "....", "i": "..", "j": ".---",
	"k": "-.-", "l": ".-..", "m": "--", "n": "-.", "o": "---",
	"p": ".--.", "q": "--.-", "r": ".-.", "s": "...", "t": "-",
	"u": "..-", "v": "...-", "w": ".--", "x": "-..-", "y": "-.--",
	"z": "--..", "0": "-----", "1": ".----", "2": "..---",
	"3": "...--", "4": "....-", "5": ".....", "6": "-....",
	"7": "--...", "8": "---..", "9": "----.",
}
MORSE_TO_TEXT = {code: character for character, code in MORSE_CODE.items()}


def text_to_morse(text):
	# Letters within a word use spaces; words use slashes.
	return " / ".join(
		" ".join(MORSE_CODE[character] for character in word)
		for word in text.lower().split()
	)


def morse_to_text(morse):
	# Decode each slash-separated word and space-separated character.
	return " ".join(
		"".join(MORSE_TO_TEXT[code] for code in word.split())
		for word in morse.split("/")
	)


message = "Hello World"
encoded_message = text_to_morse(message)
print(encoded_message)
print(morse_to_text(encoded_message))


# Exercise 3: print strings inside a frame sized for the longest string.
def box_printer(*words):
	longest_word_length = max(map(len, words))
	border = "*" * (longest_word_length + 4)
	print(border)
	for word in words:
		print(f"* {word.ljust(longest_word_length)} *")
	print(border)


box_printer("Hello", "World", "in", "reallylongword", "a", "frame")


# Exercise 4: insertion sort moves each value into its sorted position.
def insertion_sort(values):
	for index in range(1, len(values)):
		current_value = values[index]
		position = index

		# Shift larger values right until the insertion point is found.
		while position > 0 and values[position - 1] > current_value:
			values[position] = values[position - 1]
			position -= 1

		values[position] = current_value


numbers = [54, 26, 93, 17, 77, 31, 44, 55, 20]
insertion_sort(numbers)
print(numbers)
