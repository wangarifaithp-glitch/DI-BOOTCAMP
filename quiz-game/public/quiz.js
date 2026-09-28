let gameId;
let currentQuestion;

const startScreen = document.querySelector('#start-screen');
const quizScreen = document.querySelector('#quiz-screen');
const resultScreen = document.querySelector('#result-screen');
const startButton = document.querySelector('#start-button');
const restartButton = document.querySelector('#restart-button');
const answerForm = document.querySelector('#answer-form');
const questionElement = document.querySelector('#question');
const choicesElement = document.querySelector('#choices');
const feedbackElement = document.querySelector('#feedback');
const progressElement = document.querySelector('#progress');
const progressBar = document.querySelector('#progress-bar');
const scoreElement = document.querySelector('#score');
const submitButton = document.querySelector('#submit-button');
const finalScoreElement = document.querySelector('#final-score');
const resultMessageElement = document.querySelector('#result-message');

function showScreen(screen) {
  startScreen.hidden = screen !== startScreen;
  quizScreen.hidden = screen !== quizScreen;
  resultScreen.hidden = screen !== resultScreen;
}

function renderQuestion(question) {
  currentQuestion = question;
  questionElement.textContent = question.question;
  progressElement.textContent = `Question ${question.number} of ${question.total}`;
  progressBar.style.width = `${(question.number / question.total) * 100}%`;
  choicesElement.replaceChildren();
  feedbackElement.textContent = '';
  feedbackElement.className = 'feedback';

  question.choices.forEach((choice, index) => {
    const label = document.createElement('label');
    label.className = 'choice';
    label.innerHTML = `<input type="radio" name="answer" value="${index}" required><span>${choice}</span>`;
    choicesElement.append(label);
  });
}

async function startQuiz() {
  const response = await fetch('/api/quiz/start', { method: 'POST' });
  const quiz = await response.json();
  gameId = quiz.gameId;
  scoreElement.textContent = quiz.score;
  renderQuestion(quiz.question);
  showScreen(quizScreen);
}

startButton.addEventListener('click', () => {
  startQuiz().catch((error) => {
    feedbackElement.textContent = error.message;
  });
});

restartButton.addEventListener('click', () => {
  startQuiz().catch((error) => {
    resultMessageElement.textContent = error.message;
  });
});

answerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const answer = Number(new FormData(answerForm).get('answer'));
  submitButton.disabled = true;

  try {
    const response = await fetch('/api/quiz/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, answer })
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }

    scoreElement.textContent = result.score;
    feedbackElement.textContent = result.feedback;
    feedbackElement.classList.add(result.correct ? 'correct' : 'incorrect');

    if (result.finished) {
      finalScoreElement.textContent = result.finalScore;
      resultMessageElement.textContent = result.score === currentQuestion.total
        ? 'Perfect run.'
        : 'Nice work. Try again and beat your score.';
      showScreen(resultScreen);
    } else {
      renderQuestion(result.question);
    }
  } catch (error) {
    feedbackElement.textContent = error.message;
    feedbackElement.classList.add('incorrect');
  } finally {
    submitButton.disabled = false;
  }
});