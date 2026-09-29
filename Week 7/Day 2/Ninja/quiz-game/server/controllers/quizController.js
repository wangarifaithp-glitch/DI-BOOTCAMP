const crypto = require('crypto');
const quizModel = require('../models/quizModel');

const games = new Map();

function publicQuestion(question, index, total) {
  return {
    number: index + 1,
    total,
    question: question.question,
    choices: question.options
  };
}

async function startQuiz(req, res) {
  const questions = await quizModel.getAllQuestions();
  if (!questions.length) {
    return res.status(503).json({ message: 'No quiz questions are available.' });
  }

  const gameId = crypto.randomUUID();
  games.set(gameId, { questions, currentIndex: 0, score: 0 });
  res.status(201).json({
    gameId,
    score: 0,
    question: publicQuestion(questions[0], 0, questions.length)
  });
}

async function submitAnswer(req, res) {
  const { gameId, answer } = req.body || {};
  const game = games.get(gameId);
  if (!game) {
    return res.status(404).json({ message: 'Quiz not found. Start a new quiz.' });
  }
  if (!Number.isInteger(answer)) {
    return res.status(400).json({ message: 'Choose one of the available answers.' });
  }

  const current = game.questions[game.currentIndex];
  const validOption = await quizModel.isQuestionOption(current.id, answer);
  if (!validOption) {
    return res.status(400).json({ message: 'Choose one of the available answers.' });
  }

  const correctAnswer = await quizModel.getQuestionAnswer(current.id);
  const selectedText = await quizModel.getOptionText(answer);
  const correct = selectedText === correctAnswer.correct_answer;
  if (correct) game.score += 1;

  const finished = game.currentIndex === game.questions.length - 1;
  const result = {
    correct,
    feedback: correct ? 'Correct!' : `Incorrect. The answer is ${correctAnswer.correct_answer}.`,
    score: game.score,
    finished
  };

  if (finished) {
    result.finalScore = `${game.score}/${game.questions.length}`;
    games.delete(gameId);
  } else {
    game.currentIndex += 1;
    result.question = publicQuestion(
      game.questions[game.currentIndex],
      game.currentIndex,
      game.questions.length
    );
  }

  res.json(result);
}

module.exports = { startQuiz, submitAnswer };