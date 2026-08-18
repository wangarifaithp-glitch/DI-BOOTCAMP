#Given a list: [("name", "Elie"), ("job", "Instructor")], create a dictionary that looks like this: {'job': 'Instructor', 'name': 'Elie'} 
list_of_tuples = [("name", "Elie"), ("job", "Instructor")]
my_dict = dict(list_of_tuples)
print(my_dict)
#Given two lists: ["CA", "NJ", "RI"] and ["California", "New Jersey", "Rhode Island"], return a dictionary that looks like this: {'CA': 'California', 'NJ': 'New Jersey', 'RI': 'Rhode Island'}
keys = ["CA", "NJ", "RI"]
values = ["California", "New Jersey", "Rhode Island"]

result = dict(zip(keys, values))
print(result)  # Output: {'CA': 'California', 'NJ': 'New Jersey', 'RI': 'Rhode Island'}
# Create a dictionary where the keys are vowels in the alphabet and the values are 0
vowels = 'aeiou'
my_dict = {vowel: 0 for vowel in vowels}
print(my_dict)  # Output: {'a': 0, 'e': 0, 'i': 0, 'o': 0, 'u': 0}
#Create a dictionary where the key is the position of the letter in the alphabet, and the value is the letter itself. You should return something like this:

{1: 'A',
 2: 'B',
 3: 'C',
 4: 'D',
 5: 'E',
 6: 'F',
 7: 'G',
 8: 'H',
 9: 'I',
 10: 'J',
 11: 'K',
 12: 'L',
 13: 'M',
 14: 'N',
 15: 'O',
 16: 'P',
 17: 'Q',
 18: 'R',
 19: 'S',
 20: 'T',
 21: 'U',
 22: 'V',
 23: 'W',
 24: 'X',
 25: 'Y',
 26: 'Z'}