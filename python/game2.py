import random
import time


# ==========================================================
# 🥷 NUMBER NINJA
# ==========================================================

# Game statistics
high_score = 0
winning_streak = 0
total_wins = 0
total_losses = 0
coins = 0

# Secret mode
secret_mode_unlocked = False


# ==========================================================
# 🎮 DIFFICULTY SETTINGS
# ==========================================================

def choose_difficulty():
    print("\n🥷 CHOOSE YOUR DIFFICULTY")
    print("----------------------------")
    print("1. 🟢 Easy   → Number from 1 to 50  | 7 attempts")
    print("2. 🟡 Medium → Number from 1 to 100 | 5 attempts")
    print("3. 🔴 Hard   → Number from 1 to 500 | 3 attempts")

    while True:
        choice = input("\nChoose your level (1-3): ")

        if choice == "1":
            return "Easy", 50, 7

        elif choice == "2":
            return "Medium", 100, 5

        elif choice == "3":
            return "Hard", 500, 3

        else:
            print("❌ Invalid choice! Please choose 1, 2, or 3.")


# ==========================================================
# 📖 INSTRUCTIONS
# ==========================================================

def show_instructions():
    print("\n" + "=" * 50)
    print("📖 NUMBER NINJA — HOW TO PLAY")
    print("=" * 50)

    print("""
🥷 Your mission:
Guess the secret number chosen by the Number Ninja!

🎯 How it works:
• Choose Easy, Medium, or Hard.
• The Ninja secretly chooses a number.
• You have limited attempts.
• Enter your guess.
• You will receive hints.
• Try to guess the number before your attempts run out.

❤️ You have 5 lives.

💰 You can earn coins by winning.
Coins can be used to buy an EXTRA LIFE.

🔥 Winning games increases your winning streak.

🏆 Achievements can be unlocked as you play.

🥷 SECRET MODE:
Win several games in a row to unlock the secret challenge!

Good luck, Ninja!
""")


# ==========================================================
# 🏆 ACHIEVEMENTS
# ==========================================================

def show_achievements():
    print("\n🏆 ACHIEVEMENTS")
    print("=" * 40)

    if total_wins >= 1:
        print("🥷 FIRST STRIKE — First victory!")

    if total_wins >= 5:
        print("🔥 UNSTOPPABLE NINJA — Win 5 games!")

    if winning_streak >= 3:
        print("⚡ NINJA STREAK — 3 wins in a row!")

    if winning_streak >= 5:
        print("👑 NINJA LEGEND — 5 wins in a row!")

    print("🎯 PERFECT GUESS — Guess the number on your first attempt!")
    print("   Unlock this achievement by doing it during a game.")


# ==========================================================
# 🏆 HIGH SCORE
# ==========================================================

def show_high_score():
    print("\n🏆 HIGH SCORE")
    print("=" * 30)
    print(f"Highest Score: {high_score}")
    print(f"Current Streak: 🔥 {winning_streak}")
    print(f"Total Wins: {total_wins}")
    print(f"Total Losses: {total_losses}")
    print(f"Coins: 💰 {coins}")


# ==========================================================
# 💰 BUY EXTRA LIFE
# ==========================================================

def buy_extra_life():
    global coins

    print("\n💰 SHOP")
    print("=" * 30)
    print(f"You have {coins} coins.")
    print("❤️ Extra Life = 10 coins")

    if coins >= 10:
        choice = input("Do you want to buy an extra life? (yes/no): ").lower()

        if choice == "yes":
            coins -= 10
            print("❤️ Extra life purchased!")
            return True

    else:
        print("❌ You don't have enough coins.")

    return False


# ==========================================================
# 🎯 CALCULATE SCORE
# ==========================================================

def calculate_score(attempts_used, max_attempts):
    base_score = 100

    # More points for using fewer attempts
    bonus = (max_attempts - attempts_used) * 20

    score = base_score + bonus

    return score


# ==========================================================
# 🎮 MAIN GAME
# ==========================================================

