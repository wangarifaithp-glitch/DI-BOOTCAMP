const socket = io();
const joinBackdrop = document.querySelector('#join-backdrop');
const joinForm = document.querySelector('#join-form');
const usernameInput = document.querySelector('#username-input');
const roomSelect = document.querySelector('#room-select');
const joinButton = document.querySelector('#join-button');
const joinError = document.querySelector('#join-error');
const roomTitle = document.querySelector('#room-title');
const roomSubtitle = document.querySelector('#room-subtitle');
const welcomeRoom = document.querySelector('#welcome-room');
const welcomeNote = document.querySelector('#welcome-note');
const messages = document.querySelector('#messages');
const messageArea = document.querySelector('#message-area');
const messageForm = document.querySelector('#message-form');
const messageInput = document.querySelector('#message-input');
const sendButton = document.querySelector('.send-button');
const characterCount = document.querySelector('#character-count');
const memberList = document.querySelector('#member-list');
const memberCount = document.querySelector('#member-count-value');
const peopleCount = document.querySelector('#people-count');
const onlineLabel = document.querySelector('#online-label');
const youCard = document.querySelector('#you-card');
const youAvatar = document.querySelector('#you-avatar');
const youName = document.querySelector('#you-name');
const composerHint = document.querySelector('#composer-hint');
const connectionLabel = document.querySelector('#connection-label');
const topbarCenter = document.querySelector('.topbar-center');
const toast = document.querySelector('#toast');
const notifyToggle = document.querySelector('#notify-toggle');
const membersPanel = document.querySelector('#members-panel');
let currentUsername = '';
let currentRoom = '';
let toastTimer;
let unreadRooms = new Set();

const roomDescriptions = {
  general: 'A place for the whole team',
  design: 'Ideas, details, and things in progress',
  development: 'Build notes and technical talk',
  random: 'The wonderfully off-topic corner',
};

function initials(value) {
  return value.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function setConnection(connected) {
  connectionLabel.textContent = connected ? 'Connected' : 'Reconnecting';
  topbarCenter.classList.toggle('disconnected', !connected);
}

function formatTime(value) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

function addMessage(message) {
  if (message.type === 'system') {
    const notice = document.createElement('div');
    notice.className = 'system-message';
    notice.textContent = message.text;
    messages.append(notice);
  } else {
    const item = document.createElement('article');
    item.className = 'message';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.dataset.tone = String([...message.username].reduce((sum, letter) => sum + letter.charCodeAt(0), 0) % 5);
    avatar.textContent = initials(message.username);
    avatar.setAttribute('aria-hidden', 'true');

    const content = document.createElement('div');
    content.className = 'message-content';
    const meta = document.createElement('div');
    meta.className = 'message-meta';
    const name = document.createElement('strong');
    name.textContent = message.username;
    const time = document.createElement('time');
    time.dateTime = message.time;
    time.textContent = formatTime(message.time);
    meta.append(name, time);

    const text = document.createElement('p');
    text.textContent = message.text;
    content.append(meta, text);
    item.append(avatar, content);
    messages.append(item);

    if (message.id !== socket.id) {
      const title = currentRoom ? `#${currentRoom}` : 'Commonroom';
      showToast(`${message.username} in ${title}: ${message.text}`);
      if (document.hidden) {
        document.title = `New message · ${title}`;
        if (notifyToggle.classList.contains('enabled') && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(`${message.username} in ${title}`, { body: message.text, tag: currentRoom });
        }
        if (currentRoom) unreadRooms.add(currentRoom);
        renderUnreadRooms();
      }
    }
  }

  welcomeNote.hidden = messages.childElementCount > 0;
  messageArea.scrollTop = messageArea.scrollHeight;
}

function renderUsers(users) {
  memberCount.textContent = String(users.length);
  peopleCount.textContent = String(users.length);
  onlineLabel.textContent = `${users.length} ${users.length === 1 ? 'person' : 'people'} online`;
  memberList.replaceChildren();

  if (users.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-members';
    empty.textContent = 'No one is here yet.';
    memberList.append(empty);
  }

  for (const user of users) {
    const row = document.createElement('div');
    row.className = 'member-row';
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.dataset.tone = String([...user.username].reduce((sum, letter) => sum + letter.charCodeAt(0), 0) % 5);
    avatar.textContent = initials(user.username);
    avatar.setAttribute('aria-hidden', 'true');
    const name = document.createElement('span');
    name.className = 'member-name';
    name.textContent = user.username;
    row.append(avatar, name);
    if (user.id === socket.id) {
      const you = document.createElement('span');
      you.className = 'member-you';
      you.textContent = 'you';
      row.append(you);
    }
    memberList.append(row);
  }
}

function renderUnreadRooms() {
  document.querySelectorAll('.room-button').forEach((button) => {
    const dot = button.querySelector('.room-unread');
    dot.hidden = !unreadRooms.has(button.dataset.room) || button.dataset.room === currentRoom;
  });
}

function joinRoom(username, room) {
  joinButton.disabled = true;
  joinError.textContent = '';
  socket.timeout(5000).emit('room:join', { username, room }, (error, result) => {
    joinButton.disabled = !usernameInput.value.trim();
    if (error) {
      joinError.textContent = 'Could not reach the chat server. Try again.';
      return;
    }
    if (!result.ok) {
      joinError.textContent = result.message;
      return;
    }

    currentUsername = result.username;
    currentRoom = result.room;
    usernameInput.value = currentUsername;
    roomTitle.textContent = currentRoom;
    roomSubtitle.textContent = roomDescriptions[currentRoom] || 'A room for good conversation';
    welcomeRoom.textContent = `#${currentRoom}`;
    messages.replaceChildren();
    welcomeNote.hidden = false;
    renderUsers(result.users);
    youName.textContent = currentUsername;
    youAvatar.textContent = initials(currentUsername);
    youCard.hidden = false;
    composerHint.textContent = `Message #${currentRoom}`;
    messageInput.disabled = false;
    sendButton.disabled = true;
    joinBackdrop.hidden = true;
    document.querySelectorAll('.room-button').forEach((button) => {
      button.classList.toggle('active', button.dataset.room === currentRoom);
    });
    unreadRooms.delete(currentRoom);
    renderUnreadRooms();
    messageInput.focus();
  });
}

joinForm.addEventListener('input', () => {
  joinButton.disabled = !usernameInput.value.trim();
  joinError.textContent = '';
});

joinForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!usernameInput.value.trim()) return;
  joinRoom(usernameInput.value, roomSelect.value);
});

