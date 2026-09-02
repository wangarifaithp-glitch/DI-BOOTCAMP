const rawInput =
  typeof prompt === "function"
    ? prompt("Enter several words separated by commas:")
    : "Hello, World, in, a, frame";

if (rawInput === null || rawInput.trim() === "") {
  console.log("Please enter at least one word.");
} else {
  const words = rawInput
    .split(",")
    .map((word) => word.trim())
    .filter((word) => word.length > 0);

  if (words.length === 0) {
    console.log("Please enter valid words.");
  } else {
    const longestWord = Math.max(...words.map((word) => word.length));
    const border = "*".repeat(longestWord + 4);

    console.log(border);
    words.forEach((word) => {
      const padding = " ".repeat(longestWord - word.length);
      console.log(`* ${word}${padding} *`);
    });
    console.log(border);
  }
}
