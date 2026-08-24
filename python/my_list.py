import random


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


# Test the MyList class
if __name__ == "__main__":
    my_list = MyList(['c', 'a', 'b', 'd', 'e'])
    
    print("Original list:", my_list.letters)
    print("Reversed list:", my_list.reversed_list())
    print("Sorted list:", my_list.sorted_list())
    print("Random numbers list:", my_list.random_numbers_list())
    print("Random numbers list (another call):", my_list.random_numbers_list())
