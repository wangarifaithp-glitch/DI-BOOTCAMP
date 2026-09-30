const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');

const app = express();
const server = http.createServer(app);
const api = express.Router();
const usersFile = path.join(__dirname, 'users.json');
const usersByToken = new Map();
const games = new Map();
const boardSize = 10;
const directions = {
	up: { x: 0, y: -1 },
	down: { x: 0, y: 1 },
	left: { x: -1, y: 0 },
	right: { x: 1, y: 0 },
};
const obstacles = [
	{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 },
	{ x: 2, y: 4 }, { x: 5, y: 4 }, { x: 7, y: 4 }, { x: 3, y: 6 }, { x: 4, y: 6 },
	{ x: 6, y: 6 }, { x: 2, y: 7 }, { x: 5, y: 8 }, { x: 7, y: 7 },
];

app.use(express.json({ limit: '16kb' }));

async function readUsers() {
	const parsed = JSON.parse(await fs.readFile(usersFile, 'utf8'));
	if (!Array.isArray(parsed)) throw new Error('User storage must contain a JSON array');
	return parsed;
}

async function writeUsers(users) {
	await fs.writeFile(usersFile, `${JSON.stringify(users, null, 2)}\n`);
}

function requireAuth(request, response, next) {
	const token = request.get('authorization')?.match(/^Bearer (.+)$/i)?.[1];
	const userId = token && usersByToken.get(token);
	if (!userId) return response.status(401).json({ error: 'Sign in to continue' });
	request.userId = userId;
	return next();
}

function findPlayer(game, userId) {
	return game.players.find((player) => player.userId === userId);
}

function samePosition(first, second) {
	return first.x === second.x && first.y === second.y;
}

function isObstacle(position) {
	return obstacles.some((obstacle) => samePosition(obstacle, position));
}

function validMoves(game, player) {
	if (game.status !== 'active') return [];
	const opponent = game.players.find((entry) => entry.slot !== player.slot);
	return Object.entries(directions)
		.filter(([, direction]) => {
			const target = { x: player.position.x + direction.x, y: player.position.y + direction.y };
			const insideBoard = target.x >= 0 && target.x < boardSize && target.y >= 0 && target.y < boardSize;
			const ownBase = game.bases[player.slot];
			return insideBoard
				&& !isObstacle(target)
				&& !samePosition(target, player.position)
				&& !samePosition(target, ownBase)
				&& !samePosition(target, opponent.position);
		})
		.map(([direction]) => direction);
}

function gameView(game, userId) {
	const player = findPlayer(game, userId);
	return {
		id: game.id,
		status: game.status,
		boardSize,
		players: game.players.map(({ userId: id, username, slot, position }) => ({ id, username, slot, position })),
		bases: game.bases,
		obstacles,
		currentTurn: game.currentTurn,
		currentTurnUsername: game.players.find((entry) => entry.userId === game.currentTurn)?.username ?? null,
		turnNumber: game.turnNumber,
		lastAction: game.lastAction,
		winner: game.winner,
		validMoves: player ? validMoves(game, player) : [],
		canAttack: Boolean(player && game.status === 'active' && game.currentTurn === userId && canAttack(game, player)),
	};
}

function canAttack(game, player) {
	const opponent = game.players.find((entry) => entry.slot !== player.slot);
	const base = game.bases[opponent.slot];
	return Math.abs(player.position.x - base.x) + Math.abs(player.position.y - base.y) === 1;
}

function findGameForPlayer(request, response) {
	const game = games.get(request.params.id);
	if (!game) {
		response.status(404).json({ error: 'Game not found' });
		return null;
	}
	const player = findPlayer(game, request.userId);
	if (!player) {
		response.status(403).json({ error: 'You are not a player in this game' });
		return null;
	}
	return { game, player };
}

api.post('/auth/register', async (request, response) => {
	const { username, password } = request.body || {};
	if (typeof username !== 'string' || !/^[a-zA-Z0-9_-]{3,24}$/.test(username.trim())) {
		return response.status(400).json({ error: 'Username must be 3-24 letters, numbers, underscores, or hyphens' });
	}
	if (typeof password !== 'string' || password.length < 8 || password.length > 72) {
		return response.status(400).json({ error: 'Password must be between 8 and 72 characters' });
	}

	const users = await readUsers();
	const normalizedUsername = username.trim();
	if (users.some((user) => user.username.toLowerCase() === normalizedUsername.toLowerCase())) {
		return response.status(409).json({ error: 'That username is already taken' });
	}

	const user = {
		id: crypto.randomUUID(),
		username: normalizedUsername,
		passwordHash: await bcrypt.hash(password, 10),
		createdAt: new Date().toISOString(),
	};
	users.push(user);
	await writeUsers(users);
	const token = crypto.randomBytes(32).toString('hex');
	usersByToken.set(token, user.id);
	return response.status(201).json({ token, user: { id: user.id, username: user.username } });
});

api.post('/auth/login', async (request, response) => {
	const { username, password } = request.body || {};
	if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
		return response.status(400).json({ error: 'Username and password are required' });
	}

	const users = await readUsers();
	const user = users.find((entry) => entry.username.toLowerCase() === username.trim().toLowerCase());
	if (!user || !await bcrypt.compare(password, user.passwordHash)) {
		return response.status(401).json({ error: 'Incorrect username or password' });
	}

	const token = crypto.randomBytes(32).toString('hex');
	usersByToken.set(token, user.id);
	return response.json({ token, user: { id: user.id, username: user.username } });
});

