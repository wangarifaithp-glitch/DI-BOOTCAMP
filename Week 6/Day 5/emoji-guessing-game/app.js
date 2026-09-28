const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const games = new Map();
const leaderboard = [];

const emojis = [
  { emoji: '😀', name: 'Smile' },
  { emoji: '🐶', name: 'Dog' },
  { emoji: '🌮', name: 'Taco' },
  { emoji: '🚀', name: 'Rocket' },
  { emoji: '🎸', name: 'Guitar' },
  { emoji: '🍕', name: 'Pizza' },
  { emoji: '🌈', name: 'Rainbow' },
  { emoji: '🦄', name: 'Unicorn' },
  { emoji: '⚽', name: 'Soccer' },
  { emoji: '🌻', name: 'Sunflower' }
];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function createQuestion() {
  const answer = emojis[Math.floor(Math.random() * emojis.length)];
  const distractors = shuffle(emojis.filter((item) => item.name !== answer.name))
    .slice(0, 3)
    .map((item) => item.name);

  return {
    emoji: answer.emoji,
    answer: answer.name,
    options: shuffle([answer.name, ...distractors])
  };
}

function publicQuestion(game) {
  return {
    gameId: game.id,
    emoji: game.question.emoji,
    options: game.question.options,
    score: game.score
  };
}

function recordScore(name, score) {
  const existingEntry = leaderboard.find((entry) => entry.name === name);
  if (existingEntry) {
    existingEntry.score = Math.max(existingEntry.score, score);
  } else {
    leaderboard.push({ name, score });
  }
  leaderboard.sort((first, second) => second.score - first.score);
  leaderboard.splice(10);
}

app.get('/api/game/new', (req, res) => {
  const game = {
    id: crypto.randomUUID(),
    question: createQuestion(),
    score: 0,
    playerName: 'Player'
  };
  games.set(game.id, game);
  res.json(publicQuestion(game));
});

app.post('/api/game/guess', (req, res) => {
  const { gameId, guess, playerName } = req.body;
  const game = games.get(gameId);

  if (!game) {
    return res.status(404).json({ message: 'Game not found. Start a new game.' });
  }
  if (typeof guess !== 'string' || !guess.trim()) {
    return res.status(400).json({ message: 'Choose an answer before submitting.' });
  }

  if (typeof playerName === 'string' && playerName.trim()) {
    game.playerName = playerName.trim().slice(0, 20);
  }

  const correct = guess === game.question.answer;
  if (correct) {
    game.score += 1;
  }

  const answer = game.question.answer;
  game.question = createQuestion();
  recordScore(game.playerName, game.score);

  res.json({
    correct,
    answer,
    score: game.score,
    feedback: correct ? 'Correct! Great guess.' : `Not quite. The answer was ${answer}.`,
    nextQuestion: publicQuestion(game)
  });
});

app.get('/api/leaderboard', (req, res) => {
  res.json(leaderboard);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Emoji guessing game running at http://localhost:${PORT}`);
  });
}

module.exports = app;