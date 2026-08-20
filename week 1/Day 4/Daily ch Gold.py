# The encoded matrix, stored as one multiline string.
MATRIX_STR = """
7ir
Tsi
h%x
i ?
sM# 
$a 
#t%
"""


# Remove the empty line created by the multiline string and keep row spacing.
rows = MATRIX_STR.splitlines()[1:]
matrix = [list(row) for row in rows]

# Read the matrix from top to bottom, one column at a time.
column_text = ""
column_count = max(len(row) for row in matrix)
for column_index in range(column_count):
	for row in matrix:
		if column_index < len(row):
			column_text += row[column_index]

# Replace each group of symbols between letters with one space.
decoded_message = ""
for index, character in enumerate(column_text):
	if character.isalpha():
		decoded_message += character
	elif decoded_message and index + 1 < len(column_text):
		next_character = column_text[index + 1]
		if next_character.isalpha() and not decoded_message.endswith(" "):
			decoded_message += " "

print(decoded_message)
