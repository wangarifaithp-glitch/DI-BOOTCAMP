
console.log("=== Exercise 1 ===");
console.log("Hello, World!");

console.log("\n=== Exercise 2 ===");
const age: number = 30;
const nameStr: string = "Peris";

console.log(age);
console.log(nameStr);

// ===========================
// Exercise 3: Union Types
// ===========================
console.log("\n=== Exercise 3 ===");
let id: string | number = "ABC123";
console.log(id);

id = 42;
console.log(id);

// ===========================
// Exercise 4: Control Flow with if...else
// ===========================
console.log("\n=== Exercise 4 ===");

function describeNumber(value: number): string {
  if (value > 0) {
    return "positive";
  } else if (value < 0) {
    return "negative";
  } else {
    return "zero";
  }
}

console.log(describeNumber(5));   // Output: positive
console.log(describeNumber(-3));  // Output: negative
console.log(describeNumber(0));   // Output: zero

// ===========================
// Exercise 5: Tuple Types
// ===========================
console.log("\n=== Exercise 5 ===");

function getDetails(name: string, age: number): [string, number, string] {
  const greeting = `Hello, \({name}! You are\){age} years old.`;
  return [name, age, greeting];
}

const details = getDetails("Alice", 25);
console.log(details);
// Output: ['Alice', 25, 'Hello, Alice! You are 25 years old.']

// ===========================
// Exercise 6: Object Type Annotations
// ===========================
console.log("\n=== Exercise 6 ===");

type Person = {
  name: string;
  age: number;
};

function createPerson(name: string, age: number): Person {
  return { name, age };
}

const person = createPerson("Peris", 30);
console.log(person);
// Output: { name: 'Peris', age: 30 }

// ===========================
// Exercise 7: Type Assertions (DOM)
// ===========================
console.log("\n=== Exercise 7 ===");

// DOM element type assertion:
const input = document.getElementById("username") as HTMLInputElement;
if (input) {
  input.value = "Peris";
  console.log(input.value); // Output: Peris
}

// ===========================
// Exercise 8: switch Statement
// ===========================
console.log("\n=== Exercise 8 ===");

function getAction(role: string): string {
  switch (role) {
    case "admin":
      return "Manage users and settings";
    case "editor":
      return "Edit content";
    case "viewer":
      return "View content";
    case "guest":
      return "Limited access";
    default:
      return "Invalid role";
  }
}

console.log(getAction("admin"));   // Output: Manage users and settings
console.log(getAction("editor"));  // Output: Edit content
console.log(getAction("viewer"));  // Output: View content
console.log(getAction("guest"));   // Output: Limited access
console.log(getAction("unknown")); // Output: Invalid role

// ===========================
// Exercise 9: Function Overloading
// ===========================
console.log("\n=== Exercise 9 ===");

// Overload signatures
function greet(): string;
function greet(name: string): string;

// Implementation using default parameter
function greet(name: string = "guest"): string {
  return `Hello, ${name}!`;
}

console.log(greet());        // Output: Hello, guest!
console.log(greet("Peris")); // Output: Hello, Peris!