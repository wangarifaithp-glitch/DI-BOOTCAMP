// Exercise 1: Sum elements
const numbers = [1, 2, 3, 4, 5];
let sum = 0;

for (const number of numbers) {
	sum += number;
}

console.log('Sum:', sum);

// Exercise 2: Remove duplicates
const values = [1, 2, 2, 3, 4, 4, 5];
const uniqueValues = [...new Set(values)];

console.log('Without duplicates:', uniqueValues);

// Exercise 3: Remove falsy values
function removeFalsyValues(array) {
	return array.filter(Boolean);
}

const sampleArray = [NaN, 0, 15, false, -22, '', undefined, 47, null];
console.log('Without falsy values:', removeFalsyValues(sampleArray));

// Exercise 4: Repeat a string
function repeat(string, times = 1) {
	let result = '';

	for (let index = 0; index < times; index += 1) {
		result += string;
	}

	return result;
}

console.log(repeat('Ha!', 3));
console.log(repeat('Hello'));

// Exercise 5: Turtle and rabbit
const startLine = '     ||<- Start line';
let turtle = '🐢';
let rabbit = '🐇';
const startPosition = startLine.indexOf('|') + 2;

turtle = turtle.padStart(startPosition, ' ');
rabbit = rabbit.padStart(startPosition, ' ');

console.log(startLine);
console.log(turtle);
console.log(rabbit);

const paddedTurtle = turtle.trim().padEnd(9, '=');
console.log('After trim and padEnd:', paddedTurtle);
