#exercise 1

#initialize dict with 5 birthdays
birthdays = {
	"Alice": "1995/04/12",
	"Bob": "1992/09/23",
	"Charlie": "2000/01/08",
	"Diana": "1988/11/30",
	"Ethan": "1997/06/17",
}

#welcome message

print("Welcome to the birthday lookup program!")
print("You can look up the birthdays of the people in the list!")
print("Available names:")
for name in birthdays:
	print(f"- {name}")

    #user input and look up

new_name = input("Add a person's name: ").strip()
new_birthday = input("Add their birthday (YYYY/MM/DD): ").strip()
birthdays[new_name] = new_birthday

#persons name

person_name = input("Whose birthday would you like to look up? ").strip()
if person_name in birthdays:
	print(f"{person_name}'s birthday is {birthdays[person_name]}.")
else:
	print(f"Sorry, we don't have the birthday information for {person_name}.")

#print items and prices in sentence
items = {
	"banana": 4,
	"apple": 2,
	"orange": 1.5,
	"pear": 3,
}

print("Fruit prices:")
for item, price in items.items():
	print(f"The price of {item} is ${price}.")

#calculate th total stock to buy everything
items_in_stock = {
	"banana": {"price": 4, "stock": 10},
	"apple": {"price": 2, "stock": 5},
	"orange": {"price": 1.5, "stock": 24},
	"pear": {"price": 3, "stock": 1},
}
#total cost

total_inventory_value = sum(
	item_details["price"] * item_details["stock"]
	for item_details in items_in_stock.values()
)
print(f"The total value of all the fruit in stock is ${total_inventory_value}.")
