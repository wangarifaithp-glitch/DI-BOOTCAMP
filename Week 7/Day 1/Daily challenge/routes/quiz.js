const express = require('express');

const router = express.Router();

const triviaQuestions = [
    {
        question: 'What is the capital of France?',
        answer: 'Paris'
    },
    {
        question: 'Which planet is known as the Red Planet?',
        answer: 'Mars'
    },
    {
        question: 'What is the largest mammal in the world?',
        answer: 'Blue whale'
    }
];

function renderQuestion(index, feedback = '') {
    const currentQuestion = triviaQuestions[index];
    const feedbackHtml = feedback ? `<p role="status">${feedback}</p>` : '';

    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Trivia Quiz</title>
</head>
<body>
    <main>
        <h1>Trivia Quiz</h1>
        <p>Question ${index + 1} of ${triviaQuestions.length}</p>
        <h2>${currentQuestion.question}</h2>
        <form method="post" action="/quiz">
            <label for="answer">Your answer</label>
            <input id="answer" name="answer" type="text" required autofocus>
            <button type="submit">Submit answer</button>
        </form>
        ${feedbackHtml}
    </main>
</body>
</html>`;
}

router.get('/quiz', (req, res) => {
    req.session.quiz = {
        currentQuestionIndex: 0,
        score: 0,
        completed: false,
        lastFeedback: ''
    };

    res.type('html').send(renderQuestion(0));
});

router.post('/quiz', (req, res) => {
    const quiz = req.session.quiz;

    if (!quiz) {
        return res.redirect('/quiz');
    }
    if (quiz.completed) {
        return res.redirect('/quiz/score');
    }

    const currentQuestion = triviaQuestions[quiz.currentQuestionIndex];
    const submittedAnswer = typeof req.body.answer === 'string'
        ? req.body.answer.trim()
        : '';

    if (!submittedAnswer) {
        return res.status(400)
            .type('html')
            .send(renderQuestion(quiz.currentQuestionIndex, 'Enter an answer to continue.'));
    }

    const isCorrect = submittedAnswer.toLowerCase() === currentQuestion.answer.toLowerCase();

    if (isCorrect) {
        quiz.score += 1;
        quiz.lastFeedback = 'Correct!';
    } else {
        quiz.lastFeedback = `Incorrect. The correct answer is ${currentQuestion.answer}.`;
    }

    quiz.currentQuestionIndex += 1;

    if (quiz.currentQuestionIndex === triviaQuestions.length) {
        quiz.completed = true;
        return res.redirect('/quiz/score');
    }

    res.type('html').send(renderQuestion(quiz.currentQuestionIndex, quiz.lastFeedback));
});

router.get('/quiz/score', (req, res) => {
    const quiz = req.session.quiz;

    if (!quiz || !quiz.completed) {
        return res.redirect('/quiz');
    }

    res.type('html').send(`<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Trivia Quiz Score</title>
</head>
<body>
    <main>
        <h1>Quiz complete</h1>
        <p role="status">${quiz.lastFeedback}</p>
        <p>Your score: ${quiz.score} out of ${triviaQuestions.length}</p>
        <a href="/quiz">Play again</a>
    </main>
</body>
</html>`);
});

module.exports = router;