import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { io, type Socket } from 'socket.io-client'
import { api } from './api/api'
import { authenticate, clearAuthError, loadUser, logout, updateUser } from './features/authSlice'
import { loadStories, removeStory, selectStory, upsertStory } from './features/storiesSlice'
import { useAppDispatch, useAppSelector } from './store'
import type { Comment, Story, StoryDetails, StoryVersion, User } from './types/types'
import './App.css'

type AuthMode = 'login' | 'register' | 'forgot' | 'reset'

function makeStrongPassword() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?-_'
  const required = [
    'ABCDEFGHJKLMNPQRSTUVWXYZ',
    'abcdefghijkmnopqrstuvwxyz',
    '23456789',
    '!@#$%&*?-_',
  ]
  const pick = (characters: string) => {
    const random = new Uint32Array(1)
    crypto.getRandomValues(random)
    return characters[random[0] % characters.length]
  }
  const characters = [...required.map(pick)]
  while (characters.length < 18) characters.push(pick(alphabet))
  for (let index = characters.length - 1; index > 0; index--) {
    const random = new Uint32Array(1)
    crypto.getRandomValues(random)
    const swapIndex = random[0] % (index + 1)
    ;[characters[index], characters[swapIndex]] = [characters[swapIndex], characters[index]]
  }
  return characters.join('')
}

