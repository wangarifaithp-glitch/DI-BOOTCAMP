const assert = require('node:assert/strict');
const test = require('node:test');
const { io: createClient } = require('socket.io-client');
const { server, io } = require('./real time chat app.js');

function listenFor(socket, event, timeout = 2000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out waiting for ${event}`)), timeout);
    socket.once(event, (...args) => {
      clearTimeout(timer);
      resolve(args);
    });
  });
}

test('room join, presence, messaging, and leave are live', async () => {
  await new Promise((resolve) => server.listen(0, resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  const first = createClient(url, { forceNew: true });
  const second = createClient(url, { forceNew: true });

  try {
    await Promise.all([
      new Promise((resolve) => first.once('connect', resolve)),
      new Promise((resolve) => second.once('connect', resolve)),
    ]);

    const firstJoin = await new Promise((resolve) => {
      first.emit('room:join', { username: 'Mira', room: 'general' }, resolve);
    });
    assert.equal(firstJoin.ok, true);
    assert.equal(firstJoin.users.length, 1);

    const secondUsers = listenFor(second, 'room:users');
    const secondJoin = await new Promise((resolve) => {
      second.emit('room:join', { username: 'Theo', room: 'general' }, resolve);
    });
    assert.equal(secondJoin.ok, true);
    assert.equal(secondJoin.users.length, 2);
    assert.equal((await secondUsers)[0].length, 2);

    const receivedMessage = listenFor(second, 'chat:message');
    first.emit('chat:message', 'Hello, room!');
    const [message] = await receivedMessage;
    assert.equal(message.username, 'Mira');
    assert.equal(message.text, 'Hello, room!');

    const remainingUsers = listenFor(second, 'room:users');
    first.emit('room:leave');
    const [users] = await remainingUsers;
    assert.equal(users.length, 1);
    assert.equal(users[0].username, 'Theo');
  } finally {
    first.disconnect();
    second.disconnect();
    await new Promise((resolve) => io.close(resolve));
  }
});
