from menu_manager import MenuManager


manager = None


def load_manager():
    """Create and return the menu manager."""
    return MenuManager()


def show_restaurant_menu():
    """Display the current restaurant menu."""
    print("\nRestaurant menu")
    print(manager.display_menu())


def add_valentines_item():
    """Read and add a Valentine's item through the manager."""
    name = input("Valentine's item name: ").strip()
    price = input("Price (XX,14): ").strip()
    if manager.add_valentines_item(name, price):
        print("Valentine's item was added successfully.")
    else:
        print("Error: invalid Valentine's item name or price.")


def add_item_to_menu():
    """Read an item from the user and ask the manager to add it."""
    name = input("Item name: ").strip()
    if not name:
        print("Error: item name cannot be empty.")
        return

    try:
        price = float(input("Item price: "))
        if price < 0:
            raise ValueError
    except ValueError:
        print("Error: price must be a non-negative number.")
        return

    manager.add_item(name, price)
    print("Item was added successfully.")


def remove_item_from_menu():
    """Read an item name and ask the manager to remove it."""
    name = input("Item name to remove: ").strip()
    if manager.remove_item(name):
        print("Item was deleted successfully.")
    else:
        print("Error: item was not found.")


def show_user_menu():
    """Run the manager's program menu until the user exits."""
    global manager
    manager = load_manager()

    while True:
        print("\n1. Show restaurant menu")
        print("2. Add an item")
        print("3. Delete an item")
        print("4. Add Valentine's item")
        print("5. Exit")
        choice = input("Choose an option: ").strip()

        if choice == "1":
            show_restaurant_menu()
        elif choice == "2":
            add_item_to_menu()
        elif choice == "3":
            remove_item_from_menu()
        elif choice == "4":
            add_valentines_item()
        elif choice == "5":
            manager.save_to_file()
            print("Menu saved. Goodbye!")
            break
        else:
            print("Error: choose an option from 1 to 5.")


if __name__ == "__main__":
    show_user_menu()
