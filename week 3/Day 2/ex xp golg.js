// Exercise 1 : is_Blank
function isBlank(str) {
  return str.trim() === "";
}

console.log(isBlank(''));
console.log(isBlank('abc'));

// Exercise 2 : Abbrev_name
function abbrevName(name) {
  const parts = name.split(" ");
  return `${parts[0]} ${parts[1][0]}.`;
}

console.log(abbrevName("Robin Singh"));

// Exercise 3 : SwapCase
function swapCase(str) {
  return str
    .split("")
    .map((char) => {
      if (char >= "a" && char <= "z") return char.toUpperCase();
      if (char >= "A" && char <= "Z") return char.toLowerCase();
      return char;
    })
    .join("");
}

console.log(swapCase("The Quick Brown Fox"));

// Exercise 4 : Omnipresent value
function isOmnipresent(arr, value) {
  return arr.every(subArray => subArray.includes(value));
}

console.log(isOmnipresent([[1, 1], [1, 3], [5, 1], [6, 1]], 1));
console.log(isOmnipresent([[1, 1], [1, 3], [5, 1], [6, 1]], 6));

// Exercise 5 : Red table
const table = document.body.firstElementChild;

if (table && table.tagName === "TABLE") {
  const rows = table.rows;

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].cells;
    for (let j = 0; j < cells.length; j++) {
      if (i === j) {
        cells[j].style.backgroundColor = "red";
      }
    }
  }
}
