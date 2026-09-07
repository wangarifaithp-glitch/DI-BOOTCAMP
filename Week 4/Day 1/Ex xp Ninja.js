// Exercise 1: Menu
const menu = [
	{
		type: 'starter',
		name: 'Houmous with Pita',
	},
	{
		type: 'starter',
		name: 'Vegetable Soup with Houmous peas',
	},
	{
		type: 'dessert',
		name: 'Chocolate Cake',
	},
];

const hasDessert = menu.some((course) => course.type === 'dessert');
console.log(hasDessert ? 'The menu has a dessert.' : 'The menu has no dessert.');

const areAllStarters = menu.every((course) => course.type === 'starter');
console.log(areAllStarters ? 'All courses are starters.' : 'Not all courses are starters.');

const hasMainCourse = menu.some((course) => course.type === 'main course');

if (!hasMainCourse) {
	menu.push({
		type: 'main course',
		name: 'Grilled Vegetable Pasta',
	});
}

const vegetarian = ['vegetable', 'houmous', 'eggs', 'vanilla', 'potatoes'];

menu.forEach((course) => {
	const courseName = course.name.toLowerCase();
	course.vegetarian = vegetarian.some((ingredient) => courseName.includes(ingredient));
});

console.log('Updated menu:', menu);

// Exercise 2: Chop into chunks
function stringChop(string, chunkLength) {
	const chunks = [];

	for (let index = 0; index < string.length; index += chunkLength) {
		chunks.push(string.slice(index, index + chunkLength));
	}

	return chunks;
}

console.log('String chunks:', stringChop('developers', 2));

// Exercise 3: Search for a word
function searchWord(string, word) {
	const matches = string.match(new RegExp(word, 'g')) || [];
	return `'${word}' was found ${matches.length} times.`;
}

console.log(searchWord('The quick brown fox', 'fox'));

// Exercise 4: Reverse an array in place
function reverseArray(array) {
	for (let start = 0, end = array.length - 1; start < end; start += 1, end -= 1) {
		[array[start], array[end]] = [array[end], array[start]];
	}

	return array;
}

console.log('Reversed array:', reverseArray([1, 2, 3, 4, 5]));
console.log('Reversed array:', reverseArray([1, 2]));
console.log('Reversed array:', reverseArray([]));
console.log('Reversed array:', reverseArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
