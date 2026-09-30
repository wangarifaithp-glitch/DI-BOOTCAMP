const authScreen = document.querySelector('#auth-screen');
const gameScreen = document.querySelector('#game-screen');
const authForm = document.querySelector('#auth-form');
const authError = document.querySelector('#auth-error');
const authSubmit = document.querySelector('#auth-submit');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const accountArea = document.querySelector('#account-area');
const accountName = document.querySelector('#account-name');
const gameList = document.querySelector('#game-list');
const matchScreen = document.querySelector('#match-screen');
const board = document.querySelector('#board');
const toast = document.querySelector('#toast');
let authMode = 'login';
let token = sessionStorage.getItem('outpost-token') || '';
let currentUser = null;
let activeGameId = '';
let currentGame = null;
let pollTimer;
let toastTimer;

async function request(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

function showAuthenticated() {
  authScreen.hidden = true;
  gameScreen.hidden = false;
  accountArea.hidden = false;
  accountName.textContent = currentUser.username;
  loadGames();
}

function setAuthMode(mode) {
  authMode = mode;
  document.querySelectorAll('.auth-tab').forEach((tab) => {
    const selected = tab.dataset.authMode === mode;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
  authSubmit.innerHTML = mode === 'login'
    ? 'Enter the frontier <span>↗</span>'
    : 'Create account <span>↗</span>';
  passwordInput.autocomplete = mode === 'login' ? 'current-password' : 'new-password';
  authError.textContent = '';
}

document.querySelectorAll('.auth-tab').forEach((tab) => {
  tab.addEventListener('click', () => setAuthMode(tab.dataset.authMode));
});

authForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  authError.textContent = '';
  authSubmit.disabled = true;
  try {
    const result = await request(`/auth/${authMode === 'login' ? 'login' : 'register'}`, {
      method: 'POST',
      body: JSON.stringify({ username: usernameInput.value.trim(), password: passwordInput.value }),
    });
    token = result.token;
    currentUser = result.user;
    sessionStorage.setItem('outpost-token', token);
    passwordInput.value = '';
    showAuthenticated();
  } catch (error) {
    authError.textContent = error.message;
  } finally {
    authSubmit.disabled = false;
  }
});

document.querySelector('#logout-button').addEventListener('click', async () => {
  clearInterval(pollTimer);
  try { await request('/auth/logout', { method: 'POST' }); } catch {}
  token = '';
  currentUser = null;
  currentGame = null;
  activeGameId = '';
  sessionStorage.removeItem('outpost-token');
  accountArea.hidden = true;
  gameScreen.hidden = true;
  authScreen.hidden = false;
  matchScreen.hidden = true;
});

async function loadGames() {
  try {
    const games = await request('/games');
    renderGames(games);
  } catch (error) {
    gameList.replaceChildren(emptyState(error.message));
  }
}

function emptyState(message) {
  const empty = document.createElement('div');
  empty.className = 'empty-state';
  empty.textContent = message;
  return empty;
}

function renderGames(games) {
  gameList.replaceChildren();
  if (games.length === 0) {
    gameList.append(emptyState('No matches yet. Start a game and invite another player.'));
    return;
  }

  for (const game of games) {
    const ownGame = game.players.some((player) => player.username === currentUser.username);
    const card = document.createElement('article');
    card.className = 'game-card';
    const stamp = document.createElement('div');
    stamp.className = 'game-stamp';
    stamp.textContent = '⌖';
    const details = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = `${game.players[0]?.username || 'Unknown'}’s frontier`;
    const subtitle = document.createElement('p');
    subtitle.textContent = game.status === 'waiting'
      ? 'Waiting for a second operative'
      : `${game.players.map((player) => player.username).join(' vs ')} · In progress`;
    details.append(title, subtitle);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'primary-button';
    button.textContent = ownGame ? 'Open match' : game.status === 'waiting' ? 'Join match' : 'View match';
    button.addEventListener('click', () => openGame(game.id, !ownGame && game.status === 'waiting'));
    card.append(stamp, details, button);
    gameList.append(card);
  }
}

document.querySelector('#create-game').addEventListener('click', async () => {
  try {
    const game = await request('/games', { method: 'POST', body: '{}' });
    showToast('Match created. Share it with another player to begin.');
    await openGame(game.id, false);
    await loadGames();
  } catch (error) {
    showToast(error.message);
  }
});

async function openGame(id, join) {
  try {
    if (join) await request(`/games/${id}/join`, { method: 'POST', body: '{}' });
    activeGameId = id;
    matchScreen.hidden = false;
    await refreshGame();
    clearInterval(pollTimer);
    pollTimer = setInterval(refreshGame, 2200);
  } catch (error) {
    showToast(error.message);
    await loadGames();
  }
}

document.querySelector('#back-to-lobby').addEventListener('click', () => {
  clearInterval(pollTimer);
  activeGameId = '';
  currentGame = null;
  matchScreen.hidden = true;
  loadGames();
});

async function refreshGame() {
  if (!activeGameId) return;
  try {
    const game = await request(`/games/${activeGameId}`);
    currentGame = game;
    renderGame(game);
    if (game.status === 'finished') {
      const result = await request(`/games/${activeGameId}/winner`);
      if (result.winner) showToast(result.winner === currentUser.id ? 'Victory. The base is yours.' : `${result.winnerUsername} captured your base.`);
      clearInterval(pollTimer);
    }
  } catch (error) {
    document.querySelector('#game-feedback').textContent = error.message;
    clearInterval(pollTimer);
  }
}

function renderGame(game) {
  document.querySelector('#match-id').textContent = `OPERATION ${game.id.slice(0, 8).toUpperCase()}`;
  document.querySelector('#board-title').textContent = game.status === 'waiting'
    ? 'Waiting for opponent'
    : game.status === 'finished' ? 'Campaign concluded' : 'Capture the outpost';
  document.querySelector('#step-counter').textContent = `TURN ${String(game.turnNumber || 0).padStart(2, '0')}`;
  document.querySelector('#last-action').textContent = game.lastAction || 'No moves yet.';

  const turnBadge = document.querySelector('#turn-badge');
  const isMyTurn = game.currentTurn === currentUser.id && game.status === 'active';
  turnBadge.classList.toggle('your-turn', isMyTurn);
  document.querySelector('#turn-label').textContent = game.status === 'waiting'
    ? 'WAITING' : game.status === 'finished' ? (game.winner === currentUser.id ? 'VICTORY' : 'DEFEAT') : isMyTurn ? 'YOUR TURN' : 'OPPONENT';

  const localPlayer = game.players.find((player) => player.id === currentUser.id);
  const opponent = game.players.find((player) => player.id !== currentUser.id);
  document.querySelector('#move-hint').textContent = game.status === 'waiting'
    ? 'Share this match ID and wait for a second operative.'
    : game.status === 'finished' ? (game.winner === currentUser.id ? 'You captured the opposing base.' : 'Your base has been captured.')
      : isMyTurn ? 'Select a lit tile or use the move controls.' : `Waiting for ${opponent?.username || 'your opponent'} to move.`;

  renderRoster(game, localPlayer, isMyTurn);
  renderBoard(game, localPlayer);
  document.querySelector('#attack-button').disabled = !game.canAttack;
  document.querySelector('#game-feedback').textContent = '';
}

function renderRoster(game, localPlayer, isMyTurn) {
  const roster = document.querySelector('#roster');
  roster.replaceChildren();
  for (const player of game.players) {
    const operative = document.createElement('div');
    operative.className = 'operative';
    operative.dataset.slot = player.slot;
    if (player.id === game.currentTurn && game.status === 'active') operative.classList.add('active');
    const marker = document.createElement('div');
    marker.className = 'operative-marker';
    marker.textContent = player.slot;
    const meta = document.createElement('div');
    meta.className = 'operative-meta';
    const name = document.createElement('strong');
    name.textContent = player.username + (player.id === currentUser.id ? ' (you)' : '');
    const status = document.createElement('span');
    status.textContent = player.id === game.currentTurn && game.status === 'active'
      ? 'ACTIVE TURN' : `UNIT ${player.slot}`;
    const led = document.createElement('i');
    led.className = 'operative-status';
    meta.append(name, status);
    operative.append(marker, meta, led);
    roster.append(operative);
  }
  if (game.players.length < 2) {
    const waiting = document.createElement('div');
    waiting.className = 'operative';
    waiting.innerHTML = '<div class="operative-marker">B</div><div class="operative-meta"><strong>Opponent</strong><span>AWAITING ARRIVAL</span></div><i class="operative-status"></i>';
    roster.append(waiting);
  }
}

function renderBoard(game, localPlayer) {
  const directions = {
    up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 },
  };
  const validTargets = new Map();
  if (game.currentTurn === currentUser.id && game.status === 'active' && localPlayer) {
    for (const direction of game.validMoves) {
      const vector = directions[direction];
      validTargets.set(`${localPlayer.position.x + vector.x},${localPlayer.position.y + vector.y}`, direction);
    }
  }

  const fragment = document.createDocumentFragment();
  for (let y = 0; y < game.boardSize; y += 1) {
    for (let x = 0; x < game.boardSize; x += 1) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.setAttribute('role', 'gridcell');
      const positionKey = `${x},${y}`;
      const baseSlot = Object.entries(game.bases).find(([, base]) => base.x === x && base.y === y)?.[0];
      const obstacle = game.obstacles.some((item) => item.x === x && item.y === y);
      const player = game.players.find((entry) => entry.position.x === x && entry.position.y === y);
      const direction = validTargets.get(positionKey);
      if (baseSlot) {
        cell.classList.add(`base-${baseSlot.toLowerCase()}`);
        const glyph = document.createElement('span');
        glyph.className = 'base-glyph';
        glyph.textContent = '⌂';
        cell.append(glyph);
      }
      if (obstacle) {
        cell.classList.add('obstacle');
        cell.title = 'Impassable terrain';
      }
      if (player) {
        const unit = document.createElement('span');
        unit.className = `unit ${player.slot === 'B' ? 'unit-b' : ''}`;
        unit.textContent = player.slot;
        cell.append(unit);
        cell.title = `${player.username} · ${player.slot}`;
      }
      if (direction) {
        cell.classList.add('valid');
        cell.title = `Move ${direction}`;
        cell.addEventListener('click', () => makeMove(direction));
      }
      fragment.append(cell);
    }
  }
  board.replaceChildren(fragment);
}

async function makeMove(direction) {
  if (!activeGameId) return;
  try {
    const game = await request(`/games/${activeGameId}/moves`, {
      method: 'POST',
      body: JSON.stringify({ direction }),
    });
    currentGame = game;
    renderGame(game);
    if (game.status === 'finished') await refreshGame();
  } catch (error) {
    document.querySelector('#game-feedback').textContent = error.message;
    await refreshGame();
  }
}

document.querySelectorAll('.move-pad button[data-direction]').forEach((button) => {
  button.addEventListener('click', () => makeMove(button.dataset.direction));
});
document.querySelector('#attack-button').addEventListener('click', async () => {
  try {
    currentGame = await request(`/games/${activeGameId}/attack`, { method: 'POST', body: '{}' });
    renderGame(currentGame);
    await refreshGame();
  } catch (error) {
    document.querySelector('#game-feedback').textContent = error.message;
  }
});

async function restoreSession() {
  if (!token) return;
  try {
    currentUser = await request('/me');
    showAuthenticated();
  } catch {
    token = '';
    sessionStorage.removeItem('outpost-token');
  }
}

restoreSession();
setInterval(() => {
  if (!gameScreen.hidden && !activeGameId) loadGames();
}, 5000);
