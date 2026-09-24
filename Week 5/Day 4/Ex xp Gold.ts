// =========================
// Exercise 1: Intersection Types + Type Guards
// =========================

interface User {
  name: string;
  email: string;
}

interface Admin {
  adminLevel: number;
}

type AdminUser = User & Admin;

function getProperty(obj: AdminUser, prop: string): any {
  if (prop in obj) {
    return (obj as any)[prop];
  }
  return undefined;
}

const adminUser: AdminUser = {
  name: "Asha",
  email: "asha@example.com",
  adminLevel: 3,
};

console.log("=== Exercise 1 ===");
console.log("name:", getProperty(adminUser, "name"));
console.log("adminLevel:", getProperty(adminUser, "adminLevel"));
console.log("unknownProp:", getProperty(adminUser, "unknownProp"));

// =========================
// Exercise 2: Type Casting with Generics
// =========================

function castToType<T>(value: any): T {
  return value as T;
}

console.log("\n=== Exercise 2 ===");

const numStr = "42";
const castedNumber = castToType<number>(numStr);
console.log("Casted number:", castedNumber, typeof castedNumber);

const boolStr = "true";
const castedBoolean = castToType<boolean>(boolStr);
console.log("Casted boolean:", castedBoolean, typeof castedBoolean);

// =========================