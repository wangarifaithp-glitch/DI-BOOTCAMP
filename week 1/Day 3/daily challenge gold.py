def caesar_cipher(text, shift):
	result = ""

	for character in text:
		if character.isalpha():
			alphabet_start = ord("A") if character.isupper() else ord("a")
			shifted_character = chr(
				(ord(character) - alphabet_start + shift) % 26 + alphabet_start
			)
			result += shifted_character
		else:
			result += character

	return result


choice = input("Would you like to encrypt or decrypt? ").strip().lower()
message = input("Enter your message: ")
shift = int(input("Enter the shift: "))

if choice == "decrypt":
	shift = -shift
elif choice != "encrypt":
	print("Please choose either encrypt or decrypt.")
else:
	print(caesar_cipher(message, shift))

if choice == "decrypt":
	print(caesar_cipher(message, shift))
