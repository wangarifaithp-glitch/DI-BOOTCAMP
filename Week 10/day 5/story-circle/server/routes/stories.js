const express = require('express')
const { pool } = require('../db')
const { requireAuth } = require('../auth')

const router = express.Router()
router.use(requireAuth)

function toStory(row) {
  return {
    id: Number(row.id),
    title: row.title,
    content: row.content,
    category: row.category || 'Fiction',
    visibility: row.visibility,
    version: row.version,
    commentsEnabled: row.comments_enabled,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ownerId: Number(row.owner_id),
    ownerName: row.owner_name,
  }
}

async function canRead(storyId, userId) {
  const { rows } = await pool.query(
    `SELECT s.visibility, s.owner_id,
      EXISTS (SELECT 1 FROM story_collaborators c WHERE c.story_id = s.id AND c.user_id = $2) AS is_collaborator
     FROM stories s WHERE s.id = $1`,
    [storyId, userId],
  )
  return rows[0] && (rows[0].visibility === 'public' || String(rows[0].owner_id) === String(userId) || rows[0].is_collaborator)
}

async function canEdit(storyId, userId) {
  const { rows } = await pool.query(
    `SELECT s.owner_id,
      EXISTS (SELECT 1 FROM story_collaborators c WHERE c.story_id = s.id AND c.user_id = $2) AS is_collaborator
     FROM stories s WHERE s.id = $1`,
    [storyId, userId],
  )
  return rows[0] && (String(rows[0].owner_id) === String(userId) || rows[0].is_collaborator)
}

