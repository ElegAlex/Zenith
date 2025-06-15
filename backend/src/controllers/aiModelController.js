const AIModel = require('../models/AIModel');
const handleServerError = require('../utils/handleServerError');

// @desc    Create a new AI model
// @route   POST /api/ai-models
// @access  Private
exports.createAIModel = async (req, res) => {
  try {
    const { name, provider, description, maxTokens } = req.body;

    // Create AI model
    const aiModel = await AIModel.create({
      name,
      provider,
      description,
      maxTokens,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: aiModel
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

// @desc    Get all AI models (including system models and user's custom models)
// @route   GET /api/ai-models
// @access  Private
exports.getAIModels = async (req, res) => {
  try {
    // Get both system models (createdBy is null) and user's custom models
    const aiModels = await AIModel.find({
      $or: [
        { createdBy: null }, // System models
        { createdBy: req.user.id } // User's custom models
      ]
    });

    res.status(200).json({
      success: true,
      count: aiModels.length,
      data: aiModels
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

// @desc    Get single AI model
// @route   GET /api/ai-models/:id
// @access  Private
exports.getAIModel = async (req, res) => {
  try {
    const aiModel = await AIModel.findById(req.params.id);

    if (!aiModel) {
      return res.status(404).json({
        success: false,
        error: 'AI model not found'
      });
    }

    // Check if it's a system model or user's custom model
    if (aiModel.createdBy && aiModel.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this AI model'
      });
    }

    res.status(200).json({
      success: true,
      data: aiModel
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

// @desc    Update AI model
// @route   PUT /api/ai-models/:id
// @access  Private
exports.updateAIModel = async (req, res) => {
  try {
    let aiModel = await AIModel.findById(req.params.id);

    if (!aiModel) {
      return res.status(404).json({
        success: false,
        error: 'AI model not found'
      });
    }

    // Check if it's a system model (can't update system models)
    if (!aiModel.createdBy) {
      return res.status(403).json({
        success: false,
        error: 'Cannot update system AI models'
      });
    }

    // Check if user owns the AI model
    if (aiModel.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this AI model'
      });
    }

    // Update AI model
    aiModel = await AIModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: aiModel
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

// @desc    Delete AI model
// @route   DELETE /api/ai-models/:id
// @access  Private
exports.deleteAIModel = async (req, res) => {
  try {
    const aiModel = await AIModel.findById(req.params.id);

    if (!aiModel) {
      return res.status(404).json({
        success: false,
        error: 'AI model not found'
      });
    }

    // Check if it's a system model (can't delete system models)
    if (!aiModel.createdBy) {
      return res.status(403).json({
        success: false,
        error: 'Cannot delete system AI models'
      });
    }

    // Check if user owns the AI model
    if (aiModel.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this AI model'
      });
    }

    await aiModel.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

// @desc    Seed system AI models
// @route   POST /api/ai-models/seed
// @access  Private (admin only in a real app)
exports.seedAIModels = async (req, res) => {
  try {
    // Sample AI models
    const systemModels = [
      {
        name: 'GPT-4',
        provider: 'OpenAI',
        description: 'Advanced language model with improved reasoning',
        maxTokens: 8192
      },
      {
        name: 'GPT-3.5 Turbo',
        provider: 'OpenAI',
        description: 'Efficient language model optimized for chat',
        maxTokens: 4096
      },
      {
        name: 'Claude 2',
        provider: 'Anthropic',
        description: 'Helpful, harmless, and honest AI assistant',
        maxTokens: 100000
      },
      {
        name: 'Llama 2',
        provider: 'Meta',
        description: 'Open source large language model',
        maxTokens: 4096
      }
    ];

    // Insert models if they don't exist
    for (const model of systemModels) {
      await AIModel.findOneAndUpdate(
        { name: model.name },
        model,
        { upsert: true, new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'System AI models seeded successfully'
    });
  } catch (error) {
    handleServerError(res, error);
  }
};