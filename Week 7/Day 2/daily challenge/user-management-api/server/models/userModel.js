const { pool } = require('../config/db');

const publicUserFields = 'id, email, username, first_name, last_name, created_at';

async function createUser(user, passwordHash) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `INSERT INTO users (email, username, first_name, last_name)
       VALUES ($1, $2, $3, $4) RETURNING ${publicUserFields}`,
      [user.email, user.username, user.first_name, user.last_name]
    );
    const createdUser = result.rows[0];
    await client.query(
      'INSERT INTO hashpwd (user_id, username, password) VALUES ($1, $2, $3)',
      [createdUser.id, createdUser.username, passwordHash]
    );
    await client.query('COMMIT');
    return createdUser;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function findUserForLogin(username) {
  const result = await pool.query(
    `SELECT u.${publicUserFields.replaceAll(', ', ', u.')}, h.password
     FROM users u JOIN hashpwd h ON h.user_id = u.id
     WHERE u.username = $1`,
    [username]
  );
  return result.rows[0];
}

async function getAllUsers() {
  const result = await pool.query(
    `SELECT ${publicUserFields} FROM users ORDER BY id`
  );
  return result.rows;
}

async function getUserById(id) {
  const result = await pool.query(
    `SELECT ${publicUserFields} FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

async function updateUser(id, fields, passwordHash) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const assignments = [];
    const values = [];

    for (const [field, value] of Object.entries(fields)) {
      values.push(value);
      assignments.push(`${field} = $${values.length}`);
    }

    let user;
    if (assignments.length) {
      values.push(id);
      const result = await client.query(
        `UPDATE users SET ${assignments.join(', ')} WHERE id = $${values.length}
         RETURNING ${publicUserFields}`,
        values
      );
      user = result.rows[0];
    } else {
      const result = await client.query(
        `SELECT ${publicUserFields} FROM users WHERE id = $1`,
        [id]
      );
      user = result.rows[0];
    }
    if (!user) {
      await client.query('ROLLBACK');
      return undefined;
    }

    if (fields.username !== undefined) {
      await client.query('UPDATE hashpwd SET username = $1 WHERE user_id = $2', [user.username, id]);
    }
    if (passwordHash) {
      await client.query('UPDATE hashpwd SET password = $1 WHERE user_id = $2', [passwordHash, id]);
    }

    await client.query('COMMIT');
    return user;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { createUser, findUserForLogin, getAllUsers, getUserById, updateUser };