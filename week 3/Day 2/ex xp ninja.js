// Exercise 1: Random Number
const randomNumber = Math.floor(Math.random() * 100) + 1;
console.log("Random number:", randomNumber);

for (let i = 0; i <= randomNumber; i++) {
  if (i % 2 === 0) {
    console.log(i);
  }
}

// Exercise 2: Capitalized letters
function capitalize(str) {
  const evenCaps = str
    .split("")
    .map((char, index) => (index % 2 === 0 ? char.toUpperCase() : char))
    .join("");

  const oddCaps = str
    .split("")
    .map((char, index) => (index % 2 !== 0 ? char.toUpperCase() : char))
    .join("");

  return [evenCaps, oddCaps];
}

console.log(capitalize("abcdef"));

// Exercise 3: Is palindrome?
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const reversed = cleaned.split("").reverse().join("");
  return cleaned === reversed;
}

console.log(isPalindrome("madam"));
console.log(isPalindrome("hello"));

// Exercise 4: Biggest Number
function biggestNumberInArray(arrayNumber) {
  if (!Array.isArray(arrayNumber) || arrayNumber.length === 0) return 0;

  let biggest = Number.NEGATIVE_INFINITY;

  for (const item of arrayNumber) {
    const numericValue = Number(item);
    if (!Number.isNaN(numericValue) && numericValue > biggest) {
      biggest = numericValue;
    }
  }

  return biggest === Number.NEGATIVE_INFINITY ? 0 : biggest;
}

console.log(biggestNumberInArray([-1, 0, 3, 100, 99, 2, 99]));
console.log(biggestNumberInArray(["a", 3, 4, 2]));
console.log(biggestNumberInArray([]));

// Exercise 5: Unique Elements
function uniqueElements(array) {
  return [...new Set(array)];
}

console.log(uniqueElements([1, 2, 3, 3, 3, 3, 4, 5]));

// Exercise 6: Calendar
function createCalendar(year, month) {
  const calendar = document.createElement("table");
  const headerRow = document.createElement("tr");
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  days.forEach((day) => {
    const th = document.createElement("th");
    th.textContent = day;
    headerRow.appendChild(th);
  });

  calendar.appendChild(headerRow);

  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  let currentDay = 1;
  let row = document.createElement("tr");

  for (let i = 0; i < firstWeekday; i++) {
    const emptyCell = document.createElement("td");
    row.appendChild(emptyCell);
  }

  for (let day = 1; day <= totalDays; day++) {
    if ((day + firstWeekday - 1) % 7 === 0) {
      calendar.appendChild(row);
      row = document.createElement("tr");
    }

    const cell = document.createElement("td");
    cell.textContent = day;
    row.appendChild(cell);
    currentDay++;
  }

  while (row.children.length < 7) {
    const emptyCell = document.createElement("td");
    row.appendChild(emptyCell);
  }

  if (row.children.length > 0) {
    calendar.appendChild(row);
  }

  document.body.appendChild(calendar);
  return calendar;
}

createCalendar(2012, 9);
