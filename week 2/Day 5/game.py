import random


class Game:
    def get_user_item(self):
        """Prompt until the player chooses rock, paper, or scissors."""
        choices = {"rock", "paper", "scissors"}
        while True:
            user_choice = input(
                "Select an item (rock/paper/scissors): "
            ).strip().lower()
            if user_choice in choices:
                return user_choice
            print("Invalid input. Choose rock, paper, or scissors.")

    def get_computer_item(self):
        """Return a random computer choice."""
        return random.choice(["rock", "paper", "scissors"])

    def get_game_result(self, user_item, computer_item):
        """Return win, loss, or draw for the two choices."""
        if user_item == computer_item:
            return "draw"

        winning_choices = {
            "rock": "scissors",
            "paper": "rock",
            "scissors": "paper",
        }
        if winning_choices[user_item] == computer_item:
            return "win"
        return "loss"

    def play(self):
        """Play one round and return the result."""
        user_item = self.get_user_item()
        computer_item = self.get_computer_item()
        result = self.get_game_result(user_item, computer_item)

        print("\n" + "-" * 30)
        print(f"You selected: {user_item}")
        print(f"Computer selected: {computer_item}")
        print(f"Outcome: {result.title()}!")
        print("-" * 30 + "\n")
        return result
