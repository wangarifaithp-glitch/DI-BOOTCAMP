const API_BASE = "https://www.swapi.tech/api";
const TOTAL_CHARACTERS = 83;

const loadCharacterBtn = document.getElementById("loadCharacterBtn");
const characterContainer = document.getElementById("characterContainer");

loadCharacterBtn.addEventListener("click", getRandomCharacter);

// Initial load (optional)
getRandomCharacter();

function getRandomCharacter() {
  // Show loading
  characterContainer.innerHTML = `
    <div class="loading">
      <i class="fas fa-spinner"></i> Loading character...
    </div>
  `;

  // Generate random character ID between 1 and 83
  const randomId = Math.floor(Math.random() * TOTAL_CHARACTERS) + 1;
  const url = `${API_BASE}/people/${randomId}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      const character = data.result.properties;
      displayCharacter(character);
    })
    .catch(error => {
      displayError();
    });
}

function displayCharacter(character) {
  const { name, height, gender, birth_year, homeworld } = character;

  characterContainer.innerHTML = `
    <div class="character-card">
      <h2>${escapeHtml(name)}</h2>
      <p><strong>Height:</strong> ${escapeHtml(height)} cm</p>
      <p><strong>Gender:</strong> ${escapeHtml(gender)}</p>
      <p><strong>Birth Year:</strong> ${escapeHtml(birth_year)}</p>
      <p><strong>Home World:</strong> ${escapeHtml(homeworld)}</p>
    </div>
  `;
}

function displayError() {
  characterContainer.innerHTML = `
    <div class="error">
      <i class="fas fa-exclamation-triangle"></i>
      Error loading character. Please try again.
    </div>
  `;
}

// Simple HTML escape to avoid injection if API data is weird
function escapeHtml(str) {
  if (!str) return "Unknown";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}