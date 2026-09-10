function makeAllCaps(words) {
	return new Promise((resolve, reject) => {
		if (!words.every(word => typeof word === "string")) {
			reject("Every item must be a string");
			return;
		}

		resolve(words.map(word => word.toUpperCase()));
	});
}

function sortWords(words) {
	return new Promise((resolve, reject) => {
		if (words.length <= 4) {
			reject("The array must contain more than four words");
			return;
		}

		resolve([...words].sort((firstWord, secondWord) => firstWord.localeCompare(secondWord)));
	});
}

makeAllCaps([1, "pear", "banana"])
	.then(words => sortWords(words))
	.then(result => console.log(result))
	.catch(error => console.log(error));

makeAllCaps(["apple", "pear", "banana"])
	.then(words => sortWords(words))
	.then(result => console.log(result))
	.catch(error => console.log(error));

makeAllCaps(["apple", "pear", "banana", "melon", "kiwi"])
	.then(words => sortWords(words))
	.then(result => console.log(result))
	.catch(error => console.log(error));

const morse = `{
	"0": "-----",
	"1": ".----",
	"2": "..---",
	"3": "...--",
	"4": "....-",
	"5": ".....",
	"6": "-....",
	"7": "--...",
	"8": "---..",
	"9": "----.",
	"a": ".-",
	"b": "-...",
	"c": "-.-.",
	"d": "-..",
	"e": ".",
	"f": "..-.",
	"g": "--.",
	"h": "....",
	"i": "..",
	"j": ".---",
	"k": "-.-",
	"l": ".-..",
	"m": "--",
	"n": "-.",
	"o": "---",
	"p": ".--.",
	"q": "--.-",
	"r": ".-.",
	"s": "...",
	"t": "-",
	"u": "..-",
	"v": "...-",
	"w": ".--",
	"x": "-..-",
	"y": "-.--",
	"z": "--..",
	".": ".-.-.-",
	",": "--..--",
	"?": "..--..",
	"!": "-.-.--",
	"-": "-....-",
	"/": "-..-.",
	"@": ".--.-.",
	"(": "-.--.",
	")": "-.--.-"
}`;

function toJs() {
	return new Promise((resolve, reject) => {
		const morseJS = JSON.parse(morse);

		if (Object.keys(morseJS).length === 0) {
			reject("The Morse object is empty");
			return;
		}

		resolve(morseJS);
	});
}

function toMorse(morseJS) {
	return new Promise((resolve, reject) => {
		const userInput = window.prompt("Enter a word or sentence:");

		if (userInput === null) {
			reject("No text was entered");
			return;
		}

		const translation = [];

		for (const character of userInput.toLowerCase()) {
			if (character === " ") {
				continue;
			}

			if (!Object.prototype.hasOwnProperty.call(morseJS, character)) {
				reject(`The character "${character}" is not in the Morse dictionary`);
				return;
			}

			translation.push(morseJS[character]);
		}

		resolve(translation);
	});
}

function joinWords(morseTranslation) {
	const output = document.createElement("pre");
	output.textContent = morseTranslation.join("\n");
	document.body.appendChild(output);
	return morseTranslation;
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
	toJs()
		.then(morseJS => toMorse(morseJS))
		.then(morseTranslation => joinWords(morseTranslation))
		.catch(error => console.log(error));
}
