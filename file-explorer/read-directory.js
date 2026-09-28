const fs = require('fs');

const files = fs.readdirSync('.');
files.forEach((file) => console.log(file));
