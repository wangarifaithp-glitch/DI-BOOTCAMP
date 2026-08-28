"""Object-oriented programming quiz and deck of cards exercise."""


# Exercise 1: OOP concepts
answers = {
	"What is a class?": (
		"A class is a blueprint that defines the data and behavior of objects."
	),
	"What is an instance?": (
		"An instance is a concrete object created from a class."
	),
	"What is encapsulation?": (
		"Encapsulation bundles data and methods together and controls access to them."
	),
	"What is abstraction?": (
		"Abstraction hides implementation details and exposes only essential features."
	),
	"What is inheritance?": (
		"Inheritance allows a class to reuse or extend attributes and methods from another class."
	),
	"What is multiple inheritance?": (
		"Multiple inheritance allows a class to inherit from more than one parent class."
	),
	"What is polymorphism?": (
		"Polymorphism allows the same method interface to behave differently for different objects."
	),
	"What is method resolution order or MRO?": (
		"MRO is the order Python follows to find methods and attributes in a class hierarchy."
	),
}


class Card:
	"""Represent one playing card."""

	suits = ("Hearts", "Diamonds", "Clubs", "Spades")
	values = ("A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K")

	def __init__(self, suit, value):
		if suit not in self.suits:
			raise ValueError(f"Invalid suit: {suit}")
		if value not in self.values:
			raise ValueError(f"Invalid value: {value}")
		self.suit = suit
		self.value = value

	def __repr__(self):
		return f"Card({self.suit!r}, {self.value!r})"


class Deck:
	"""Represent and manage a standard 52-card deck."""

	def __init__(self):
		self.cards = [
			Card(suit, value)
			for suit in Card.suits
			for value in Card.values
		]

	def shuffle(self):
		"""Reset the deck to all 52 cards and shuffle it randomly."""
		self.cards = [
			Card(suit, value)
			for suit in Card.suits
			for value in Card.values
		]
		import random

		random.shuffle(self.cards)

	def deal(self):
		"""Deal and remove one card, or return None when the deck is empty."""
		if not self.cards:
			return None
		return self.cards.pop()


if __name__ == "__main__":
	for question, answer in answers.items():
		print(f"{question}\n{answer}\n")

	deck = Deck()
	deck.shuffle()
	print(f"Cards in deck: {len(deck.cards)}")
	print(f"Dealt card: {deck.deal()}")
	print(f"Cards remaining: {len(deck.cards)}")
