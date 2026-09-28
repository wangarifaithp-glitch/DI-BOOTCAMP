const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'source.txt');
const destinationPath = path.join(__dirname, 'destination.txt');
const content = fs.readFileSync(sourcePath, 'utf8');
fs.writeFileSync(destinationPath, content, 'utf8');
console.log('source.txt copied to destination.txt.');
