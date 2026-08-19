"""Solutions for the dictionaries exercises."""


# Exercise 1: Converting Lists into Dictionaries
keys = ["Ten", "Twenty", "Thirty"]
values = [10, 20, 30]
numbers = dict(zip(keys, values))
print("Exercise 1:", numbers)


# Exercise 2: Cinemax
family = {"rick": 43, "beth": 13, "morty": 5, "summer": 8}
total_cost = 0

for name, age in family.items():
	if age < 3:
		ticket_price = 0
	elif age <= 12:
		ticket_price = 10
	else:
		ticket_price = 15
	total_cost += ticket_price
	print(f"{name}: ${ticket_price}")

print(f"Total ticket cost: ${total_cost}")


# Exercise 3: Zara
brand = {
	"name": "Zara",
	"creation_date": 1975,
	"creator_name": "Amancio Ortega Gaona",
	"type_of_clothes": "men, women, children, home",
	"international_competitors": ["Gap", "H&M", "Benetton"],
	"number_stores": 7000,
	"major_color": {
		"France": ["blue"],
		"Spain": ["red"],
		"US": ["pink", "green"],
	},
}

brand["number_stores"] = 2
print(f"Zara's clients can shop for {brand['type_of_clothes']}.")
brand["country_creation"] = "Spain"

if "international_competitors" in brand:
	brand["international_competitors"].append("Desigual")

del brand["creation_date"]
print("Last international competitor:", brand["international_competitors"][-1])
print("US major colors:", ", ".join(brand["major_color"]["US"]))
print("Number of keys:", len(brand))
print("Keys:", list(brand.keys()))

more_on_zara = {"creation_date": 1975, "number_stores": 2}
brand.update(more_on_zara)
print("Zara with bonus data:", brand)


# Exercise 4: Disney Characters
users = ["Mickey", "Minnie", "Donald", "Ariel", "Pluto"]

characters_to_indices = {character: index for index, character in enumerate(users)}
indices_to_characters = {index: character for index, character in enumerate(users)}
sorted_characters_to_indices = {
	character: index for index, character in enumerate(sorted(users))
}

print("Characters to indices:", characters_to_indices)
print("Indices to characters:", indices_to_characters)
print("Sorted characters to indices:", sorted_characters_to_indices)
