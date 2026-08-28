from game import Game


def get_user_menu_choice():
    """
    Show the main menu and ask the user to pick an option.
    Keeps asking until the user enters 1, 2, or 3.
    Returns the user's choice as a string.
    """
    valid_choices = ["1", "2", "3"]

    while True:
        print("\n=================================")
        print("      ROCK PAPER SCISSORS")
        print("=================================\n")
        print("1. Play a new game")
        print("2. Show scores")
        print("3. Quit")

        choice = input("\nEnter your choice: ").strip()

        if choice in valid_choices:
            return choice
        else:
            print("❌ Invalid choice. Please enter 1, 2, or 3.")


def print_results(results):
    """
    Display the current scores using the values stored in the
    results dictionary. Works correctly even if all values are 0.
    """
    print("\n=================================")
    print("           FINAL SCORES")
    print("=================================\n")
    print(f"🏆 Wins:   {results['win']}")
    print(f"😔 Losses: {results['loss']}")
    print(f"🤝 Draws:  {results['draw']}")
    print("\nThanks for playing Rock-Paper-Scissors! 🎮")
    print("See you next time! 👋")


def main():
    """
    Controls the entire program:
    - keeps track of the score dictionary
    - shows the menu in a loop
    - reacts to the user's menu choice
    """
    # Dictionary to keep track of results as the program runs
    results = {
        "win": 0,
        "loss": 0,
        "draw": 0
    }

    while True:
        choice = get_user_menu_choice()

        if choice == "1":
            # Play a new game
            game = Game()
            result = game.play()
            # Update the matching score in the results dictionary
            results[result] += 1

        elif choice == "2":
            # Show the current scores, then go back to the menu
            print_results(results)

        elif choice == "3":
            # Show final scores and end the program
            print_results(results)
            break


# This makes sure main() only runs when this file is executed directly,
# not when it's imported somewhere else.
if __name__ == "__main__":
    main()