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

async function getTasksByProject(projectId, ownerId, filters = {}) {
  const projectCheck = 'SELECT id FROM projects WHERE id = $1 AND owner_id = $2';
  const checkRes = await db.query(projectCheck, [projectId, ownerId]);
  if (checkRes.rows.length === 0) return null;

  const queryClauses = ['project_id = $1'];
  const values = [projectId];
  let index = 2;

  if (filters.status) {
    queryClauses.push(`status = $${index}`);
    values.push(filters.status);
    index++;
  }

  if (filters.priority) {
    queryClauses.push(`priority = $${index}`);
    values.push(filters.priority);
    index++;
  }

  const queryText = `
    SELECT * FROM tasks
    WHERE ${queryClauses.join(' AND ')}
    ORDER BY created_at DESC
  `;
  
  const { rows } = await db.query(queryText, values);
  return rows;
}

async function getTaskByIdAndOwner(taskId, ownerId) {
  const queryText = `
    SELECT t.* FROM tasks t
    JOIN projects p ON t.project_id = p.id
    WHERE t.id = $1 AND p.owner_id = $2
  `;
  const { rows } = await db.query(queryText, [taskId, ownerId]);
  return rows[0];
}

async function updateTask(id, fields, ownerId) {
  const task = await getTaskByIdAndOwner(id, ownerId);
  if (!task) return null;

  const allowedFields = ['title', 'description', 'status', 'priority', 'assigned_to'];
  const updateClauses = [];
  const values = [];
  let index = 1;

  for (const field of allowedFields) {
    if (fields[field] !== undefined) {
      updateClauses.push(`${field} = $${index}`);
      values.push(fields[field]);
      index++;
    }
  }

  if (updateClauses.length === 0) return task;

  values.push(id);
  const queryText = `
    UPDATE tasks
    SET ${updateClauses.join(', ')}
    WHERE id = $${index}
    RETURNING *
  `;
  
  const { rows } = await db.query(queryText, values);
  return rows[0];
}

async function deleteTask(id, ownerId) {
  const task = await getTaskByIdAndOwner(id, ownerId);
  if (!task) return null;

  const queryText = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
  const { rows } = await db.query(queryText, [id]);
  return rows[0];
}

module.exports = {
  createTask,
  getTasksByProject,
  getTaskByIdAndOwner,
  updateTask,
  deleteTask
};
