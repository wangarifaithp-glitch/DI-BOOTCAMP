// Exercise 1: List of people
const people = ["Greg", "Mary", "Devon", "James"];

// 1. Remove "Greg"
people.shift();

// 2. Replace "James" with "Jason"
people[people.indexOf("James")] = "Jason";

// 3. Add your name to the end
people.push("YourName");

// 4. Mary's index
console.log("Mary index:", people.indexOf("Mary"));

// 5. Copy of people without Mary and your name
const peopleCopy = people.slice(1, 3);
console.log("People copy:", peopleCopy);

// 6. Index of "Foo"
console.log("Foo index:", people.indexOf("Foo"));
// It returns -1 because "Foo" is not in the array.

// 7. Last element
const last = people[people.length - 1];
console.log("Last:", last);

// Part II - Loops
console.log("Loop through people:");
for (let i = 0; i < people.length; i++) {
  console.log(people[i]);
}

console.log("Loop until Devon:");
for (let i = 0; i < people.length; i++) {
  console.log(people[i]);
  if (people[i] === "Devon") {
    break;
  }
}

// Exercise 2: Favorite colors
const colors = ["blue", "red", "green", "yellow", "purple"];
const suffixes = ["st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th"];

for (let i = 0; i < colors.length; i++) {
  const suffix = suffixes[i] || "th";
  console.log(`My ${i + 1}${suffix} choice is ${colors[i]}`);
}

// Exercise 3: Repeat the question
let userNumber = Number(prompt("Please enter a number:"));
while (userNumber < 10) {
  userNumber = Number(prompt("Please enter a number bigger than or equal to 10:"));
}
console.log("Final number:", userNumber);

// Exercise 4: Building Management
const building = {
  numberOfFloors: 4,
  numberOfAptByFloor: {
    firstFloor: 3,
    secondFloor: 4,
    thirdFloor: 9,
    fourthFloor: 2,
  },
  nameOfTenants: ["Sarah", "Dan", "David"],
  numberOfRoomsAndRent: {
    sarah: [3, 990],
    dan: [4, 1000],
    david: [1, 500],
  },
};

console.log("Number of floors:", building.numberOfFloors);
console.log(
  "Apartments on floors 1 and 3:",
  building.numberOfAptByFloor.firstFloor + building.numberOfAptByFloor.thirdFloor
);
console.log(
  "Second tenant:",
  building.nameOfTenants[1],
  "Rooms:",
  building.numberOfRoomsAndRent.dan[0]
);
if (building.numberOfRoomsAndRent.sarah[1] + building.numberOfRoomsAndRent.david[1] > building.numberOfRoomsAndRent.dan[1]) {
  building.numberOfRoomsAndRent.dan[1] = 1200;
}
console.log("Updated Dan rent:", building.numberOfRoomsAndRent.dan[1]);

// Exercise 5: Family
const family = {
  father: "John",
  mother: "Jane",
  son: "Mark",
  daughter: "Anna",
};

for (const key in family) {
  console.log("Key:", key);
}
for (const key in family) {
  console.log("Value:", family[key]);
}

// Exercise 6: Rudolf
const details = {
  my: "name",
  is: "Rudolf",
  the: "reindeer",
};

let sentence = "";
for (const key in details) {
  sentence += `${key} ${details[key]} `;
}
console.log(sentence.trim());

// Exercise 7: Secret Group
const names = ["Jack", "Philip", "Sarah", "Amanda", "Bernard", "Kyle"];
const sortedNames = [...names].sort();
const secretSociety = sortedNames.map(name => name[0]).join("");
console.log("Secret society:", secretSociety);
