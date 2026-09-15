function getDetails(name: string, age: number): [string, number, string] {
    const greeting = `Hello, my name is ${name} and I am ${age} years old.`;
    return [name, age, greeting];
}

// Example usage
const details = getDetails("Alice", 30);
console.log(details); // Output: [ 'Alice', 30, 'Hello, my name is Alice and I am 30 years old.' ]