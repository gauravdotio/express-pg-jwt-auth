const express = require('express');
const {
  getProjectTasks,
  createProjectTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const authenticate = require('../middleware/auth');

// We have two routers merging:
// 1. Nested: /api/projects/:projectId/tasks (for GET/POST)
// 2. Base: /api/tasks/:id (for PUT/DELETE)
const router = express.Router({ mergeParams: true });

router.use(authenticate);

// Get tasks and post tasks nested inside projects
router.route('/')
  .get(getProjectTasks)
  .post(createProjectTask);

// Update/Delete routes directly on task id
router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
