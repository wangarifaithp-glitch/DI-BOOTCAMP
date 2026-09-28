const fs = require('fs');
const path = require('path');

// Helper function to handle async operations sequentially
async function runAllExercises() {

  // ==========================================
  //  Exercise 1: CommonJS Multiple Exports & Imports
  // ==========================================
  console.log("=== EXERCISE 1 ===");
  const products = [
    { name: 'Laptop', price: 1200, category: 'Electronics' },
    { name: 'Phone', price: 800, category: 'Electronics' },
    { name: 'Desk', price: 150, category: 'Furniture' }
  ];

  function findProduct(productName) {
    const product = products.find(p => p.name.toLowerCase() === productName.toLowerCase());
    if (product) {
      console.log(Found: ${product.name} | Category: ${product.category} | Price: $${product.price});
    } else {
      console.log(Product "${productName}" not found.);
    }
  }

  findProduct('Laptop');
  findProduct('Desk');
  findProduct('Tablet');

  // ==========================================
  //  Exercise 2: ES6 Module Usage (Simulated via JS Object)
  // ==========================================
  console.log("\n=== EXERCISE 2 ===");
  const persons = [
    { name: 'Alice', age: 25, location: 'New York' },
    { name: 'Bob', age: 30, location: 'London' },
    { name: 'Charlie', age: 35, location: 'Paris' }
  ];

  function calculateAverageAge(peopleArray) {
    const totalAge = peopleArray.reduce((sum, person) => sum + person.age, 0);
    const avgAge = totalAge / peopleArray.length;
    console.log(Average Age: ${avgAge.toFixed(2)});
  }

  calculateAverageAge(persons);

 

  //  Exercise 3: File Management using fs
  // ==========================================
  console.log("\n=== EXERCISE 3 ===");
  const fileManager = {
    readFile: (filePath) => fs.readFileSync(filePath, 'utf8'),
    writeFile: (filePath, content) => fs.writeFileSync(filePath, content, 'utf8')
  };

  fileManager.writeFile('Hello World.txt', 'Hello World !! ');
  fileManager.writeFile('Bye World.txt', 'Bye World !! ');

  const helloContent = fileManager.readFile('Hello World.txt');
  console.log('Read Content from Hello World.txt:', helloContent);

  fileManager.writeFile('Bye World.txt', 'Writing to the file');
  console.log('Updated Bye World.txt content to: "Writing to the file"');


  //  Exercise 4: Todo List Class
  // ==========================================
  console.log("\n=== EXERCISE 4 ===");
  class TodoList {
    constructor() {
      this.tasks = [];
    }

addTask(taskName) {
  this.tasks.push({ task: taskName, completed: false });
  console.log(`Added task: "${taskName}"`);
}

markComplete(taskName) {
  const task = this.tasks.find(t => t.task.toLowerCase() === taskName.toLowerCase());
  if (task) {
    task.completed = true;
    console.log(`Marked as complete: "${taskName}"`);
  } else {
    console.log(`Task "${taskName}" not found.`);
  }
}

listTasks() {
  console.log("Current Tasks:");
  this.tasks.forEach((t, i) => {
    console.log(` ${i + 1}. [${t.completed ? 'X' : ' '}] ${t.task}`);
  });
}
  }

  const myTodoList = new TodoList();
  myTodoList.addTask('Buy groceries');
  myTodoList.addTask('Clean the room');
  myTodoList.markComplete('Buy groceries');
  myTodoList.listTasks();



  //  Exercise 5: Custom Math Module
  // ==========================================
  console.log("\n=== EXERCISE 5 ===");
  const customMath = {
    add: (a, b) => a + b,
    multiply: (a, b) => a * b
  };

  console.log('Addition (5 + 3):', customMath.add(5, 3));
  console.log('Multiplication (4 * 7):', customMath.multiply(4, 7));

  // ==========================================

  // ==========================================
  console.log("\n=== EXERCISE 6 ===");
  // Using ANSI escape codes (native Node.js alternative to chalk package)
  console.log("\x1b[32m%s\x1b[0m", "Success! This text is green.");
  console.log("\x1b[31m%s\x1b[0m", "Error! This text is red.");
  console.log("\x1b[34m%s\x1b[0m", "Info! This text is blue.");

  //  Exercise 7: Reading and Copying Files
  console.log("\n=== EXERCISE 7 ===");
  // Create source file
  fs.writeFileSync('source.txt', 'This is the sample text inside source.txt', 'utf8');

  // Copy file content
  const sourceData = fs.readFileSync('source.txt', 'utf8');
  fs.writeFileSync('destination.txt', sourceData, 'utf8');
  console.log('Copied source.txt content to destination.txt successfully.');

  // Read Directory
  console.log('Files in current directory:');
  const files = fs.readdirSync(__dirname);
  files.forEach(file => console.log(- ${file}));
}

runAllExercises();