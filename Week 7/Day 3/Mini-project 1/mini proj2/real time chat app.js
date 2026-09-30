const express = require('express');
const http = require('node:http');
const path = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const rooms = new Map();

app.use(express.static(path.join(__dirname, 'public')));

function normalizeUsername(value) {
	if (typeof value !== 'string') return null;
	const username = value.normalize('NFKC').replace(/[\u0000-\u001f\u007f]/g, '').trim();
	return username.length > 0 && username.length <= 24 ? username : null;
}

function normalizeRoom(value) {
	if (typeof value !== 'string') return null;
	const room = value.trim().toLowerCase().replace(/\s+/g, '-');
	return /^[a-z0-9_-]{2,32}$/.test(room) ? room : null;
}

function getRoomUsers(room) {
	return [...(rooms.get(room)?.entries() ?? [])].map(([id, username]) => ({ id, username }));
}

function emitRoomUsers(room) {
	io.to(room).emit('room:users', getRoomUsers(room));
}

function createSystemMessage(text) {
	return {
		type: 'system',
		text,
		time: new Date().toISOString(),
	};
}

function leaveRoom(socket, announce = true) {
	const { room, username } = socket.data;
	if (!room) return;

	const members = rooms.get(room);
	members?.delete(socket.id);
	if (members?.size === 0) rooms.delete(room);

	socket.leave(room);
	socket.data.room = null;
	socket.data.username = null;

	if (announce) {
		io.to(room).emit('chat:message', createSystemMessage(`${username} left the room.`));
	}
	emitRoomUsers(room);
}

io.on('connection', (socket) => {
	socket.on('room:join', async (payload = {}, acknowledge) => {
		const username = normalizeUsername(payload?.username);
		const room = normalizeRoom(payload?.room);

		if (!username || !room) {
			acknowledge?.({
				ok: false,
				message: 'Enter a username (1-24 characters) and a room (2-32 letters, numbers, hyphens, or underscores).',
			});
			return;
		}

		if (socket.data.room) {
			leaveRoom(socket);
		}

		await socket.join(room);
		socket.data.username = username;
		socket.data.room = room;

		if (!rooms.has(room)) rooms.set(room, new Map());
		rooms.get(room).set(socket.id, username);

		socket.to(room).emit('chat:message', createSystemMessage(`${username} joined the room.`));
		emitRoomUsers(room);
		acknowledge?.({ ok: true, username, room, users: getRoomUsers(room) });
	});

	socket.on('chat:message', (value) => {
		const { room, username } = socket.data;
		if (!room || typeof value !== 'string') return;

		const text = value.trim();
		if (!text || text.length > 1000) return;

		io.to(room).emit('chat:message', {
			type: 'message',
			id: socket.id,
			username,
			text,
			time: new Date().toISOString(),
		});
	});

	socket.on('room:leave', () => leaveRoom(socket));
	socket.on('disconnect', () => leaveRoom(socket));
});

const port = Number(process.env.PORT) || 3000;
if (require.main === module) {
	server.listen(port, () => console.log(`Chat server listening on http://localhost:${port}`));
}

module.exports = { app, server, io };
