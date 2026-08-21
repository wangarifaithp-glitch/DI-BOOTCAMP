# Tic Tac Toe
# Two players take turns playing on a 3x3 board.


def display_board(board):
	"""Display the current board in a readable format."""
	print("\n  1   2   3")
	for row_number, row in enumerate(board, start=1):
		print(f"{row_number} {row[0]} | {row[1]} | {row[2]}")
		if row_number < 3:
			print("  ---------")


def player_input(board, player):
	"""Ask for and validate a player's row and column choice."""
	while True:
		move = input(f"Player {player}, choose a row and column (example: 1 2): ")
		values = move.split()

		# The player must enter exactly two whole numbers.
		if len(values) != 2 or not all(value.isdigit() for value in values):
			print("Invalid input. Enter two numbers, such as 1 2.")
			continue

		# Convert the user's 1-3 coordinates into list indexes 0-2.
		row, column = (int(value) - 1 for value in values)

		if not (0 <= row < 3 and 0 <= column < 3):
			print("The row and column must be between 1 and 3.")
		elif board[row][column] != " ":
			print("That position is already taken. Choose another one.")
		else:
			return row, column


def check_win(board, player):
	"""Return True when the player has three symbols in a row."""
	# Add all three horizontal rows to the list of possible winning lines.
	winning_lines = board[:]

	# Add the three vertical columns.
	winning_lines.extend([
		[board[0][column], board[1][column], board[2][column]]
		for column in range(3)
	])

	# Add the two diagonals.
	winning_lines.extend([
		[board[0][0], board[1][1], board[2][2]],
		[board[0][2], board[1][1], board[2][0]],
	])

	# A win happens if one complete line contains the current player's symbol.
	return any(line == [player, player, player] for line in winning_lines)


def check_tie(board):
	"""Return True when every square is filled."""
	return all(cell != " " for row in board for cell in row)


def play():
	"""Run the game until one player wins or the game is a tie."""
	# Create a 3x3 board. A space represents an empty square.
	board = [[" " for _ in range(3)] for _ in range(3)]
	current_player = "X"

	while True:
		# Show the board before each player's turn.
		display_board(board)

		# Get a valid empty position and place the player's symbol there.
		row, column = player_input(board, current_player)
		board[row][column] = current_player

		# Check for a winner immediately after the move.
		if check_win(board, current_player):
			display_board(board)
			print(f"Player {current_player} wins!")
			break

		# If there is no winner and no empty square, the game is tied.
		if check_tie(board):
			display_board(board)
			print("It's a tie!")
			break

		# Switch from X to O, or from O to X.
		current_player = "O" if current_player == "X" else "X"


# Start the game only when this file is run directly.
if __name__ == "__main__":
	play()
