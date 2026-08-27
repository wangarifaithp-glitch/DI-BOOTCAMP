import random
from abc import ABC, abstractmethod


class Temperature(ABC):
	"""Base class for temperatures represented in degrees Celsius internally."""

	def __init__(self, value):
		self.value = float(value)

	@abstractmethod
	def to_celsius(self):
		"""Return the temperature in degrees Celsius."""

	def to_kelvin(self):
		# Convert through the shared Celsius representation.
		return Kelvin(self.to_celsius() + 273.15)

	def to_fahrenheit(self):
		# Convert through the shared Celsius representation.
		return Fahrenheit(self.to_celsius() * 9 / 5 + 32)

	def __repr__(self):
		return f"{self.__class__.__name__}({self.value:g})"


class Celsius(Temperature):
	def to_celsius(self):
		return Celsius(self.value)


class Kelvin(Temperature):
	def to_celsius(self):
		return Celsius(self.value - 273.15)


class Fahrenheit(Temperature):
	def to_celsius(self):
		return Celsius((self.value - 32) * 5 / 9)


class QuantumParticle:
	def __init__(self, x=None, y=None, p=None):
		self._position = x if x is not None else random.randint(1, 10000)
		self._momentum = y if y is not None else random.random()
		self._spin = p if p in (0.5, -0.5) else random.choice((0.5, -0.5))
		self._entangled_particle = None

	def _disturb(self):
		# Every measurement changes the particle's position and momentum.
		self._position = random.randint(1, 10000)
		self._momentum = random.random()
		print("Quantum Interferences!!")

	def position(self):
		self._disturb()
		return self._position

	def momentum(self):
		self._disturb()
		return self._momentum

	def spin(self):
		self._disturb()
		self._spin = random.choice((0.5, -0.5))
		if self._entangled_particle is not None:
			# Entangled particles always have opposite spin values.
			self._entangled_particle._spin = -self._spin
		return self._spin

	def entangle(self, particle):
		if not isinstance(particle, QuantumParticle):
			raise TypeError("A particle can only be entangled with another QuantumParticle")
		if particle is self:
			raise ValueError("A particle cannot be entangled with itself")
		self._entangled_particle = particle
		particle._entangled_particle = self
		print("Spooky Action at a Distance !!")

	def __repr__(self):
		return (
			f"QuantumParticle(position={self._position}, "
			f"momentum={self._momentum}, spin={self._spin})"
		)
