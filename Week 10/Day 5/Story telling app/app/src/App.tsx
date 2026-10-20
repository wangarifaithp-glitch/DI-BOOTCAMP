import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from './app/hooks'
import {
  addCollaborator,
  addComment,
  createStory,
  deleteComment,
  deleteStory,
  editComment,
  restoreVersion,
  saveVersion,
  setActiveUser,
  setSelectedStory,
  toggleComments,
  toggleReaction,
  updateProfile,
  updateStory,
  type Story,
  type StoryComment,
} from './features/workspaceSlice'
import './App.css'

type StoryFilter = 'all' | 'mine' | 'shared'

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(date))
}

function Avatar({ userId, small = false }: { userId: string; small?: boolean }) {
  const user = useAppSelector((state) => state.workspace.users.find((item) => item.id === userId))
  if (!user) return null
  return (
    <span className={`avatar${small ? ' avatar--small' : ''}`} style={{ background: user.color }} title={user.name}>
      {user.avatar}
    </span>
  )
}

function App() {
  const dispatch = useAppDispatch()
  const workspace = useAppSelector((state) => state.workspace)
  const { users, stories, comments, activeUserId, selectedStoryId } = workspace
  const activeUser = users.find((user) => user.id === activeUserId) ?? users[0]
  const selectedStory = stories.find((story) => story.id === selectedStoryId)
  const [filter, setFilter] = useState<StoryFilter>('all')
  const [rightTab, setRightTab] = useState<'comments' | 'versions'>('comments')
  const [commentText, setCommentText] = useState('')
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editCommentText, setEditCommentText] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileName, setProfileName] = useState(activeUser.name)
  const [profileBio, setProfileBio] = useState(activeUser.bio)
  const [notice, setNotice] = useState('')
  const [collabOpen, setCollabOpen] = useState(false)
  const [storySearch, setStorySearch] = useState('')
  const discoverStories = useMemo(() => {
    const query = storySearch.trim().toLocaleLowerCase()
    return stories.filter((story) => {
      const author = users.find((user) => user.id === story.authorId)
      return !query || `${story.title} ${story.genre ?? ''} ${author?.name ?? ''}`.toLocaleLowerCase().includes(query)
    })
  }, [stories, users, storySearch])

  const visibleStories = useMemo(() => {
    if (filter === 'mine') return stories.filter((story) => story.authorId === activeUserId)
    if (filter === 'shared') return stories.filter((story) => story.collaboratorIds.includes(activeUserId) && story.authorId !== activeUserId)
    return stories.filter((story) => story.authorId === activeUserId || story.collaboratorIds.includes(activeUserId) || story.id.startsWith('story-'))
  }, [stories, filter, activeUserId])

  const storyComments = comments.filter((comment) => comment.storyId === selectedStoryId)

  useEffect(() => {
    const sharedStory = new URLSearchParams(window.location.search).get('story')
    if (sharedStory && stories.some((story) => story.id === sharedStory)) {
      dispatch(setSelectedStory(sharedStory))
    }
  }, [dispatch, stories])

  useEffect(() => {
    if (notice) {
      const timeout = window.setTimeout(() => setNotice(''), 2500)
      return () => window.clearTimeout(timeout)
    }
  }, [notice])

  function selectStory(story: Story) {
    dispatch(setSelectedStory(story.id))
    setRightTab('comments')
    const url = new URL(window.location.href)
    url.searchParams.set('story', story.id)
    window.history.replaceState({}, '', url)
  }

  function openProfileEditor() {
    setProfileName(activeUser.name)
    setProfileBio(activeUser.bio)
    setProfileOpen(!profileOpen)
  }

  function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedStory) return
    dispatch(addComment({ storyId: selectedStory.id, text: commentText }))
    setCommentText('')
  }

  function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    dispatch(updateProfile({ name: profileName, bio: profileBio }))
    setProfileOpen(false)
    setNotice('Profile updated')
  }

  async function shareStory() {
    if (!selectedStory) return
    const url = new URL(window.location.href)
    url.searchParams.set('story', selectedStory.id)
    try {
      await navigator.clipboard.writeText(url.toString())
      setNotice('Story link copied')
    } catch {
      window.prompt('Copy your story link:', url.toString())
    }
  }

  function makeVersion() {
    if (!selectedStory) return
    const label = window.prompt('Name this version:', `Revision ${selectedStory.versions.length + 1}`)
    if (label === null) return
    dispatch(saveVersion({ storyId: selectedStory.id, label }))
    setRightTab('versions')
    setNotice('Version saved')
  }

  function addDemoCollaborator(userId: string) {
    if (!selectedStory) return
    dispatch(addCollaborator(userId))
    setCollabOpen(false)
    setNotice('Collaborator added')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Fable home">
          <span className="brand-mark" aria-hidden="true">f</span>
          <span>fable<span className="brand-dot">.</span></span>
        </a>
        <div className="topbar-center"><span className="live-dot" /> THE SHARED STORY ROOM</div>
        <div className="topbar-user">
          <label htmlFor="switch-profile">Viewing as</label>
          <select id="switch-profile" value={activeUserId} onChange={(event) => dispatch(setActiveUser(event.target.value))}>
            {users.map((user) => <option value={user.id} key={user.id}>{user.name}</option>)}
          </select>
          <button className="top-avatar-button" type="button" aria-label="Edit your profile" onClick={openProfileEditor}>
            <Avatar userId={activeUserId} />
          </button>
        </div>
      </header>

      <section className="discovery">
        <div className="discovery-intro">
          <div>
            <p className="eyebrow">A COMMUNITY OF IMAGINATIONS</p>
            <h1>Stories are better <em>together.</em></h1>
            <p>Step into a world someone is still writing. Find a spark, leave a note, add your voice.</p>
          </div>
          <div className="discovery-side">
            <label className="story-search">
              <span aria-hidden="true">⌕</span>
              <input aria-label="Find a story" value={storySearch} onChange={(event) => setStorySearch(event.target.value)} placeholder="Find a story or genre..." />
            </label>
            <button className="discovery-create" type="button" onClick={() => dispatch(createStory())}>＋ Start a story</button>
          </div>
        </div>
        <div className="shelf-heading">
          <div><span className="shelf-spark">✦</span><strong>Open story shelf</strong><span className="shelf-count">{discoverStories.length} stories in progress</span></div>
          <span className="shelf-hint">PICK A STORY TO STEP INSIDE <span aria-hidden="true">→</span></span>
        </div>
        {discoverStories.length > 0 ? (
          <div className="story-shelf">
            {discoverStories.map((story, index) => {
              const author = users.find((user) => user.id === story.authorId)
              const excerpt = story.content.trim().split(/\s+/).slice(0, 19).join(' ')
              return (
                <button
                  className={`shelf-card ${story.cover ?? `cover--${index % 6}`}${story.id === selectedStoryId ? ' shelf-card--selected' : ''}`}
                  type="button"
                  key={story.id}
                  onClick={() => selectStory(story)}
                >
                  <span className="shelf-card-top"><span>{story.genre ?? 'Collaborative fiction'}</span><span className="shelf-card-mark" aria-hidden="true">{['✳', '✦', '❋', '✧'][index % 4]}</span></span>
                  <span className="shelf-card-title">{story.title || 'Untitled story'}</span>
                  <span className="shelf-card-excerpt">{excerpt}{story.content.trim().split(/\s+/).length > 19 ? '…' : ''}</span>
                  <span className="shelf-card-footer">
                    <span className="shelf-author"><Avatar userId={story.authorId} small /> {author?.name.split(' ')[0]}</span>
                    <span className="shelf-contributors">{story.collaboratorIds.length + 1} voices</span>
                  </span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="shelf-no-results">No stories match that search. Try another title or genre.</div>
        )}
      </section>

      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-label">YOUR WRITING SPACE</div>
          <button className="new-story-button" type="button" onClick={() => dispatch(createStory())}>
            <span>＋</span> New story
          </button>

          <div className="sidebar-section">
            <div className="sidebar-heading">Stories <span>{visibleStories.length}</span></div>
            <div className="story-filters" role="group" aria-label="Filter stories">
              <button className={filter === 'all' ? 'story-filter active' : 'story-filter'} onClick={() => setFilter('all')} type="button">All stories</button>
              <button className={filter === 'mine' ? 'story-filter active' : 'story-filter'} onClick={() => setFilter('mine')} type="button">Written by me</button>
              <button className={filter === 'shared' ? 'story-filter active' : 'story-filter'} onClick={() => setFilter('shared')} type="button">Shared with me</button>
            </div>
            <div className="story-list">
              {visibleStories.map((story) => {
                const author = users.find((user) => user.id === story.authorId)
                return (
                  <button
                    type="button"
                    key={story.id}
                    className={story.id === selectedStoryId ? 'story-nav-item selected' : 'story-nav-item'}
                    onClick={() => selectStory(story)}
                  >
                    <span className="story-nav-icon">✎</span>
                    <span className="story-nav-copy">
                      <strong>{story.title || 'Untitled story'}</strong>
                      <small>{story.authorId === activeUserId ? 'You' : author?.name.split(' ')[0]} · {story.collaboratorIds.length ? `${story.collaboratorIds.length + 1} writers` : 'Just you'}</small>
                    </span>
                  </button>
                )
              })}
              {visibleStories.length === 0 && <p className="sidebar-empty">Nothing here yet.</p>}
            </div>
          </div>

          <div className="sidebar-bottom">
            <div className="sidebar-label">WRITING TOGETHER</div>
            <div className="team-avatars">
              {users.filter((user) => user.id !== activeUserId).map((user) => <Avatar key={user.id} userId={user.id} small />)}
              <span className="team-caption">Your writing circle</span>
            </div>
            <button className="profile-edit-link" type="button" onClick={openProfileEditor}>
              <Avatar userId={activeUserId} small /><span>Edit your profile</span><span className="chevron">›</span>
            </button>
          </div>
        </aside>

        <section className="editor-column">
          {selectedStory ? (
            <>
              <div className="editor-toolbar">
                <div className="breadcrumbs"><span>Stories</span><span>/</span><strong>{selectedStory.title || 'Untitled story'}</strong></div>
                <div className="toolbar-actions">
                  <span className="save-status"><span /> Saved</span>
                  <button className="toolbar-button" type="button" onClick={shareStory} title="Copy shareable link">↗ <span>Share</span></button>
                  {selectedStory.authorId === activeUserId && (
                    <button className="toolbar-button toolbar-button--delete" type="button" onClick={() => {
                      if (window.confirm('Delete this story and its comments?')) dispatch(deleteStory(selectedStory.id))
                    }} title="Delete story">⌫</button>
                  )}
                </div>
              </div>

              <div className="story-editor">
                <div className="story-meta">
                  <span className="story-type"><span>✦</span> COLLABORATIVE STORY</span>
                  <span>Last edited {formatDate(selectedStory.updatedAt)}</span>
                </div>
                <input
                  aria-label="Story title"
                  className="title-input"
                  value={selectedStory.title}
                  maxLength={120}
                  onChange={(event) => dispatch(updateStory({ id: selectedStory.id, title: event.target.value }))}
                  placeholder="Give your story a title..."
                />
                <div className="author-line">
                  <span>Started by</span><Avatar userId={selectedStory.authorId} small />
                  <strong>{users.find((user) => user.id === selectedStory.authorId)?.name}</strong>
                  <span className="author-separator">·</span>
                  <span>{selectedStory.collaboratorIds.length + 1} contributors</span>
                </div>
                <textarea
                  aria-label="Story text"
                  className="story-textarea"
                  value={selectedStory.content}
                  onChange={(event) => dispatch(updateStory({ id: selectedStory.id, content: event.target.value }))}
                  placeholder="Once upon a time... Start writing and invite your circle in."
                  spellCheck
                />
                <div className="editor-bottom">
                  <span>{selectedStory.content.trim() ? selectedStory.content.trim().split(/\s+/).length : 0} words</span>
                  <span>Changes sync across open tabs</span>
                </div>
              </div>

              <div className="collaborator-bar">
                <div className="collaborator-stack">
                  <span className="collaborator-label">WRITING CIRCLE</span>
                  <div className="avatar-stack">
                    <Avatar userId={selectedStory.authorId} small />
                    {selectedStory.collaboratorIds.map((id) => <Avatar key={id} userId={id} small />)}
                  </div>
                  <span className="online-label"><span /> {selectedStory.collaboratorIds.length + 1} here</span>
                </div>
                <div className="collab-actions">
                  <div className="collab-menu-wrap">
                    <button className="invite-button" type="button" onClick={() => setCollabOpen(!collabOpen)}>＋ Invite</button>
                    {collabOpen && (
                      <div className="collab-menu">
                        <strong>Invite to this story</strong>
                        {users.filter((user) => user.id !== selectedStory.authorId && !selectedStory.collaboratorIds.includes(user.id)).map((user) => (
                          <button type="button" key={user.id} onClick={() => addDemoCollaborator(user.id)}>
                            <Avatar userId={user.id} small /> {user.name} <span>Invite</span>
                          </button>
                        ))}
                        {users.every((user) => user.id === selectedStory.authorId || selectedStory.collaboratorIds.includes(user.id)) && <small>Everyone is already in this story.</small>}
                      </div>
                    )}
                  </div>
                  <button className="version-button" type="button" onClick={makeVersion}>↺ Save version</button>
                </div>
              </div>
            </>
          ) : (
            <div className="blank-editor">
              <span>✎</span><h2>Your next story starts here</h2><p>Create a story or choose one from your writing space.</p>
              <button className="new-story-button" type="button" onClick={() => dispatch(createStory())}>＋ New story</button>
            </div>
          )}
        </section>

        <aside className="right-panel">
          {profileOpen ? (
            <section className="profile-panel">
              <div className="panel-heading"><div><p className="eyebrow">YOUR PROFILE</p><h2>Make it yours</h2></div><button type="button" className="close-button" aria-label="Close profile editor" onClick={() => setProfileOpen(false)}>×</button></div>
              <form onSubmit={handleProfileSubmit} className="profile-form">
                <Avatar userId={activeUserId} />
                <label htmlFor="profileName">Display name</label>
                <input id="profileName" value={profileName} maxLength={40} onChange={(event) => setProfileName(event.target.value)} required />
                <label htmlFor="profileBio">A little about you</label>
                <textarea id="profileBio" value={profileBio} maxLength={120} rows={4} onChange={(event) => setProfileBio(event.target.value)} />
                <button className="primary-button" type="submit">Save profile</button>
              </form>
              <p className="profile-handle">@{activeUser.handle}</p>
            </section>
          ) : (
            <>
              <div className="right-tabs" role="tablist" aria-label="Story side panel">
                <button type="button" role="tab" aria-selected={rightTab === 'comments'} className={rightTab === 'comments' ? 'right-tab active' : 'right-tab'} onClick={() => setRightTab('comments')}>Comments <span>{storyComments.length}</span></button>
                <button type="button" role="tab" aria-selected={rightTab === 'versions'} className={rightTab === 'versions' ? 'right-tab active' : 'right-tab'} onClick={() => setRightTab('versions')}>History <span>{selectedStory?.versions.length ?? 0}</span></button>
              </div>
              {rightTab === 'comments' ? (
                <section className="comments-panel">
                  <div className="panel-heading">
                    <div><p className="eyebrow">THE WRITING ROOM</p><h2>Conversation</h2></div>
                    {selectedStory && <button className={selectedStory.commentsEnabled ? 'toggle-comments enabled' : 'toggle-comments'} type="button" onClick={() => dispatch(toggleComments(selectedStory.id))} title="Toggle comments">{selectedStory.commentsEnabled ? '● On' : '○ Off'}</button>}
                  </div>
                  {selectedStory?.commentsEnabled ? (
                    <>
                      <div className="comment-list">
                        {storyComments.map((comment) => (
                          <CommentItem
                            comment={comment}
                            key={comment.id}
                            activeUserId={activeUserId}
                            onReact={(emoji) => dispatch(toggleReaction({ commentId: comment.id, emoji }))}
                            onDelete={() => dispatch(deleteComment(comment.id))}
                            onEdit={() => {
                              setEditingComment(comment.id)
                              setEditCommentText(comment.text)
                            }}
                            editing={editingComment === comment.id}
                            editText={editCommentText}
                            setEditText={setEditCommentText}
                            onSaveEdit={() => {
                              dispatch(editComment({ commentId: comment.id, text: editCommentText }))
                              setEditingComment(null)
                            }}
                            onCancelEdit={() => setEditingComment(null)}
                          />
                        ))}
                        {storyComments.length === 0 && <p className="comments-empty">No notes yet. Leave the first one for your writing circle.</p>}
                      </div>
                      {selectedStory && (
                        <form className="comment-form" onSubmit={handleCommentSubmit}>
                          <label htmlFor="commentText">Leave a note</label>
                          <textarea id="commentText" rows={3} value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Share a thought or idea..." maxLength={500} required />
                          <div className="comment-form-bottom"><span>{commentText.length}/500</span><button type="submit" disabled={!commentText.trim()}>Post note ↗</button></div>
                        </form>
                      )}
                    </>
                  ) : (
                    <div className="comments-disabled"><span>◌</span><strong>Conversation paused</strong><p>The story owner has turned off comments for now.</p></div>
                  )}
                </section>
              ) : (
                <section className="history-panel">
                  <div className="panel-heading"><div><p className="eyebrow">STORY TIMELINE</p><h2>Version history</h2></div></div>
                  {!selectedStory?.versions.length ? (
                    <div className="history-empty"><span>↺</span><strong>No saved versions yet</strong><p>Save a snapshot to keep a point-in-time copy of this story.</p><button type="button" onClick={makeVersion} disabled={!selectedStory}>Save first version</button></div>
                  ) : (
                    <div className="version-list">
                      {selectedStory.versions.map((version) => (
                        <article className="version-item" key={version.id}>
                          <div className="version-marker" />
                          <div className="version-info"><strong>{version.label}</strong><span>{users.find((user) => user.id === version.authorId)?.name} · {formatDate(version.createdAt)}</span></div>
                          <button type="button" title={`Restore ${version.label}`} onClick={() => {
                            if (window.confirm(`Restore "${version.label}"? Your current draft will be saved in history first.`)) {
                              dispatch(restoreVersion({ storyId: selectedStory!.id, versionId: version.id }))
                              setNotice('Version restored')
                            }
                          }}>↶</button>
                        </article>
                      ))}
                    </div>
                  )}
                  <button className="save-version-full" type="button" onClick={makeVersion} disabled={!selectedStory}>＋ Save current draft</button>
                </section>
              )}
            </>
          )}
        </aside>
      </div>
      <footer className="app-footer"><span>fable.</span><span>Your stories are saved on this device and sync across open tabs.</span><span className="demo-pill">LOCAL PROTOTYPE</span></footer>
      {notice && <div className="toast" role="status">{notice}</div>}
    </main>
  )
}

interface CommentItemProps {
  comment: StoryComment
  activeUserId: string
  onReact: (emoji: string) => void
  onDelete: () => void
  onEdit: () => void
  editing: boolean
  editText: string
  setEditText: (text: string) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
}

function CommentItem({
  comment,
  activeUserId,
  onReact,
  onDelete,
  onEdit,
  editing,
  editText,
  setEditText,
  onSaveEdit,
  onCancelEdit,
}: CommentItemProps) {
  const author = useAppSelector((state) => state.workspace.users.find((user) => user.id === comment.authorId))
  return (
    <article className="comment-item">
      <div className="comment-avatar"><Avatar userId={comment.authorId} small /></div>
      <div className="comment-body">
        <div className="comment-author"><strong>{author?.name}</strong><span>{formatDate(comment.createdAt)}</span></div>
        {editing ? (
          <div className="edit-comment"><textarea value={editText} rows={3} onChange={(event) => setEditText(event.target.value)} />
            <div><button type="button" onClick={onCancelEdit}>Cancel</button><button type="button" onClick={onSaveEdit}>Save</button></div>
          </div>
        ) : <p>{comment.text}</p>}
        <div className="comment-actions">
          {['✨', '💛'].map((emoji) => {
            const reactors = comment.reactions[emoji] ?? []
            return <button className={reactors.includes(activeUserId) ? 'reaction reacted' : 'reaction'} key={emoji} type="button" onClick={() => onReact(emoji)}>{emoji} {reactors.length || ''}</button>
          })}
          {comment.authorId === activeUserId && !editing && (
            <span className="comment-owner-actions">
              <button type="button" onClick={onEdit}>Edit</button>
              <button type="button" onClick={onDelete}>Delete</button>
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

export default App
