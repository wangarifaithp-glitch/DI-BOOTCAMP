// This file demonstrates how to use type assertions to cast an HTML element retrieved from the DOM to a specific type, allowing access to its properties.

const inputElement = document.getElementById('inputField') as HTMLInputElement;

if (inputElement) {
    inputElement.value = 'TypeScript is awesome!';
    console.log(inputElement.value);
} else {
    console.log('Input element not found.');
}