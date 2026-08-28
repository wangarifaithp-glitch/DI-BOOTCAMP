import json
import random
from pathlib import Path


ABILITIES = (
	"Strength",
	"Dexterity",
	"Constitution",
	"Intelligence",
	"Wisdom",
	"Charisma",
)


class Character:
	"""Create one Dungeons & Dragons character."""

	def __init__(self, name, age):
		self.name = name.strip()
		self.age = int(age)
		self.attributes = {ability: self.roll_attribute() for ability in ABILITIES}

	@staticmethod
	def roll_attribute():
		"""Roll four six-sided dice and keep the highest three."""
		rolls = [random.randint(1, 6) for _ in range(4)]
		return sum(sorted(rolls)[1:])

	def to_dict(self):
		return {
			"name": self.name,
			"age": self.age,
			"attributes": self.attributes,
		}


class Game:
	"""Create characters and export them for the players."""

	def __init__(self, output_directory=None):
		self.characters = []
		self.output_directory = Path(output_directory or Path(__file__).parent)

	def create_characters(self):
		"""Ask for the number of players and create their characters."""
		while True:
			try:
				player_count = int(input("How many players are playing? "))
				if player_count > 0:
					break
			except ValueError:
				pass
			print("Please enter a positive whole number.")

		for player_number in range(1, player_count + 1):
			print(f"\nPlayer {player_number}")
			name = input("Character name: ").strip()
			while True:
				try:
					age = int(input("Character age: "))
					if age > 0:
						break
				except ValueError:
					pass
				print("Please enter a positive whole number for the age.")
			self.characters.append(Character(name, age))

	def export_json(self):
		"""Write all characters to a JSON file."""
		path = self.output_directory / "characters.json"
		with path.open("w", encoding="utf-8") as file:
			json.dump([character.to_dict() for character in self.characters], file, indent=4)
		return path

	def export_txt(self):
		"""Write all characters to a readable text file."""
		path = self.output_directory / "characters.txt"
		with path.open("w", encoding="utf-8") as file:
			for character in self.characters:
				file.write(f"Name: {character.name}\nAge: {character.age}\n")
				for ability, score in character.attributes.items():
					file.write(f"{ability}: {score}\n")
				file.write("\n")
		return path


if __name__ == "__main__":
	game = Game()
	game.create_characters()
	game.export_json()
	game.export_txt()
	print("Characters saved to characters.json and characters.txt.")
