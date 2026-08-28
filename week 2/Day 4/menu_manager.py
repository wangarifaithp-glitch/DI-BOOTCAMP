import json
import re
from pathlib import Path


MENU_FILE = Path(__file__).with_name("restaurant_menu.json")


class MenuManager:
    """Load, update, and save the restaurant menu."""

    def __init__(self, menu_file=MENU_FILE):
        self.menu_file = Path(menu_file)
        with self.menu_file.open("r", encoding="utf-8") as file:
            data = json.load(file)
            self.menu = data["items"]
            self.valentines_items = data.get("valentines_items", [])

    def add_item(self, name, price):
        """Add an item without saving it immediately."""
        self.menu.append({"name": name.strip(), "price": float(price)})

    def remove_item(self, name):
        """Remove an item by name and return whether it was found."""
        for index, item in enumerate(self.menu):
            if item["name"].casefold() == name.strip().casefold():
                del self.menu[index]
                return True
        return False

    def save_to_file(self):
        """Save the current menu to the JSON file."""
        with self.menu_file.open("w", encoding="utf-8") as file:
            json.dump(
                {"items": self.menu, "valentines_items": self.valentines_items},
                file,
                indent=4,
            )
            file.write("\n")

    def add_valentines_item(self, name, price):
        """Validate and add a Valentine's item, returning success and a message."""
        words = name.strip().split()
        valid_connection_words = {"of", "and", "the", "with", "in"}
        name_is_valid = bool(words) and all(
            word.isalpha() or (word.endswith("-day") and word[:-4].isalpha())
            for word in words
        ) and "e" in name.lower() and name.lower().count("e") >= 2

        for index, word in enumerate(words):
            if index == 0 and not word.startswith("V"):
                name_is_valid = False
            elif word.lower() in valid_connection_words:
                if word != word.lower():
                    name_is_valid = False
            elif not word[0].isupper():
                name_is_valid = False

        if not name_is_valid or not re.fullmatch(r"\d{2},14", str(price).strip()):
            return False

        self.valentines_items.append({"name": name.strip(), "price": str(price).strip()})
        return True

    def heart(self):
        """Return a small heart made from asterisks."""
        return "  **   **\n ****** ******\n***************\n *************\n  ***********\n   *********\n    *******\n     *****\n      ***\n       *"

    def display_menu(self):
        """Return a formatted view of the restaurant menu."""
        if not self.menu:
            return "The restaurant menu is empty."
        return self.heart() + "\n\n" + "\n".join(
            f"{index}. {item['name']} - ${item['price']:.2f}"
            for index, item in enumerate(self.menu, start=1)
        )
