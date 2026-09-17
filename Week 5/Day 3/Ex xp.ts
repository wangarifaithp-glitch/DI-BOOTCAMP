
// Exercise 1: Class with Access Modifiers
class Employee {
  private name: string;
  private salary: number;
  public position: string;
  protected department: string;

  constructor(name: string, salary: number, position: string, department: string) {
    this.name = name;
    this.salary = salary;
    this.position = position;
    this.department = department;
  }

  public getEmployeeInfo(): string {
    return `${this.name} - ${this.position}`;
  }

  protected getDepartment(): string {
    return this.department;
  }
}

// Exercise 2: Readonly Properties in a Class
class Product {
  readonly id: number;
  public name: string;
  public price: number;

  constructor(id: number, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
  }

  getProductInfo(): string {
    return `${this.name} - $${this.price}`;
  }
}

// Exercise 3: Class Inheritance
class Animal {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  makeSound(): string {
    return "some sound";
  }
}

class Dog extends Animal {
  override makeSound(): string {
    return "bark";
  }
}

// Exercise 4: Static Properties and Methods
class Calculator {
  static add(a: number, b: number): number {
    return a + b;
  }

  static subtract(a: number, b: number): number {
    return a - b;
  }
}

// Exercise 5: Interfaces with Optional and Readonly Properties
interface User {
  readonly id: number;
  name: string;
  email: string;
}

interface PremiumUser extends User {
  membershipLevel?: "silver" | "gold" | "platinum";
}

function printUserDetails(user: PremiumUser): void {
  console.log(`ID: ${user.id}`);
  console.log(`Name: ${user.name}`);
  console.log(`Email: ${user.email}`);
  if (user.membershipLevel) {
    console.log(`Membership: ${user.membershipLevel}`);
  } else {
    console.log("Membership: standard");
  }
}

// Function Types in Interfaces (extra)
interface Comparator<T> {
  compare(a: T, b: T): number;
}

class NumberComparator implements Comparator<number> {
  compare(a: number, b: number): number {
    return a - b;
  }
}

// Demo runs
console.log("=== Exercise 1: Access Modifiers ===");
const emp = new Employee("Asha", 120000, "Engineer", "Backend");
console.log(emp.position); // public
console.log(emp.getEmployeeInfo());

console.log("\n=== Exercise 2: Readonly Properties ===");
const product = new Product(101, "Laptop", 999);
console.log(product.getProductInfo());
// product.id = 102; // Uncomment to see TypeScript error

console.log("\n=== Exercise 3: Inheritance ===");
const dog = new Dog("Rex");
console.log(dog.name);
console.log(dog.makeSound());

console.log("\n=== Exercise 4: Static Members ===");
console.log(Calculator.add(5, 3));
console.log(Calculator.subtract(10, 4));

console.log("\n=== Exercise 5: Interfaces ===");
const premiumUser: PremiumUser = {
  id: 42,
  name: "Kofi",
  email: "kofi@example.com",
  membershipLevel: "gold",
};
printUserDetails(premiumUser);

console.log("\n=== Function Types in Interfaces ===");
const comp: Comparator<number> = {
  compare: (a, b) => a - b,
};
console.log(comp.compare(10, 3));