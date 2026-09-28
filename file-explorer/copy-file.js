const fs = require('fs');

const content = fs.readFileSync('source.txt', 'utf8');
fs.writeFileSync('destination.txt', content, 'utf8');
console.log('source.txt copied to destination.txt.');
