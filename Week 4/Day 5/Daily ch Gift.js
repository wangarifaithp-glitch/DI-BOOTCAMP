/* ============================================================
   script.js
   ============================================================ */

const apiKey = "hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My";

const form = document.getElementById("gif-form");
const input = document.getElementById("gif-input");
const gifContainer = document.getElementById("gif-container");
const deleteAllBtn = document.getElementById("delete-all-btn");

// Listen for the form submission
form.addEventListener("submit", async (event) => {
    event.preventDefault(); // stop the page from reloading

    const category = input.value.trim();

    if (category === "") return;

    await getRandomGif(category);

    input.value = ""; // clear the input after search
});

// Fetch one random gif based on the category (tag)
async function getRandomGif(category) {
    const url = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${category}&rating=g`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // The gif URL is nested inside data.data.images.original.url
        const gifUrl = data.data.images.original.url;

        displayGif(gifUrl);

    } catch (error) {
        console.error("Error fetching the gif:", error);
    }
}

// Create and append the gif + its DELETE button to the page
function displayGif(gifUrl) {
    // Wrapper div for the gif + its delete button
    const gifWrapper = document.createElement("div");
    gifWrapper.classList.add("gif-wrapper");

    // The gif image
    const gifImg = document.createElement("img");
    gifImg.src = gifUrl;

    // The delete button for this specific gif
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "DELETE";

    // Remove only this gif's wrapper when clicked
    deleteBtn.addEventListener("click", () => {
        gifWrapper.remove();
    });

    // Put the image and button inside the wrapper
    gifWrapper.appendChild(gifImg);
    gifWrapper.appendChild(deleteBtn);

    // Add the wrapper to the main container
    gifContainer.appendChild(gifWrapper);
}

// Remove every gif from the page
deleteAllBtn.addEventListener("click", () => {
    gifContainer.innerHTML = "";
});