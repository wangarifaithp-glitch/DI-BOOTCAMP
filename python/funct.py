def find_largest(nums):
	"""Return the largest number in the list, or None for empty lists."""
	if not nums:
		return None
	largest = nums[0]
	for n in nums[1:]:
		if n > largest:
			largest = n
	return largest


def check_letter(word, letter):
	"""Return True if `letter` is in `word`, else False."""
	return letter in word


def count_to_number(n):
	"""Print numbers from 1 to n (inclusive). If n < 1, prints nothing."""
	for i in range(1, n + 1):
		print(i)


if __name__ == "__main__":
	# Examples / simple tests
	print(find_largest([1, 2, 3, 4]))  # 4
	print(find_largest([10, 20, 5]))  # 20
	print(find_largest([]))  # None

	print(check_letter("apple", "a"))  # True
	print(check_letter("banana", "z"))  # False

	count_to_number(3)
