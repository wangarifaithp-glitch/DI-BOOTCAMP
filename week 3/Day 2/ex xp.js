const stock = {
  banana: 6,
  apple: 0,
  pear: 12,
  orange: 32,
  blueberry: 1,
};

const prices = {
  banana: 4,
  apple: 2,
  pear: 1,
  orange: 1.5,
  blueberry: 10,
};

function displayNumbersDivisible(divisor = 23) {
  let sum = 0;
  const numbers = [];

  for (let i = 0; i <= 500; i++) {
    if (i % divisor === 0) {
      numbers.push(i);
      sum += i;
      console.log(i);
    }
  }

  console.log("Sum:", sum);
  return { numbers, sum };
}

console.log("Exercise 1:");
displayNumbersDivisible(23);

const shoppingList = ["banana", "orange", "apple"];

function myBill() {
  let total = 0;

  shoppingList.forEach((item) => {
    if (item in stock && stock[item] > 0 && item in prices) {
      total += prices[item];
      stock[item] -= 1;
    }
  });

  console.log("Exercise 2 - Total bill:", total);
  return total;
}

myBill();

function changeEnough(itemPrice, amountOfChange) {
  const values = [0.25, 0.1, 0.05, 0.01];
  const total = amountOfChange.reduce((sum, coins, index) => {
    return sum + coins * values[index];
  }, 0);

  return total >= itemPrice;
}

console.log("Exercise 3:");
console.log(changeEnough(4.25, [25, 20, 5, 0]));
console.log(changeEnough(14.11, [2, 100, 0, 0]));
console.log(changeEnough(0.75, [0, 0, 20, 5]));

function hotelCost() {
  let nights;

  while (true) {
    nights = Number(prompt("How many nights would you like to stay?"));
    if (!Number.isNaN(nights) && nights > 0) {
      break;
    }
    alert("Please enter a valid number of nights.");
  }

  return nights * 140;
}

function planeRideCost() {
  let destination;

  while (true) {
    destination = prompt("What is your destination?");
    if (typeof destination === "string" && destination.trim() !== "") {
      break;
    }
    alert("Please enter a valid destination.");
  }

  const normalized = destination.trim().toLowerCase();

  if (normalized === "london") return 183;
  if (normalized === "paris") return 220;

  return 300;
}

function rentalCarCost() {
  let days;

  while (true) {
    days = Number(prompt("How many days would you like to rent the car?"));
    if (!Number.isNaN(days) && days > 0) {
      break;
    }
    alert("Please enter a valid number of days.");
  }

  let cost = days * 40;

  if (days > 10) {
    cost *= 0.95;
  }

  return cost;
}

function totalVacationCost() {
  const hotel = hotelCost();
  const plane = planeRideCost();
  const car = rentalCarCost();
  const total = hotel + plane + car;

  console.log("Exercise 4:");
  console.log(`The car cost: $${car}, the hotel cost: $${hotel}, the plane tickets cost: $${plane}.`);
  console.log(`Total vacation cost: $${total}`);

  return total;
}

console.log("Exercise 4 total:", totalVacationCost());

document.addEventListener("DOMContentLoaded", () => {
  console.log("Exercise 5:");
  const container = document.getElementById("container");
  console.log(container);

  const lists = document.querySelectorAll(".list");

  const firstList = lists[0];
  const secondList = lists[1];

  const pete = firstList.querySelectorAll("li")[1];
  if (pete) {
    pete.textContent = "Richard";
  }

  const richard = Array.from(document.querySelectorAll("li")).find(
    (li) => li.textContent.trim() === "Richard"
  );

  if (secondList.children[1]) {
    secondList.removeChild(secondList.children[1]);
  }

  lists.forEach((ul) => {
    ul.classList.add("student_list");
    const firstLi = ul.querySelector("li");
    if (firstLi) {
      firstLi.textContent = "Your Name";
    }
  });

  firstList.classList.add("university", "attendance");

  container.style.backgroundColor = "lightblue";
  container.style.padding = "10px";

  const dan = Array.from(document.querySelectorAll("li")).find(
    (li) => li.textContent.trim() === "Dan"
  );
  if (dan) {
    dan.style.display = "none";
  }

  if (richard) {
    richard.style.border = "2px solid black";
  }

  document.body.style.fontSize = "18px";

  const visibleUsers = Array.from(document.querySelectorAll("li"))
    .map((li) => li.textContent.trim())
    .filter((name) => name && name !== "Dan");

  if (getComputedStyle(container).backgroundColor === "rgb(173, 216, 230)" && visibleUsers.length >= 2) {
    alert(`Hello ${visibleUsers[0]} and ${visibleUsers[1]}`);
  }

  console.log("Exercise 6:");
  const navBar = document.getElementById("navBar");
  navBar.setAttribute("id", "socialNetworkNavigation");

  const navList = navBar.querySelector("ul");
  const newItem = document.createElement("li");
  const newText = document.createTextNode("Logout");
  newItem.appendChild(newText);
  navList.appendChild(newItem);

  const firstNavItem = navList.firstElementChild;
  const lastNavItem = navList.lastElementChild;

  console.log(firstNavItem.textContent);
  console.log(lastNavItem.textContent);

  console.log("Exercise 7:");
  const allBooks = [
    {
      title: "Harry Potter",
      author: "J.K. Rowling",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=200&q=80",
      alreadyRead: true,
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=200&q=80",
      alreadyRead: false,
    },
  ];

  const bookSection = document.querySelector(".listBooks");

  allBooks.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.style.marginBottom = "15px";

    const titleAuthor = document.createElement("p");
    titleAuthor.textContent = `${book.title} written by ${book.author}`;

    const image = document.createElement("img");
    image.src = book.image;
    image.alt = `${book.title} cover`;
    image.width = 100;

    if (book.alreadyRead) {
      titleAuthor.style.color = "red";
    }

    bookCard.appendChild(titleAuthor);
    bookCard.appendChild(image);
    bookSection.appendChild(bookCard);
  });
});
