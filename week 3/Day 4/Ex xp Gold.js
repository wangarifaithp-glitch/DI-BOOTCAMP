// Exercise 1: Nested functions
// Prediction: landscape() returns "____/''''\\____".
// flat adds four underscores, mountain adds /, four apostrophes, and \\,
// then the second flat adds four more underscores. The inner functions close
// over and update result from landscape.

const landscape = () => {
	let result = "";

	const flat = x => {
		for (let count = 0; count < x; count++) {
			result += "_";
		}
	};

	const mountain = x => {
		result += "/";
		for (let counter = 0; counter < x; counter++) {
			result += "'";
		}
		result += "\\";
	};

	flat(4);
	mountain(4);
	flat(4);

	return result;
};

console.log(landscape());

// Exercise 2: Closure
// Prediction: addTo(10) returns a function that remembers x = 10.
// Calling that function with 3 returns 13.
const addTo = x => y => x + y;
const addToTen = addTo(10);
console.log(addToTen(3));

// Exercise 3: Currying
// Prediction: curriedSumExercise3(30)(1) returns 31.
// The first call stores a = 30, and the second call supplies b = 1.
const curriedSumExercise3 = a => b => a + b;
console.log(curriedSumExercise3(30)(1));

// Exercise 4: Currying
// Prediction: add5(12) returns 17 because it adds the stored value 5 to 12.
const curriedSumExercise4 = a => b => a + b;
const add5 = curriedSumExercise4(5);
console.log(add5(12));

// Exercise 5: Composing
// Prediction: compose(add1, add5)(10) returns 16. Composition runs add5 first
// (10 + 5 = 15), then passes that result to add1 (15 + 1 = 16).
const compose = (f, g) => a => f(g(a));
const add1 = num => num + 1;
const addFive = num => num + 5;
console.log(compose(add1, addFive)(10));
