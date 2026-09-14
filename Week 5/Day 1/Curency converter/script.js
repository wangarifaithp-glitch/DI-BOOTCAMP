if (false) {
const API_BASE = 'https://www.swapi.tech/api';
const TOTAL_CHARACTERS = 83;

let elements = {};

/**
 * Grabs every DOM element the app needs to read from or write to.
 */
function getElements() {
  elements = {
    fetchButton: document.getElementById('fetchButton'),
    retryButton: document.getElementById('retryButton'),
    loadingState: document.getElementById('loadingState'),
    errorState: document.getElementById('errorState'),
    recordState: document.getElementById('recordState'),
    charName: document.getElementById('charName'),
    charHeight: document.getElementById('charHeight'),
    charGender: document.getElementById('charGender'),
    charBirthYear: document.getElementById('charBirthYear'),
    charHomeworld: document.getElementById('charHomeworld'),
  };
}

/**
 * Shows exactly one of the three terminal states (loading / error / record).
 */
function setState(stateName) {
  elements.loadingState.hidden = stateName !== 'loading';
  elements.errorState.hidden = stateName !== 'error';
  elements.recordState.hidden = stateName !== 'record';
}

/**
 * Picks a random character id within the range the API supports.
 */
function getRandomCharacterId() {
  return Math.floor(Math.random() * TOTAL_CHARACTERS) + 1;
}

/**
 * swapi.tech nests the actual record under result.properties, while
 * some mirrors return the fields flat on the root object. This reads
 * whichever shape is present so the app keeps working either way.
 */
function extractProperties(payload) {
  if (payload && payload.result && payload.result.properties) {
    return payload.result.properties;
  }
  return payload;
}

/**
 * Fetches a single character record, then resolves its homeworld name.
 * Returns a plain object with only the fields the UI displays.
 */
async function fetchCharacter(id) {
  let personResponse = await fetch(`${API_BASE}/people/${id}`);

  // A handful of ids in the range are gaps rather than real failures —
  // quietly try a couple of neighbors before treating it as an error.
  let attempts = 0;
  while (personResponse.status === 404 && attempts < 3) {
    id = getRandomCharacterId();
    personResponse = await fetch(`${API_BASE}/people/${id}`);
    attempts += 1;
  }

  if (!personResponse.ok) {
    throw new Error(`Character request failed with status ${personResponse.status}`);
  }
  const personData = await personResponse.json();
  const properties = extractProperties(personData);

  const homeworldName = await fetchHomeworldName(properties.homeworld);

  return {
    name: properties.name,
    height: properties.height,
    gender: properties.gender,
    birthYear: properties.birth_year,
    homeworld: homeworldName,
  };
}

/**
 * Resolves a homeworld URL into a planet name. Falls back gracefully
 * if the planet itself can't be read, without failing the whole request.
 */
async function fetchHomeworldName(homeworldUrl) {
  try {
    const response = await fetch(homeworldUrl);
    if (!response.ok) {
      throw new Error(`Homeworld request failed with status ${response.status}`);
    }
    const data = await response.json();
    return extractProperties(data).name;
  } catch (err) {
    return 'Unknown';
  }
}

/**
 * Writes a character's info into the record card.
 */
function displayCharacter(character) {
  elements.charName.textContent = character.name;
  elements.charHeight.textContent = `${character.height} cm`;
  elements.charGender.textContent = character.gender;
  elements.charBirthYear.textContent = character.birthYear;
  elements.charHomeworld.textContent = character.homeworld;
  setState('record');
}

/**
 * Runs the full loading -> fetch -> display/error cycle for one character.
 */
async function loadRandomCharacter() {
  setState('loading');
  elements.fetchButton.disabled = true;

  try {
    const id = getRandomCharacterId();
    const character = await fetchCharacter(id);
    displayCharacter(character);
  } catch (err) {
    console.error(err);
    setState('error');
  } finally {
    elements.fetchButton.disabled = false;
  }
}

function init() {
  getElements();
  elements.fetchButton.addEventListener('click', loadRandomCharacter);
  elements.retryButton.addEventListener('click', loadRandomCharacter);
  loadRandomCharacter();
  initStarfield();
}

/**
 * Lightweight animated starfield drawn on a full-viewport canvas.
 * Purely decorative — skipped entirely if reduced motion is preferred.
 */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.floor((canvas.width * canvas.height) / 6000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function drawStatic() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#e7e9ee';
    stars.forEach((star) => {
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawFrame(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#e7e9ee';
    stars.forEach((star) => {
      const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(time / 1200 + star.phase));
      ctx.globalAlpha = twinkle;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(drawFrame);
  }

  resize();
  window.addEventListener('resize', resize);

  if (prefersReducedMotion) {
    drawStatic();
  } else {
    requestAnimationFrame(drawFrame);
  }
}

document.addEventListener('DOMContentLoaded', init);
}

const ratesToUsd = {
  USD: 1,
  EUR: 1.09,
  GBP: 1.27,
  JPY: 0.0067,
  CAD: 0.74,
  AUD: 0.66,
  ILS: 0.27,
};

const currencyNames = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
  ILS: 'Israeli New Shekel',
};

const form = document.getElementById('converterForm');
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const result = document.getElementById('result');
const switchButton = document.getElementById('switchBtn');

function populateCurrencies() {
  Object.entries(currencyNames).forEach(([code, name]) => {
    const option = new Option(`${code} - ${name}`, code);
    fromCurrency.add(option.cloneNode(true));
    toCurrency.add(option);
  });
  fromCurrency.value = 'USD';
  toCurrency.value = 'EUR';
}

function convert() {
  const amount = Number(amountInput.value);
  if (!Number.isFinite(amount) || amount < 0) {
    result.textContent = 'Please enter a valid amount.';
    return;
  }

  const convertedAmount = amount * ratesToUsd[fromCurrency.value] / ratesToUsd[toCurrency.value];
  const rate = ratesToUsd[fromCurrency.value] / ratesToUsd[toCurrency.value];
  result.innerHTML = `<p><strong>${amount.toLocaleString()} ${fromCurrency.value} = ${convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${toCurrency.value}</strong></p><p class="rate-text">1 ${fromCurrency.value} = ${rate.toFixed(4)} ${toCurrency.value}</p>`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  convert();
});

switchButton.addEventListener('click', () => {
  [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
  convert();
});

populateCurrencies();
convert();