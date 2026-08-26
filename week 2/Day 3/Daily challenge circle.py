import math


# Question 1: Create a Circle class
# A circle can be created using either the radius or the diameter.
# We use properties and setters so the user can query either value.


class Circle:
    def __init__(self, radius=None, diameter=None):
        if radius is None and diameter is None:
            raise ValueError("Please provide a radius or a diameter.")
        if radius is not None and diameter is not None:
            raise ValueError("Please provide either radius or diameter, not both.")

        if radius is not None:
            self.radius = radius
        else:
            self.diameter = diameter

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("Radius cannot be negative.")
        self._radius = value
        self._diameter = value * 2

    @property
    def diameter(self):
        return self._diameter

    @diameter.setter
    def diameter(self, value):
        if value < 0:
            raise ValueError("Diameter cannot be negative.")
        self._diameter = value
        self._radius = value / 2

    # Question 2: Compute the circle's area
    @property
    def area(self):
        return math.pi * self.radius ** 2

    # Question 3: Print the attributes using a dunder method
    def __str__(self):
        return f"Circle(radius={self.radius}, diameter={self.diameter}, area={self.area:.2f})"

    def __repr__(self):
        return self.__str__()

    # Question 4: Add two circles together and return a new circle
    def __add__(self, other):
        if not isinstance(other, Circle):
            return NotImplemented
        return Circle(radius=self.radius + other.radius)

    # Question 5: Compare two circles to see which is bigger
    def __gt__(self, other):
        if not isinstance(other, Circle):
            return NotImplemented
        return self.radius > other.radius

    # Question 6: Sort the circles by size
    def __lt__(self, other):
        if not isinstance(other, Circle):
            return NotImplemented
        return self.radius < other.radius

    # Question 7: Check if two circles are equal
    def __eq__(self, other):
        if not isinstance(other, Circle):
            return NotImplemented
        return math.isclose(self.radius, other.radius)


if __name__ == "__main__":
    # Example usage to test the class
    c1 = Circle(radius=5)
    c2 = Circle(diameter=10)
    c3 = Circle(radius=3)
    c4 = Circle(radius=8)

    print(c1)
    print(f"Area: {c1.area:.2f}")
    print(c1 + c3)
    print(c1 > c3)
    print(c1 == c2)

    circles = [c4, c3, c1]
    sorted_circles = sorted(circles)
    print(sorted_circles)

    # Bonus challenge: draw the circles using Turtle if installed
    # try:
    #     import turtle
    #     t = turtle.Turtle()
    #     for circle in sorted_circles:
    #         t.circle(circle.radius)
    #         t.up()
    #         t.forward(circle.radius * 2 + 20)
    #         t.down()
    #     turtle.done()
    # except ImportError:
    #     print("Install PythonTurtle to draw the circles.")
