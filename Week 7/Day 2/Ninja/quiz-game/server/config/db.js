const { Pool } = require('pg');

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : undefined
);

const starterQuestions = [
  {
    question: 'Which language runs directly in a web browser?',
    options: ['JavaScript', 'Python', 'Java', 'C#'],
    correctAnswer: 'JavaScript'
  },
  {
    question: 'Which HTTP method is normally used to create a resource?',
    options: ['GET', 'POST', 'DELETE', 'HEAD'],
    correctAnswer: 'POST'
  },
  {
    question: 'What does JSON stand for?',
    options: [
      'JavaScript Object Notation',
      'Java Source Object Network',
      'Joined System Object Names',
      'JavaScript Online Nodes'
    ],
    correctAnswer: 'JavaScript Object Notation'
  },
  {
    question: 'Which Express middleware parses JSON request bodies?',
    options: ['express.json()', 'express.body()', 'express.parse()', 'express.data()'],
    correctAnswer: 'express.json()'
  },
  {
    question: 'Which HTTP status code indicates a successful request?',
    options: ['201', '301', '404', '200'],
    correctAnswer: '200'
  }
];

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      question TEXT NOT NULL,
      correct_answer TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS options (
      id SERIAL PRIMARY KEY,
      option TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS questions_options (
      question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
      option_id INTEGER NOT NULL REFERENCES options(id) ON DELETE CASCADE,
      PRIMARY KEY (question_id, option_id)
    );
  `);

  const { rows } = await pool.query('SELECT EXISTS (SELECT 1 FROM questions) AS seeded');
  if (rows[0].seeded) return;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const item of starterQuestions) {
      const questionResult = await client.query(
        'INSERT INTO questions (question, correct_answer) VALUES ($1, $2) RETURNING id',
        [item.question, item.correctAnswer]
      );
      const questionId = questionResult.rows[0].id;

      for (const option of item.options) {
        const optionResult = await client.query(
          'INSERT INTO options (option) VALUES ($1) ON CONFLICT (option) DO UPDATE SET option = EXCLUDED.option RETURNING id',
          [option]
        );
        await client.query(
          'INSERT INTO questions_options (question_id, option_id) VALUES ($1, $2)',
          [questionId, optionResult.rows[0].id]
        );
      }
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { initializeDatabase, pool };