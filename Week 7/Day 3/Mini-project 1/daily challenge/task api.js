const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('node:fs/promises');
const path = require('node:path');

const app = express();
const router = express.Router();
const usersFile = path.join(__dirname, 'users.json');
const saltRounds = 10;

app.use(express.json());

async function readUsers() {
	const contents = await fs.readFile(usersFile, 'utf8');
	const users = JSON.parse(contents);

	if (!Array.isArray(users)) {
		throw new Error('User storage must contain a JSON array');
	}

	return users;
}

async function writeUsers(users) {
	await fs.writeFile(usersFile, `${JSON.stringify(users, null, 2)}\n`);
}

function publicUser(user) {
	const { password, ...safeUser } = user;
	return safeUser;
}

function validateUser(body, { registration = false } = {}) {
	if (!body || typeof body !== 'object' || Array.isArray(body)) {
		return 'Request body must be a JSON object';
	}

	const fields = ['name', 'lastName', 'email', 'username', 'password'];
	const unknownField = Object.keys(body).find((field) => !fields.includes(field));
	if (unknownField) {
		return `Unknown user field: ${unknownField}`;
	}

	const requiredFields = registration ? fields : Object.keys(body);
	if (!registration && requiredFields.length === 0) {
		return 'At least one user field is required';
	}

	for (const field of requiredFields) {
		if (typeof body[field] !== 'string' || !body[field].trim()) {
			return `${field} must be a non-empty string`;
		}
	}

	if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
		return 'Email must be valid';
	}

	if (body.username && (body.username.trim().length < 3 || body.username.trim().length > 30)) {
		return 'Username must be between 3 and 30 characters';
	}

	if (body.password && (body.password.trim().length < 8 || body.password.length > 72)) {
		return 'Password must be between 8 and 72 characters';
	}

	return null;
}

async function passwordAlreadyUsed(password, users, exceptId) {
	for (const user of users) {
		if (user.id !== exceptId && await bcrypt.compare(password, user.password)) {
			return true;
		}
	}

	return false;
}

router.post('/register', async (request, response) => {
	const validationError = validateUser(request.body, { registration: true });
	if (validationError) {
		return response.status(400).json({ message: validationError });
	}

	const users = await readUsers();
	const { name, lastName, email, username, password } = request.body;
	const usernameExists = users.some(
		(user) => user.username.toLowerCase() === username.trim().toLowerCase(),
	);

	if (usernameExists || await passwordAlreadyUsed(password, users)) {
		return response.status(409).json({ message: 'Username or password already exists' });
	}

	const user = {
		id: users.reduce((highestId, entry) => Math.max(highestId, entry.id), 0) + 1,
		name: name.trim(),
		lastName: lastName.trim(),
		email: email.trim(),
		username: username.trim(),
		password: await bcrypt.hash(password, saltRounds),
		createdAt: new Date().toISOString(),
	};

	users.push(user);
	await writeUsers(users);
	return response.status(201).json({
		message: `Welcome, ${user.name}! Your account has been registered.`,
		user: publicUser(user),
	});
});

router.post('/login', async (request, response) => {
	const { username, password } = request.body || {};
	if (typeof username !== 'string' || !username.trim() || typeof password !== 'string' || !password) {
		return response.status(400).json({ message: 'Username and password are required' });
	}

	const users = await readUsers();
	const user = users.find(
		(entry) => entry.username.toLowerCase() === username.trim().toLowerCase(),
	);

	if (!user || !await bcrypt.compare(password, user.password)) {
		return response.status(401).json({ message: 'Invalid username or password' });
	}

	return response.json({
		message: `Welcome back, ${user.name}! You are now logged in.`,
		user: publicUser(user),
	});
});

router.get('/users', async (request, response) => {
	const users = await readUsers();
	return response.json(users.map(publicUser));
});

router.get('/users/:id', async (request, response) => {
	const id = Number(request.params.id);
	if (!Number.isInteger(id) || id < 1) {
		return response.status(400).json({ message: 'User ID must be a positive integer' });
	}

	const users = await readUsers();
	const user = users.find((entry) => entry.id === id);
	if (!user) {
		return response.status(404).json({ message: 'User not found' });
	}

	return response.json(publicUser(user));
});

router.put('/users/:id', async (request, response) => {
	const id = Number(request.params.id);
	if (!Number.isInteger(id) || id < 1) {
		return response.status(400).json({ message: 'User ID must be a positive integer' });
	}

	const validationError = validateUser(request.body);
	if (validationError) {
		return response.status(400).json({ message: validationError });
	}

	const users = await readUsers();
	const userIndex = users.findIndex((entry) => entry.id === id);
	if (userIndex === -1) {
		return response.status(404).json({ message: 'User not found' });
	}

	const updates = { ...request.body };
	if (updates.username) {
		updates.username = updates.username.trim();
		const duplicateUsername = users.some(
			(entry) => entry.id !== id && entry.username.toLowerCase() === updates.username.toLowerCase(),
		);
		if (duplicateUsername) {
			return response.status(409).json({ message: 'Username already exists' });
		}
	}

	for (const field of ['name', 'lastName', 'email']) {
		if (updates[field]) {
			updates[field] = updates[field].trim();
		}
	}

	if (updates.password) {
		if (await passwordAlreadyUsed(updates.password, users, id)) {
			return response.status(409).json({ message: 'Password already exists' });
		}
		updates.password = await bcrypt.hash(updates.password, saltRounds);
	}

	users[userIndex] = { ...users[userIndex], ...updates };
	await writeUsers(users);
	return response.json(publicUser(users[userIndex]));
});

app.get('/', (request, response) => response.redirect('/login.html'));
app.get('/login.html', (request, response) => response.sendFile(path.join(__dirname, 'login.html')));
app.get('/register.html', (request, response) => response.sendFile(path.join(__dirname, 'register.html')));
app.use(router);

app.use((error, request, response, next) => {
	if (response.headersSent) {
		return next(error);
	}

	if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
		return response.status(400).json({ message: 'Request body must be valid JSON' });
	}

	if (error.type === 'entity.too.large') {
		return response.status(413).json({ message: 'Request body is too large' });
	}

	console.error(error);
	return response.status(500).json({ message: 'Unable to read or update user storage' });
});

if (require.main === module) {
	const port = process.env.PORT || 3000;
	app.listen(port, () => console.log(`User API listening on http://localhost:${port}`));
}

module.exports = { app, router };
