const projectDb = require('../db/projectDb');

async function getAllProjects(req, res, next) {
  try {
    const projects = await projectDb.getProjectsByOwner(req.user.id);
    return res.json({ projects });
  } catch (error) {
    next(error);
  }
}

async function getProject(req, res, next) {
  try {
    const project = await projectDb.getProjectById(req.params.id, req.user.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json({ project });
  } catch (error) {
    next(error);
  }
}

async function createProject(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }
    const project = await projectDb.createProject(name, description, req.user.id);
    return res.status(201).json({ message: 'Project created', project });
  } catch (error) {
    next(error);
  }
}

async function updateProject(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }
    const project = await projectDb.updateProject(req.params.id, name, description, req.user.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found or unauthorized' });
    }
    return res.json({ message: 'Project updated', project });
  } catch (error) {
    next(error);
  }
}

async function deleteProject(req, res, next) {
  try {
    const project = await projectDb.deleteProject(req.params.id, req.user.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found or unauthorized' });
    }
    return res.json({ message: 'Project deleted successfully', project });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};
