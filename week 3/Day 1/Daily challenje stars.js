// Daily Challenge: Star Pattern
// Version 1: One loop
console.log("Version 1: One loop");
let line = "";
for (let i = 1; i <= 6; i++) {
  line += "* ";
  console.log(line.trim());
}

// Version 2: Nested loops
console.log("\nVersion 2: Nested loops");
for (let i = 1; i <= 6; i++) {
  let row = "";
  for (let j = 1; j <= i; j++) {
    row += "* ";
  }
  console.log(row.trim());
}
