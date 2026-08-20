keys = ['Ten', 'Twenty', 'Thirty']
values = [10, 20, 30]
number_dictionary = dict(zip(keys, values))
print("Exercise 1:", number_dictionary)


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

print("Total cost:", f"${total_cost}")


brand = {
	"name": "Zara",
	"creation_date": 1975,
	"creator_name": "Amancio Ortega Gaona",
	"type_of_clothes": ["men", "women", "children", "home"],
	"international_competitors": ["Gap", "H&M", "Benetton"],
	"number_stores": 7000,
	"major_color": {
		"France": ["blue"],
		"Spain": ["red"],
		"US": ["pink", "green"],
	},
}

brand["number_stores"] = 2
print(
	f"Zara's clients can buy clothes for "
	f"{', '.join(brand['type_of_clothes'])}."
)
brand["country_creation"] = "Spain"

if "international_competitors" in brand:
	brand["international_competitors"].append("Desigual")

brand.pop("creation_date")
print("Last competitor:", brand["international_competitors"][-1])
print("US major colors:", ", ".join(brand["major_color"]["US"]))
print("Number of keys:", len(brand))
print("Keys:", list(brand.keys()))

more_on_zara = {"creation_date": 1975, "number_stores": 10000}
brand.update(more_on_zara)
print("Updated Zara brand:", brand)


users = ["Mickey", "Minnie", "Donald", "Ariel", "Pluto"]
characters_to_indices = {character: index for index, character in enumerate(users)}
indices_to_characters = {index: character for index, character in enumerate(users)}
sorted_characters_to_indices = {
	character: index for index, character in enumerate(sorted(users))
}

print("Characters to indices:", characters_to_indices)
print("Indices to characters:", indices_to_characters)
print("Sorted characters to indices:", sorted_characters_to_indices)
