let gameId;
let currentQuestion;

const startScreen = document.querySelector('#start-screen');
const quizScreen = document.querySelector('#quiz-screen');
const resultScreen = document.querySelector('#result-screen');
const startButton = document.querySelector('#start-button');
const restartButton = document.querySelector('#restart-button');
const nextButton = document.querySelector('#next-button');
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
let upcomingQuestion;

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
  submitButton.disabled = false;
  nextButton.hidden = true;

  question.choices.forEach((choice) => {
    const label = document.createElement('label');
    label.className = 'choice';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'answer';
    input.value = choice.id;
    input.required = true;
    const text = document.createElement('span');
    text.textContent = choice.text;
    label.append(input, text);
    choicesElement.append(label);
  });
}

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || 'Request failed.');
  return payload;
}

async function startQuiz() {
  startButton.disabled = true;
  restartButton.disabled = true;
  try {
    const quiz = await requestJson('/api/quiz/start', { method: 'POST' });
    gameId = quiz.gameId;
    scoreElement.textContent = quiz.score;
    renderQuestion(quiz.question);
    showScreen(quizScreen);
  } catch (error) {
    resultMessageElement.textContent = error.message;
    showScreen(resultScreen);
  } finally {
    startButton.disabled = false;
    restartButton.disabled = false;
  }
}

startButton.addEventListener('click', startQuiz);
restartButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', () => renderQuestion(upcomingQuestion));

answerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const answer = Number(new FormData(answerForm).get('answer'));
  submitButton.disabled = true;

  try {
    const result = await requestJson('/api/quiz/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, answer })
    });

    scoreElement.textContent = result.score;
    feedbackElement.textContent = result.feedback;
    feedbackElement.classList.add(result.correct ? 'correct' : 'incorrect');

    if (result.finished) {
      finalScoreElement.textContent = result.finalScore;
      resultMessageElement.textContent = result.score === currentQuestion.total
        ? 'Perfect run.'
        : 'Nice work. Play again and beat your score.';
      showScreen(resultScreen);
    } else {
      upcomingQuestion = result.question;
      choicesElement.querySelectorAll('input').forEach((input) => {
        input.disabled = true;
      });
      submitButton.disabled = true;
      nextButton.hidden = false;
    }
  } catch (error) {
    feedbackElement.textContent = error.message;
    feedbackElement.classList.add('incorrect');
    submitButton.disabled = false;
  }
});