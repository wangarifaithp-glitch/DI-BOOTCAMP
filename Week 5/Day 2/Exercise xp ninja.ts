// ===========================
// Exercise 1: Conditional Types
// ===========================
console.log("=== Exercise 1 ===");

// 1. Define Conditional Type
type MappedType = T extends number ? number : T extends string ? number : never;

// 2. Implement Function with Overload Signatures for Type Safety
function mapType(val: number): number;
function mapType(val: string): number;
function mapType(val: number | string): number {
  if (typeof val === "number") {
    return val * val; // Square the number
  } else {
    return val.length; // Length of the string
  }
}

// 3. Test Function
console.log(mapType(5));      // Output: 25
console.log(mapType("hello")); // Output: 5

// ===========================
// Exercise 2: Keyof and Lookup Types
// ===========================
console.log("\n=== Exercise 2 ===");

// Function utilizing keyof (K extends keyof T) and lookup type T[K]
function getProperty(obj: T, key: K): T[K] {
  return obj[key];
}

// Test Function
const user = {
  id: 101,
  name: "Peris",
  role: "Admin"
};

const userName = getProperty(user, "name");
const userId = getProperty(user, "id");

console.log(userName); // Output: Peris
console.log(userId);   // Output: 101

// ===========================
// Exercise 3: Using Interfaces with Numeric Properties
// ===========================
console.log("\n=== Exercise 3 ===");

// 1. Define Interface with index signature for numeric properties
interface HasNumericProperty {
  [key: string]: number;
}

// 2. Implement Function
function multiplyProperty(
  obj: HasNumericProperty,
  key: string,
  factor: number
): number {
  return obj[key] * factor;
}

// 3. Test Function
const product = {
  price: 50,
  tax: 5,
  quantity: 2
};

const totalCost = multiplyProperty(product, "price", 3);
console.log(totalCost); // Output: 150