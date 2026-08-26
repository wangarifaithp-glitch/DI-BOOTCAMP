from collections import defaultdict


# EXERCISE 1: CATS 

class Cat:
    """A class to represent a cat with name and age."""
    
    def __init__(self, cat_name, cat_age):
        self.name = cat_name
        self.age = cat_age


def find_oldest_cat(cat1, cat2, cat3):
    """
    Find and return the oldest cat among three cats.
    """
    cats = [cat1, cat2, cat3]
    oldest_cat = max(cats, key=lambda cat: cat.age)
    return oldest_cat


# EXERCISE 2: DOGS

class Dog:
    """A class to represent a dog with name and height."""
    
    def __init__(self, name, height):
        self.name = name
        self.height = height
    
    def bark(self):
        """Dog barks with a sound."""
        print(f"{self.name} goes woof!")
    
    def jump(self):
        """Dog jumps a certain height."""
        jump_height = self.height * 2
        print(f"{self.name} jumps {jump_height} cm high!")


# EXERCISE 3: SONG 

class Song:
    """A class to represent a song with lyrics."""
    
    def __init__(self, lyrics):
        self.lyrics = lyrics
    
    def sing_me_a_song(self):
        """Print each lyric line on a new line."""
        for lyric in self.lyrics:
            print(lyric)


# EXERCISE 4: ZOO 

class Zoo:
    """A class to manage a zoo and its animals."""
    
    def __init__(self, zoo_name):
        self.zoo_name = zoo_name
        self.animals = []
    
    def add_animal(self, *new_animals):
        """
        Add one or more animals to the zoo (with bonus *args support).
        Does not add if animal already exists.
        """
        for animal in new_animals:
            if animal not in self.animals:
                self.animals.append(animal)
            else:
                print(f"  ('{animal}' already in the zoo)")
    
    def get_animals(self):
        """Print all animals currently in the zoo."""
        print(f"\n--- Animals in {self.zoo_name} ---")
        if not self.animals:
            print("No animals in the zoo.")
        else:
            for animal in self.animals:
                print(f"  • {animal}")
    
    def sell_animal(self, animal_sold):
        """Remove a specified animal from the zoo."""
        if animal_sold in self.animals:
            self.animals.remove(animal_sold)
            print(f"✓ {animal_sold} has been sold.")
        else:
            print(f"✗ {animal_sold} is not in the zoo.")
    
    def sort_animals(self):
        """
        Sort animals alphabetically and group them by first letter.
        Returns a dictionary with first letters as keys and animal lists as values.
        """
        sorted_animals = sorted(self.animals)
        groups = defaultdict(list)
        
        for animal in sorted_animals:
            first_letter = animal[0].upper()
            groups[first_letter].append(animal)
        
        return dict(sorted(groups.items()))
    
    def get_groups(self):
        """Print the grouped animals by their first letter."""
        groups = self.sort_animals()
        print(f"\n--- Animals grouped by first letter ---")
        for letter, animals_list in groups.items():
            print(f"{letter}: {animals_list}")


# TEST CODE 

if __name__ == "__main__":
    #  EXERCISE 1: CATS 
    print("="*70)
    print("EXERCISE 1: CATS - Find the Oldest Cat")
    print("="*70)
    
    # Step 1: Create cat objects
    cat1 = Cat("Fluffy", 3)
    cat2 = Cat("Whiskers", 7)
    cat3 = Cat("Mittens", 5)
    
    print(f"\nCreated cats:")
    print(f"  • {cat1.name}: {cat1.age} years old")
    print(f"  • {cat2.name}: {cat2.age} years old")
    print(f"  • {cat3.name}: {cat3.age} years old")
    
    # Step 2 & 3: Find and print the oldest cat
    oldest = find_oldest_cat(cat1, cat2, cat3)
    print(f"\nResult: The oldest cat is {oldest.name}, and is {oldest.age} years old.")
    
    
    # EXERCISE 2: DOGS
    print("\n" + "="*70)
    print("EXERCISE 2: DOGS - Dog Class Methods")
    print("="*70)
    
    # Step 2: Create dog objects
    davids_dog = Dog("Rex", 50)
    sarahs_dog = Dog("Bella", 30)
    
    # Step 3: Print details and call methods
    print(f"\nDavid's Dog:")
    print(f"  Name: {davids_dog.name}")
    print(f"  Height: {davids_dog.height} cm")
    davids_dog.bark()
    davids_dog.jump()
    
    print(f"\nSarah's Dog:")
    print(f"  Name: {sarahs_dog.name}")
    print(f"  Height: {sarahs_dog.height} cm")
    sarahs_dog.bark()
    sarahs_dog.jump()
    
    # Step 4: Compare dog sizes
    print(f"\nComparison:")
    taller_dog = davids_dog if davids_dog.height > sarahs_dog.height else sarahs_dog
    print(f"  {taller_dog.name} is taller ({taller_dog.height} cm)")
    
    
    # EXERCISE 3: SONG 
    print("\n" + "="*70)
    print("EXERCISE 3: SONG - Sing a Song")
    print("="*70)
    
    # Step 1: Create a Song object
    stairway = Song([
        "There's a lady who's sure",
        "all that glitters is gold",
        "and she's buying a stairway to heaven"
    ])
    
    print(f"\nSinging 'Stairway to Heaven':")
    stairway.sing_me_a_song()
    
    
    # EXERCISE 4: ZOO
    print("\n" + "="*70)
    print("EXERCISE 4: ZOO - Zoo Management System")
    print("="*70)
    
    # Step 2: Create a zoo object
    brooklyn_safari = Zoo("Brooklyn Safari")
    
    # Step 3: Use zoo methods
    print(f"\n--- Adding animals to {brooklyn_safari.zoo_name} ---")
    brooklyn_safari.add_animal("Giraffe", "Bear", "Baboon", "Lion", "Cat", "Cougar", "Zebra")
    brooklyn_safari.get_animals()
    
    # Try to add duplicate
    print(f"\nTrying to add duplicate:")
    brooklyn_safari.add_animal("Bear")
    
    # Sell an animal
    print(f"\nSelling 'Bear':")
    brooklyn_safari.sell_animal("Bear")
    brooklyn_safari.get_animals()
    
    # Sort and group animals
    brooklyn_safari.get_groups()
    
    # Try to sell a non-existent animal
    print(f"\nTrying to sell non-existent animal:")
    brooklyn_safari.sell_animal("Elephant")
    
    # Bonus: Add multiple animals at once
    print(f"\n--- Adding multiple animals at once (Bonus) ---")
    brooklyn_safari.add_animal("Elephant", "Ant", "Antelope", "Camel")
    brooklyn_safari.get_animals()
    brooklyn_safari.get_groups()
