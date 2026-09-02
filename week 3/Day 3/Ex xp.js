// 1. Retrieve the h1 element using a DOM property and log it to the console.
const h1 = document.querySelector('h1');
console.log(h1);

// Select the article and remove its last paragraph using DOM methods.
const article = document.querySelector('article');
const lastParagraph = article.lastElementChild;
if (lastParagraph) {
    article.removeChild(lastParagraph);
}

// 3. Add a click event listener to change the background color of h2 to red.
const h2 = document.querySelector('h2');
h2.addEventListener('click', () => {
    h2.style.backgroundColor = 'red';
});

// 4. Add a click event listener to hide h3 using display: none.
const h3 = document.querySelector('h3');
h3.addEventListener('click', () => {
    h3.style.display = 'none';
});

// 5. Add a button event listener to make all paragraph text bold.
const button = document.getElementById('bold-btn');
button.addEventListener('click', () => {
    const paragraphs = article.querySelectorAll('p');
    paragraphs.forEach((paragraph) => {
        paragraph.style.fontWeight = 'bold';
    });
});

// BONUS: Change the h1 font size randomly on hover between 0 and 100 pixels.
h1.addEventListener('mouseover', () => {
    const randomSize = Math.floor(Math.random() * 101);
    h1.style.fontSize = `${randomSize}px`;
});

// Reset the h1 size when the mouse leaves.
h1.addEventListener('mouseleave', () => {
    h1.style.fontSize = '2em';
});

// BONUS: Add a fade-out effect when hovering over the second paragraph.
const secondParagraph = article.querySelectorAll('p')[1];
secondParagraph.addEventListener('mouseenter', () => {
    secondParagraph.classList.add('fade-out');
    secondParagraph.style.opacity = '0';
});

secondParagraph.addEventListener('mouseleave', () => {
    secondParagraph.classList.remove('fade-out');
    secondParagraph.style.opacity = '1';
});
