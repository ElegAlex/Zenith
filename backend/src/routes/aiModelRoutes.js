const express = require('express');
const {
  createAIModel,
  getAIModels,
  getAIModel,
  updateAIModel,
  deleteAIModel,
  seedAIModels
} = require('../controllers/aiModelController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All AI model routes require authentication
router.use(protect);

// Routes for /api/ai-models
router.route('/')
  .get(getAIModels)
  .post(createAIModel);

// Route for seeding system AI models
router.route('/seed')
  .post(seedAIModels);

// Routes for /api/ai-models/:id
router.route('/:id')
  .get(getAIModel)
  .put(updateAIModel)
  .delete(deleteAIModel);

module.exports = router;