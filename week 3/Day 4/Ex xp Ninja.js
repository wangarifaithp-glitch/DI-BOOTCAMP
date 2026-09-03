// Each call adds one word; calling the returned function without an argument
// returns the sentence accumulated by the closure.
const mergeWords = word => nextWord =>
	nextWord === undefined ? word : mergeWords(`${word} ${nextWord}`);

console.log(mergeWords("Hello")());
console.log(mergeWords("There")("is")("no")("spoon.")());
