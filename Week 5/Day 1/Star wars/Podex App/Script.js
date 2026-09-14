const API_BASE = "https://pokeapi.co/api/v2/pokemon";

// Global variable to track current Pokémon ID
let currentPokemonId = 1;

// DOM elements
const pokemonDisplay = document.getElementById("pokemonDisplay");
const pokemonImage = document.getElementById("pokemonImage");
const pokemonName = document.getElementById("pokemonName");
const pokemonId = document.getElementById("pokemonId");
const pokemonHeight = document.getElementById("pokemonHeight");
const pokemonWeight = document.getElementById("pokemonWeight");
const pokemonType = document.getElementById("pokemonType");

const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const randomBtn = document.getElementById("randomBtn");

// Event listeners
randomBtn.addEventListener("click", fetchRandomPokemon);
prevBtn.addEventListener("click", fetchPreviousPokemon);
nextBtn.addEventListener("click", fetchNextPokemon);

// Initial load
fetchRandomPokemon();

async function fetchRandomPokemon() {
  showLoading();
  hideError();

  try {
    // PokéAPI has at least 1010+ Pokémon; using 1–1010 for safety
    const randomId = Math.floor(Math.random() * 1010) + 1;
    currentPokemonId = randomId;

    const data = await fetchPokemonById(currentPokemonId);
    displayPokemon(data);
  } catch (err) {
    showError();
  }
}

async function fetchPreviousPokemon() {
  if (currentPokemonId <= 1) return; // no previous

  showLoading();
  hideError();

  try {
    currentPokemonId -= 1;
    const data = await fetchPokemonById(currentPokemonId);
    displayPokemon(data);
  } catch (err) {
    showError();
  }
}

async function fetchNextPokemon() {
  showLoading();
  hideError();

  try {
    currentPokemonId += 1;
    const data = await fetchPokemonById(currentPokemonId);
    displayPokemon(data);
  } catch (err) {
    showError();
  }
}

async function fetchPokemonById(id) {
  const url = `${API_BASE}/${id}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Pokémon not found");
  }

  return response.json();
}

function displayPokemon(data) {
  const { id, name, height, weight, types, sprites } = data;

  // Use official artwork if available, otherwise front default
  const imageUrl =
    sprites.other["official-artwork"].front_default ||
    sprites.front_default ||
    "";

  pokemonImage.src = imageUrl;
  pokemonName.textContent = name;
  pokemonId.textContent = `#${String(id).padStart(4, "0")}`;
  pokemonHeight.textContent = `${height / 10} m`; // convert from dm to m
  pokemonWeight.textContent = `${weight / 10} kg`; // convert from hg to kg

  // Types can be multiple; join them
  const typeNames = types.map(t => t.type.name).join(", ");
  pokemonType.textContent = typeNames;

  pokemonDisplay.style.display = "block";
}

function showLoading() {
  loadingMessage.style.display = "block";
  errorMessage.style.display = "none";
  pokemonDisplay.style.display = "none";
}

function hideError() {
  errorMessage.style.display = "none";
}

function showError() {
  loadingMessage.style.display = "none";
  errorMessage.style.display = "block";
  pokemonDisplay.style.display = "none";
}