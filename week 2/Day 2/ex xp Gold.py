 # Basic bank account with authentication-protected transactions.
class BankAccount:
	def __init__(self, balance=0, username="", password=""):
		self.balance = balance
		self.username = username
		self.password = password
		self.authenticated = False

	def authenticate(self, username, password):
		# Transactions stay locked until both credentials match.
		if username == self.username and password == self.password:
			self.authenticated = True
			return True
		return False

	def _check_transaction(self, amount):
		# Reuse the same validation for deposits and withdrawals.
		if not isinstance(amount, int) or isinstance(amount, bool) or amount <= 0:
			raise Exception("The amount must be a positive integer.")
		if not self.authenticated:
			raise Exception("Please authenticate before making a transaction.")

	def deposit(self, amount):
		self._check_transaction(amount)
		self.balance += amount
		return self.balance

	def withdraw(self, amount):
		self._check_transaction(amount)
		if amount > self.balance:
			raise Exception("Insufficient funds.")
		self.balance -= amount
		return self.balance


class MinimumBalanceAccount(BankAccount):
	# This subclass keeps a required amount in the account after withdrawal.
	def __init__(self, balance=0, username="", password="", minimum_balance=0):
		super().__init__(balance, username, password)
		self.minimum_balance = minimum_balance

	def withdraw(self, amount):
		self._check_transaction(amount)
		# Override the parent rule with the minimum-balance requirement.
		if self.balance - amount < self.minimum_balance:
			raise Exception("The minimum balance must be maintained.")
		self.balance -= amount
		return self.balance


class ATM:
	def __init__(self, account_list, try_limit):
		# The ATM may only manage the supported account classes.
		if not isinstance(account_list, list) or not all(
			isinstance(account, (BankAccount, MinimumBalanceAccount))
			for account in account_list
		):
			raise Exception("account_list must contain bank accounts.")

		if not isinstance(try_limit, (int, float)) or isinstance(try_limit, bool) or try_limit <= 0:
			# Invalid limits use the assignment's fallback value.
			print("Invalid try limit. The try limit has been set to 2.")
			try_limit = 2

		self.account_list = account_list
		self.try_limit = try_limit
		self.current_tries = 0
		self.running = True
		self.show_main_menu()

	def show_main_menu(self):
		# Keep showing the main menu until the user exits or runs out of tries.
		while self.running:
			print("\n1. Log in\n2. Exit")
			choice = input("Choose an option: ")
			if choice == "1":
				username = input("Username: ")
				password = input("Password: ")
				self.log_in(username, password)
			elif choice == "2":
				self.running = False
			else:
				print("Invalid option.")

	def log_in(self, username, password):
		# Try each account until one authenticates the supplied credentials.
		for account in self.account_list:
			if account.authenticate(username, password):
				self.current_tries = 0
				self.show_account_menu(account)
				return

		self.current_tries += 1
		# Failed attempts are counted globally for this ATM session.
		print("Incorrect username or password.")
		if self.current_tries >= self.try_limit:
			print("You have reached the maximum number of tries. Shutting down.")
			self.running = False

	def show_account_menu(self, account):
		# An authenticated user can deposit, withdraw, or log out.
		while self.running and account.authenticated:
			print(f"\nBalance: {account.balance}")
			print("1. Deposit\n2. Withdraw\n3. Exit")
			choice = input("Choose an option: ")
			if choice in ("1", "2"):
				try:
					amount = int(input("Amount: "))
					if choice == "1":
						account.deposit(amount)
					else:
						account.withdraw(amount)
					print(f"Transaction complete. New balance: {account.balance}")
				except (ValueError, Exception) as error:
					print(f"Transaction failed: {error}")
			elif choice == "3":
				account.authenticated = False
			else:
				print("Invalid option.")


if __name__ == "__main__":
	# Uncomment the next lines to try the interactive ATM.
	# accounts = [BankAccount(100, "sara", "1234"), MinimumBalanceAccount(200, "alex", "5678", 50)]
	# ATM(accounts, 3)

	# Non-interactive checks for the account classes.
	account = BankAccount(100, "sara", "1234")
	account.authenticate("sara", "1234")
	account.deposit(50)
	account.withdraw(25)
	print(f"Account balance: {account.balance}")
