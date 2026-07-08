const db = require('./index');

async function createProject(name, description, ownerId) {
  const queryText = `
    INSERT INTO projects (name, description, owner_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const { rows } = await db.query(queryText, [name, description, ownerId]);
  return rows[0];
}

async function getProjectsByOwner(ownerId) {
  const queryText = 'SELECT * FROM projects WHERE owner_id = $1 ORDER BY created_at DESC';
  const { rows } = await db.query(queryText, [ownerId]);
  return rows;
}

async function getProjectById(id, ownerId) {
  const queryText = 'SELECT * FROM projects WHERE id = $1 AND owner_id = $2';
  const { rows } = await db.query(queryText, [id, ownerId]);
  return rows[0];
}

async function updateProject(id, name, description, ownerId) {
  const queryText = `
    UPDATE projects
    SET name = $1, description = $2
    WHERE id = $3 AND owner_id = $4
    RETURNING *
  `;
  const { rows } = await db.query(queryText, [name, description, id, ownerId]);
  return rows[0];
}

async function deleteProject(id, ownerId) {
  const queryText = 'DELETE FROM projects WHERE id = $1 AND owner_id = $2 RETURNING *';
  const { rows } = await db.query(queryText, [id, ownerId]);
  return rows[0];
}

module.exports = {
  createProject,
  getProjectsByOwner,
  getProjectById,
  updateProject,
  deleteProject
};
