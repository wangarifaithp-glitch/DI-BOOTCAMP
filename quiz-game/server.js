const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const games = new Map();

const questions = [
  {
    question: 'Which language runs directly in a web browser?',
    choices: ['JavaScript', 'Python', 'Java', 'C#'],
    correctAnswer: 0
  },
  {
    question: 'Which HTTP method is normally used to create a resource?',
    choices: ['GET', 'POST', 'DELETE', 'HEAD'],
    correctAnswer: 1
  },
  {
    question: 'What does JSON stand for?',
    choices: ['JavaScript Object Notation', 'Java Source Object Network', 'Joined System Object Names', 'JavaScript Online Nodes'],
    correctAnswer: 0
  },
  {
    question: 'Which Express middleware parses JSON request bodies?',
    choices: ['express.json()', 'express.body()', 'express.parse()', 'express.data()'],
    correctAnswer: 0
  },
  {
    question: 'Which status code means a request was successful?',
    choices: ['201', '301', '404', '200'],
    correctAnswer: 3
  }
];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function publicQuestion(index) {
  const question = questions[index];
  return {
    number: index + 1,
    total: questions.length,
    question: question.question,
    choices: question.choices
  };
}

app.post('/api/quiz/start', (req, res) => {
  const game = {
    id: crypto.randomUUID(),
    currentIndex: 0,
    score: 0,
    answered: false
  };
  games.set(game.id, game);
  res.status(201).json({ gameId: game.id, question: publicQuestion(game.currentIndex), score: game.score });
});

app.post('/api/quiz/answer', (req, res) => {
  const { gameId, answer } = req.body;
  const game = games.get(gameId);

  if (!game) {
    return res.status(404).json({ message: 'Quiz not found. Start a new quiz.' });
  }
  if (game.answered) {
    return res.status(400).json({ message: 'This question has already been answered.' });
  }
  if (!Number.isInteger(answer) || answer < 0 || answer >= questions[game.currentIndex].choices.length) {
    return res.status(400).json({ message: 'Choose one of the available answers.' });
  }

  const currentQuestion = questions[game.currentIndex];
  const correct = answer === currentQuestion.correctAnswer;
  if (correct) {
    game.score += 1;
  }
  game.answered = true;

  const isFinished = game.currentIndex === questions.length - 1;
  const result = {
    correct,
    feedback: correct ? 'Correct!' : `Incorrect. The answer is ${currentQuestion.choices[currentQuestion.correctAnswer]}.`,
    score: game.score,
    finished: isFinished
  };

  if (isFinished) {
    result.finalScore = `${game.score}/${questions.length}`;
  } else {
    game.currentIndex += 1;
    game.answered = false;
    result.question = publicQuestion(game.currentIndex);
  }

  res.json(result);
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Quiz game running at http://localhost:${PORT}`);
  });
}

module.exports = app;