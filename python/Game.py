import random

def number_guessing_game():
    secret_number = random.randint(1, 100)
    max_attempts = 7
    
    print("🎲 Welcome to the Number Guessing Game!")
    print("I'm thinking of a number between 1 and 100.")
    print(f"You have {max_attempts} attempts to guess it correctly.\n")

    for attempt in range(1, max_attempts + 1):
        try:
            guess = int(input(f"Attempt {attempt}/{max_attempts} - Enter your guess: "))
        except ValueError:
            print("⚠️ Invalid input! Please enter a valid integer.")
            continue

        if guess == secret_number:
            print(f"🎉 Congratulations! You guessed the number in {attempt} attempts!")
            break
        elif guess < secret_number:
            print("📈 Too low! Try a higher number.\n")
        else:
            print("📉 Too high! Try a lower number.\n")
    else:
        # Executed if the loop completes without a 'break'
        print(f"❌ Game Over! You've run out of attempts. The number was {secret_number}.")

if __name__ == "__main__":
    number_guessing_game()