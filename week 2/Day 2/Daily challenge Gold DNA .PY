import random
from abc import ABC, abstractmethod


# Common interface used by Gene, Chromosome, and DNA (polymorphism).
class GeneticMaterial(ABC):
	@abstractmethod
	def mutate(self):
		"""Apply a mutation to this level of genetic material."""

	@abstractmethod
	def count_ones(self):
		"""Return the number of genes containing 1."""

	@abstractmethod
	def gene_count(self):
		"""Return the number of genes contained here."""

	def is_all_ones(self):
		return self.count_ones() == self.gene_count()


class Gene(GeneticMaterial):
	def __init__(self, value=None):
		self.value = random.randint(0, 1) if value is None else value
		if self.value not in (0, 1):
			raise ValueError("A gene must be 0 or 1")

	def mutate(self):
		# A gene mutates by flipping its value.
		self.value = 1 - self.value

	def count_ones(self):
		return self.value

	def gene_count(self):
		return 1

	def __str__(self):
		return str(self.value)


class Chromosome(GeneticMaterial):
	def __init__(self, genes=None):
		self.genes = genes or [Gene() for _ in range(10)]
		if len(self.genes) != 10:
			raise ValueError("A chromosome must contain 10 genes")

	def mutate(self):
		# Only some randomly selected genes flip during a mutation.
		genes_to_mutate = random.randint(1, len(self.genes))
		for gene in random.sample(self.genes, genes_to_mutate):
			if random.choice((True, False)):
				gene.mutate()

	def count_ones(self):
		return sum(gene.count_ones() for gene in self.genes)

	def gene_count(self):
		return len(self.genes)

	def __str__(self):
		return "".join(str(gene) for gene in self.genes)


class DNA(GeneticMaterial):
	def __init__(self, chromosomes=None):
		self.chromosomes = chromosomes or [Chromosome() for _ in range(10)]
		if len(self.chromosomes) != 10:
			raise ValueError("DNA must contain 10 chromosomes")

	def mutate(self):
		# DNA delegates mutation to a random number of chromosomes.
		chromosomes_to_mutate = random.randint(1, len(self.chromosomes))
		for chromosome in random.sample(self.chromosomes, chromosomes_to_mutate):
			chromosome.mutate()

	def count_ones(self):
		return sum(chromosome.count_ones() for chromosome in self.chromosomes)

	def gene_count(self):
		return sum(chromosome.gene_count() for chromosome in self.chromosomes)

	def __str__(self):
		return "\n".join(str(chromosome) for chromosome in self.chromosomes)

	def copy(self):
		return DNA([[Gene(gene.value) for gene in chromosome.genes]
					for chromosome in self.chromosomes])


class Organism:
	def __init__(self, dna, environment):
		self.dna = dna
		self.environment = environment

	def mutate(self):
		# The environment controls whether this organism mutates.
		if random.random() < self.environment:
			self.dna.mutate()

	def fitness(self):
		return self.dna.count_ones()


def run_experiment(population_size=100, mutation_probability=0.2):
	population = [Organism(DNA(), mutation_probability)
				  for _ in range(population_size)]
	generations = 0

	while True:
		# Mutate each organism and stop as soon as one reaches the target DNA.
		for organism in population:
			organism.mutate()
			if organism.dna.is_all_ones():
				return generations, organism

		generations += 1
		# Keep the fittest DNA and use copies to continue the experiment.
		best = max(population, key=Organism.fitness)
		population = [Organism(best.dna.copy(), best.environment)
					  for _ in range(population_size)]


if __name__ == "__main__":
	random.seed(42)
	generations, successful_organism = run_experiment()
	print(f"Generations: {generations}")
	print("Successful DNA:")
	print(successful_organism.dna)
	print("Conclusion: mutation and selection produced an organism with 100/100 ones.")
