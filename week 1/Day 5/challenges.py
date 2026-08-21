import math


# Exercise 1: insert an item at a chosen position without changing the original list.
def insert_at_index(items, index, item):
	"""Return a copy of items with item inserted at index."""
	result = items[:]
	result.insert(index, item)
	return result


# Exercise 2: count every space character in a string.
def count_spaces(text):
	"""Return the number of regular spaces in text."""
	spaces = 0
	for character in text:
		if character == " ":
			spaces += 1
	return spaces


# Exercise 3: count uppercase and lowercase letters separately.
def count_cases(text):
	"""Return a dictionary containing uppercase and lowercase letter counts."""
	uppercase = 0
	lowercase = 0

	for character in text:
		if character.isupper():
			uppercase += 1
		elif character.islower():
			lowercase += 1

	return {"uppercase": uppercase, "lowercase": lowercase}


# Exercise 4: calculate a list's sum without using sum().
def my_sum(numbers):
	"""Return the total of all numbers in numbers."""
	total = 0
	for number in numbers:
		total += number
	return total


# Exercise 5: find the largest number without using max().
def find_max(numbers):
	"""Return the largest number in a non-empty list."""
	if not numbers:
		raise ValueError("find_max() needs at least one number")

	largest = numbers[0]
	for number in numbers[1:]:
		if number > largest:
			largest = number
	return largest


# Exercise 6: calculate a factorial using a loop.
def factorial(number):
	"""Return number!, requiring a non-negative integer."""
	if not isinstance(number, int) or isinstance(number, bool) or number < 0:
		raise ValueError("factorial() needs a non-negative integer")

	result = 1
	for value in range(2, number + 1):
		result *= value
	return result


# Exercise 7: count matching elements without using list.count().
def list_count(items, target):
	"""Return the number of times target appears in items."""
	matches = 0
	for item in items:
		if item == target:
			matches += 1
	return matches


# Exercise 8: calculate the L2 norm, also called the Euclidean norm.
def norm(numbers):
	"""Return the square root of the sum of the numbers' squares."""
	sum_of_squares = 0
	for number in numbers:
		sum_of_squares += number * number
	return math.sqrt(sum_of_squares)


# Exercise 9: check whether values increase or decrease without changing direction.
def is_mono(numbers):
	"""Return True when numbers are monotonic in either direction."""
	increasing = True
	decreasing = True

	for index in range(1, len(numbers)):
		if numbers[index] < numbers[index - 1]:
			increasing = False
		if numbers[index] > numbers[index - 1]:
			decreasing = False

	return increasing or decreasing


# Exercise 10: find and print the longest word, returning it for easy testing.
def print_longest_word(words):
	"""Print and return the first longest word in words."""
	if not words:
		raise ValueError("print_longest_word() needs at least one word")

	longest = words[0]
	for word in words[1:]:
		if len(word) > len(longest):
			longest = word

	print(longest)
	return longest


# Exercise 11: separate integers and strings into two new lists.
def separate_types(items):
	"""Return two lists: integers first and strings second."""
	integers = []
	strings = []

	for item in items:
		if isinstance(item, bool):
			# bool is technically an int subclass, but it is not an integer here.
			continue
		if isinstance(item, int):
			integers.append(item)
		elif isinstance(item, str):
			strings.append(item)

	return integers, strings


# Exercise 12: compare a string with its reversed version.
def is_palindrome(text):
	"""Return True when text reads the same forwards and backwards."""
	return text == text[::-1]


# Exercise 13: count words whose length is greater than k.
def sum_over_k(sentence, k):
	"""Return the number of words in sentence longer than k characters."""
	count = 0
	for word in sentence.split():
		if len(word) > k:
			count += 1
	return count


# Exercise 14: calculate the arithmetic average of dictionary values.
def dict_avg(values):
	"""Return the average of numeric dictionary values."""
	if not values:
		raise ValueError("dict_avg() needs at least one value")
	return my_sum(values.values()) / len(values)


# Exercise 15: find positive divisors shared by two numbers.
def common_div(number_one, number_two):
	"""Return the common positive divisors of two non-zero integers."""
	number_one = abs(number_one)
	number_two = abs(number_two)

	if number_one == 0 or number_two == 0:
		raise ValueError("common_div() does not accept zero")

	divisors = []
	for divisor in range(1, min(number_one, number_two) + 1):
		if number_one % divisor == 0 and number_two % divisor == 0:
			divisors.append(divisor)
	return divisors


# Exercise 16: test divisibility only up to the square root for efficiency.
def is_prime(number):
	"""Return True when number is a prime number."""
	if number < 2:
		return False
	for divisor in range(2, math.isqrt(number) + 1):
		if number % divisor == 0:
			return False
	return True


# Exercise 17: print values that are both at an even index and even themselves.
def weird_print(items):
	"""Print and return values with an even index and an even value."""
	result = []
	for index, value in enumerate(items):
		if index % 2 == 0 and value % 2 == 0:
			result.append(value)
	print(result)
	return result


# Exercise 18: count keyword arguments by their exact basic type.
def type_count(**values):
	"""Return counts for int, str, float, and bool keyword values."""
	counts = {"int": 0, "str": 0, "float": 0, "bool": 0}

	for value in values.values():
		# Check bool before int because bool inherits from int in Python.
		if type(value) is bool:
			counts["bool"] += 1
		elif type(value) is int:
			counts["int"] += 1
		elif type(value) is str:
			counts["str"] += 1
		elif type(value) is float:
			counts["float"] += 1

	return counts


# Exercise 19: split on whitespace by default or on a supplied separator.
def custom_split(text, separator=None):
	"""Return text parts using whitespace or the requested separator."""
	parts = []
	current = ""

	for character in text:
		if separator is None:
			is_separator = character.isspace()
		else:
			is_separator = character == separator

		if is_separator:
			if current:
				parts.append(current)
				current = ""
			# Repeated separators do not create empty parts, like split().
		else:
			current += character

	if current:
		parts.append(current)
	return parts


# Exercise 20: replace every character in a password with a star.
def password_format(password):
	"""Return one star for every character in password."""
	return "*" * len(password)


if __name__ == "__main__":
	# These examples demonstrate the requested functions when this file runs.
	print("Exercise 1:", insert_at_index([1, 2, 4], 2, 3))
	print("Exercise 2:", count_spaces("hello beautiful world"))
	print("Exercise 3:", count_cases("Hello WORLD!"))
	print("Exercise 4:", my_sum([1, 5, 4, 2]))
	print("Exercise 5:", find_max([0, 1, 3, 50]))
	print("Exercise 6:", factorial(4))
	print("Exercise 7:", list_count(["a", "a", "t", "o"], "a"))
	print("Exercise 8:", norm([1, 2, 2]))
	print("Exercise 9:", is_mono([7, 6, 5, 5, 2, 0]))
	print("Exercise 10:", end=" ")
	print_longest_word(["cat", "elephant", "dog"])
	print("Exercise 11:", separate_types([1, "two", 3, "four"]))
	print("Exercise 12:", is_palindrome("radar"))
	print("Exercise 13:", sum_over_k("Do or do not there is no try", 2))
	print("Exercise 14:", dict_avg({"a": 1, "b": 2, "c": 8, "d": 1}))
	print("Exercise 15:", common_div(10, 20))
	print("Exercise 16:", is_prime(11))
	print("Exercise 17:", end=" ")
	weird_print([1, 2, 2, 3, 4, 5])
	print("Exercise 18:", type_count(a=1, b="string", c=1.0, d=True, e=False))
	print("Exercise 19:", custom_split("one two three"))
	print("Exercise 20:", password_format("mypassword"))
