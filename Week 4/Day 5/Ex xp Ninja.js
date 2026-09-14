// Replace with your API key from Exercises XP
const apiKey = "hp3432NQI1C224cz2f36hpTrA1OYM4XM";

const form = document.getElementById("search-form");
const categoryInput = document.getElementById("category-input");
const container = document.getElementById("gif-container");
const deleteAllBtn = document.getElementById("delete-all-btn");

form.addEventListener("submit", fetchGifByCategory);
deleteAllBtn.addEventListener("click", () => {
  container.innerHTML = ""; // Removes all appended GIFs from the page
});

async function fetchGifByCategory(event) {
  event.preventDefault();

  const category = categoryInput.value.trim();
  if (!category) return;

  // Search endpoint with limit=1 to fetch 1 relevant GIF for the query
  const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(category)}&limit=1`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    if (result.data.length === 0) {
      alert("No GIFs found for that category!");
      return;
    }

    // Extract GIF URL from the sub-object 'images'
    const gifUrl = result.data[0].images.original.url;

    // Create an image element and append it to the page
    const img = document.createElement("img");
    img.src = gifUrl;
    img.alt = category;
    img.style.width = "200px";

    container.appendChild(img);
    categoryInput.value = ""; // Clear input field

  } catch (error) {
    console.error("Error fetching GIF:", error);
  }
}