import os
import time
import random

class Cell:
    """Represents an individual cell in the Game of Life grid."""
    def __init__(self, state=0):
        self.state = state  # 1 = Alive, 0 = Dead

    def is_alive(self):
        return self.state == 1

    def __str__(self):
        return "█" if self.is_alive() else " "


class GameOfLife:
    """Handles the board logic, neighbor counts, rule enforcement, and grid rendering."""
    def __init__(self, rows=15, cols=30, expandable=False, max_limit=10000):
        self.rows = rows
        self.cols = cols
        self.expandable = expandable
        self.max_limit = max_limit
        self.grid = [[Cell(0) for _ in range(cols)] for _ in range(rows)]

    def set_pattern(self, coordinates):
        """Populates specific starting live cells using a list of (row, col) tuples."""
        for r, c in coordinates:
            if 0 <= r < self.rows and 0 <= c < self.cols:
                self.grid[r][c].state = 1

    def randomize(self, density=0.25):
        """Fills the grid randomly based on a probability density."""
        for r in range(self.rows):
            for c in range(self.cols):
                self.grid[r][c].state = 1 if random.random() < density else 0

    def count_live_neighbors(self, r, c):
        """Calculates the number of adjacent living cells (8 directions)."""
        live_count = 0
        for dr in [-1, 0, 1]:
            for dc in [-1, 0, 1]:
                if dr == 0 and dc == 0:
                    continue
                nr, nc = r + dr, c + dc
                if 0 <= nr < self.rows and 0 <= nc < self.cols:
                    live_count += self.grid[nr][nc].state
        return live_count

    def _expand_borders_if_needed(self):
        """Bonus: Dynamically expands the grid borders when live cells touch the edge."""
        if not self.expandable:
            return

        top_touch = any(self.grid[0][c].is_alive() for c in range(self.cols))
        bottom_touch = any(self.grid[self.rows - 1][c].is_alive() for c in range(self.cols))
        left_touch = any(self.grid[r][0].is_alive() for r in range(self.rows))
        right_touch = any(self.grid[r][self.cols - 1].is_alive() for r in range(self.rows))

        # Expand Vertically
        if top_touch and self.rows < self.max_limit:
            self.grid.insert(0, [Cell(0) for _ in range(self.cols)])
            self.rows += 1
        if bottom_touch and self.rows < self.max_limit:
            self.grid.append([Cell(0) for _ in range(self.cols)])
            self.rows += 1

        # Expand Horizontally
        if left_touch and self.cols < self.max_limit:
            for row in self.grid:
                row.insert(0, Cell(0))
            self.cols += 1
        if right_touch and self.cols < self.max_limit:
            for row in self.grid:
                row.append(Cell(0))
            self.cols += 1

    def step(self):
        """Advances the game state by one generation based on Conway's rules."""
        self._expand_borders_if_needed()
        next_grid = [[Cell(0) for _ in range(self.cols)] for _ in range(self.rows)]

        for r in range(self.rows):
            for c in range(self.cols):
                neighbors = self.count_live_neighbors(r, c)
                is_alive = self.grid[r][c].is_alive()

                # Rule enforcement
                if is_alive and (neighbors == 2 or neighbors == 3):
                    next_grid[r][c].state = 1
                elif not is_alive and neighbors == 3:
                    next_grid[r][c].state = 1
                else:
                    next_grid[r][c].state = 0

        self.grid = next_grid

    def display(self, generation):
        """Clears console and prints current grid state."""
        os.system('cls' if os.name == 'nt' else 'clear')
        print(f"--- Generation {generation} (Grid Size: {self.rows}x{self.cols}) ---")
        border = "+" + "-" * self.cols + "+"
        print(border)
        for row in self.grid:
            print("|" + "".join(str(cell) for cell in row) + "|")
        print(border)

    def run(self, steps=30, delay=0.15):
        """Runs the game animation loop."""
        for gen in range(steps):
            self.display(gen)
            self.step()
            time.sleep(delay)


# --- Initialization Examples ---
if __name__ == "__main__":
    # Example 1: Fixed grid with a Glider pattern
    game = GameOfLife(rows=12, cols=20, expandable=True)
    
    # Glider Pattern coordinates
    glider = [(1, 2), (2, 3), (3, 1), (3, 2), (3, 3)]
    game.set_pattern(glider)
    
    # Run simulation
    game.run(steps=40, delay=0.1)