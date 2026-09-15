function checkNumber(num: number): string {
    if (num > 0) {
        return "The number is positive.";
    } else if (num < 0) {
        return "The number is negative.";
    } else {
        return "The number is zero.";
    }
}

// Example usage
console.log(checkNumber(10));  // The number is positive.
console.log(checkNumber(-5));  // The number is negative.
console.log(checkNumber(0));   // The number is zero.