const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const test = require('node:test');
const { app, server, games } = require('./multiplier strategy.js');

const usersFile = path.join(__dirname, 'users.json');

async function jsonRequest(base, route, { token, method = 'GET', body } = {}) {
  const response = await fetch(`${base}/api${route}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { response, data: response.status === 204 ? null : await response.json() };
}

test('accounts can play a turn-based match and capture a base', async () => {
  const originalUsers = await fs.readFile(usersFile, 'utf8');
  await fs.writeFile(usersFile, '[]\n');
  games.clear();
  await new Promise((resolve) => server.listen(0, resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const registeredTokens = [];

  try {
    const alphaAuth = await jsonRequest(base, '/auth/register', {
      method: 'POST', body: { username: 'alpha', password: 'alpha-password' },
    });
    assert.equal(alphaAuth.response.status, 201);
  registeredTokens.push(alphaAuth.data.token);
    const bravoAuth = await jsonRequest(base, '/auth/register', {
      method: 'POST', body: { username: 'bravo', password: 'bravo-password' },
    });
    assert.equal(bravoAuth.response.status, 201);
  registeredTokens.push(bravoAuth.data.token);

    const storedUsers = JSON.parse(await fs.readFile(usersFile, 'utf8'));
    assert.notEqual(storedUsers[0].passwordHash, 'alpha-password');

    const created = await jsonRequest(base, '/games', {
      token: alphaAuth.data.token, method: 'POST', body: {},
    });
    assert.equal(created.response.status, 201);
    assert.deepEqual(created.data.players[0].position, { x: 1, y: 0 });

    const joined = await jsonRequest(base, `/games/${created.data.id}/join`, {
      token: bravoAuth.data.token, method: 'POST', body: {},
    });
    assert.equal(joined.data.status, 'active');
    assert.equal(joined.data.players.length, 2);

    const wrongTurn = await jsonRequest(base, `/games/${created.data.id}/moves`, {
      token: bravoAuth.data.token, method: 'POST', body: { direction: 'left' },
    });
    assert.equal(wrongTurn.response.status, 409);

    const obstacle = await jsonRequest(base, `/games/${created.data.id}/moves`, {
      token: alphaAuth.data.token, method: 'POST', body: { direction: 'down' },
    });
    assert.equal(obstacle.response.status, 400);
    assert.match(obstacle.data.error, /obstacle/i);

    const attackTooSoon = await jsonRequest(base, `/games/${created.data.id}/attack`, {
      token: alphaAuth.data.token, method: 'POST', body: {},
    });
    assert.equal(attackTooSoon.response.status, 400);

    let replyCount = 0;
    for (let step = 0; step < 7; step += 1) {
      const move = await jsonRequest(base, `/games/${created.data.id}/moves`, {
        token: alphaAuth.data.token, method: 'POST', body: { direction: 'right' },
      });
      assert.equal(move.response.status, 200);
      const reply = await jsonRequest(base, `/games/${created.data.id}/moves`, {
        token: bravoAuth.data.token,
        method: 'POST',
        body: { direction: replyCount++ % 2 === 0 ? 'left' : 'right' },
      });
      assert.equal(reply.response.status, 200);
    }

    for (let step = 0; step < 8; step += 1) {
      const move = await jsonRequest(base, `/games/${created.data.id}/moves`, {
        token: alphaAuth.data.token, method: 'POST', body: { direction: 'down' },
      });
      assert.equal(move.response.status, 200);
      const reply = await jsonRequest(base, `/games/${created.data.id}/moves`, {
        token: bravoAuth.data.token,
        method: 'POST',
        body: { direction: replyCount++ % 2 === 0 ? 'left' : 'right' },
      });
      assert.equal(reply.response.status, 200);
    }

    const finalMove = await jsonRequest(base, `/games/${created.data.id}/moves`, {
      token: alphaAuth.data.token, method: 'POST', body: { direction: 'down' },
    });
    assert.equal(finalMove.response.status, 200);
    assert.equal(finalMove.data.turnNumber, 31);

    const finalReply = await jsonRequest(base, `/games/${created.data.id}/moves`, {
      token: bravoAuth.data.token, method: 'POST', body: { direction: 'up' },
    });
    assert.equal(finalReply.response.status, 200);

    const nearBase = await jsonRequest(base, `/games/${created.data.id}`, { token: alphaAuth.data.token });
    assert.equal(nearBase.data.canAttack, true);
    const captured = await jsonRequest(base, `/games/${created.data.id}/attack`, {
      token: alphaAuth.data.token, method: 'POST', body: {},
    });
    assert.equal(captured.data.status, 'finished');
    assert.equal(captured.data.winner, alphaAuth.data.user.id);

    const winner = await jsonRequest(base, `/games/${created.data.id}/winner`, { token: bravoAuth.data.token });
    assert.equal(winner.data.winnerUsername, 'alpha');
  } finally {
    for (const token of registeredTokens) {
      await jsonRequest(base, '/auth/logout', { token, method: 'POST' });
    }
    games.clear();
    server.closeAllConnections?.();
    await new Promise((resolve) => server.close(resolve));
    await fs.writeFile(usersFile, originalUsers);
  }
});