api.get('/me', requireAuth, async (request, response) => {
	const user = (await readUsers()).find((entry) => entry.id === request.userId);
	if (!user) return response.status(401).json({ error: 'Account no longer exists' });
	return response.json({ id: user.id, username: user.username });
});

api.post('/auth/logout', requireAuth, (request, response) => {
	const token = request.get('authorization').match(/^Bearer (.+)$/i)[1];
	usersByToken.delete(token);
	return response.status(204).end();
});

api.get('/games', requireAuth, (request, response) => {
	const list = [...games.values()]
		.filter((game) => game.status === 'waiting' || findPlayer(game, request.userId))
		.map((game) => ({
			id: game.id,
			status: game.status,
			players: game.players.map(({ username, slot }) => ({ username, slot })),
			createdAt: game.createdAt,
		}));
	return response.json(list);
});

api.post('/games', requireAuth, async (request, response) => {
	const users = await readUsers();
	const user = users.find((entry) => entry.id === request.userId);
	const game = {
		id: crypto.randomUUID(),
		status: 'waiting',
		players: [{ userId: user.id, username: user.username, slot: 'A', position: { x: 1, y: 0 } }],
		bases: { A: { x: 0, y: 0 }, B: { x: 9, y: 9 } },
		currentTurn: null,
		winner: null,
		turnNumber: 0,
		lastAction: '',
		createdAt: new Date().toISOString(),
	};
	games.set(game.id, game);
	return response.status(201).json(gameView(game, request.userId));
});

api.post('/games/:id/join', requireAuth, async (request, response) => {
	const game = games.get(request.params.id);
	if (!game) return response.status(404).json({ error: 'Game not found' });
	if (game.players.some((player) => player.userId === request.userId)) {
		return response.status(409).json({ error: 'You are already in this game' });
	}
	if (game.status !== 'waiting') return response.status(409).json({ error: 'This game is not open to new players' });

	const users = await readUsers();
	const user = users.find((entry) => entry.id === request.userId);
	game.players.push({ userId: user.id, username: user.username, slot: 'B', position: { x: 8, y: 9 } });
	game.status = 'active';
	game.currentTurn = game.players[0].userId;
	return response.json(gameView(game, request.userId));
});

api.get('/games/:id', requireAuth, (request, response) => {
	const found = findGameForPlayer(request, response);
	if (!found) return;
	return response.json(gameView(found.game, request.userId));
});

api.get('/games/:id/winner', requireAuth, (request, response) => {
	const found = findGameForPlayer(request, response);
	if (!found) return;
	return response.json({
		status: found.game.status,
		winner: found.game.winner,
		winnerUsername: found.game.players.find((player) => player.userId === found.game.winner)?.username ?? null,
	});
});

api.post('/games/:id/moves', requireAuth, (request, response) => {
	const found = findGameForPlayer(request, response);
	if (!found) return;
	const { game, player } = found;
	const direction = directions[request.body?.direction];

	if (!direction) return response.status(400).json({ error: 'Choose up, down, left, or right' });
	if (game.status !== 'active') return response.status(409).json({ error: 'This game is not active' });
	if (game.currentTurn !== request.userId) return response.status(409).json({ error: 'Wait for your turn' });

	const target = { x: player.position.x + direction.x, y: player.position.y + direction.y };
	const opponent = game.players.find((entry) => entry.slot !== player.slot);
	if (target.x < 0 || target.x >= boardSize || target.y < 0 || target.y >= boardSize) {
		return response.status(400).json({ error: 'That move would leave the board' });
	}
	if (isObstacle(target)) return response.status(400).json({ error: 'An obstacle blocks that move' });
	if (samePosition(target, player.position)) return response.status(400).json({ error: 'Invalid move' });
	if (samePosition(target, game.bases[player.slot])) return response.status(400).json({ error: 'You cannot move onto your own base' });
	if (samePosition(target, opponent.position)) return response.status(400).json({ error: 'The other player occupies that space' });

	player.position = target;
	game.turnNumber += 1;
	game.lastAction = `${player.username} moved ${request.body.direction}.`;
	if (samePosition(target, game.bases[opponent.slot])) {
		game.status = 'finished';
		game.winner = request.userId;
	} else {
		game.currentTurn = opponent.userId;
	}
	return response.json(gameView(game, request.userId));
});

api.post('/games/:id/attack', requireAuth, (request, response) => {
	const found = findGameForPlayer(request, response);
	if (!found) return;
	const { game, player } = found;
	if (game.status !== 'active') return response.status(409).json({ error: 'This game is not active' });
	if (game.currentTurn !== request.userId) return response.status(409).json({ error: 'Wait for your turn' });
	if (!canAttack(game, player)) return response.status(400).json({ error: 'Move next to the enemy base before attacking' });

	const opponent = game.players.find((entry) => entry.slot !== player.slot);
	game.status = 'finished';
	game.winner = request.userId;
	game.lastAction = `${player.username} captured the ${opponent.slot} base.`;
	return response.json({ ...gameView(game, request.userId), capturedBase: opponent.slot });
});

app.use('/api', api);
app.use(express.static(path.join(__dirname, 'public')));
app.use((error, request, response, next) => {
	if (response.headersSent) return next(error);
	if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
		return response.status(400).json({ error: 'Request body must be valid JSON' });
	}
	console.error(error);
	return response.status(500).json({ error: 'Unable to complete the request' });
});

const port = Number(process.env.PORT) || 3000;
if (require.main === module) {
	server.listen(port, () => console.log(`Strategy game listening on http://localhost:${port}`));
}

module.exports = { app, server, games };
