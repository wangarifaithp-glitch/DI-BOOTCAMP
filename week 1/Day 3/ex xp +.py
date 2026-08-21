student_grades = {
    "Alice": [88, 92, 100],
    "Bob": [75, 78, 80],
    "Charlie": [92, 90, 85],
    "Dana": [83, 88, 92],
    "Eli":[78, 80, 72]
}

#calculate the average age of each studennt
student_averages = {}
for student, grades in student_grades.items():
    student_averages[student] = sum(grades) / len(grades)

print("Student averages:", student_averages)


#Asign a letter grade based on the average score
students_letter_grades = {}
for student, average in student_averages.items():
    if average >= 90:
        students_letter_grades[student] = "A"
    elif average >= 80:
        students_letter_grades[student] = "B"
    elif average >= 70:
        students_letter_grades[student] = "C"
    elif average >= 60:
        students_letter_grades[student] = "D"
    else:
        students_letter_grades[student] = "F"

print("Student letter grades:", students_letter_grades)

def clean_price(price_str):
    return int(price_str.replace("$", "").replace(",", ""))

#exersice 2
#advanced data manipulation
sales_data = [
    {"customer-id": 1, "product": "smartphone"},
    {"customer-id": 2, "product": "laptop"},
    {"customer-id": 1, "product": "laptop"},
    {"customer-id": 2, "product": "smartphone"},
    {"customer-id": 3, "product": "headphone"},
    {"customer-id": 3, "product": "smartphone"},
    {"customer-id": 1, "product": "headphone"},
]

#tottal sales per product
total_sales_per_product = {}
for item in sales_data:
    product = item["product"]
    if product in total_sales_per_product:
        total_sales_per_product[product] += 1
    else:
        total_sales_per_product[product] = 1

print("Total sales per product:", total_sales_per_product)