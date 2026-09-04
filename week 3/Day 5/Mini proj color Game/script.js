const board = document.querySelector('#board');
const palette = document.querySelector('#palette');
const clearButton = document.querySelector('#clear-button');
const newPuzzleButton = document.querySelector('#new-puzzle-button');
const filledCount = document.querySelector('#filled-count');
const selectedColorName = document.querySelector('#selected-color-name');
const boardStatus = document.querySelector('#board-status');

const colors = [
	{ name: 'Coral', value: '#ee6c4d' },
	{ name: 'Sun', value: '#f2c14e' },
	{ name: 'Mint', value: '#62c5a3' },
	{ name: 'Sky', value: '#4da3d9' },
	{ name: 'Lavender', value: '#9b8ed1' },
	{ name: 'Pink', value: '#e79ab5' },
	{ name: 'Ink', value: '#17212b' }
];

let selectedColor = colors[0];
let isDrawing = false;

function updateProgress() {
	const coloredSquares = document.querySelectorAll('.square[data-colored="true"]').length;
	filledCount.textContent = coloredSquares;
	boardStatus.textContent = coloredSquares === 100 ? 'Board complete!' : coloredSquares ? 'Keep creating' : 'Ready to create';
}

function colorSquare(square) {
	square.style.backgroundColor = selectedColor.value;
	square.style.borderColor = selectedColor.value;
	square.dataset.colored = 'true';
	updateProgress();
}

colors.forEach((color, index) => {
	const swatch = document.createElement('button');
	swatch.className = `color-swatch${index === 0 ? ' selected' : ''}`;
	swatch.type = 'button';
	swatch.style.backgroundColor = color.value;
	swatch.title = color.name;
	swatch.setAttribute('aria-label', `Choose ${color.name}`);
	swatch.addEventListener('click', () => {
		selectedColor = color;
		selectedColorName.textContent = color.name;
		document.querySelectorAll('.color-swatch').forEach((item) => item.classList.remove('selected'));
		swatch.classList.add('selected');
	});
	palette.appendChild(swatch);
});

for (let index = 0; index < 100; index += 1) {
	const square = document.createElement('button');
	square.className = 'square';
	square.type = 'button';
	square.setAttribute('role', 'gridcell');
	square.setAttribute('aria-label', `Square ${index + 1}`);
	square.addEventListener('mousedown', () => {
		isDrawing = true;
		colorSquare(square);
	});
	square.addEventListener('mouseover', () => {
		if (isDrawing) colorSquare(square);
	});
	square.addEventListener('click', () => colorSquare(square));
	board.appendChild(square);
}

document.addEventListener('mouseup', () => { isDrawing = false; });
clearButton.addEventListener('click', () => {
	document.querySelectorAll('.square').forEach((square) => {
		square.style.backgroundColor = '';
		square.style.borderColor = '';
		square.dataset.colored = 'false';
	});
	updateProgress();
});

newPuzzleButton.addEventListener('click', () => {
	clearButton.click();
	document.querySelectorAll('.square').forEach((square) => {
		if (Math.random() > 0.82) colorSquare(square);
	});
});