router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT s.*, u.display_name AS owner_name FROM stories s
     JOIN users u ON u.id = s.owner_id
     WHERE s.visibility = 'public' OR s.owner_id = $1
       OR EXISTS (SELECT 1 FROM story_collaborators c WHERE c.story_id = s.id AND c.user_id = $1)
     ORDER BY s.updated_at DESC, s.id DESC`,
    [req.user.id],
  )
  return res.json({ stories: rows.map(toStory) })
})

router.post('/', async (req, res) => {
  const title = typeof req.body.title === 'string' ? req.body.title.trim() : ''
  const content = typeof req.body.content === 'string' ? req.body.content : ''
  const visibility = req.body.visibility === 'public' ? 'public' : 'private'
  if (title.length < 1 || title.length > 120) return res.status(400).json({ error: 'Title must be 1 to 120 characters.' })
  if (content.length > 100000) return res.status(400).json({ error: 'Story must be 100,000 characters or fewer.' })

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { rows } = await client.query(
      `INSERT INTO stories (owner_id, title, content, visibility) VALUES ($1, $2, $3, $4)
       RETURNING *, (SELECT display_name FROM users WHERE id = $1) AS owner_name`,
      [req.user.id, title, content, visibility],
    )
    await client.query(
      'INSERT INTO story_versions (story_id, version, title, content, editor_id) VALUES ($1, 1, $2, $3, $4)',
      [rows[0].id, title, content, req.user.id],
    )
    await client.query('COMMIT')
    return res.status(201).json({ story: toStory(rows[0]) })
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
})

router.get('/:storyId', async (req, res) => {
  const storyId = Number(req.params.storyId)
  if (!Number.isSafeInteger(storyId) || storyId < 1) return res.status(400).json({ error: 'Invalid story id.' })
  if (!(await canRead(storyId, req.user.id))) return res.status(404).json({ error: 'Story not found.' })

  const [{ rows: storyRows }, { rows: comments }, { rows: versions }, { rows: collaborators }] = await Promise.all([
    pool.query(
      `SELECT s.*, u.display_name AS owner_name FROM stories s JOIN users u ON u.id = s.owner_id WHERE s.id = $1`,
      [storyId],
    ),
    pool.query(
      `SELECT c.id, c.body, c.created_at, c.updated_at, c.user_id, u.display_name, u.avatar_url
       FROM comments c JOIN users u ON u.id = c.user_id WHERE c.story_id = $1 ORDER BY c.created_at`,
      [storyId],
    ),
    pool.query(
      `SELECT v.id, v.version, v.title, v.content, v.created_at, u.display_name AS editor_name
       FROM story_versions v JOIN users u ON u.id = v.editor_id
       WHERE v.story_id = $1 ORDER BY v.version DESC LIMIT 30`,
      [storyId],
    ),
    pool.query(
      `SELECT u.id, u.display_name, u.email, u.avatar_url FROM story_collaborators c
       JOIN users u ON u.id = c.user_id WHERE c.story_id = $1`,
      [storyId],
    ),
  ])
  return res.json({
    story: toStory(storyRows[0]),
    comments: comments.map((comment) => ({
      ...comment,
      id: Number(comment.id),
      user_id: Number(comment.user_id),
    })),
    versions: versions.map((version) => ({ ...version, id: Number(version.id) })),
    collaborators: collaborators.map((collaborator) => ({ ...collaborator, id: Number(collaborator.id) })),
    canEdit: await canEdit(storyId, req.user.id),
  })
})

router.patch('/:storyId', async (req, res) => {
  const storyId = Number(req.params.storyId)
  if (!Number.isSafeInteger(storyId) || storyId < 1) return res.status(400).json({ error: 'Invalid story id.' })
  if (!(await canEdit(storyId, req.user.id))) return res.status(404).json({ error: 'Story not found.' })

  const { rows: currentRows } = await pool.query(
    'SELECT owner_id, visibility, comments_enabled FROM stories WHERE id = $1',
    [storyId],
  )
  const isOwner = String(currentRows[0].owner_id) === String(req.user.id)
  const title = typeof req.body.title === 'string' ? req.body.title.trim() : ''
  const content = typeof req.body.content === 'string' ? req.body.content : ''
  const visibility = isOwner
    ? (req.body.visibility === 'public' ? 'public' : 'private')
    : currentRows[0].visibility
  const commentsEnabled = isOwner ? req.body.commentsEnabled !== false : currentRows[0].comments_enabled
  const expectedVersion = Number(req.body.version)
  if (title.length < 1 || title.length > 120) return res.status(400).json({ error: 'Title must be 1 to 120 characters.' })
  if (content.length > 100000) return res.status(400).json({ error: 'Story must be 100,000 characters or fewer.' })
  if (!Number.isSafeInteger(expectedVersion) || expectedVersion < 1) return res.status(400).json({ error: 'A valid story version is required.' })

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { rows } = await client.query(
      `UPDATE stories SET title = $1, content = $2, visibility = $3, comments_enabled = $4,
        version = version + 1, updated_at = NOW()
       WHERE id = $5 AND version = $6 RETURNING *,
       (SELECT display_name FROM users WHERE id = owner_id) AS owner_name`,
      [title, content, visibility, commentsEnabled, storyId, expectedVersion],
    )
    if (!rows[0]) {
      await client.query('ROLLBACK')
      const current = await pool.query('SELECT version, title, content FROM stories WHERE id = $1', [storyId])
      return res.status(409).json({ error: 'This story changed elsewhere. Reload the latest version before editing.', current: current.rows[0] })
    }
    await client.query(
      'INSERT INTO story_versions (story_id, version, title, content, editor_id) VALUES ($1, $2, $3, $4, $5)',
      [storyId, rows[0].version, title, content, req.user.id],
    )
    await client.query('COMMIT')
    const story = toStory(rows[0])
    req.app.locals.io.to(`story:${storyId}`).emit('story:changed', { story, editorId: req.user.id })
    return res.json({ story })
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
})

router.delete('/:storyId', async (req, res) => {
  const storyId = Number(req.params.storyId)
  const { rowCount } = await pool.query('DELETE FROM stories WHERE id = $1 AND owner_id = $2', [storyId, req.user.id])
  if (!rowCount) return res.status(404).json({ error: 'Story not found or you are not its owner.' })
  req.app.locals.io.to(`story:${storyId}`).emit('story:deleted', { storyId })
  return res.status(204).end()
})

router.post('/:storyId/comments', async (req, res) => {
  const storyId = Number(req.params.storyId)
  const body = typeof req.body.body === 'string' ? req.body.body.trim() : ''
  if (body.length < 1 || body.length > 2000) return res.status(400).json({ error: 'Comment must be 1 to 2,000 characters.' })
  if (!(await canRead(storyId, req.user.id))) return res.status(404).json({ error: 'Story not found.' })
  const { rows: settings } = await pool.query('SELECT comments_enabled FROM stories WHERE id = $1', [storyId])
  if (!settings[0].comments_enabled) return res.status(403).json({ error: 'Comments are turned off for this story.' })
  const { rows } = await pool.query(
    `INSERT INTO comments (story_id, user_id, body) VALUES ($1, $2, $3)
     RETURNING id, body, created_at, updated_at, user_id`,
    [storyId, req.user.id, body],
  )
  req.app.locals.io.to(`story:${storyId}`).emit('comment:created', rows[0])
  return res.status(201).json({ comment: rows[0] })
})

router.patch('/:storyId/comments/:commentId', async (req, res) => {
  const storyId = Number(req.params.storyId)
  const commentId = Number(req.params.commentId)
  const body = typeof req.body.body === 'string' ? req.body.body.trim() : ''
  if (body.length < 1 || body.length > 2000) return res.status(400).json({ error: 'Comment must be 1 to 2,000 characters.' })
  if (!(await canRead(storyId, req.user.id))) return res.status(404).json({ error: 'Story not found.' })
  const { rows } = await pool.query(
    `UPDATE comments SET body = $1, updated_at = NOW()
     WHERE id = $2 AND story_id = $3 AND user_id = $4
     RETURNING id, body, created_at, updated_at, user_id`,
    [body, commentId, storyId, req.user.id],
  )
  if (!rows[0]) return res.status(404).json({ error: 'Comment not found or you are not its author.' })
  req.app.locals.io.to(`story:${storyId}`).emit('comment:updated', rows[0])
  return res.json({ comment: rows[0] })
})

router.delete('/:storyId/comments/:commentId', async (req, res) => {
  const storyId = Number(req.params.storyId)
  const commentId = Number(req.params.commentId)
  if (!(await canRead(storyId, req.user.id))) return res.status(404).json({ error: 'Story not found.' })
  const { rowCount } = await pool.query(
    `DELETE FROM comments c USING stories s
     WHERE c.id = $1 AND c.story_id = $2 AND s.id = c.story_id
       AND (c.user_id = $3 OR s.owner_id = $3)`,
    [commentId, storyId, req.user.id],
  )
  if (!rowCount) return res.status(404).json({ error: 'Comment not found or you do not have permission to remove it.' })
  req.app.locals.io.to(`story:${storyId}`).emit('comment:deleted', { commentId })
  return res.status(204).end()
})

router.post('/:storyId/versions/:version/restore', async (req, res) => {
  const storyId = Number(req.params.storyId)
  const version = Number(req.params.version)
  if (!(await canEdit(storyId, req.user.id))) return res.status(404).json({ error: 'Story not found.' })
  const { rows: snapshots } = await pool.query(
    'SELECT title, content FROM story_versions WHERE story_id = $1 AND version = $2',
    [storyId, version],
  )
  if (!snapshots[0]) return res.status(404).json({ error: 'Version not found.' })
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { rows } = await client.query(
      `UPDATE stories SET title = $1, content = $2, version = version + 1, updated_at = NOW()
       WHERE id = $3 RETURNING *, (SELECT display_name FROM users WHERE id = owner_id) AS owner_name`,
      [snapshots[0].title, snapshots[0].content, storyId],
    )
    await client.query(
      'INSERT INTO story_versions (story_id, version, title, content, editor_id) VALUES ($1, $2, $3, $4, $5)',
      [storyId, rows[0].version, rows[0].title, rows[0].content, req.user.id],
    )
    await client.query('COMMIT')
    const story = toStory(rows[0])
    req.app.locals.io.to(`story:${storyId}`).emit('story:changed', { story, editorId: req.user.id })
    return res.json({ story })
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
})

router.post('/:storyId/collaborators', async (req, res) => {
  const storyId = Number(req.params.storyId)
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  const { rows: owners } = await pool.query('SELECT owner_id FROM stories WHERE id = $1', [storyId])
  if (!owners[0] || String(owners[0].owner_id) !== String(req.user.id)) {
    return res.status(404).json({ error: 'Story not found or you are not its owner.' })
  }
  const { rows: users } = await pool.query(
    'SELECT id, email, display_name FROM users WHERE email = $1 AND id <> $2',
    [email, req.user.id],
  )
  if (!users[0]) return res.status(404).json({ error: 'No other account was found with that email.' })
  await pool.query(
    'INSERT INTO story_collaborators (story_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [storyId, users[0].id],
  )
  req.app.locals.io.to(`user:${users[0].id}`).emit('story:shared', { storyId })
  return res.status(201).json({ collaborator: users[0] })
})

router.delete('/:storyId/collaborators/:userId', async (req, res) => {
  const { rowCount } = await pool.query(
    `DELETE FROM story_collaborators c USING stories s
     WHERE c.story_id = $1 AND c.user_id = $2 AND s.id = c.story_id AND s.owner_id = $3`,
    [req.params.storyId, req.params.userId, req.user.id],
  )
  if (!rowCount) return res.status(404).json({ error: 'Collaborator not found or you are not the owner.' })
  req.app.locals.io.to(`user:${req.params.userId}`).emit('story:unshared', { storyId: Number(req.params.storyId) })
  return res.status(204).end()
})

module.exports = router
