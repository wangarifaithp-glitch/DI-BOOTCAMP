# Ask the user to enter the string to search.
text = input("String: ")

# Ask which character should be counted.
character = input("Character: ")

# Count how many times the character appears in the string.
occurrences = text.count(character)

# Display the result.
print(occurrences)
