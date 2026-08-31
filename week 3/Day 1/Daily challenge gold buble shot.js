const numbers = [5, 0, 9, 1, 7, 4, 2, 6, 3, 8];

console.log("Original array:", numbers);

// 1. Convert array to string using toString()
const toStringResult = numbers.toString();
console.log("Using toString():", toStringResult);

// 2. Convert array to string using join() with different separators
console.log("Using join() default:", numbers.join());
console.log("Using join('+'):", numbers.join("+"));
console.log("Using join(' '):", numbers.join(" "));
console.log("Using join(''):", numbers.join(""));

// Bonus: Bubble Sort in descending order using nested for loops
let sortedNumbers = [...numbers];
console.log("\nBubble sort in descending order:");

for (let i = 0; i < sortedNumbers.length; i++) {
  for (let j = 0; j < sortedNumbers.length - 1 - i; j++) {
    console.log(`Compare ${sortedNumbers[j]} and ${sortedNumbers[j + 1]}`);

    // Swap if the left number is smaller than the right number
    if (sortedNumbers[j] < sortedNumbers[j + 1]) {
      const temp = sortedNumbers[j];
      sortedNumbers[j] = sortedNumbers[j + 1];
      sortedNumbers[j + 1] = temp;
      console.log("Swap =>", sortedNumbers);
    }
  }
}

console.log("Final sorted array:", sortedNumbers);
