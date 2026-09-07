// Exercise 1: Dog age to human years
const data = [
	{ name: 'Butters', age: 3, type: 'dog' },
	{ name: 'Cuty', age: 5, type: 'rabbit' },
	{ name: 'Lizzy', age: 6, type: 'dog' },
	{ name: 'Red', age: 1, type: 'cat' },
	{ name: 'Joey', age: 3, type: 'dog' },
	{ name: 'Rex', age: 10, type: 'dog' },
];

let dogAgeSum = 0;

for (const animal of data) {
	if (animal.type === 'dog') {
		dogAgeSum += animal.age * 7;
	}
}

console.log('Dog age sum using a loop:', dogAgeSum);

const dogAgeSumWithReduce = data.reduce((sum, animal) => {
	return animal.type === 'dog' ? sum + animal.age * 7 : sum;
}, 0);

console.log('Dog age sum using reduce:', dogAgeSumWithReduce);

// Exercise 2: Email
const userEmail3 = ' cannotfillemailformcorrectly@gmail.com ';
const cleanedEmail = userEmail3.trim();

console.log('Cleaned email:', cleanedEmail);

// Exercise 3: Employees #3
const users = [
	{ firstName: 'Bradley', lastName: 'Bouley', role: 'Full Stack Resident' },
	{ firstName: 'Chloe', lastName: 'Alnaji', role: 'Full Stack Resident' },
	{ firstName: 'Jonathan', lastName: 'Baughn', role: 'Enterprise Instructor' },
	{ firstName: 'Michael', lastName: 'Herman', role: 'Lead Instructor' },
	{ firstName: 'Robert', lastName: 'Hajek', role: 'Full Stack Resident' },
	{ firstName: 'Wes', lastName: 'Reid', role: 'Instructor' },
	{ firstName: 'Zach', lastName: 'Klabunde', role: 'Instructor' },
];

const usersByFullName = {};

for (const user of users) {
	const fullName = `${user.firstName} ${user.lastName}`;
	usersByFullName[fullName] = user.role;
}

console.log('Users by full name:', usersByFullName);

// Exercise 4: Array to object
const letters = ['x', 'y', 'z', 'z'];
const letterCountsWithLoop = {};

for (const letter of letters) {
	letterCountsWithLoop[letter] = (letterCountsWithLoop[letter] || 0) + 1;
}

console.log('Letter counts using a loop:', letterCountsWithLoop);

const letterCountsWithReduce = letters.reduce((counts, letter) => {
	counts[letter] = (counts[letter] || 0) + 1;
	return counts;
}, {});

console.log('Letter counts using reduce:', letterCountsWithReduce);
