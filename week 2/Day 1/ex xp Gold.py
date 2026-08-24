import math
import random


# ==================== EXERCISE 1: GEOMETRY ====================

class Circle:
    """A class to represent a circle with radius and geometric calculations."""
    
    def __init__(self, radius=1.0):
        """Initialize a Circle with a given radius (default is 1.0)."""
        self.radius = radius
    
    def perimeter(self):
        """Calculate and return the perimeter (circumference) of the circle."""
        return 2 * math.pi * self.radius
    
    def area(self):
        """Calculate and return the area of the circle."""
        return math.pi * self.radius ** 2
    
    def definition(self):
        """Print the geometrical definition of a circle."""
        print("A circle is a geometric shape consisting of all points in a plane that are")
        print("at a fixed distance (radius) from a single point (center).")
        print(f"\nThis circle has:")
        print(f"  - Radius: {self.radius}")
        print(f"  - Perimeter: {self.perimeter():.2f}")
        print(f"  - Area: {self.area():.2f}")


# ==================== EXERCISE 2: CUSTOM LIST CLASS ====================

class MyList:
    """A custom list class with additional methods for list operations."""
    
    def __init__(self, letters):
        """Initialize MyList with a list of letters."""
        self.letters = letters
    
    def reversed_list(self):
        """Return the reversed list."""
        return self.letters[::-1]
    
    def sorted_list(self):
        """Return the sorted list."""
        return sorted(self.letters)
    
    def random_numbers_list(self):
        """
        Bonus method: Generate a list with the same length as mylist.
        The list is constructed with random numbers using list comprehension.
        """
        return [random.randint(1, 100) for _ in range(len(self.letters))]


# ==================== EXERCISE 3: RESTAURANT MENU MANAGER ====================

class MenuManager:
    """A class to manage restaurant menu items."""
    
    def __init__(self):
        """Initialize the MenuManager with the current menu (list of dictionaries)."""
        self.menu = [
            {"name": "Soup", "price": 10, "spice": "B", "gluten": False},
            {"name": "Hamburger", "price": 15, "spice": "A", "gluten": True},
            {"name": "Salad", "price": 18, "spice": "A", "gluten": False},
            {"name": "French Fries", "price": 5, "spice": "C", "gluten": False},
            {"name": "Beef bourguignon", "price": 25, "spice": "B", "gluten": True},
        ]
    
    def add_item(self, name, price, spice, gluten):
        """Add a new dish to the menu."""
        new_dish = {
            "name": name,
            "price": price,
            "spice": spice,
            "gluten": gluten
        }
        self.menu.append(new_dish)
        print(f"✓ '{name}' has been added to the menu.")
    
    def update_item(self, name, price, spice, gluten):
        """Update an existing dish in the menu."""
        for dish in self.menu:
            if dish["name"].lower() == name.lower():
                dish["price"] = price
                dish["spice"] = spice
                dish["gluten"] = gluten
                print(f"✓ '{name}' has been updated successfully.")
                return
        print(f"✗ '{name}' is not found in the menu. Cannot update.")
    
    def remove_item(self, name):
        """Remove a dish from the menu."""
        for i, dish in enumerate(self.menu):
            if dish["name"].lower() == name.lower():
                removed_dish = self.menu.pop(i)
                print(f"✓ '{name}' has been removed from the menu.")
                self.print_menu()
                return
        print(f"✗ '{name}' is not found in the menu. Cannot remove.")
    
    def print_menu(self):
        """Print the current menu in a formatted way."""
        print("\n" + "="*70)
        print("CURRENT MENU")
        print("="*70)
        for i, dish in enumerate(self.menu, 1):
            gluten_status = "Contains Gluten" if dish["gluten"] else "No Gluten"
            spice_level = f"Spice: {dish['spice']}"
            print(f"{i}. {dish['name']:<20} | ${dish['price']:>3} | {spice_level} | {gluten_status}")
        print("="*70 + "\n")


# ==================== TEST CODE ====================

if __name__ == "__main__":
    # Test Exercise 1: Circle
    print("EXERCISE 1: GEOMETRY - Circle Class")
    print("=" * 70)
    circle1 = Circle()
    circle1.definition()
    
    print("\n")
    
    circle2 = Circle(5)
    circle2.definition()
    
    print("\n" * 2)
    
    # Test Exercise 2: MyList
    print("EXERCISE 2: CUSTOM LIST CLASS - MyList Class")
    print("=" * 70)
    my_list = MyList(['c', 'a', 'b', 'd', 'e'])
    
    print("Original list:", my_list.letters)
    print("Reversed list:", my_list.reversed_list())
    print("Sorted list:", my_list.sorted_list())
    print("Random numbers list:", my_list.random_numbers_list())
    print("Random numbers list (another call):", my_list.random_numbers_list())
    
    print("\n" * 2)
    
    # Test Exercise 3: MenuManager
    print("EXERCISE 3: RESTAURANT MENU MANAGER - MenuManager Class")
    print("=" * 70)
    manager = MenuManager()
    
    # Print initial menu
    manager.print_menu()
    
    # Add a new item
    manager.add_item("Pizza", 20, "A", True)
    manager.print_menu()
    
    # Update an existing item
    manager.update_item("Salad", 19, "B", False)
    manager.print_menu()
    
    # Try to update a non-existent item
    manager.update_item("Pasta", 16, "A", True)
    print()
    
    # Remove an item
    manager.remove_item("Pizza")
    
    # Try to remove a non-existent item
    manager.remove_item("Pasta")
    print()
