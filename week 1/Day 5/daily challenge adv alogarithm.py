import random


# Generate the list and define the number that each pair must total.
list_of_numbers = [random.randint(0, 10000) for _ in range(20000)]
target_number = 3728


def find_pairs(numbers, target):
	"""Return each unique pair of values whose sum equals target."""
	# Count every value so duplicate pairs such as 1864 + 1864 can be checked.
	number_counts = {}
	for number in numbers:
		number_counts[number] = number_counts.get(number, 0) + 1

	pairs = []

	# Sorting makes the output predictable and lets us avoid reversed duplicates.
	for number in sorted(number_counts):
		complement = target - number

		# Only inspect complements that are present in the input.
		if complement not in number_counts:
			continue

		# A number can pair with itself only when it occurs at least twice.
		if number == complement and number_counts[number] < 2:
			continue

		# Keep only the pair whose smaller value comes first.
		if number <= complement:
			pairs.append((number, complement))

	return pairs


# Find all matching pairs in the generated list.
pairs = find_pairs(list_of_numbers, target_number)

# Display the result in the format requested by the exercise.
if pairs:
	for first_number, second_number in pairs:
		print(
			f"{first_number} and {second_number} "
			f"sums to the target_number {target_number}"
		)
else:
	print(f"No pairs sum to the target_number {target_number}.")
