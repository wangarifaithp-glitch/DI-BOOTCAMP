#Challenge 1
#user input
word =input("enter a word:")

#2. creating the dictionary
letter_indices = {}
for index, letter in enumerate(word):
	if letter in letter_indices:
		letter_indices[letter].append(index)
	else:
		letter_indices[letter] = [index]

print("Letter indices:", letter_indices)

#Challenge 2
#function to clean money string to int
def clean_money(price_str) :
	return int(float(price_str.replace("$", "").replace(",", "").strip()))

#example data
items = {
	"Water": "$2.50",
	"Juice": "$3.00",
	"Salad": "$10.00"
}
#clean water amount
water_amount = clean_money(items["Water"])
print("Water amount:", water_amount)

#clean juice amount
juice_amount = clean_money(items["Juice"])
print("Juice amount:", juice_amount)

#clean salad amount
salad_amount = clean_money(items["Salad"])
print("Salad amount:", salad_amount)
