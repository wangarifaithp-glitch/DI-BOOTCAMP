const express = require('express');
const quizController = require('../controllers/quizController');

const router = express.Router();

router.post('/start', quizController.startQuiz);
router.post('/answer', quizController.submitAnswer);

module.exports = router;