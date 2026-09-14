const apiKey = "hp3432NQI1C224cz2f36hpTrA1OYM4XM";

const form = document.getElementById("search-form");
const categoryInput = document.getElementById("category-input");
const container = document.getElementById("gif-container");
const deleteAllBtn = document.getElementById("delete-all-btn");

form.addEventListener("submit", fetchGifByCategory);

deleteAllBtn.addEventListener("click", () => {
  container.innerHTML = "";
});

async function fetchGifByCategory(event) {
  event.preventDefault();

  const category = categoryInput.value.trim();
  if (!category) return;

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

    const gifUrl = result.data[0].images.original.url;

    const img = document.createElement("img");
    img.src = gifUrl;
    img.alt = category;
    img.style.width = "200px";

    container.appendChild(img);
    categoryInput.value = "";

  } catch (error) {
    console.error("Error fetching GIF:", error);
  }
}