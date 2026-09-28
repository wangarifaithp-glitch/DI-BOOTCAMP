const express = require('express');
const session = require('express-session');
const quizRouter = require('./routes/quiz');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
	secret: process.env.SESSION_SECRET || 'local-trivia-development-secret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production'
	}
}));

app.use(quizRouter);

app.use((req, res) => {
	res.status(404).send('Page not found.');
});

if (require.main === module) {
	const port = process.env.PORT || 3000;
	app.listen(port, () => {
		console.log(`Trivia quiz listening on port ${port}`);
	});
}

module.exports = app;
