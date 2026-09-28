const _ = require('lodash');
const { add, multiply } = require('./math');

const numbers = [4, 7, 2];
const firstTwoNumbersSum = add(numbers[0], numbers[1]);
const product = multiply(numbers[0], numbers[1]);

console.log(`Sum: ${firstTwoNumbersSum}`);
console.log(`Product: ${product}`);
console.log(`Sorted numbers: ${_.sortBy(numbers).join(', ')}`);
console.log(`Largest number: ${_.max(numbers)}`);
