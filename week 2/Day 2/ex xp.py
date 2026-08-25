import random


# Exercise 1: Cats and inheritance.
class Pets:
	def __init__(self, animals):
		self.animals = animals

	def walk(self):
		# Polymorphism: every cat uses its own inherited walk method.
		for animal in self.animals:
			print(animal.walk())


class Cat:
	is_lazy = True

	def __init__(self, name, age):
		self.name = name
		self.age = age

	def walk(self):
		return f"{self.name} is just walking around"


class Bengal(Cat):
	def sing(self, sounds):
		return sounds


class Chartreux(Cat):
	def sing(self, sounds):
		return sounds


class Siamese(Cat):
	pass


# Exercise 2: Dogs and object interactions.
class Dog:
	def __init__(self, name, age, weight):
		self.name = name
		self.age = age
		self.weight = weight

	def bark(self):
		return f"{self.name} is barking"

	def run_speed(self):
		return self.weight / self.age * 10

	def fight(self, other_dog):
		own_score = self.run_speed() * self.weight
		other_score = other_dog.run_speed() * other_dog.weight
		if own_score > other_score:
			return f"{self.name} wins the fight"
		if other_score > own_score:
			return f"{other_dog.name} wins the fight"
		return "The fight is a draw"


# Exercise 3: PetDog adds training and random tricks through inheritance.
class PetDog(Dog):
	def __init__(self, name, age, weight):
		super().__init__(name, age, weight)
		self.trained = False

	def train(self):
		print(self.bark())
		self.trained = True

	def play(self, *args):
		# Accept either Dog objects or names, matching both exercise examples.
		names = [dog.name if isinstance(dog, Dog) else str(dog) for dog in args]
		print(f"{', '.join([self.name] + names)} all play together")

	def do_a_trick(self):
		if self.trained:
			tricks = [
				"does a barrel roll",
				"stands on his back legs",
				"shakes your hand",
				"plays dead",
			]
			print(f"{self.name} {random.choice(tricks)}")


# Exercise 4: Family and Person classes.
class Person:
	def __init__(self, first_name, age):
		self.first_name = first_name
		self.age = age
		self.last_name = ""

	def is_18(self):
		return self.age >= 18


class Family:
	def __init__(self, last_name):
		self.last_name = last_name
		self.members = []

	def born(self, first_name, age):
		# New people inherit the family's last name.
		person = Person(first_name, age)
		person.last_name = self.last_name
		self.members.append(person)

	def check_majority(self, first_name):
		for member in self.members:
			if member.first_name == first_name:
				if member.is_18():
					print("You are over 18, your parents Jane and John accept that you will go out with your friends")
				else:
					print("Sorry, you are not allowed to go out with your friends.")
				return
		print(f"No family member named {first_name} was found.")

	def family_presentation(self):
		print(f"Family name: {self.last_name}")
		for member in self.members:
			print(f"{member.first_name}, {member.age}")


if __name__ == "__main__":
	# Run simple tests for all four exercises.
	all_cats = [Bengal("Luna", 3), Chartreux("Milo", 5), Siamese("Nala", 2)]
	Pets(all_cats).walk()

	dog1 = Dog("Rex", 4, 20)
	dog2 = Dog("Buddy", 2, 15)
	print(dog1.bark())
	print(dog2.run_speed())
	print(dog1.fight(dog2))

	pet_dog = PetDog("Fido", 2, 10)
	pet_dog.train()
	pet_dog.play(dog1, "Max")
	pet_dog.do_a_trick()

	family = Family("Smith")
	family.born("Alice", 20)
	family.born("Ben", 16)
	family.family_presentation()
	family.check_majority("Alice")
	family.check_majority("Ben")
