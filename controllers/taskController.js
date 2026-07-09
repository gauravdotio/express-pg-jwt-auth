const taskDb = require('../db/taskDb');
const projectDb = require('../db/projectDb');

async function getProjectTasks(req, res, next) {
  try {
    const { projectId } = req.params;
    const tasks = await taskDb.getTasksByProject(projectId, req.user.id);
    if (tasks === null) {
      return res.status(403).json({ error: 'Unauthorized project access or project not found' });
    }
    return res.json({ tasks });
  } catch (error) {
    next(error);
  }
}

async function createProjectTask(req, res, next) {
  try {
    const { projectId } = req.params;
    const { title, description, status, priority, assignedTo } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    // Verify project belongs to authenticated user
    const project = await projectDb.getProjectById(projectId, req.user.id);
    if (!project) {
      return res.status(403).json({ error: 'Unauthorized project access or project not found' });
    }

    const task = await taskDb.createTask(title, description, status, priority, projectId, assignedTo);
    return res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProjectTasks,
  createProjectTask
};
