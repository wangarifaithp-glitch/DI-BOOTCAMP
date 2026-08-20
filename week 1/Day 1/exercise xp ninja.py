def show_outputs():
	print(3 <= 3 < 9)
	print(3 == 3 == 3)
	print(bool(0))
	print(bool(5 == "5"))
	print(bool(4 == 4) == bool("4" == "4"))
	print(bool(bool(None)))

	x = 1 == True
	y = 1 == False
	a = True + 4
	b = False + 10

	print("x is", x)
	print("y is", y)
	print("a:", a)
	print("b:", b)


def character_count():
	my_text = """Lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco
laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit
esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident,
sunt in culpa qui officia deserunt mollit anim id est laborum."""
	return len(my_text)
 

def longest_sentence_without_a():
	longest_sentence = ""

	while True:
		sentence = input('Enter a sentence without the character "A": ')
		if "a" in sentence.lower():
			print('That sentence contains "A". Try again.')
			continue

		if len(sentence) > len(longest_sentence):
			longest_sentence = sentence
			print("Congratulations! You set a new longest sentence.")


if __name__ == "__main__":
	show_outputs()
	print("Character count:", character_count())
	longest_sentence_without_a()
