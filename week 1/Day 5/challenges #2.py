# Week 1, Day 5 - Loop Challenges


# Exercise 1, pattern 1: print a centered pyramid with three rows.
def draw_centered_pyramid():
	for row in range(3):
		spaces = 2 - row
		stars = 2 * row + 1
		print(" " * spaces + "*" * stars)


# Exercise 1, pattern 2: print a right-aligned triangle with five rows.
def draw_right_aligned_triangle():
	for row in range(1, 6):
		spaces = 5 - row
		print(" " * spaces + "*" * row)


# Exercise 1, pattern 3: print an increasing triangle followed by a decreasing one.
def draw_hourglass_triangle():
	# Print the first half, from one star to five stars.
	for row in range(1, 6):
		print("*" * row)

	# Print the second half, from five stars back to one star.
	for row in range(5, 0, -1):
		spaces = 5 - row
		print(" " * spaces + "*" * row)


# Exercise 2: analyse the selection-sort program.
my_list = [2, 24, 12, 354, 233]  # The list before sorting.

# The outer loop selects each position that needs the next smallest value.
for i in range(len(my_list) - 1):
	minimum = i  # Start by assuming the current position has the smallest value.

	# The inner loop searches the unsorted part of the list.
	for j in range(i + 1, len(my_list)):
		# Compare the current candidate with the smallest value found so far.
		if my_list[j] < my_list[minimum]:
			minimum = j  # Store the index of the newly found smaller value.

			# Move the smallest value found into position i.
			if minimum != i:
				my_list[i], my_list[minimum] = my_list[minimum], my_list[i]

# Trace of the variables and list changes:
# Start: my_list = [2, 24, 12, 354, 233]
# i = 0: minimum starts at 0 (value 2); no smaller value is found.
# i = 1: minimum starts at 1 (value 24); j = 2 finds 12, so swap -> [2, 12, 24, 354, 233].
#        j = 3 and j = 4 do not change minimum or the list.
# i = 2: minimum starts at 2 (value 24); no smaller value is found.
# i = 3: minimum starts at 3 (value 354); j = 4 finds 233, so swap -> [2, 12, 24, 233, 354].
# Final values: i has finished at 3, minimum is 4, and my_list is sorted.
print("Sorted list:", my_list)


if __name__ == "__main__":
	# Run the three pattern examples when this file is executed directly.
	print("Pattern 1:")
	draw_centered_pyramid()

	print("\nPattern 2:")
	draw_right_aligned_triangle()

	print("\nPattern 3:")
	draw_hourglass_triangle()
