const fs = require('fs');
const path = require('path');

const directoryPath = path.resolve(__dirname);
const files = fs.readdirSync(directoryPath);
files.forEach((file) => console.log(file));
