# 1Declare a variable called first and assign it to the value "Hello World".
from ast import Assign
import string


first = "Hello World"
# Write a comment that says "This is a comment."
print("This is a comment")
#Log a message to the terminal that says "I AM A COMPUTER!"
print("I am a computer")  
# Write an if statement that checks if 1 is less than 2 and if 4 is greater than 2. If it is, show the message "Math is fun."
if 1 < 2 and 4 > 2:
 print("Math is fun.")
 print(1<2 and 4>2)
 # Assign a variable called nope to an absence of value
nope=False
print(nope)
#Use the language’s “and” boolean operator to combine the language’s “true” value with its “false” value.
print("True"and"False")
#Calculate the length of the string "What's my length?"
print(len("what is my length")) #output: 17
#Convert the string "i am shouting" to uppercase
print("I am shouting")
#Combine the number 4 with the string "real" to produce "4real"
print(f"{4} real")
#Convert the string "i am shouting" to uppercase.
print("i am shouting".upper())
#Convert the string "1000" to the number 1000.
print(int("1000"))
#Combine the number 4 with the string "real" to produce "4real".
print(f"{4}real")
#Record the output of the expression 3 * "cool".
print(3 * "cool")
#Record the output of the expression 1 / 0.
# print(1 / 0)  # This will raise a ZeroDivisionError
# Determine the type of [].
print(type([]))
# Ask the user for their name, and store it in a variable called name.
name = input("What is your name? ")
print(f"Hello, {name}!")
# Find the index of "l" in "apple"
print("apple".index("l"))
# Check whether "y" is in "xylophone".
print("y" in "xylophone")
# Check whether a string called my_string is all in lowercase.
my_string = input("Please enter a string: ")
print(my_string.islower())

# Ask the user for a number and report whether it's negative, positive, or zero.
try:
	num_input = input("Enter a number: ")
	num = float(num_input)
except ValueError:
	print("That's not a valid number.")
else:
	if num < 0:
		print("That number is less than 0!")
	elif num > 0:
		print("That number is greater than 0!")
	else:
		print("You picked 0!")
		