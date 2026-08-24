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


# Test the MenuManager class
if __name__ == "__main__":
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
