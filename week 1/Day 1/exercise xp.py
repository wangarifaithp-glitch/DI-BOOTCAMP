
# Exercise 1: Hello World
print("Hello world\nHello world\nHello world\nHello world")

# Exercise 2: Some Math
math_result = (99 ** 3) * 8
print(math_result)

# Exercise 3: What is the output?
# 5 < 3       -> False
# 3 == 3      -> True
# 3 == "3"    -> False
# "3" > 3     -> TypeError
# "Hello" == "hello" -> False
print(5 < 3)
print(3 == 3)
print(3 == "3")
try:
	print("3" > 3)
except TypeError as error:
	print(type(error).__name__)
print("Hello" == "hello")

# Exercise 4: Your computer brand
computer_brand = "Lenovo"
print(f"I have a {computer_brand} computer.")

# Exercise 5: Your information
name = "EHK"
age = 25
shoe_size = 42
info = f"My name is {name}, I am {age} years old, and my shoe size is {shoe_size}."
print(info)

# Exercise 6: A & B
a = 12
b = 8
if a > b:
	print("Hello World")

# Exercise 7: Odd or Even
number = int(input("Enter a number: "))
if number % 2 == 0:
	print("The number is even.")
else:
	print("The number is odd.")

# Exercise 8: What's your name?
user_name = input("What is your name? ")
if user_name.casefold() == name.casefold():
	print("We have the same name! What are the odds?")
else:
	print(f"Nice to meet you, {user_name}. My name is {name}, so we are name-neighbors!")

# Exercise 9: Tall enough to ride a roller coaster
height = float(input("What is your height in centimeters? "))
if height > 145:
	print("You are tall enough to ride!")
else:
	print("You need to grow some more to ride.")
