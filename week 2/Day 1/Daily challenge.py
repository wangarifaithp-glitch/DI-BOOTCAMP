class Farm:
    """A class to represent a farm and manage its animals."""
    
    def __init__(self, farm_name):
        """
        Initialize a Farm with a name and empty animals dictionary.
        
        Args:
            farm_name (str): The name of the farm
        """
        self.name = farm_name
        self.animals = {}
    
    def add_animal(self, **kwargs):
        """
        Add or update animals in the farm (uses **kwargs for flexibility).
        
        Args:
            **kwargs: Key-value pairs where key is animal_type and value is count
        """
        for animal_type, count in kwargs.items():
            if animal_type in self.animals:
                self.animals[animal_type] += count
            else:
                self.animals[animal_type] = count
    
    def get_info(self):
        """
        Return a formatted string displaying farm info and animals.
        
        Returns:
            str: Formatted farm information including animals and counts
        """
        result = f"{self.name}'s farm\n\n"
        
        for animal_type, count in self.animals.items():
            result += f"{animal_type} : {count}\n"
        
        result += "\n    E-I-E-I-0!"
        
        return result
    
    def get_animal_types(self):
        """
        Return a sorted list of all animal types in the farm.
        
        Returns:
            list: Sorted list of animal types
        """
        return sorted(self.animals.keys())
    
    def get_short_info(self):
        """
        Return a short formatted string about the farm and its animals.
        Pluralizes animal names based on their count.
        
        Returns:
            str: Short info string like "McDonald's farm has cows, goats and sheeps."
        """
        animal_types = self.get_animal_types()
        
        # Build animal names with proper pluralization
        animal_names = []
        for animal in animal_types:
            count = self.animals[animal]
            # Add 's' if count > 1 (simple pluralization)
            animal_name = animal if count == 1 else animal + "s"
            animal_names.append(animal_name)
        
        # Format the string with proper grammar
        if len(animal_names) == 0:
            animal_string = ""
        elif len(animal_names) == 1:
            animal_string = animal_names[0]
        elif len(animal_names) == 2:
            animal_string = f"{animal_names[0]} and {animal_names[1]}"
        else:
            # Join all but last with commas, then add 'and' before last
            animal_string = ", ".join(animal_names[:-1]) + f" and {animal_names[-1]}"
        
        return f"{self.name}'s farm has {animal_string}."


# ==================== TEST CODE ====================

if __name__ == "__main__":
    print("="*70)
    print("DAILY CHALLENGE: Farm Class")
    print("="*70)
    
    # Test basic functionality
    print("\n--- Test 1: Basic Farm Operations ---")
    macdonald = Farm("McDonald")
    
    # Add animals using **kwargs
    macdonald.add_animal(cow=5)
    macdonald.add_animal(sheep=1)
    macdonald.add_animal(sheep=1)  # Add another sheep (should increment)
    macdonald.add_animal(goat=12)
    
    print("\nFarm Info:")
    print(macdonald.get_info())
    
    # Test get_animal_types
    print("\n--- Test 2: Get Animal Types ---")
    print("Animal types:", macdonald.get_animal_types())
    
    # Test get_short_info
    print("\n--- Test 3: Short Farm Info ---")
    print(macdonald.get_short_info())
    
    # Test with more animals
    print("\n" + "="*70)
    print("--- Test 4: Farm with Multiple Animals ---")
    print("="*70)
    
    farm2 = Farm("Sunny Valley")
    farm2.add_animal(horse=3, pig=7, cow=2, chicken=15, duck=8)
    
    print("\nFarm Info:")
    print(farm2.get_info())
    
    print("\nShort Info:")
    print(farm2.get_short_info())
    
    # Test with single animal
    print("\n" + "="*70)
    print("--- Test 5: Farm with Single Animal ---")
    print("="*70)
    
    farm3 = Farm("Simple Farm")
    farm3.add_animal(dog=1)
    
    print("\nFarm Info:")
    print(farm3.get_info())
    
    print("\nShort Info:")
    print(farm3.get_short_info())
