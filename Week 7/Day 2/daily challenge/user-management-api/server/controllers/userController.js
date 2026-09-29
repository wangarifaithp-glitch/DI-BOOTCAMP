const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const SALT_ROUNDS = 12;

function parseUserId(value) {
  if (!/^\d+$/.test(value) || Number(value) < 1) return null;
  return Number(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function optionalProfileFields(body) {
  const user = {};
  for (const field of ['email', 'first_name', 'last_name']) {
    if (body[field] !== undefined) {
      if (!isNonEmptyString(body[field])) return null;
      user[field] = body[field].trim();
    }
  }
  return user;
}

async function register(req, res) {
  const body = req.body || {};
  if (!isNonEmptyString(body.username) || !isNonEmptyString(body.password)) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  if (Buffer.byteLength(body.password, 'utf8') > 72) {
    return res.status(400).json({ error: 'Password must be 72 bytes or fewer.' });
  }

  const profile = optionalProfileFields(body);
  if (!profile) {
    return res.status(400).json({ error: 'Profile fields must be non-empty strings when provided.' });
  }

  const passwordHash = await bcrypt.hash(body.password, SALT_ROUNDS);
  const user = await userModel.createUser({
    email: profile.email || null,
    username: body.username.trim(),
    first_name: profile.first_name || null,
    last_name: profile.last_name || null
  }, passwordHash);
  res.status(201).json({ user });
}

async function login(req, res) {
  const { username, password } = req.body || {};
  if (!isNonEmptyString(username) || !isNonEmptyString(password)) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const user = await userModel.findUserForLogin(username.trim());
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const { password: storedHash, ...safeUser } = user;
  res.json({ message: 'Login successful.', user: safeUser });
}

async function getUsers(req, res) {
  res.json(await userModel.getAllUsers());
}

async function getUser(req, res) {
  const id = parseUserId(req.params.id);
  if (!id) return res.status(400).json({ error: 'User ID must be a positive integer.' });

  const user = await userModel.getUserById(id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json(user);
}

async function updateUser(req, res) {
  const id = parseUserId(req.params.id);
  if (!id) return res.status(400).json({ error: 'User ID must be a positive integer.' });

  const body = req.body || {};
  const fields = optionalProfileFields(body);
  if (!fields) {
    return res.status(400).json({ error: 'Profile fields must be non-empty strings.' });
  }
  if (body.username !== undefined) {
    if (!isNonEmptyString(body.username)) {
      return res.status(400).json({ error: 'Username must be a non-empty string.' });
    }
    fields.username = body.username.trim();
  }
  if (body.password !== undefined) {
    if (!isNonEmptyString(body.password) || Buffer.byteLength(body.password, 'utf8') > 72) {
      return res.status(400).json({ error: 'Password must be a non-empty string of 72 bytes or fewer.' });
    }
  }
  if (!Object.keys(fields).length && body.password === undefined) {
    return res.status(400).json({ error: 'Provide at least one field to update.' });
  }

  const passwordHash = body.password === undefined
    ? undefined
    : await bcrypt.hash(body.password, SALT_ROUNDS);
  const user = await userModel.updateUser(id, fields, passwordHash);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ user });
}

module.exports = { register, login, getUsers, getUser, updateUser };