const express = require('express');
const greetingRouter = require('./routes/greeting');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/', greetingRouter);

app.use((req, res) => {
	res.status(404).send('Page not found.');
});

if (require.main === module) {
	const port = process.env.PORT || 3000;
	app.listen(port, () => {
		console.log(`Emoji greeting app listening on port ${port}`);
	});
}

module.exports = app;
