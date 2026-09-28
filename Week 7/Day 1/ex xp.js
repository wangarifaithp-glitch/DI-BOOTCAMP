const express = require('express');
const homeRouter = require('./routes');
const todosRouter = require('./routes/todos');
const booksRouter = require('./routes/books');

const app = express();

app.use(express.json());
app.use('/', homeRouter);
app.use('/todos', todosRouter);
app.use('/books', booksRouter);

app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' });
});

if (require.main === module) {
	const port = process.env.PORT || 3000;
	app.listen(port, () => {
		console.log(`Server listening on port ${port}`);
	});
}

module.exports = app;
