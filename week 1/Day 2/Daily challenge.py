user_word = input("user's word: ")

modified_word = ""
for letter in user_word:
	if not modified_word or letter != modified_word[-1]:
		modified_word += letter

print(modified_word)
