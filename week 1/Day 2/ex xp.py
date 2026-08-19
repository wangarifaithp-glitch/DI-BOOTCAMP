"""Solutions for the sequence, list, set, and tuple exercises."""


# Exercise 1: Favorite Numbers
my_fav_numbers = {3, 7, 21}
my_fav_numbers.add(42)
my_fav_numbers.add(100)
my_fav_numbers.remove(100)

friend_fav_numbers = {5, 7, 13}
our_fav_numbers = my_fav_numbers.union(friend_fav_numbers)
print("Exercise 1:", our_fav_numbers)


# Exercise 2: Tuple
numbers = (1, 2, 3, 4)
try:
	numbers[0] = 99
except TypeError:
	print("Exercise 2: tuples are immutable and cannot be changed")


# Exercise 3: List Manipulation
basket = ["Banana", "Apples", "Oranges", "Blueberries"]
basket.remove("Banana")
basket.remove("Blueberries")
basket.append("Kiwi")
basket.insert(0, "Apples")
apple_count = basket.count("Apples")
basket.clear()
print("Exercise 3: Apples appeared", apple_count, "time(s); final list:", basket)


# Exercise 4: Floats
mixed_numbers = [number / 2 for number in range(3, 11)]
print("Exercise 4:", mixed_numbers)
print("A float has a decimal component; an integer has no decimal component.")


# Exercise 5: For Loop
print("Exercise 5: numbers 1 to 20")
for number in range(1, 21):
	print(number, end=" ")
print()

print("Exercise 5: numbers at even indexes")
for index, number in enumerate(range(1, 21)):
	if index % 2 == 0:
		print(number, end=" ")
print()


# Exercise 6: While Loop
while True:
	name = input("Exercise 6 - enter your name: ").strip()
	if len(name) >= 3 and not name.isdigit() and any(letter.isalpha() for letter in name):
		print("Thank you")
		break
	print("Please enter a proper name with at least 3 letters.")


# Exercise 7: Favorite Fruits
favorite_fruits = input("Exercise 7 - enter favorite fruits separated by spaces: ").lower().split()
chosen_fruit = input("Enter the name of any fruit: ").strip().lower()
if chosen_fruit in favorite_fruits:
	print("You chose one of your favorite fruits! Enjoy!")
else:
	print("You chose a new fruit. I hope you enjoy it!")


# Exercise 8: Pizza Toppings
toppings = []
while True:
	topping = input("Exercise 8 - enter a pizza topping (or 'quit'): ").strip()
	if topping.lower() == "quit":
		break
	if topping:
		toppings.append(topping)
		print(f"Adding {topping} to your pizza.")

pizza_cost = 10 + len(toppings) * 2.50
print("Toppings:", ", ".join(toppings) if toppings else "none")
print(f"Total cost: ${pizza_cost:.2f}")


# Exercise 9: Cinemax Tickets
ages = []
while True:
	age_input = input("Exercise 9 - enter a family member's age (or press Enter to finish): ").strip()
	if not age_input:
		break
	try:
		age = int(age_input)
	except ValueError:
		print("Please enter a whole number.")
		continue
	if age < 0:
		print("Age cannot be negative.")
		continue
	ages.append(age)

total_cost = sum(0 if age < 3 else 10 if age <= 12 else 15 for age in ages)
print(f"Total ticket cost: ${total_cost:.2f}")


# Bonus: restricted movie attendees
attendees = [age for age in ages if 16 <= age <= 21]
print("Restricted movie attendees:", attendees)