def play_game(player_name):
    global high_score
    global winning_streak
    global total_wins
    global total_losses
    global coins
    global secret_mode_unlocked

    difficulty, maximum_number, max_attempts = choose_difficulty()

    random_number = random.randint(1, maximum_number)

    lives = 5
    score = 0
    guessed_correctly = False
    attempts_used = 0

    print("\n" + "=" * 50)
    print(f"🥷 NUMBER NINJA — {difficulty.upper()} MODE")
    print("=" * 50)

    print(f"🎯 Guess a number between 1 and {maximum_number}")
    print(f"❤️ Lives: {lives}")
    print(f"🎯 Attempts: {max_attempts}")
    print("⏱️ You have 30 seconds for each guess!")

    # ------------------------------------------------------
    # FOR LOOP — REQUIRED BY THE EXAM
    # ------------------------------------------------------

    for attempt in range(1, max_attempts + 1):

        print("\n" + "-" * 40)
        print(f"🥷 Attempt {attempt}/{max_attempts}")
        print(f"❤️ Lives remaining: {lives}")

        # Timer
        start_time = time.time()

        while True:
            guess_input = input(
                "🎯 Enter your guess: "
            )

            # Check if input is a number
            if guess_input.isdigit():
                guess = int(guess_input)

                if 1 <= guess <= maximum_number:
                    break
                else:
                    print(
                        f"❌ Please enter a number between "
                        f"1 and {maximum_number}."
                    )

            else:
                print("❌ Please enter a valid whole number.")

        end_time = time.time()

        # Timer result
        elapsed_time = end_time - start_time

        if elapsed_time > 30:
            print("⏰ TIME'S UP!")
            lives -= 1
            print("❤️ You lost a life!")

            if lives == 0:
                print("💀 You have no lives left!")
                break

            continue

        attempts_used += 1

        # --------------------------------------------------
        # IF / ELIF / ELSE — REQUIRED BY THE EXAM
        # --------------------------------------------------

        if guess < random_number:
            print("📉 Too low!")

            difference = random_number - guess

            if difference <= 5:
                print("🔥 HOT! You're extremely close!")

            elif difference <= 15:
                print("🌡️ Warm! You're getting closer.")

            else:
                print("❄️ Cold! You're far away.")

            # Even / Odd hint
            if random_number % 2 == 0:
                print("💡 Hint: The secret number is EVEN.")
            else:
                print("💡 Hint: The secret number is ODD.")

            lives -= 1
            print("❤️ You lost a life!")

        elif guess > random_number:
            print("📈 Too high!")

            difference = guess - random_number

            if difference <= 5:
                print("🔥 HOT! You're extremely close!")

            elif difference <= 15:
                print("🌡️ Warm! You're getting closer.")

            else:
                print("❄️ Cold! You're far away.")

            # Even / Odd hint
            if random_number % 2 == 0:
                print("💡 Hint: The secret number is EVEN.")
            else:
                print("💡 Hint: The secret number is ODD.")

            lives -= 1
            print("❤️ You lost a life!")

        else:
            print("\n" + "=" * 50)
            print("🎉🎉🎉 CONGRATULATIONS! 🎉🎉🎉")
            print("=" * 50)

            print(f"🥷 Amazing job, {player_name}!")
            print(f"🎯 The number was {random_number}.")

            score = calculate_score(attempts_used, max_attempts)

            # Perfect guess achievement
            if attempts_used == 1:
                print("🏆 ACHIEVEMENT UNLOCKED!")
                print("🎯 PERFECT GUESS!")

            total_wins += 1
            winning_streak += 1

            # Coins reward
            earned_coins = 10
            coins += earned_coins

            print(f"⭐ Your score: {score}")
            print(f"💰 Coins earned: +{earned_coins}")
            print(f"🔥 Winning streak: {winning_streak}")

            if score > high_score:
                high_score = score
                print("🏆 NEW HIGH SCORE!")

            # Unlock secret mode
            if winning_streak >= 3 and not secret_mode_unlocked:
                secret_mode_unlocked = True
                print("\n🥷 SECRET MODE UNLOCKED! 🥷")
                print("You are becoming a true Number Ninja!")

            guessed_correctly = True

            # REQUIRED BREAK
            break

        # --------------------------------------------------
        # EXTRA LIFE OPTION
        # --------------------------------------------------

        if lives == 0 and attempt < max_attempts:
            print("\n💀 You have lost all your lives!")

            if coins >= 10:
                choice = input(
                    "💰 Spend 10 coins for an extra life? (yes/no): "
                ).lower()

                if choice == "yes":
                    coins -= 10
                    lives = 1
                    print("❤️ EXTRA LIFE ACTIVATED!")
                    print(f"💰 Coins remaining: {coins}")

    # ------------------------------------------------------
    # LOSS
    # ------------------------------------------------------

    if not guessed_correctly:
        total_losses += 1
        winning_streak = 0

        print("\n" + "=" * 50)
        print("💀 GAME OVER!")
        print("=" * 50)

        print(f"😢 Sorry, {player_name}!")
        print(f"🔢 The correct number was: {random_number}")
        print("🔥 Your winning streak has been reset.")

    # ------------------------------------------------------
    # FINAL STATISTICS
    # ------------------------------------------------------

    print("\n" + "=" * 50)
    print("📊 GAME STATISTICS")
    print("=" * 50)

    print(f"👤 Player: {player_name}")
    print(f"🎮 Difficulty: {difficulty}")
    print(f"🔢 Secret Number: {random_number}")
    print(f"🎯 Attempts Used: {attempts_used}")
    print(f"❤️ Lives Remaining: {lives}")
    print(f"⭐ Score: {score}")
    print(f"🏆 High Score: {high_score}")
    print(f"🔥 Winning Streak: {winning_streak}")
    print(f"💰 Coins: {coins}")


