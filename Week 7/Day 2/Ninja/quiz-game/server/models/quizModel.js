const { pool } = require('../config/db');

async function getAllQuestions() {
  const result = await pool.query(`
    SELECT q.id, q.question,
      COALESCE(json_agg(json_build_object('id', o.id, 'text', o.option) ORDER BY o.id)
        FILTER (WHERE o.id IS NOT NULL), '[]') AS options
    FROM questions q
    LEFT JOIN questions_options qo ON qo.question_id = q.id
    LEFT JOIN options o ON o.id = qo.option_id
    GROUP BY q.id
    ORDER BY q.id
  `);
  return result.rows;
}

async function getQuestionAnswer(questionId) {
  const result = await pool.query(
    'SELECT id, question, correct_answer FROM questions WHERE id = $1',
    [questionId]
  );
  return result.rows[0];
}

async function isQuestionOption(questionId, optionId) {
  const result = await pool.query(
    'SELECT 1 FROM questions_options WHERE question_id = $1 AND option_id = $2',
    [questionId, optionId]
  );
  return result.rowCount > 0;
}

async function getOptionText(optionId) {
  const result = await pool.query('SELECT option FROM options WHERE id = $1', [optionId]);
  return result.rows[0]?.option;
}

module.exports = { getAllQuestions, getQuestionAnswer, isQuestionOption, getOptionText };