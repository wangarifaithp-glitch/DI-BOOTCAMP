manufacturers_string = "Volkswagen, Toyota, Ford Motor, Honda, Chevrolet"
manufacturers = [manufacturer.strip() for manufacturer in manufacturers_string.split(",")]

print(f"There are {len(manufacturers)} manufacturers.")
print("Manufacturers in reverse order:", sorted(manufacturers, reverse=True))

with_letter_o = sum("o" in manufacturer.lower() for manufacturer in manufacturers)
without_letter_i = sum("i" not in manufacturer.lower() for manufacturer in manufacturers)
print(f"Manufacturers containing the letter 'o': {with_letter_o}")
print(f"Manufacturers without the letter 'i': {without_letter_i}")

duplicate_manufacturers = [
	"Honda",
	"Volkswagen",
	"Toyota",
	"Ford Motor",
	"Honda",
	"Chevrolet",
	"Toyota",
]
unique_manufacturers = sorted(set(duplicate_manufacturers))
print("Companies without duplicates:", ", ".join(unique_manufacturers))
print(f"There are now {len(unique_manufacturers)} companies.")

reversed_names = [manufacturer[::-1] for manufacturer in unique_manufacturers]
print("Ascending order with reversed names:", reversed_names)
