
console.log("=== Exercise 1 ===");

type MappedType<T> =
  T extends number ? number :
  T extends string ? number :
  never;

function mapType(val: number): number;
function mapType(val: string): number;
function mapType(val: number | string): number {
  return typeof val === "number" ? val * val : val.length;
}

console.log(mapType(5));
console.log(mapType("hello"));


console.log("\n=== Exercise 2 ===");

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = {
  id: 101,
  name: "Peris",
  role: "Admin",
};

console.log(getProperty(user, "name"));
console.log(getProperty(user, "id"));

// ===========================
// Exercise 3: Numeric Properties
// ===========================
console.log("\n=== Exercise 3 ===");

interface HasNumericProperty {
  [key: string]: number;
}

function multiplyProperty(
  obj: HasNumericProperty,
  key: string,
  factor: number
): number {
  return (obj[key] ?? 0) * factor;
}

const product = {
  price: 50,
  tax: 5,
  quantity: 2,
};

console.log(multiplyProperty(product, "price", 3));