function App() {
  const dispatch = useAppDispatch()
  const { user, loading: authLoading } = useAppSelector((state) => state.auth)
  const { items: stories, selectedId, loading: storiesLoading, error: storiesError } = useAppSelector((state) => state.stories)
  const [details, setDetails] = useState<StoryDetails | null>(null)
  const [detailsErrorState, setDetailsErrorState] = useState<{ storyId: number; message: string } | null>(null)
  const [notice, setNotice] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [storyFilter, setStoryFilter] = useState<'all' | 'mine' | 'community'>('all')
  const [storySearch, setStorySearch] = useState('')
  const [presence, setPresence] = useState<Array<{ id: string; displayName: string }>>([])
  const [liveCursor, setLiveCursor] = useState<{ displayName: string; position: number } | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const selectedIdRef = useRef(selectedId)
  const visibleStories = stories.filter((story) => {
    const matchesFilter = storyFilter === 'all'
      || (storyFilter === 'mine' ? story.ownerId === user?.id : story.ownerId !== user?.id)
    const matchesSearch = `${story.title} ${story.category} ${story.ownerName}`
      .toLocaleLowerCase().includes(storySearch.trim().toLocaleLowerCase())
    return matchesFilter && matchesSearch
  })
  const activeDetails = selectedId && details?.story.id === selectedId ? details : null
  const detailsError = selectedId && detailsErrorState?.storyId === selectedId ? detailsErrorState.message : ''
  const emitCursor = (position: number) => socketRef.current?.emit('story:cursor', { position })

  useEffect(() => {
    selectedIdRef.current = selectedId
  }, [selectedId])

  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  useEffect(() => {
    if (!user) return
    dispatch(loadStories())
  }, [dispatch, user])

  useEffect(() => {
    const userId = user?.id
    if (!userId) return
    const socket = io({ withCredentials: true })
    socketRef.current = socket
    socket.on('story:presence', (users: Array<{ id: string; displayName: string }>) => setPresence(users))
    socket.on('presence:joined', (person: { id: string; displayName: string }) => {
      setPresence((current) => current.some((peer) => peer.id === person.id) ? current : [...current, person])
    })
    socket.on('presence:left', ({ id }: { id: string }) => {
      setPresence((current) => current.filter((person) => person.id !== id))
    })
    socket.on('story:cursor', (cursor: { displayName: string; position: number }) => setLiveCursor(cursor))
    socket.on('story:changed', ({ story, editorId }: { story: Story; editorId: number }) => {
      dispatch(upsertStory(story))
      if (editorId !== userId && story.id === selectedIdRef.current) {
        setNotice('A collaborator saved a new version. Reload to see their latest text.')
      }
    })
    socket.on('story:deleted', ({ storyId }: { storyId: number }) => {
      dispatch(removeStory(storyId))
      if (storyId === selectedIdRef.current) dispatch(selectStory(null))
      setNotice('This story was deleted by its owner.')
    })
    socket.on('story:shared', () => {
      dispatch(loadStories())
      setNotice('A story was shared with you.')
    })
    socket.on('story:unshared', ({ storyId }: { storyId: number }) => {
      dispatch(loadStories())
      if (storyId === selectedIdRef.current) {
        dispatch(selectStory(null))
        setNotice('Your access to this story was removed.')
      }
    })
    socket.on('comment:created', () => {
      const activeId = selectedIdRef.current
      if (activeId) api.story(activeId).then(setDetails).catch((error: Error) => setDetailsErrorState({ storyId: activeId, message: error.message }))
    })
    socket.on('comment:updated', () => {
      const activeId = selectedIdRef.current
      if (activeId) api.story(activeId).then(setDetails).catch((error: Error) => setDetailsErrorState({ storyId: activeId, message: error.message }))
    })
    socket.on('comment:deleted', () => {
      const activeId = selectedIdRef.current
      if (activeId) api.story(activeId).then(setDetails).catch((error: Error) => setDetailsErrorState({ storyId: activeId, message: error.message }))
    })
    return () => {
      socket.disconnect()
      socketRef.current = null
      setPresence([])
      setLiveCursor(null)
    }
  }, [dispatch, user?.id])

  useEffect(() => {
    const socket = socketRef.current
    if (!socket || !selectedId) return
    const joinRoom = () => socket.emit('story:join', selectedId)
    if (socket.connected) joinRoom()
    else socket.on('connect', joinRoom)
    return () => {
      socket.off('connect', joinRoom)
      socket.emit('story:leave', selectedId)
    }
  }, [selectedId])

  useEffect(() => {
    if (!stories.length) {
      dispatch(selectStory(null))
      return
    }
    const requestedId = Number(new URLSearchParams(window.location.search).get('story'))
    const requestedStory = stories.find((story) => story.id === requestedId)
    if (requestedStory) dispatch(selectStory(requestedStory.id))
    else if (!stories.some((story) => story.id === selectedId)) dispatch(selectStory(stories[0].id))
  }, [dispatch, selectedId, stories])

  useEffect(() => {
    if (!selectedId) return
    let active = true
    api.story(selectedId)
      .then((nextDetails) => {
        if (active) {
          setDetails(nextDetails)
          setDetailsErrorState(null)
        }
      })
      .catch((error: Error) => {
        if (active) {
          setDetailsErrorState({ storyId: selectedId, message: error.message })
        }
      })
    return () => {
      active = false
    }
  }, [dispatch, selectedId, user?.id])

  async function createStory() {
    try {
      const { story } = await api.createStory('A story in the making')
      dispatch(upsertStory(story))
      dispatch(selectStory(story.id))
      setNotice('Your new story is ready.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not create story.')
    }
  }

  async function deleteCurrentStory() {
    if (!details || !window.confirm('Delete this story and its comments permanently?')) return
    try {
      await api.deleteStory(details.story.id)
      dispatch(removeStory(details.story.id))
      setNotice('Story deleted.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not delete story.')
    }
  }

  async function handleLogout() {
    try {
      await dispatch(logout()).unwrap()
      dispatch(selectStory(null))
      setNotice('')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not sign out. Please try again.')
    }
  }

  function chooseStory(story: Story) {
    dispatch(selectStory(story.id))
    window.history.replaceState(null, '', `/?story=${story.id}`)
  }

  const refreshDetails = useCallback(async () => {
    if (!selectedId) return
    setDetailsErrorState(null)
    try {
      setDetails(await api.story(selectedId))
    } catch (error) {
      setDetailsErrorState({
        storyId: selectedId,
        message: error instanceof Error ? error.message : 'Could not refresh story.',
      })
    }
  }, [selectedId])

  const handleStorySaved = useCallback((story: Story) => {
    setDetails((current) => current ? { ...current, story } : current)
    dispatch(upsertStory(story))
  }, [dispatch])

  if (authLoading) return <div className="boot-screen"><span className="brand-stamp">S</span><p>Opening the writing room…</p></div>
  if (!user) return <AuthScreen />

  return (
    <div className="app-frame">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Story Circle home">
          <span className="brand-stamp">S</span><span>STORY CIRCLE</span>
        </a>
        <div className="topbar-right">
          <span className="room-label"><i /> WRITING ROOM</span>
          <button className="profile-trigger" type="button" onClick={() => setProfileOpen(true)}>
            <Avatar user={user} /><span>{user.displayName}</span><span className="profile-dot" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="workspace">
        <aside className="story-rail">
          <div className="rail-intro">
            <p className="eyebrow">YOUR WORKSPACE</p>
            <h1>Stories,<br /><em>in progress.</em></h1>
            <p className="rail-description">A quiet place for ideas to find their words.</p>
          </div>
          <button className="new-story-button" type="button" onClick={createStory}><span>＋</span> Start a story</button>
          <div className="story-list-heading">
            <span>STORIES IN THE CIRCLE</span><span>{stories.length.toString().padStart(2, '0')}</span>
          </div>
          <div className="library-filters" aria-label="Filter stories">
            {([
              ['all', 'All'],
              ['mine', 'Mine'],
              ['community', 'Community'],
            ] as const).map(([filter, label]) => (
              <button
                className={storyFilter === filter ? 'active' : ''}
                type="button"
                key={filter}
                onClick={() => setStoryFilter(filter)}
              >
                {label}
                <span>{filter === 'all' ? stories.length : filter === 'mine'
                  ? stories.filter((story) => story.ownerId === user.id).length
                  : stories.filter((story) => story.ownerId !== user.id).length}</span>
              </button>
            ))}
          </div>
          <label className="story-search">
            <span aria-hidden="true">⌕</span>
            <input aria-label="Search stories" placeholder="Find a story or writer" value={storySearch} onChange={(event) => setStorySearch(event.target.value)} />
          </label>
          <div className="story-list">
            {storiesLoading && <p className="subtle-message">Gathering your stories…</p>}
            {storiesError && <p className="inline-error">{storiesError}</p>}
            {!storiesLoading && stories.length === 0 && (
              <div className="empty-library"><span className="empty-mark">✳</span><p>Your next story starts with a single line.</p></div>
            )}
            {!storiesLoading && stories.length > 0 && visibleStories.length === 0 && (
              <p className="subtle-message library-empty">No stories match that search.</p>
            )}
            {visibleStories.map((story, index) => (
              <button
                className={`story-list-item ${selectedId === story.id ? 'selected' : ''}`}
                type="button"
                key={story.id}
                onClick={() => chooseStory(story)}
              >
                <span className="story-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="story-item-copy"><strong>{story.title}</strong><small>{story.category} · {story.ownerName} {story.ownerId === user.id ? '· yours' : ''}</small></span>
              </button>
            ))}
          </div>
          <div className="rail-bottom">
            <div className="avatar-large"><Avatar user={user} /></div>
            <div><strong>{user.displayName}</strong><small>{user.email}</small></div>
            <button type="button" className="quiet-button logout-button" onClick={handleLogout} title="Sign out">Sign out</button>
          </div>
        </aside>

        <main className="editor-area">
          {notice && <div className="notice-bar" role="status">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Dismiss">×</button></div>}
          {detailsError ? (
            <div className="center-state"><span className="empty-mark">!</span><p>{detailsError}</p><button className="text-button" type="button" onClick={refreshDetails}>Try again</button></div>
          ) : activeDetails ? (
            <StoryWorkspace
              key={`${activeDetails.story.id}-${activeDetails.canEdit}`}
              details={activeDetails}
              user={user}
              presence={presence}
              liveCursor={liveCursor}
              onCursor={emitCursor}
              onStorySaved={handleStorySaved}
              onRefresh={refreshDetails}
              onDelete={deleteCurrentStory}
            />
          ) : (
            <div className="welcome-state">
              <div className="sunburst">✳</div>
              <p className="eyebrow">MAKE YOURSELF AT HOME</p>
              <h2>Every good story<br /><em>begins somewhere.</em></h2>
              <p>Start a new draft, or choose one from your library to continue writing.</p>
              <button type="button" className="primary-button" onClick={createStory}>Start a new story</button>
            </div>
          )}
        </main>
      </div>

      {profileOpen && (
        <ProfileDialog
          user={user}
          onClose={() => setProfileOpen(false)}
          onSaved={(nextUser) => {
            dispatch(updateUser(nextUser))
            setProfileOpen(false)
            setNotice('Profile saved.')
          }}
          onError={(message) => setNotice(message)}
        />
      )}
    </div>
  )
}

function AuthScreen() {
  const dispatch = useAppDispatch()
  const error = useAppSelector((state) => state.auth.error)
  const [mode, setMode] = useState<AuthMode>(() => new URLSearchParams(window.location.search).has('reset') ? 'reset' : 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [resetToken] = useState(() => new URLSearchParams(window.location.search).get('reset') || '')
  const [resetLink, setResetLink] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const register = mode === 'register'
  const resetting = mode === 'reset'
  const needsStrongPassword = register || resetting

  function suggestPassword() {
    const suggested = makeStrongPassword()
    setPassword(suggested)
    setConfirmPassword(suggested)
    setShowPassword(true)
    setFormMessage('Strong password suggested. Save it somewhere safe before continuing.')
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setFormMessage('')
    dispatch(clearAuthError())
    try {
      if (mode === 'forgot') {
        const result = await api.requestPasswordReset(email)
        setResetLink(result.resetUrl || '')
        setFormMessage(result.message)
      } else if (resetting) {
        if (password !== confirmPassword) throw new Error('Your passwords do not match.')
        const result = await api.resetPassword(resetToken, password)
        setFormMessage(result.message)
        setPassword('')
        setConfirmPassword('')
        setMode('login')
        window.history.replaceState(null, '', '/')
      } else {
        await dispatch(authenticate({ email, password, displayName, register })).unwrap()
      }
    } catch (error) {
      if (error instanceof Error && (mode === 'forgot' || resetting)) setFormMessage(error.message)
      setSubmitting(false)
      return
    }
    setSubmitting(false)
  }

  const passwordStrong = password.length >= 12
    && /[a-z]/.test(password)
    && /[A-Z]/.test(password)
    && /\d/.test(password)
    && /[^A-Za-z0-9]/.test(password)

  return (
    <main className="auth-layout">
      <section className="auth-story">
        <a className="brand auth-brand" href="/"><span className="brand-stamp">S</span><span>STORY CIRCLE</span></a>
        <div className="auth-quote">
          <span className="quote-mark">“</span>
          <h1>Stories are how<br />we <em>find each other.</em></h1>
          <p>24 community stories are waiting for your next favorite line.</p>
          <div className="auth-story-cards">
            <article><span>FICTION · MAYA CHEN</span><strong>The Bookshop at the End of the Rain</strong></article>
            <article><span>MYSTERY · AMINA OKAFOR</span><strong>The House That Kept Your Secrets</strong></article>
            <article><span>FANTASY · PRIYA NAIR</span><strong>A Letter for the Sea</strong></article>
          </div>
        </div>
        <div className="auth-footnote"><span>01 — A SPACE TO MAKE THINGS</span><span>EST. WHENEVER YOU'RE READY</span></div>
      </section>
      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <p className="eyebrow">{register ? 'PULL UP A CHAIR' : resetting ? 'ONE MORE CHAPTER' : mode === 'forgot' ? 'FIND YOUR WAY BACK' : 'GOOD TO SEE YOU'}</p>
          <h2>{register ? 'Join the circle.' : resetting ? 'Choose a new password.' : mode === 'forgot' ? 'Let’s get you back in.' : 'Welcome back.'}</h2>
          <p className="auth-subtitle">{register ? 'Create an account to start writing and meet the community.' : resetting ? 'Set a new, strong password for your account.' : mode === 'forgot' ? 'Enter your email and we’ll send a secure recovery link.' : 'Sign in to pick up where you left off.'}</p>
          <form className="auth-form" onSubmit={submit}>
            {register && <label>Display name<input required minLength={2} maxLength={40} value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="What should we call you?" /></label>}
            {mode !== 'reset' && <label>Email address<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>}
            {mode === 'reset' && <p className="reset-email-note">{resetToken ? 'Your secure recovery link is ready.' : 'This recovery link is missing or invalid. Request a new one.'}</p>}
            {(mode === 'login' || mode === 'register' || resetting) && (
              <PasswordInput
                id="account-password"
                label={resetting ? 'New password' : 'Password'}
                value={password}
                visible={showPassword}
                strong={needsStrongPassword}
                autoComplete={register || resetting ? 'new-password' : 'current-password'}
                onChange={setPassword}
                onToggleVisibility={() => setShowPassword((visible) => !visible)}
                onSuggest={needsStrongPassword ? suggestPassword : undefined}
              />
            )}
            {resetting && (
              <PasswordInput
                id="confirm-password"
                label="Confirm new password"
                value={confirmPassword}
                visible={showPassword}
                autoComplete="new-password"
                onChange={setConfirmPassword}
                onToggleVisibility={() => setShowPassword((visible) => !visible)}
              />
            )}
            {needsStrongPassword && <PasswordStrength password={password} />}
            {error && <p className="form-error" role="alert">{error}</p>}
            {formMessage && <div className="form-message" role="status">{formMessage}{resetLink && <a href={resetLink}>Open the password reset page</a>}</div>}
            {mode !== 'reset' || resetToken ? (
              <button className="primary-button auth-submit" disabled={submitting || (needsStrongPassword && !passwordStrong)} type="submit">
                {submitting ? 'One moment…' : register ? 'Create account' : resetting ? 'Reset password' : mode === 'forgot' ? 'Send recovery link' : 'Sign in'}
              </button>
            ) : null}
          </form>
          {mode === 'login' && <button className="forgot-link" type="button" onClick={() => { setMode('forgot'); setFormMessage('') }}>Forgot your password?</button>}
          <p className="auth-switch">
            {mode === 'register' ? 'Already have a seat?' : mode === 'login' ? 'New to the circle?' : 'Found your way back?'}
            {' '}
            <button type="button" onClick={() => {
              setMode(mode === 'register' || mode === 'login' ? (register ? 'login' : 'register') : 'login')
              setFormMessage('')
              setPassword('')
              setConfirmPassword('')
              window.history.replaceState(null, '', '/')
              dispatch(clearAuthError())
            }}>
              {mode === 'register' || mode === 'reset' || mode === 'forgot' ? 'Sign in' : 'Create an account'}
            </button>
          </p>
        </div>
      </section>
    </main>
  )
}

interface PasswordInputProps {
  id: string
  label: string
  value: string
  visible: boolean
  strong?: boolean
  autoComplete: string
  onChange: (value: string) => void
  onToggleVisibility: () => void
  onSuggest?: () => void
}

function PasswordInput({ id, label, value, visible, strong, autoComplete, onChange, onToggleVisibility, onSuggest }: PasswordInputProps) {
  return (
    <label className="password-field" htmlFor={id}>
      <span className="password-label-row">{label}<span className="password-tools">
        {onSuggest && <button type="button" onClick={onSuggest}>Suggest a strong password</button>}
        <button type="button" onClick={onToggleVisibility}>{visible ? 'Hide' : 'Show'}</button>
      </span></span>
      <input
        id={id}
        required
        type={visible ? 'text' : 'password'}
        minLength={strong ? 12 : undefined}
        maxLength={72}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={strong ? '12+ characters, with a number and symbol' : 'Your password'}
      />
    </label>
  )
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    ['At least 12 characters', password.length >= 12],
    ['Uppercase and lowercase letters', /[A-Z]/.test(password) && /[a-z]/.test(password)],
    ['At least one number', /\d/.test(password)],
    ['At least one symbol', /[^A-Za-z0-9]/.test(password)],
  ] as const
  const passed = checks.filter(([, valid]) => valid).length

  return (
    <div className={`password-strength strength-${passed}`} aria-live="polite">
      <div className="strength-caption"><span>Password strength</span><strong>{password ? ['Add a few details', 'Getting there', 'Almost strong', 'Strong', 'Excellent'][passed] : 'Not set'}</strong></div>
      <div className="strength-meter" aria-hidden="true">{checks.map(([rule, valid]) => <i className={valid ? 'passed' : ''} key={rule} />)}</div>
      <ul>{checks.map(([rule, valid]) => <li className={valid ? 'passed' : ''} key={rule}><span>{valid ? '✓' : '○'}</span>{rule}</li>)}</ul>
    </div>
  )
}

interface WorkspaceProps {
  details: StoryDetails
  user: User
  presence: Array<{ id: string; displayName: string }>
  liveCursor: { displayName: string; position: number } | null
  onCursor: (position: number) => void
  onStorySaved: (story: Story) => void
  onRefresh: () => Promise<void>
  onDelete: () => Promise<void>
}

function StoryWorkspace({ details, user, presence, liveCursor, onCursor, onStorySaved, onRefresh, onDelete }: WorkspaceProps) {
  const { story } = details
  const [draft, setDraft] = useState({
    version: story.version,
    revision: 0,
    title: story.title,
    content: story.content,
    visibility: story.visibility,
    commentsEnabled: story.commentsEnabled,
  })
  const draftValues = draft.version === story.version ? draft : {
    version: story.version,
    revision: draft.revision,
    title: story.title,
    content: story.content,
    visibility: story.visibility,
    commentsEnabled: story.commentsEnabled,
  }
  const { title, content, visibility, commentsEnabled } = draftValues
  const [saveLabel, setSaveLabel] = useState('All changes saved')
  const [saveError, setSaveError] = useState('')
  const [commentDraft, setCommentDraft] = useState('')
  const [commentError, setCommentError] = useState('')
  const [collaboratorEmail, setCollaboratorEmail] = useState('')
  const [collaboratorMessage, setCollaboratorMessage] = useState('')
  const [editingComment, setEditingComment] = useState<number | null>(null)
  const [editCommentDraft, setEditCommentDraft] = useState('')
  const [shareLabel, setShareLabel] = useState('Share')
  const savingRef = useRef(false)

  function updateDraft(changes: Partial<Pick<Story, 'title' | 'content' | 'visibility' | 'commentsEnabled'>>) {
    setDraft((current) => ({
      ...draftValues,
      ...changes,
      version: story.version,
      revision: current.revision + 1,
    }))
  }

  useEffect(() => {
    if (!details.canEdit || saveError || savingRef.current) return
    const dirty = title !== story.title || content !== story.content
      || visibility !== story.visibility || commentsEnabled !== story.commentsEnabled
    if (!dirty) return
    const timer = window.setTimeout(async () => {
      if (savingRef.current) return
      savingRef.current = true
      const savedRevision = draftValues.revision
      setSaveLabel('Saving…')
      try {
        const { story: saved } = await api.updateStory(story, { title, content, visibility, commentsEnabled })
        setDraft((current) => ({
          ...current,
          version: saved.version,
          ...(current.revision === savedRevision
            ? { title: saved.title, content: saved.content, visibility: saved.visibility, commentsEnabled: saved.commentsEnabled }
            : {}),
        }))
        setSaveLabel('All changes saved')
        onStorySaved(saved)
      } catch (error) {
        setSaveLabel('Not saved')
        setSaveError(error instanceof Error ? error.message : 'Could not save changes.')
      } finally {
        savingRef.current = false
      }
    }, 800)
    return () => window.clearTimeout(timer)
  }, [commentsEnabled, content, details.canEdit, draft.revision, draft.version, draftValues.revision, onStorySaved, saveError, story, title, visibility])

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCommentError('')
    try {
      await api.addComment(story.id, commentDraft)
      setCommentDraft('')
      await onRefresh()
    } catch (error) {
      setCommentError(error instanceof Error ? error.message : 'Could not add comment.')
    }
  }

  async function saveComment(commentId: number) {
    try {
      await api.updateComment(story.id, commentId, editCommentDraft)
      setEditingComment(null)
      await onRefresh()
    } catch (error) {
      setCommentError(error instanceof Error ? error.message : 'Could not update comment.')
    }
  }

  async function removeComment(commentId: number) {
    try {
      await api.deleteComment(story.id, commentId)
      await onRefresh()
    } catch (error) {
      setCommentError(error instanceof Error ? error.message : 'Could not delete comment.')
    }
  }

  async function restoreVersion(version: StoryVersion) {
    if (!window.confirm(`Restore version ${version.version}? This creates a new version.`)) return
    try {
      const { story: restored } = await api.restoreVersion(story.id, version.version)
      onStorySaved(restored)
      await onRefresh()
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Could not restore version.')
    }
  }

  async function inviteCollaborator(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const { collaborator } = await api.addCollaborator(story.id, collaboratorEmail)
      setCollaboratorEmail('')
      setCollaboratorMessage(`${collaborator.display_name} can now edit this story.`)
      await onRefresh()
    } catch (error) {
      setCollaboratorMessage(error instanceof Error ? error.message : 'Could not add collaborator.')
    }
  }

  async function removeCollaborator(userId: number, displayName: string) {
    try {
      await api.removeCollaborator(story.id, userId)
      setCollaboratorMessage(`${displayName} was removed.`)
      await onRefresh()
    } catch (error) {
      setCollaboratorMessage(error instanceof Error ? error.message : 'Could not remove collaborator.')
    }
  }

  async function shareStory() {
    if (visibility !== 'public') {
      setSaveError('Set the story visibility to public before sharing its link.')
      return
    }

    const url = `${window.location.origin}/?story=${story.id}`
    try {
      if (navigator.share) await navigator.share({ title, url })
      else {
        await navigator.clipboard.writeText(url)
        setShareLabel('Link copied')
        window.setTimeout(() => setShareLabel('Share'), 1800)
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') setSaveError('Could not share this story.')
    }
  }

  async function reloadStory() {
    setSaveError('')
    setSaveLabel('Loading latest version…')
    await onRefresh()
  }

  return (
    <div className="story-workspace">
      <div className="editor-toolbar">
        <div className="breadcrumbs"><span>YOUR LIBRARY</span><b>/</b><span>{story.visibility === 'public' ? 'SHARED STORY' : 'PRIVATE DRAFT'}</span></div>
        <div className="toolbar-actions">
          <span className="save-state"><i className={saveLabel === 'All changes saved' ? 'saved-dot' : 'pending-dot'} />{saveLabel}</span>
          <button type="button" className="share-button" onClick={shareStory}>{shareLabel}</button>
          {story.ownerId === user.id && <button type="button" className="icon-button delete-story" onClick={() => void onDelete()} aria-label="Delete story" title="Delete story">⌫</button>}
        </div>
      </div>
      {saveError &&       <p className="form-error save-error" role="alert">{saveError} <button type="button" className="text-button" onClick={() => void reloadStory()}>Reload story</button></p>}
      <div className="editor-layout">
        <section className="writing-column">
          <div className="story-heading">
            <div className="story-kicker"><span>{story.category.toUpperCase()}</span><span>·</span><span>STORY NO. {String(story.id).padStart(3, '0')}</span><span>·</span><span>VERSION {story.version}</span></div>
            <input
              className="story-title-input"
              aria-label="Story title"
              value={title}
              maxLength={120}
              readOnly={!details.canEdit}
              onChange={(event) => updateDraft({ title: event.target.value })}
              placeholder="Give your story a title…"
            />
            <div className="story-byline">Written by <strong>{story.ownerName}</strong><span>·</span>{new Date(story.updatedAt).toLocaleDateString()}</div>
          </div>
          <div className="collab-banner">
            <div className="collab-avatars">
              <Avatar user={user} />
              {presence.slice(0, 2).map((person) => <span className="presence-avatar" title={`${person.displayName} is here`} key={person.id}>{person.displayName.charAt(0).toUpperCase()}</span>)}
            </div>
            <span>{presence.length ? `${presence.map((person) => person.displayName).join(', ')} ${presence.length === 1 ? 'is' : 'are'} here now` : 'Your words are saved as you write'}</span>
            <span className="live-tag"><i /> LIVE</span>
          </div>
          <label className="sr-only" htmlFor="story-content">Story text</label>
          <textarea
            id="story-content"
            className="story-editor"
            value={content}
            readOnly={!details.canEdit}
            maxLength={100000}
            onChange={(event) => updateDraft({ content: event.target.value })}
            onSelect={(event) => onCursor(event.currentTarget.selectionStart)}
            placeholder={details.canEdit ? 'Every story begins with a first line…' : 'This story is waiting for its next line.'}
          />
          <div className="editor-foot">
            <span>{content.trim() ? content.trim().split(/\s+/).length : 0} WORDS</span>
            <span>{details.canEdit ? 'CHANGES SAVE AUTOMATICALLY' : 'READ ONLY'}</span>
          </div>
          {liveCursor && <p className="cursor-note" role="status">{liveCursor.displayName} is writing around character {liveCursor.position}.</p>}
          {details.canEdit && (
            <div className="story-settings">
              <label className="select-setting">Visibility
                <select value={visibility} disabled={story.ownerId !== user.id} onChange={(event) => updateDraft({ visibility: event.target.value as Story['visibility'] })}>
                  <option value="private">Private</option><option value="public">Public — anyone with the link</option>
                </select>
              </label>
              {story.ownerId === user.id && (
                <label className="toggle-setting"><input type="checkbox" checked={commentsEnabled} onChange={(event) => updateDraft({ commentsEnabled: event.target.checked })} /> Allow comments</label>
              )}
            </div>
          )}
          {story.ownerId === user.id && (
            <Collaborators details={details} email={collaboratorEmail} message={collaboratorMessage}
              onEmail={setCollaboratorEmail} onInvite={inviteCollaborator} onRemove={removeCollaborator} />
          )}
        </section>

        <aside className="detail-column">
          <section className="detail-card">
            <div className="detail-heading"><span>THE MARGIN</span><span className="comment-count">{details.comments.length.toString().padStart(2, '0')}</span></div>
            <h3>Notes & thoughts</h3>
            {!story.commentsEnabled && <p className="subtle-message">Comments are turned off for this story.</p>}
            <div className="comments-list">
              {details.comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  currentUser={user}
                  isOwner={story.ownerId === user.id}
                  editing={editingComment === comment.id}
                  editText={editCommentDraft}
                  onStartEdit={() => { setEditingComment(comment.id); setEditCommentDraft(comment.body) }}
                  onEditText={setEditCommentDraft}
                  onSave={() => void saveComment(comment.id)}
                  onCancel={() => setEditingComment(null)}
                  onDelete={() => void removeComment(comment.id)}
                />
              ))}
              {details.comments.length === 0 && story.commentsEnabled && <p className="subtle-message">No notes yet. Leave the first one.</p>}
            </div>
            {story.commentsEnabled && (
              <form className="comment-form" onSubmit={submitComment}>
                <textarea aria-label="Write a note" value={commentDraft} maxLength={2000} onChange={(event) => setCommentDraft(event.target.value)} placeholder="Leave a thoughtful note…" required />
                {commentError && <p className="form-error" role="alert">{commentError}</p>}
                <button type="submit" className="text-button">Add a note</button>
              </form>
            )}
          </section>

          <section className="detail-card history-card">
            <div className="detail-heading"><span>THE ARCHIVE</span><span>{details.versions.length.toString().padStart(2, '0')}</span></div>
            <h3>Version history</h3>
            <div className="version-list">
              {details.versions.map((version) => (
                <div className="version-row" key={version.id}>
                  <div className="version-marker" />
                  <div><strong>Version {version.version}</strong><small>{version.editor_name} · {new Date(version.created_at).toLocaleString()}</small></div>
                  {details.canEdit && version.version !== story.version && <button type="button" className="restore-button" onClick={() => void restoreVersion(version)}>Restore</button>}
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

interface CommentCardProps {
  comment: Comment
  currentUser: User
  isOwner: boolean
  editing: boolean
  editText: string
  onStartEdit: () => void
  onEditText: (value: string) => void
  onSave: () => void
  onCancel: () => void
  onDelete: () => void
}

function CommentCard({ comment, currentUser, isOwner, editing, editText, onStartEdit, onEditText, onSave, onCancel, onDelete }: CommentCardProps) {
  return (
    <article className="comment-item">
      <div className="comment-avatar">{comment.display_name?.charAt(0).toUpperCase() || 'W'}</div>
      <div className="comment-body">
        <div className="comment-meta"><strong>{comment.display_name || 'Writer'}</strong><time>{new Date(comment.created_at).toLocaleDateString()}</time></div>
        {editing ? (
          <div className="comment-edit">
            <textarea value={editText} maxLength={2000} onChange={(event) => onEditText(event.target.value)} />
            <button type="button" className="text-button" onClick={onSave}>Save</button><button type="button" className="quiet-button" onClick={onCancel}>Cancel</button>
          </div>
        ) : <p>{comment.body}</p>}
        {(comment.user_id === currentUser.id || isOwner) && !editing && (
          <div className="comment-actions">
            {comment.user_id === currentUser.id && <button type="button" onClick={onStartEdit}>Edit</button>}
            <button type="button" onClick={onDelete}>Delete</button>
          </div>
        )}
      </div>
    </article>
  )
}

interface CollaboratorsProps {
  details: StoryDetails
  email: string
  message: string
  onEmail: (email: string) => void
  onInvite: (event: FormEvent<HTMLFormElement>) => void
  onRemove: (userId: number, name: string) => void
}

function Collaborators({ details, email, message, onEmail, onInvite, onRemove }: CollaboratorsProps) {
  return (
    <section className="collaborator-section">
      <div className="detail-heading"><span>YOUR WRITING CIRCLE</span><span>{details.collaborators.length}</span></div>
      {details.collaborators.map((person) => (
        <div className="collaborator-row" key={person.id}>
          <span className="comment-avatar">{person.display_name.charAt(0).toUpperCase()}</span>
          <span><strong>{person.display_name}</strong><small>{person.email}</small></span>
          <button type="button" className="quiet-button" onClick={() => onRemove(person.id, person.display_name)} aria-label={`Remove ${person.display_name}`}>×</button>
        </div>
      ))}
      <form className="invite-form" onSubmit={onInvite}>
        <label className="sr-only" htmlFor="collaborator-email">Collaborator email</label>
        <input id="collaborator-email" type="email" required value={email} onChange={(event) => onEmail(event.target.value)} placeholder="Invite by email" />
        <button type="submit" className="text-button">Invite writer</button>
      </form>
      {message && <p className="subtle-message" role="status">{message}</p>}
    </section>
  )
}

interface ProfileDialogProps {
  user: User
  onClose: () => void
  onSaved: (user: User) => void
  onError: (message: string) => void
}

function ProfileDialog({ user, onClose, onSaved, onError }: ProfileDialogProps) {
  const [displayName, setDisplayName] = useState(user.displayName)
  const [bio, setBio] = useState(user.bio)
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      onError('Choose an image file to upload.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      onError('Choose an image smaller than 5 MB.')
      return
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    if (!cloudName || !uploadPreset) {
      onError('Configure the Cloudinary cloud name and unsigned upload preset in .env to upload an avatar.')
      return
    }

    const formData = new FormData()
    formData.set('file', file)
    formData.set('upload_preset', uploadPreset)
    setUploading(true)
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, {
        method: 'POST',
        body: formData,
      })
      const result = await response.json() as { secure_url?: string; error?: { message?: string } }
      if (!response.ok || !result.secure_url) {
        throw new Error(result.error?.message || 'Cloudinary could not upload this image.')
      }
      setAvatarUrl(result.secure_url)
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Could not upload avatar.')
    } finally {
      setUploading(false)
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    try {
      const { user: saved } = await api.updateProfile({ displayName, bio, avatarUrl })
      onSaved(saved)
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Could not update profile.')
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="profile-dialog" role="dialog" aria-modal="true" aria-labelledby="profile-title">
        <button type="button" className="dialog-close" onClick={onClose} aria-label="Close profile">×</button>
        <p className="eyebrow">YOUR PAGE IN THE CIRCLE</p>
        <h2 id="profile-title">A little about you.</h2>
        <form className="profile-form" onSubmit={submit}>
          <label>Display name<input value={displayName} minLength={2} maxLength={40} required onChange={(event) => setDisplayName(event.target.value)} /></label>
          <label>About you <span className="char-count">{bio.length}/280</span><textarea value={bio} maxLength={280} onChange={(event) => setBio(event.target.value)} placeholder="What do you like to write?" /></label>
          <label>Avatar image URL<input type="url" value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} placeholder="https://example.com/image.jpg" /></label>
          <label className="avatar-upload">Or upload an image (5 MB max)<input type="file" accept="image/*" disabled={uploading} onChange={uploadAvatar} />{uploading && <span>Uploading to Cloudinary…</span>}</label>
          <button className="primary-button" disabled={saving} type="submit">{saving ? 'Saving…' : 'Save profile'}</button>
        </form>
      </section>
    </div>
  )
}

function Avatar({ user }: { user: Pick<User, 'displayName' | 'avatarUrl'> }) {
  return user.avatarUrl
    ? <img className="avatar-image" src={user.avatarUrl} alt="" />
    : <span className="avatar-fallback" aria-hidden="true">{user.displayName.charAt(0).toUpperCase()}</span>
}

export default App
