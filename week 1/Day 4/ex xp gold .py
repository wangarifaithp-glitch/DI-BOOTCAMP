import random


# Current date used to calculate ages in the retirement exercise.
CURRENT_YEAR = 2026
CURRENT_MONTH = 8
CURRENT_DAY = 20


# Exercise 1: calculate a person's age from their date of birth.
def get_age(year, month, day):
	age = CURRENT_YEAR - year
	# Subtract one if the birthday has not happened yet this year.
	if (CURRENT_MONTH, CURRENT_DAY) < (month, day):
		age -= 1
	return age


def can_retire(gender, date_of_birth):
	year, month, day = date_of_birth
	age = get_age(year, month, day)
	# The exercise uses different retirement ages for men and women.
	retirement_age = 67 if gender.lower() == "m" else 62
	return age >= retirement_age


def retirement_check():
	gender = input("Enter your gender (m/f): ").strip()
	date_parts = input("Enter your date of birth (YYYY/MM/DD): ").split("/")
	date_of_birth = tuple(int(part) for part in date_parts)

	if can_retire(gender, date_of_birth):
		print("You can retire.")
	else:
		print("You cannot retire yet.")


# Exercise 2: calculate X + XX + XXX + XXXX.
def sum_x(x):
	return sum(int(str(x) * multiplier) for multiplier in range(1, 5))


# Exercise 3: return one random dice value.
def throw_dice():
	return random.randint(1, 6)


def throw_until_doubles():
	throws = 0
	# Keep rolling until both dice show the same value.
	while True:
		first_die = throw_dice()
		second_die = throw_dice()
		throws += 1
		if first_die == second_die:
			return throws


def dice_main():
	# Repeat the doubles experiment 100 times and collect each result.
	results = [throw_until_doubles() for _ in range(100)]
	total_throws = sum(results)
	average_throws = total_throws / len(results)
	print(f"Total throws: {total_throws}")
	print(f"Average throws to reach doubles: {average_throws:.2f}")


# Run the exercises.
print("Sum for X=3:", sum_x(3))
retirement_check()
dice_main()
