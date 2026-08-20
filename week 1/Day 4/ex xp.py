import random


# Exercise 1: display a message about what I am learning.
def display_message():
	print("I am learning about functions in Python.")


display_message()


# Exercise 2: display a favorite book using a function parameter.
def favorite_book(title):
	print(f"One of my favorite books is {title}.")


favorite_book("Alice in Wonderland")


# Exercise 3: describe a city and use a default country value.
def describe_city(city, country="Unknown"):
	print(f"{city} is in {country}.")


describe_city("Reykjavik", "Iceland")
describe_city("Paris")


# Exercise 4: compare a user's number with a random number.
def compare_numbers(number):
	random_number = random.randint(1, 100)

	if number == random_number:
		print("Success!")
	else:
		print(f"Fail! Your number: {number}, Random number: {random_number}")


compare_numbers(50)


# Exercise 5: describe a shirt using default and custom values.
def make_shirt(size="large", text="I love Python"):
	print(f"The size of the shirt is {size} and the text is {text}.")


make_shirt()
make_shirt("medium")
make_shirt("small", "Custom message")
make_shirt(size="small", text="Hello!")


# Exercise 6: add "the Great" to every magician's name.
magician_names = ["Harry Houdini", "David Blaine", "Criss Angel"]


def show_magicians(names):
	for name in names:
		print(name)


def make_great(names):
	# Update each item in the original list.
	for index in range(len(names)):
		names[index] = f"{names[index]} the Great"


make_great(magician_names)
show_magicians(magician_names)


# Exercise 7: generate a temperature between -10 and 40 degrees Celsius.
def get_random_temp():
	return random.randint(-10, 40)


def main():
	temperature = get_random_temp()
	print(f"The temperature right now is {temperature} degrees Celsius.")

	# Give advice based on the generated temperature range.
	if temperature < 0:
		print("Brrr, that's freezing! Wear some extra layers today.")
	elif temperature < 16:
		print("Quite chilly! Don't forget your coat.")
	elif temperature <= 23:
		print("Nice weather.")
	elif temperature <= 32:
		print("A bit warm, stay hydrated.")
	else:
		print("It's really hot! Stay cool.")


main()
