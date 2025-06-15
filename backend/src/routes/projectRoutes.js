const express = require('express');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All project routes require authentication
router.use(protect);

// Routes for /api/projects
router.route('/')
  .get(getProjects)
  .post(createProject);

// Routes for /api/projects/:id
router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;