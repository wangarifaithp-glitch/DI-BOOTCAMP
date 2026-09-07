// Exercise 1: Analyzing map
const mapResult = [1, 2, 3].map((num) => {
	if (typeof num === 'number') return num * 2;
	return;
});

// All values are numbers, so the result is [2, 4, 6].
console.log('Map result:', mapResult);

// Exercise 2: Analyzing reduce
const reduceResult = [[0, 1], [2, 3]].reduce(
	(acc, cur) => acc.concat(cur),
	[1, 2],
);

// The result is [1, 2, 0, 1, 2, 3].
console.log('Reduce result:', reduceResult);

// Exercise 3: The second map argument is the current index.
const arrayNum = [1, 2, 4, 5, 8, 9];
const newArray = arrayNum.map((num, i) => {
	console.log('Value and index:', num, i);
	return num * 2;
});

// i takes the values 0, 1, 2, 3, 4, and 5.
console.log('Mapped numbers:', newArray);

// Exercise 4: Nested arrays
const array = [[1], [2], [3], [[[4]]], [[[5]]]];
const flattenedArray = array.flat(2);

// Bonus one-line version: array.flat(2)
console.log('Flattened array:', flattenedArray);

const greeting = [
	['Hello', 'young', 'grasshopper!'],
	['you', 'are'],
	['learning', 'fast!'],
];

const joinedGreetingParts = greeting.map((words) => words.join(' '));
const greetingString = joinedGreetingParts.join(' ');

console.log('Joined greeting:', joinedGreetingParts);
console.log('Greeting string:', greetingString);

const trapped = [[[[[[[[[[[[[[[[[[[[[[[[[[3]]]]]]]]]]]]]]]]]]]]]]]]]];
const releasedNumber = trapped.flat(Infinity);

console.log('Released number:', releasedNumber);
