const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const test = require('node:test');
const bcrypt = require('bcrypt');
const { app } = require('./task api.js');

const usersFile = path.join(__dirname, 'users.json');

test('registration, login, and user management routes', async () => {
  const originalUsers = await fs.readFile(usersFile, 'utf8');
  await fs.writeFile(usersFile, '[]\n');

  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const request = (route, method = 'GET', body) => fetch(`${baseUrl}${route}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  try {
    const registerPage = await request('/register.html');
    assert.equal(registerPage.status, 200);
    assert.match(await registerPage.text(), /type="submit" disabled/);
    const loginPage = await request('/login.html');
    assert.equal(loginPage.status, 200);
    assert.match(await loginPage.text(), /type="submit" disabled/);

    let response = await request('/register', 'POST', {
      name: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      username: 'ada',
      password: 'analytical-engine',
    });
    assert.equal(response.status, 201);
    const created = await response.json();
    assert.equal(created.user.password, undefined);

    const storedUsers = JSON.parse(await fs.readFile(usersFile, 'utf8'));
    assert.notEqual(storedUsers[0].password, 'analytical-engine');
    assert.equal(await bcrypt.compare('analytical-engine', storedUsers[0].password), true);

    response = await request('/register', 'POST', {
      name: 'Ada', lastName: 'Lovelace', email: 'ada2@example.com',
      username: 'ada', password: 'different-password',
    });
    assert.equal(response.status, 409);

    response = await request('/register', 'POST', {
      name: 'Grace', lastName: 'Hopper', email: 'grace@example.com',
      username: 'grace', password: 'analytical-engine',
    });
    assert.equal(response.status, 409);
    assert.equal(JSON.parse(await fs.readFile(usersFile, 'utf8')).length, 1);

    response = await request('/login', 'POST', {
      username: 'ada', password: 'analytical-engine',
    });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).user.password, undefined);

    response = await request('/login', 'POST', {
      username: 'ada', password: 'incorrect-password',
    });
    assert.equal(response.status, 401);

    response = await request('/users');
    const users = await response.json();
    assert.equal(users.length, 1);
    assert.equal(users[0].password, undefined);

    response = await request(`/users/${created.user.id}`);
    assert.equal(response.status, 200);

    response = await request(`/users/${created.user.id}`, 'PUT', { name: 'Augusta' });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).name, 'Augusta');
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await fs.writeFile(usersFile, originalUsers);
  }
});
