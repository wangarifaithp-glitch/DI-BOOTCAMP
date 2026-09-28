let currentGame;

const emojiElement = document.querySelector('#emoji');
const optionsElement = document.querySelector('#options');
const scoreElement = document.querySelector('#score');
const feedbackElement = document.querySelector('#feedback');
const form = document.querySelector('#guess-form');
const playerNameElement = document.querySelector('#player-name');
const submitButton = document.querySelector('#submit-button');
const leaderboardElement = document.querySelector('#leaderboard');

function renderQuestion(question) {
  currentGame = question;
  emojiElement.textContent = question.emoji;
  scoreElement.textContent = question.score;
  optionsElement.replaceChildren();
  feedbackElement.textContent = '';
  feedbackElement.className = 'feedback';

  question.options.forEach((option, index) => {
    const label = document.createElement('label');
    label.className = 'option';
    label.innerHTML = `<input type="radio" name="guess" value="${option}" ${index === 0 ? 'required' : ''}><span>${option}</span>`;
    optionsElement.append(label);
  });
}

async function loadQuestion() {
  const response = await fetch('/api/game/new');
  renderQuestion(await response.json());
}

async function loadLeaderboard() {
  const response = await fetch('/api/leaderboard');
  const scores = await response.json();
  leaderboardElement.replaceChildren();

  scores.forEach((entry) => {
    const item = document.createElement('li');
    item.innerHTML = `<span>${entry.name}</span><strong>${entry.score}</strong>`;
    leaderboardElement.append(item);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const selectedGuess = new FormData(form).get('guess');
  submitButton.disabled = true;

  try {
    const response = await fetch('/api/game/guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameId: currentGame.gameId,
        guess: selectedGuess,
        playerName: playerNameElement.value
      })
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }

    feedbackElement.textContent = result.feedback;
    feedbackElement.classList.add(result.correct ? 'correct' : 'incorrect');
    renderQuestion(result.nextQuestion);
    await loadLeaderboard();
  } catch (error) {
    feedbackElement.textContent = error.message;
    feedbackElement.classList.add('incorrect');
  } finally {
    submitButton.disabled = false;
  }
});

loadQuestion().catch((error) => {
  feedbackElement.textContent = error.message;
});
loadLeaderboard();