# ==========================================================
# 🥷 SECRET MODE
# ==========================================================

def secret_mode():
    global secret_mode_unlocked

    if secret_mode_unlocked:
        print("\n🥷 SECRET NINJA MODE")
        print("=" * 40)
        print("💀 Welcome to the secret challenge!")
        print("The number will be between 1 and 1000.")
        print("You only get 3 attempts!")

        secret_number = random.randint(1, 1000)

        for attempt in range(1, 4):
            guess = int(input(f"🥷 Secret Attempt {attempt}/3: "))

            if guess < secret_number:
                print("📉 Too low!")

            elif guess > secret_number:
                print("📈 Too high!")

            else:
                print("🔥🔥🔥 YOU BEAT SECRET MODE! 🔥🔥🔥")
                print(f"The secret number was {secret_number}!")
                return

        print("💀 Secret Mode defeated you!")
        print(f"The number was {secret_number}.")

    else:
        print("\n🔒 SECRET MODE IS LOCKED!")
        print("Win 3 games in a row to unlock it.")


# ==========================================================
# 🏠 MAIN MENU
# ==========================================================

def number_ninja():

    global high_score

    print("\n")
    print("🥷" * 20)
    print("       🥷 NUMBER NINJA 🥷")
    print("🥷" * 20)

    player_name = input("\n👤 Enter your ninja name: ")

    while True:

        print("\n" + "=" * 50)
        print(f"🥷 WELCOME, {player_name.upper()}!")
        print("=" * 50)

        print("1. 🎮 Start Game")
        print("2. 📖 Instructions")
        print("3. 🏆 High Score")
        print("4. 🏅 Achievements")
        print("5. 💰 Shop")
        print("6. 🥷 Secret Mode")
        print("7. 🚪 Exit")

        choice = input("\nChoose an option (1-7): ")

        if choice == "1":
            play_game(player_name)

            replay = input(
                "\n🔄 Do you want to play another game? (yes/no): "
            ).lower()

            if replay != "yes":
                print("\n🥷 Thanks for playing NUMBER NINJA!")
                print("🔥 Keep training, Ninja!")
                break

        elif choice == "2":
            show_instructions()

        elif choice == "3":
            show_high_score()

        elif choice == "4":
            show_achievements()

        elif choice == "5":
            buy_extra_life()

        elif choice == "6":
            secret_mode()

        elif choice == "7":
            print("\n🥷 Goodbye, Ninja!")
            print("🔥 See you next time!")
            break

        else:
            print("❌ Invalid option. Choose between 1 and 7.")


# ==========================================================
# 🚀 START THE GAME
# ==========================================================

number_ninja()