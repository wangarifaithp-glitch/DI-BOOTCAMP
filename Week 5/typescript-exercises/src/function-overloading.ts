function greet(name: string): string;
function greet(): string;
function greet(name?: string): string {
    if (name) {
        return `Hello, ${name}!`;
    } else {
        return "Hello, World!";
    }
}

// Example usage
console.log(greet("Alice")); // Output: Hello, Alice!
console.log(greet());        // Output: Hello, World!