const express = require('express');
const { getProjectTasks, createProjectTask } = require('../controllers/taskController');
const authenticate = require('../middleware/auth');

const router = express.Router({ mergeParams: true }); // enables inheriting projectId from project router

router.use(authenticate);

router.get('/', getProjectTasks);
router.post('/', createProjectTask);

module.exports = router;
