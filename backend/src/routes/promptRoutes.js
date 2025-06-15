const express = require('express');
const {
  createPrompt,
  getPrompts,
  getPrompt,
  updatePrompt,
  deletePrompt,
  usePrompt
} = require('../controllers/promptController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All prompt routes require authentication
router.use(protect);

// Routes for /api/prompts
router.route('/')
  .get(getPrompts)
  .post(createPrompt);

// Routes for /api/prompts/:id
router.route('/:id')
  .get(getPrompt)
  .put(updatePrompt)
  .delete(deletePrompt);

// Route for incrementing usage count
router.route('/:id/use')
  .put(usePrompt);

module.exports = router;