from datetime import date, datetime, timedelta
import random
import re
import string

import holidays


# Exercise 1
def upcoming_holiday(country="US"):
	today = date.today()
	holiday_calendar = holidays.country_holidays(country, years=today.year)

	for day_offset in range(0, 367):
		holiday_date = today + timedelta(days=day_offset)
		if holiday_date in holiday_calendar:
			holiday_name = holiday_calendar.get(holiday_date)
			return today, holiday_date, holiday_name, (holiday_date - today).days

	raise RuntimeError("No upcoming holiday was found.")


def display_upcoming_holiday(country="US"):
	today, holiday_date, holiday_name, days_left = upcoming_holiday(country)
	print(f"Today is {today:%B %d, %Y}.")
	print(
		f"The next holiday is {holiday_name} on {holiday_date:%B %d, %Y}, "
		f"in {days_left} days."
	)


# Exercise 2
PLANET orbital_periods = {
	"Earth": 1,
	"Mercury": 0.2408467,
	"Venus": 0.61519726,
	"Mars": 1.8808158,
	"Jupiter": 11.862615,
	"Saturn": 29.447498,
	"Uranus": 84.016846,
	"Neptune": 164.79132,
}


def ages_on_planets(age_in_seconds):
	earth_years = age_in_seconds / 31_557_600
	return {
		planet: round(earth_years / orbital_period, 2)
		for planet, orbital_period in orbital_periods.items()
	}


# Exercise 3
def return_numbers(text):
	return "".join(re.findall(r"\d", text))


# Exercise 4
def valid_full_name(name):
	return bool(re.fullmatch(r"[A-Z][a-z]+ [A-Z][a-z]+", name))


def ask_for_valid_name():
	while True:
		name = input("Enter your full name: ").strip()
		if valid_full_name(name):
			return name
		print("Please enter two names with one space and capital initials.")


# Exercise 5
SPECIAL_CHARACTERS = "!@#$%^_&*()-+=?"
PASSWORD_CHARACTERS = string.ascii_letters + string.digits + SPECIAL_CHARACTERS


def valid_password(password, length):
	return (
		len(password) == length
		and any(character.isdigit() for character in password)
		and any(character.islower() for character in password)
		and any(character.isupper() for character in password)
		and any(character in SPECIAL_CHARACTERS for character in password)
	)


def generate_password(length):
	if not 6 <= length <= 30:
		raise ValueError("Password length must be between 6 and 30.")

	required_characters = [
		random.choice(string.digits),
		random.choice(string.ascii_lowercase),
		random.choice(string.ascii_uppercase),
		random.choice(SPECIAL_CHARACTERS),
	]
	remaining_characters = random.choices(
		PASSWORD_CHARACTERS, k=length - len(required_characters)
	)
	password_characters = required_characters + remaining_characters
	random.shuffle(password_characters)
	return "".join(password_characters)


def ask_for_password_length():
	while True:
		try:
			length = int(input("Password length (6-30): "))
			if 6 <= length <= 30:
				return length
		except ValueError:
			pass
		print("Please enter a whole number from 6 to 30.")


def test_password_generator():
	for _ in range(100):
		length = random.randint(6, 30)
		password = generate_password(length)
		assert valid_password(password, length)
	print("100 password tests passed.")


if __name__ == "__main__":
	print(ages_on_planets(1_000_000_000))
	print(return_numbers("k5k3q2g5z6x9bn"))
	print(valid_full_name("John Doe"))
	test_password_generator()
