import random
import string
from datetime import date, datetime

try:
    from faker import Faker
except ImportError:
    Faker = None


class Currency:
    def __init__(self, currency, amount):
        self.currency = currency
        self.amount = amount

    def __str__(self):
        label = self.currency if self.amount == 1 else f"{self.currency}s"
        return f"{self.amount} {label}"

    def __repr__(self):
        return str(self)

    def __int__(self):
        return self.amount

    def __add__(self, other):
        if isinstance(other, Currency):
            if self.currency != other.currency:
                raise TypeError(
                    f"Cannot add between Currency type <{self.currency}> and <{other.currency}>"
                )
            return self.amount + other.amount
        if isinstance(other, (int, float)):
            return self.amount + other
        return NotImplemented

    def __iadd__(self, other):
        if isinstance(other, Currency):
            if self.currency != other.currency:
                raise TypeError(
                    f"Cannot add between Currency type <{self.currency}> and <{other.currency}>"
                )
            self.amount += other.amount
            return self
        if isinstance(other, (int, float)):
            self.amount += other
            return self
        return NotImplemented


def currency_demo():
    c1 = Currency("dollar", 5)
    c2 = Currency("dollar", 10)
    c3 = Currency("shekel", 1)

    print(c1)
    print(int(c1))
    print(repr(c1))
    print(c1 + 5)
    print(c1 + c2)
    print(c1)

    c1 += 5
    print(c1)

    c1 += c2
    print(c1)

    try:
        print(c1 + c3)
    except TypeError as error:
        print(error)


def generate_random_string(length=5):
    letters = string.ascii_letters
    return "".join(random.choice(letters) for _ in range(length))


def display_current_date():
    today = date.today()
    print(today)
    return today


def time_left_until_january_first():
    now = datetime.now()
    next_year = datetime(now.year + 1, 1, 1)
    difference = next_year - now
    print(difference)
    return difference


def minutes_lived(birthdate):
    birth_date = datetime.strptime(birthdate, "%Y-%m-%d")
    minutes = (datetime.now() - birth_date).total_seconds() / 60
    print(f"You lived approximately {int(minutes)} minutes.")
    return int(minutes)


def add_users(number_of_users):
    if Faker is None:
        raise ImportError("Install faker with: pip install faker")

    fake = Faker()
    users = []
    for _ in range(number_of_users):
        user = {
            "name": fake.name(),
            "address": fake.address(),
            "language_code": fake.language_code(),
        }
        users.append(user)
    return users


if __name__ == "__main__":
    currency_demo()
    print(generate_random_string())
    display_current_date()
    time_left_until_january_first()
    minutes_lived("1990-01-01")
    print(add_users(3))
