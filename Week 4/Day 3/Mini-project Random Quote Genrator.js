const quotes = [
	{
		id: 0,
		author: "Maya Angelou",
		quote: "Nothing can dim the light that shines from within.",
		likes: 0,
	},
	{
		id: 1,
		author: "Oscar Wilde",
		quote: "Be yourself; everyone else is already taken.",
		likes: 0,
	},
	{
		id: 2,
		author: "Albert Einstein",
		quote: "Life is like riding a bicycle. To keep your balance, you must keep moving.",
		likes: 0,
	},
	{
		id: 3,
		author: "Confucius",
		quote: "It does not matter how slowly you go as long as you do not stop.",
		likes: 0,
	},
	{
		id: 4,
		author: "Eleanor Roosevelt",
		quote: "The future belongs to those who believe in the beauty of their dreams.",
		likes: 0,
	},
	{
		id: 5,
		author: "Ralph Waldo Emerson",
		quote: "What lies behind us and what lies before us are tiny matters within us.",
		likes: 0,
	},
	{
		id: 6,
		author: "Mark Twain",
		quote: "The secret of getting ahead is getting started.",
		likes: 0,
	},
	{
		id: 7,
		author: "Helen Keller",
		quote: "Alone we can do so little; together we can do so much.",
		likes: 0,
	},
	{
		id: 8,
		author: "Walt Disney",
		quote: "The way to get started is to quit talking and begin doing.",
		likes: 0,
	},
	{
		id: 9,
		author: "Nelson Mandela",
		quote: "It always seems impossible until it is done.",
		likes: 0,
	},
	{
		id: 10,
		author: "Audre Lorde",
		quote: "I am deliberate and afraid of nothing.",
		likes: 0,
	},
	{
		id: 11,
		author: "Marcus Aurelius",
		quote: "The happiness of your life depends upon the quality of your thoughts.",
		likes: 0,
	},
	{
		id: 12,
		author: "Leonardo da Vinci",
		quote: "Learning never exhausts the mind.",
		likes: 0,
	},
	{
		id: 13,
		author: "Rumi",
		quote: "What you seek is seeking you.",
		likes: 0,
	},
	{
		id: 14,
		author: "Jane Austen",
		quote: "There is no charm equal to tenderness of heart.",
		likes: 0,
	},
	{
		id: 15,
		author: "William Shakespeare",
		quote: "We know what we are, but know not what we may be.",
		likes: 0,
	},
	{
		id: 16,
		author: "Friedrich Nietzsche",
		quote: "He who has a why to live can bear almost any how.",
		likes: 0,
	},
	{
		id: 17,
		author: "Simone de Beauvoir",
		quote: "Change your life today. Don't gamble on the future.",
		likes: 0,
	},
	{
		id: 18,
		author: "James Baldwin",
		quote: "Not everything that is faced can be changed, but nothing can be changed until it is faced.",
		likes: 0,
	},
	{
		id: 19,
		author: "Mary Oliver",
		quote: "Tell me, what is it you plan to do with your one wild and precious life?",
		likes: 0,
	},
];

let nextId = quotes.length;
let currentQuote = null;
let lastRandomId = null;
let filteredQuotes = [];
let filteredIndex = 0;

const quoteText = document.querySelector("#quote-text");
const quoteAuthor = document.querySelector("#quote-author");
const quoteDetails = document.querySelector("#quote-details");
const statusMessage = document.querySelector("#status-message");
const generateButton = document.querySelector("#generate-quote");
const addQuoteForm = document.querySelector("#add-quote-form");
const filterForm = document.querySelector("#filter-form");
const previousButton = document.querySelector("#previous-quote");
const nextButton = document.querySelector("#next-quote");

function displayQuote(quoteToDisplay) {
	currentQuote = quoteToDisplay;
	quoteText.textContent = `“${quoteToDisplay.quote}”`;
	quoteAuthor.textContent = `- ${quoteToDisplay.author}`;
	quoteDetails.textContent = `Likes: ${quoteToDisplay.likes}`;
	statusMessage.textContent = "";
}

function getRandomQuote() {
	const availableQuotes = quotes.filter((quoteItem) => quoteItem.id !== lastRandomId);
	const randomIndex = Math.floor(Math.random() * availableQuotes.length);
	const randomQuote = availableQuotes[randomIndex];

	lastRandomId = randomQuote.id;
	displayQuote(randomQuote);
}

function showFilteredQuote() {
	if (filteredQuotes.length === 0) {
		quoteText.textContent = "No quotes found for this author.";
		quoteAuthor.textContent = "";
		quoteDetails.textContent = "";
		previousButton.disabled = true;
		nextButton.disabled = true;
		return;
	}

	displayQuote(filteredQuotes[filteredIndex]);
	previousButton.disabled = filteredIndex === 0;
	nextButton.disabled = filteredIndex === filteredQuotes.length - 1;
}

generateButton.addEventListener("click", getRandomQuote);

addQuoteForm.addEventListener("submit", (event) => {
	event.preventDefault();

	const formData = new FormData(addQuoteForm);
	const newQuote = {
		id: nextId,
		quote: formData.get("quote").trim(),
		author: formData.get("author").trim(),
		likes: 0,
	};

	quotes.push(newQuote);
	nextId += 1;
	addQuoteForm.reset();
	displayQuote(newQuote);
	statusMessage.textContent = "Quote added successfully.";
});

document.querySelector("#characters-with-spaces").addEventListener("click", () => {
	if (currentQuote) {
		quoteDetails.textContent = `Characters including spaces: ${currentQuote.quote.length}`;
	}
});

document.querySelector("#characters-without-spaces").addEventListener("click", () => {
	if (currentQuote) {
		quoteDetails.textContent = `Characters excluding spaces: ${currentQuote.quote.replace(/\s/g, "").length}`;
	}
});

document.querySelector("#word-count").addEventListener("click", () => {
	if (currentQuote) {
		const words = currentQuote.quote.trim().split(/\s+/).filter(Boolean);
		quoteDetails.textContent = `Words: ${words.length}`;
	}
});

document.querySelector("#like-quote").addEventListener("click", () => {
	if (currentQuote) {
		currentQuote.likes += 1;
		quoteDetails.textContent = `Likes: ${currentQuote.likes}`;
	}
});

filterForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const authorToFind = new FormData(filterForm).get("author").trim().toLowerCase();

	filteredQuotes = quotes.filter(
		(quoteItem) => quoteItem.author.toLowerCase() === authorToFind,
	);
	filteredIndex = 0;
	showFilteredQuote();
});

previousButton.addEventListener("click", () => {
	if (filteredIndex > 0) {
		filteredIndex -= 1;
		showFilteredQuote();
	}
});

nextButton.addEventListener("click", () => {
	if (filteredIndex < filteredQuotes.length - 1) {
		filteredIndex += 1;
		showFilteredQuote();
	}
});

previousButton.disabled = true;
nextButton.disabled = true;
