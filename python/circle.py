import math


class Circle:
    """A class to represent a circle with radius and geometric calculations."""
    
    def __init__(self, radius=1.0):
        """Initialize a Circle with a given radius (default is 1.0)."""
        self.radius = radius
    
    def perimeter(self):
        """Calculate and return the perimeter (circumference) of the circle."""
        return 2 * math.pi * self.radius
    
    def area(self):
        """Calculate and return the area of the circle."""
        return math.pi * self.radius ** 2
    
    def definition(self):
        """Print the geometrical definition of a circle."""
        print("A circle is a geometric shape consisting of all points in a plane that are")
        print("at a fixed distance (radius) from a single point (center).")
        print(f"\nThis circle has:")
        print(f"  - Radius: {self.radius}")
        print(f"  - Perimeter: {self.perimeter():.2f}")
        print(f"  - Area: {self.area():.2f}")


# Test the Circle class
if __name__ == "__main__":
    circle1 = Circle()
    circle1.definition()
    
    print("\n" + "="*50 + "\n")
    
    circle2 = Circle(5)
    circle2.definition()
