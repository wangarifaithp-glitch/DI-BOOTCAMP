const authForm = document.querySelector('#authForm')
const authPanel = document.querySelector('#authPanel')
const profilePanel = document.querySelector('#profilePanel')
const authHeading = document.querySelector('#authHeading')
const authDescription = document.querySelector('#authDescription')
const authMessage = document.querySelector('#authMessage')
const profileMessage = document.querySelector('#profileMessage')
const submitButton = document.querySelector('#submitButton')
const passwordHint = document.querySelector('#passwordHint')
const passwordInput = document.querySelector('#password')
const loginMode = document.querySelector('#loginMode')
const registerMode = document.querySelector('#registerMode')
let mode = 'login'

function showMessage(element, text, success = false) {
  element.textContent = text
  element.hidden = !text
  element.classList.toggle('message--success', success)
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    credentials: 'same-origin',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  if (response.status === 204) return null
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(result.error || 'The request could not be completed.')
  return result
}

function setMode(nextMode) {
  mode = nextMode
  const registering = mode === 'register'
  loginMode.classList.toggle('mode-button--active', !registering)
  registerMode.classList.toggle('mode-button--active', registering)
  loginMode.setAttribute('aria-pressed', String(!registering))
  registerMode.setAttribute('aria-pressed', String(registering))
  authHeading.textContent = registering ? 'Create your account' : 'Welcome back'
  authDescription.textContent = registering
    ? 'Choose a username and a strong password to get started.'
    : 'Sign in to access your protected profile.'
  submitButton.firstChild.textContent = registering ? 'Create account ' : 'Sign in '
  passwordHint.textContent = registering ? 'at least 12 characters' : 'your account password'
  passwordInput.autocomplete = registering ? 'new-password' : 'current-password'
  passwordInput.minLength = registering ? 12 : 1
  showMessage(authMessage, '')
}

function showProfile(user) {
  authPanel.hidden = true
  profilePanel.hidden = false
  document.querySelector('#currentUsername').textContent = user.username
  document.querySelector('#avatar').textContent = user.username.charAt(0).toUpperCase()
  document.querySelector('#newUsername').value = user.username
  showMessage(profileMessage, '')
}

function showAuth() {
  profilePanel.hidden = true
  authPanel.hidden = false
}

loginMode.addEventListener('click', () => setMode('login'))
registerMode.addEventListener('click', () => setMode('register'))

authForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  showMessage(authMessage, '')
  submitButton.disabled = true
  const username = document.querySelector('#username').value.trim()
  const password = passwordInput.value

  try {
    const result = await request(`/api/auth/${mode}`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    authForm.reset()
    showProfile(result.user)
  } catch (error) {
    showMessage(authMessage, error.message)
  } finally {
    submitButton.disabled = false
  }
})

document.querySelector('#logoutButton').addEventListener('click', async () => {
  try {
    await request('/api/auth/logout', { method: 'POST' })
    showAuth()
    authForm.reset()
    setMode('login')
    showMessage(authMessage, 'You have signed out.', true)
  } catch (error) {
    showMessage(profileMessage, error.message)
  }
})

document.querySelector('#profileForm').addEventListener('submit', async (event) => {
  event.preventDefault()
  showMessage(profileMessage, '')
  try {
    const username = document.querySelector('#newUsername').value.trim()
    const result = await request('/api/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify({ username }),
    })
    showProfile(result.user)
    showMessage(profileMessage, 'Username updated.', true)
  } catch (error) {
    showMessage(profileMessage, error.message)
  }
})

async function restoreSession() {
  try {
    const result = await request('/api/auth/me')
    showProfile(result.user)
  } catch {
    try {
      const refreshed = await request('/api/auth/refresh', { method: 'POST' })
      showProfile(refreshed.user)
    } catch {
      showAuth()
    }
  }
}

restoreSession()
