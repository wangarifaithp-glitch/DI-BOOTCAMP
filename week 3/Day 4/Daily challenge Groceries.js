// Each call stores another word; an empty call returns the accumulated sentence.
const mergeWords = string => nextString =>
	nextString === undefined ? string : mergeWords(`${string} ${nextString}`);

console.log(mergeWords("Hello")());
console.log(mergeWords("Hello")("world")());
console.log(mergeWords("This")("is")("JavaScript")());
console.log(mergeWords("There")("is")("no")("spoon.")());
