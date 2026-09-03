// Exercise 1: Scope

function funcOne() {
	let a = 5;
	if (a > 1) {
		a = 3;
	}
	alert(`inside the funcOne function ${a}`);
}

// funcOne();

let scopeA = 0;
function funcTwo() {
	scopeA = 5;
}

function funcThree() {
	alert(`inside the funcThree function ${scopeA}`);
}

// funcThree();
// funcTwo();
// funcThree();

function funcFour() {
	window.a = "hello";
}

function funcFive() {
	alert(`inside the funcFive function ${window.a}`);
}

// funcFour();
// funcFive();

let outerA = 1;
function funcSix() {
	let innerA = "test";
	alert(`inside the funcSix function ${innerA}`);
}

// funcSix();

// Exercise 5: Kg and grams
function kilogramsToGrams(weightInKilograms) {
	return weightInKilograms * 1000;
}
console.log(kilogramsToGrams(2));

const kilogramsToGramsExpression = function (weightInKilograms) {
	return weightInKilograms * 1000;
};
console.log(kilogramsToGramsExpression(2));

// A declaration is hoisted and can be called before its definition; an expression is assigned at runtime.
const kilogramsToGramsArrow = weightInKilograms => weightInKilograms * 1000;
console.log(kilogramsToGramsArrow(2));

// Exercise 2: Ternary operator
const winBattle = () => true;
const experiencePoints = winBattle() ? 10 : 1;
console.log(experiencePoints);

// Exercise 3: Is it a string?
const isString = value => typeof value === "string";
console.log(isString("hello"));
console.log(isString([1, 2, 4, 0]));

// Exercise 4: Find the sum
const sum = (firstNumber, secondNumber) => firstNumber + secondNumber;
console.log(sum(4, 6));

// Exercise 6: Fortune teller
(function (numberOfChildren, partnerName, geographicLocation, jobTitle) {
	const fortune = `You will be a ${jobTitle} in ${geographicLocation}, and married to ${partnerName} with ${numberOfChildren} kids.`;
	document.querySelector("#fortune").textContent = fortune;
})(3, "Alex", "Paris", "web developer");

// Exercise 7: Welcome
(function (userName) {
	const welcome = document.createElement("div");
	const profileImage = document.createElement("img");
	profileImage.src = "https://i.pravatar.cc/80?img=12";
	profileImage.alt = `${userName}'s profile picture`;
	welcome.append(profileImage, document.createTextNode(`Welcome, ${userName}`));
	document.querySelector("#navbar").appendChild(welcome);
})("John");

// Exercise 8, Part I: one inner call from the outer function.
function makeJuice(size) {
	function addIngredients(firstIngredient, secondIngredient, thirdIngredient) {
		document.querySelector("#juice-part-one").textContent =
			`The client wants a ${size} juice, containing ${firstIngredient}, ${secondIngredient}, ${thirdIngredient}.`;
	}

	addIngredients("apple", "ginger", "lemon");
}

makeJuice("medium");

// Exercise 8, Part II: collect six ingredients, then display them once.
function makeJuice(size) {
	const ingredients = [];

	function addIngredients(firstIngredient, secondIngredient, thirdIngredient) {
		ingredients.push(firstIngredient, secondIngredient, thirdIngredient);
	}

	function displayJuice() {
		document.querySelector("#juice-part-two").textContent =
			`The client wants a ${size} juice, containing ${ingredients.join(", ")}.`;
	}

	addIngredients("mango", "banana", "lime");
	addIngredients("mint", "pineapple", "coconut");
	displayJuice();
}

makeJuice("large");
