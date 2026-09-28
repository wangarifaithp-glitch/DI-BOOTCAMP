const express = require('express');
const postsRouter = require('./routes/posts');

const app = express();

app.use(express.json());
app.use('/posts', postsRouter);

app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
	if (error.type === 'entity.parse.failed') {
		return res.status(400).json({ error: 'Request body must be valid JSON' });
	}

	next(error);
});

if (require.main === module) {
	const port = process.env.PORT || 3000;
	app.listen(port, () => {
		console.log(`Blog API listening on port ${port}`);
	});
}

module.exports = app;
