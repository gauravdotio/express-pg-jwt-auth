const db = require('./index');
const bcrypt = require('bcryptjs');

async function createUser(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const queryText = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at
  `;
  const values = [name, email.toLowerCase(), hashedPassword];
  const { rows } = await db.query(queryText, values);
  return rows[0];
}

async function findUserByEmail(email) {
  const queryText = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await db.query(queryText, [email.toLowerCase()]);
  return rows[0];
}

async function findUserById(id) {
  const queryText = 'SELECT id, name, email, created_at FROM users WHERE id = $1';
  const { rows } = await db.query(queryText, [id]);
  return rows[0];
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
};
