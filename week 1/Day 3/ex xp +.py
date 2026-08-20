student_grades = {
    "Alice": [88, 92, 100],
    "Bob": [75, 78, 80],
    "Charlie": [92, 90, 85],
    "Dana": [83, 88, 92],
    "Eli":[78, 80, 72]
}


def clean_price(price_str):
    return int(price_str.replace("$", "").replace(",", ""))


items_purchase = {
    "Water": "$1",
    "Bread": "$3",
    "TV": "$1,000",
    "Fertilizer": "$20",
}
wallet_str = "$300"
wallet = clean_price(wallet_str)
basket = []

for item, price_str in items_purchase.items():
    price = clean_price(price_str)

    if price <= wallet:
        basket.append(item)
        wallet -= price

if not basket:
    print("Nothing")
else:
    print(sorted(basket))

