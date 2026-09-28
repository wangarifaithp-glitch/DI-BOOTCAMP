const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-me';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const users = new Map();

app.use(express.json());

function validPassword(password) {
  return typeof password === 'string'
    && password.length >= 8
    && /[A-Z]/.test(password)
    && /[a-z]/.test(password)
    && /\d/.test(password);
}

function createToken(user) {
  return jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
}

function authenticate(req, res, next) {
  const authorization = req.headers.authorization || '';
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'A Bearer token is required.' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: 'The token is invalid or expired.' });
  }
}

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (typeof username !== 'string' || !username.trim() || !validPassword(password)) {
    return res.status(400).json({
      message: 'Username is required and password must be 8+ characters with uppercase, lowercase, and a number.'
    });
  }

  const normalizedUsername = username.trim().toLowerCase();
  if (users.has(normalizedUsername)) {
    return res.status(409).json({ message: 'That username is already registered.' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  users.set(normalizedUsername, {
    username: normalizedUsername,
    passwordHash,
    role: 'user',
    failedAttempts: 0,
    lockedUntil: 0
  });

  res.status(201).json({ message: 'User registered successfully.' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.get(typeof username === 'string' ? username.trim().toLowerCase() : '');

  if (!user || Date.now() < user.lockedUntil) {
    return res.status(401).json({ message: 'Invalid credentials or account temporarily locked.' });
  }

  const passwordMatches = await bcrypt.compare(password || '', user.passwordHash);
  if (!passwordMatches) {
    user.failedAttempts += 1;
    if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      user.lockedUntil = Date.now() + LOCKOUT_MS;
      user.failedAttempts = 0;
    }
    return res.status(401).json({ message: 'Invalid credentials or account temporarily locked.' });
  }

  user.failedAttempts = 0;
  res.json({ token: createToken(user) });
});

app.get('/api/profile', authenticate, (req, res) => {
  const user = users.get(req.user.username);
  res.json({ username: user.username, role: user.role });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`User login API running on port ${PORT}`);
  });
}

module.exports = app;