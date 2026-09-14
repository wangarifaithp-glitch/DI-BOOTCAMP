// Replace with your API key from Exercises XP (e.g. "hp3432NQI1C224cz2f36hpTrA1OYM4XM")
const apiKey = "hp3432NQI1C224cz2f36hpTrA1OYM4XM";
const container = document.getElementById("gif-container");
const button = document.getElementById("fetch-gif-btn");

button.addEventListener("click", fetchRandomGif);

async function fetchRandomGif() {
  const url = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}`;

  try {
    const response = await fetch(url);

    // Check if the response status is OK (status code 200–299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    
    // Extract GIF URL from sub-object "images" inside data
    const gifUrl = result.data.images.original.url;

    // Create an img tag and append it to the page
    const img = document.createElement("img");
    img.src = gifUrl;
    img.alt = "Random GIF";

    container.appendChild(img);

  } catch (error) {
    console.error("An error occurred while fetching the GIF:", error);
  }
}