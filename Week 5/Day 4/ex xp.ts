// =========================
// Exercise 1: Intersection Types
// =========================

type Person = {
  name: string;
  age: number;
};

type Address = {
  street: string;
  city: string;
};

type PersonWithAddress = Person & Address;

const personWithAddress: PersonWithAddress = {
  name: "Asha",
  age: 28,
  street: "Kimathi Street",
  city: "Nairobi",
};

console.log("=== Exercise 1: Intersection Types ===");
console.log(personWithAddress.name, personWithAddress.age, personWithAddress.street, personWithAddress.city);

// =========================
// Exercise 2: Type Guards with Union Types
// =========================

function describeValue(value: number | string): string {
  if (typeof value === "number") {
    return "This is a number";
  }
  if (typeof value === "string") {
    return "This is a string";
  }
  return "Unknown type";
}

console.log("\n=== Exercise 2: Type Guards with Union Types ===");
console.log(describeValue(42));
console.log(describeValue("hello"));

// =========================
// Exercise 3: Type Casting
// =========================

let someValue: any = "TypeScript is great";
const safeStringValue = someValue as string;

console.log("\n=== Exercise 3: Type Casting ===");
console.log("Value:", safeStringValue);
console.log("Length:", safeStringValue.length);

// =========================
// Exercise 4: Type Assertions with Union Types
// =========================

function getFirstElement(arr: (number | string)[]): string {
  return arr[0] as string;
}

console.log("\n=== Exercise 4: Type Assertions with Union Types ===");
console.log(getFirstElement(["first", 2, 3]));

// =========================
// Exercise 5: Generic Constraints
// =========================

function logLength(value: string | any[]): void {
  console.log("Length:", value.length);
}

console.log("\n=== Exercise 5: Generic Constraints ===");
logLength("hello");
logLength([1, 2, 3, 4]);

// =========================
// Exercise 6: Intersection Types and Type Guards
// =========================

type Job = {
  position: string;
  department: string;
};

type Manager = Job & {
  managesPeople: true;
  teamSize: number;
};

type Developer = Job & {
  managesPeople: false;
  primaryLanguage: string;
};

type Employee = Person & Job;

function describeEmployee(
  name: string,
  job: Employee & (Manager | Developer)
): string {
  if (job.managesPeople === true && job.teamSize !== undefined) {
    return `${name} is a Manager in ${job.department}, managing ${job.teamSize} people.`;
  }
  if (job.managesPeople === false && job.primaryLanguage !== undefined) {
    return `${name} is a Developer in ${job.department}, using ${job.primaryLanguage}.`;
  }
  return `${name} works as ${job.position} in ${job.department}.`;
}

console.log("\n=== Exercise 6: Intersection Types and Type Guards ===");

const manager: Employee & Manager = {
  name: "Brian",
  age: 35,
  position: "Engineering Manager",
  department: "Backend",
  managesPeople: true,
  teamSize: 6,
};

const developer: Employee & Developer = {
  name: "Catherine",
  age: 29,
  position: "Senior Developer",
  department: "Frontend",
  managesPeople: false,
  primaryLanguage: "TypeScript",
};

console.log(describeEmployee(manager.name, manager));
console.log(describeEmployee(developer.name, developer));

// =========================
// Exercise 7: Type Assertions and Generic Constraints
// =========================

function formatInput(value: number | string | boolean): string {
  const str = String(value);
  return `Formatted: "${str}"`;
}

console.log("\n=== Exercise 7: Type Assertions and Generic Constraints ===");
console.log(formatInput(123));
console.log(formatInput("hello"));
console.log(formatInput(true));