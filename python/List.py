# print out all the values in the list one by one.
import string


my_list = [1, 2, 3, 4]
for value in my_list:
    print(value)
# Given a list [1, 2, 3, 4], print out all the values in the list multiplied by 20.
for value in my_list:
    print(value * 20)
# Given a list ["Elie", "Tim", "Matt"], return a new list with only the first letter of each name: ["E", "T", "M"].
names = ["Elie", "Tim", "Matt"]
first_letters = [name[0] for name in names]
print(first_letters)
# Given a list [1, 2, 3, 4, 5, 6], return a new list with all the even values: [2, 4, 6].
even_values = [value for value in my_list if value % 2 == 0]
print(even_values)
# Given two lists [1, 2, 3, 4] and [3, 4, 5, 6], return a new list that contains only the values present in both lists: [3, 4].
list1 = [1, 2, 3, 4]
list2 = [3, 4, 5, 6]
common_values = [value for value in list1 if value in list2]
print(common_values)
# Given a list of words ["Elie", "Tim", "Matt"], return a new list with each word reversed and in lowercase: ["eile", "mit", "ttam"].

reversed_lowercase = [name[::-1].lower() for name in names]
print(reversed_lowercase)
# Given two strings "first" and "third", return a new list of the letters that are present in both strings: ["i", "r", "t"].
string1 = "first"
string2 = "third"
common_letters = [letter for letter in string1 if letter in string2]
print(common_letters)
# For all numbers between 1 and 100, return a list of the numbers that are divisible by 12: [12, 24, 36, 48, 60, 72, 84, 96].
divisible_by_12 = [num for num in range(1, 101) if num % 12 == 0]
print(divisible_by_12)
# Given the string "amazing", return a list with all the vowels removed: ["m", "z", "n", "g"].
vowels = "aeiou"
amazing = "amazing"
no_vowels = [char for char in amazing if char not in vowels]
print(no_vowels)
# Generate a list with the following value: [[0, 1, 2], [0, 1, 2], [0, 1, 2]].
generated_list = [[i for i in range(3)] for _ in range(3)]
print(generated_list)
# Generate a list with the following structure:
#
# [
#   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
#   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
#   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
#   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
#   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
#   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
#   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
#   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
#   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
#   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
#   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
#   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
#   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
#   [0, 1, 2, 3, 4, 5, 6, 7, 8,
#   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
# ]
matrix_10x10 = [list(range(10)) for _ in range(10)]
print(matrix_10x10)