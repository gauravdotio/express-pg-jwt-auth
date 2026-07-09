const db = require('./index');

async function createTask(title, description, status, priority, projectId, assignedTo) {
  const queryText = `
    INSERT INTO tasks (title, description, status, priority, project_id, assigned_to)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const values = [
    title,
    description,
    status || 'todo',
    priority || 'medium',
    projectId,
    assignedTo || null
  ];
  const { rows } = await db.query(queryText, values);
  return rows[0];
}

async function getTasksByProject(projectId, ownerId) {
  // Confirm ownership of the project first
  const projectCheck = 'SELECT id FROM projects WHERE id = $1 AND owner_id = $2';
  const checkRes = await db.query(projectCheck, [projectId, ownerId]);
  if (checkRes.rows.length === 0) return null;

  const queryText = 'SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC';
  const { rows } = await db.query(queryText, [projectId]);
  return rows;
}

module.exports = {
  createTask,
  getTasksByProject
};
