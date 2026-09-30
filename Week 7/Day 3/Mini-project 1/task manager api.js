const express = require('express');
const fs = require('node:fs/promises');
const path = require('node:path');

const app = express();
const router = express.Router();
const tasksFile = path.join(__dirname, 'tasks.json');

app.use(express.json());

async function readTasks() {
	const contents = await fs.readFile(tasksFile, 'utf8');
	const tasks = JSON.parse(contents);

	if (!Array.isArray(tasks)) {
		throw new Error('Task storage must contain a JSON array');
	}

	return tasks;
}

async function writeTasks(tasks) {
	await fs.writeFile(tasksFile, `${JSON.stringify(tasks, null, 2)}\n`);
}

function parseTaskId(value) {
	if (!/^\d+$/.test(value) || Number(value) < 1) {
		const error = new Error('Task ID must be a positive integer');
		error.status = 400;
		throw error;
	}

	return Number(value);
}

function validateTaskInput(body, { requireTitle = false } = {}) {
	if (!body || typeof body !== 'object' || Array.isArray(body)) {
		return 'Request body must be a JSON object';
	}

	const allowedFields = ['title', 'description', 'completed'];
	const unknownField = Object.keys(body).find((field) => !allowedFields.includes(field));
	if (unknownField) {
		return `Unknown task field: ${unknownField}`;
	}

	if (requireTitle && !Object.hasOwn(body, 'title')) {
		return 'Title is required';
	}

	if (Object.hasOwn(body, 'title') && (typeof body.title !== 'string' || !body.title.trim())) {
		return 'Title must be a non-empty string';
	}

	if (Object.hasOwn(body, 'description') && typeof body.description !== 'string') {
		return 'Description must be a string';
	}

	if (Object.hasOwn(body, 'completed') && typeof body.completed !== 'boolean') {
		return 'Completed must be a boolean';
	}

	if (!requireTitle && Object.keys(body).length === 0) {
		return 'At least one task field is required';
	}

	return null;
}

router.get('/', async (request, response) => {
	response.json(await readTasks());
});

router.get('/:id', async (request, response) => {
	const id = parseTaskId(request.params.id);
	const tasks = await readTasks();
	const task = tasks.find((item) => item.id === id);

	if (!task) {
		return response.status(404).json({ error: 'Task not found' });
	}

	return response.json(task);
});

router.post('/', async (request, response) => {
	const validationError = validateTaskInput(request.body, { requireTitle: true });
	if (validationError) {
		return response.status(400).json({ error: validationError });
	}

	const tasks = await readTasks();
	const task = {
		id: tasks.reduce((highestId, item) => Math.max(highestId, item.id), 0) + 1,
		title: request.body.title.trim(),
		description: request.body.description ?? '',
		completed: request.body.completed ?? false,
		createdAt: new Date().toISOString(),
	};

	tasks.push(task);
	await writeTasks(tasks);
	return response.status(201).json(task);
});

router.put('/:id', async (request, response) => {
	const id = parseTaskId(request.params.id);
	const validationError = validateTaskInput(request.body);
	if (validationError) {
		return response.status(400).json({ error: validationError });
	}

	const tasks = await readTasks();
	const taskIndex = tasks.findIndex((item) => item.id === id);
	if (taskIndex === -1) {
		return response.status(404).json({ error: 'Task not found' });
	}

	const updates = { ...request.body };
	if (Object.hasOwn(updates, 'title')) {
		updates.title = updates.title.trim();
	}

	tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
	await writeTasks(tasks);
	return response.json(tasks[taskIndex]);
});

router.delete('/:id', async (request, response) => {
	const id = parseTaskId(request.params.id);
	const tasks = await readTasks();
	const taskIndex = tasks.findIndex((item) => item.id === id);

	if (taskIndex === -1) {
		return response.status(404).json({ error: 'Task not found' });
	}

	const [deletedTask] = tasks.splice(taskIndex, 1);
	await writeTasks(tasks);
	return response.json(deletedTask);
});

app.use('/tasks', router);

app.use((error, request, response, next) => {
	if (response.headersSent) {
		return next(error);
	}

	if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
		return response.status(400).json({ error: 'Request body must be valid JSON' });
	}

	const status = error.status || 500;
	if (status >= 500) {
		console.error(error);
	}

	return response.status(status).json({
		error: status === 500 ? 'Unable to read or update task storage' : error.message,
	});
});

if (require.main === module) {
	const port = process.env.PORT || 3000;
	app.listen(port, () => {
		console.log(`Task API listening on http://localhost:${port}`);
	});
}

module.exports = { app, router };
