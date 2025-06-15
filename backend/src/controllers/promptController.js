const Prompt = require('../models/Prompt');
const Project = require('../models/Project');
const AIModel = require('../models/AIModel');
const handleServerError = require('../utils/handleServerError');

// @desc    Create a new prompt
// @route   POST /api/prompts
// @access  Private
exports.createPrompt = async (req, res) => {
  try {
    const { title, content, project, aiModel, parameters, tags } = req.body;

    // Validate project if provided
    if (project) {
      const projectExists = await Project.findById(project);
      if (!projectExists) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }
      
      // Check if user owns the project
      if (projectExists.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to use this project'
        });
      }
    }

    // Validate AI model
    const aiModelExists = await AIModel.findById(aiModel);
    if (!aiModelExists) {
      return res.status(404).json({
        success: false,
        error: 'AI model not found'
      });
    }

    // Create prompt
    const prompt = await Prompt.create({
      title,
      content,
      project,
      aiModel,
      parameters,
      tags,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: prompt
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

// @desc    Get all prompts for a user
// @route   GET /api/prompts
// @access  Private
exports.getPrompts = async (req, res) => {
  try {
    let query = { user: req.user.id };
    
    // Filter by project if provided
    if (req.query.project) {
      query.project = req.query.project;
    }
    
    // Filter by AI model if provided
    if (req.query.aiModel) {
      query.aiModel = req.query.aiModel;
    }
    
    // Filter by tags if provided
    if (req.query.tag) {
      query.tags = { $in: [req.query.tag] };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const prompts = await Prompt.find(query)
      .populate('project', 'name')
      .populate('aiModel', 'name provider')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Prompt.countDocuments(query);

    res.status(200).json({
      success: true,
      count: prompts.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: prompts
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

// @desc    Get single prompt
// @route   GET /api/prompts/:id
// @access  Private
exports.getPrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id)
      .populate('project', 'name')
      .populate('aiModel', 'name provider');

    if (!prompt) {
      return res.status(404).json({
        success: false,
        error: 'Prompt not found'
      });
    }

    // Make sure user owns the prompt
    if (prompt.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this prompt'
      });
    }

    res.status(200).json({
      success: true,
      data: prompt
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

// @desc    Update prompt
// @route   PUT /api/prompts/:id
// @access  Private
exports.updatePrompt = async (req, res) => {
  try {
    let prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({
        success: false,
        error: 'Prompt not found'
      });
    }

    // Make sure user owns the prompt
    if (prompt.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this prompt'
      });
    }

    // Validate project if provided
    if (req.body.project) {
      const projectExists = await Project.findById(req.body.project);
      if (!projectExists) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }
      
      // Check if user owns the project
      if (projectExists.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to use this project'
        });
      }
    }

    // Validate AI model if provided
    if (req.body.aiModel) {
      const aiModelExists = await AIModel.findById(req.body.aiModel);
      if (!aiModelExists) {
        return res.status(404).json({
          success: false,
          error: 'AI model not found'
        });
      }
    }

    // Update prompt
    prompt = await Prompt.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('project', 'name')
      .populate('aiModel', 'name provider');

    res.status(200).json({
      success: true,
      data: prompt
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

// @desc    Delete prompt
// @route   DELETE /api/prompts/:id
// @access  Private
exports.deletePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({
        success: false,
        error: 'Prompt not found'
      });
    }

    // Make sure user owns the prompt
    if (prompt.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this prompt'
      });
    }

    await prompt.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

// @desc    Increment prompt usage count
// @route   PUT /api/prompts/:id/use
// @access  Private
exports.usePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({
        success: false,
        error: 'Prompt not found'
      });
    }

    // Make sure user owns the prompt
    if (prompt.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to use this prompt'
      });
    }

    // Increment usage count
    await prompt.incrementUsage();

    res.status(200).json({
      success: true,
      data: prompt
    });
  } catch (error) {
    handleServerError(res, error);
  }
};