document.querySelectorAll('.room-button').forEach((button) => {
  button.addEventListener('click', () => {
    if (!currentUsername) {
      roomSelect.value = button.dataset.room;
      return;
    }
    if (button.dataset.room !== currentRoom) joinRoom(currentUsername, button.dataset.room);
  });
});

document.querySelector('#custom-room-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#custom-room');
  const room = input.value.trim();
  if (!room) return;
  if (!currentUsername) {
    roomSelect.value = room;
    showToast('Choose your username to join this room.');
    return;
  }
  joinRoom(currentUsername, room);
  input.value = '';
});

messageInput.addEventListener('input', () => {
  sendButton.disabled = !messageInput.value.trim();
  characterCount.textContent = `${messageInput.value.length} / 1000`;
});

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (!text || !currentRoom) return;
  socket.emit('chat:message', text);
  messageInput.value = '';
  sendButton.disabled = true;
  characterCount.textContent = '0 / 1000';
  messageInput.focus();
});

document.querySelector('#emoji-button').addEventListener('click', () => {
  if (messageInput.disabled) return;
  messageInput.value += ' 👋';
  messageInput.dispatchEvent(new Event('input'));
  messageInput.focus();
});

document.querySelector('#member-count').addEventListener('click', () => {
  membersPanel.classList.toggle('open');
});
document.querySelector('#mobile-members').addEventListener('click', () => {
  membersPanel.classList.add('open');
});
document.querySelector('#mobile-close').addEventListener('click', () => {
  membersPanel.classList.remove('open');
});

notifyToggle.addEventListener('click', async () => {
  if (!('Notification' in window)) {
    showToast('Desktop notifications are not supported in this browser.');
    return;
  }
  const permission = Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission;
  const enabled = permission === 'granted';
  notifyToggle.classList.toggle('enabled', enabled);
  notifyToggle.title = enabled ? 'Desktop notifications enabled' : 'Enable desktop notifications';
  showToast(enabled ? 'Desktop notifications enabled.' : 'Notifications were not enabled.');
});

socket.on('connect', () => {
  setConnection(true);
  if (currentUsername && currentRoom) joinRoom(currentUsername, currentRoom);
});
socket.on('disconnect', () => setConnection(false));
socket.on('room:users', renderUsers);
socket.on('chat:message', addMessage);
window.addEventListener('focus', () => {
  document.title = 'Commonroom · Live chat';
});
