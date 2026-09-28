const path = require('path');
const { readFile, writeFile } = require('./fileManager');

const helloWorldPath = path.join(__dirname, 'Hello World.txt');
const byeWorldPath = path.join(__dirname, 'Bye World.txt');

const helloWorldContent = readFile(helloWorldPath);
console.log(`Read from Hello World.txt: ${helloWorldContent}`);

writeFile(byeWorldPath, 'Writing to the file');
console.log('Successfully wrote to Bye World.txt.');
