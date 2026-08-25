import math


class Pagination:
	def __init__(self, items=None, page_size=10):
		if page_size <= 0:
			raise ValueError("page_size must be greater than 0")

		self.items = [] if items is None else list(items)
		self.page_size = page_size
		self.current_idx = 0
		# ceil keeps the final partially filled page in the page count.
		self.total_pages = math.ceil(len(self.items) / self.page_size)

	def get_visible_items(self):
		# Convert the current page index into slice boundaries.
		start = self.current_idx * self.page_size
		end = start + self.page_size
		return self.items[start:end]

	def go_to_page(self, page_num):
		# Users count pages from 1, while current_idx starts at 0.
		if page_num < 1 or page_num > self.total_pages:
			raise ValueError("page number is out of range")
		self.current_idx = page_num - 1
		return self

	def first_page(self):
		self.current_idx = 0
		return self

	def last_page(self):
		# max also handles an empty pagination object safely.
		self.current_idx = max(0, self.total_pages - 1)
		return self

	def next_page(self):
		# Do not move beyond the final page.
		if self.current_idx < self.total_pages - 1:
			self.current_idx += 1
		return self

	def previous_page(self):
		# Do not move before the first page.
		if self.current_idx > 0:
			self.current_idx -= 1
		return self

	# Aliases support the camelCase method names used in the bonus example.
	nextPage = next_page
	previousPage = previous_page
	firstPage = first_page
	lastPage = last_page
	goToPage = go_to_page
	getVisibleItems = get_visible_items

	def __str__(self):
		return "\n".join(str(item) for item in self.get_visible_items())


if __name__ == "__main__":
	# Example data and tests for page navigation and method chaining.
	alphabet_list = list("abcdefghijklmnopqrstuvwxyz")
	pagination = Pagination(alphabet_list, 4)

	print(pagination.get_visible_items())
	print(pagination.next_page().get_visible_items())
	print(pagination.last_page().get_visible_items())
	print(pagination.first_page().nextPage().nextPage().nextPage().getVisibleItems())

	try:
		pagination.go_to_page(10)
	except ValueError as error:
		print(f"ValueError: {error}")

	try:
		pagination.go_to_page(0)
	except ValueError as error:
		print(f"ValueError: {error}")
