const mongoose = require('mongoose');

const PromptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the prompt'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please provide the prompt content'],
    trim: true
  },
  // Reference to the user who owns this prompt
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Reference to the project this prompt belongs to (optional)
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: false
  },
  // Reference to the AI model this prompt is designed for
  aiModel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AIModel',
    required: true
  },
  // Optional parameters for the prompt
  parameters: {
    temperature: {
      type: Number,
      min: 0,
      max: 2,
      default: 0.7
    },
    maxTokens: {
      type: Number,
      min: 1,
      default: 256
    },
    topP: {
      type: Number,
      min: 0,
      max: 1,
      default: 1
    },
    frequencyPenalty: {
      type: Number,
      min: 0,
      max: 2,
      default: 0
    },
    presencePenalty: {
      type: Number,
      min: 0,
      max: 2,
      default: 0
    }
  },
  // Tags for organizing and searching prompts
  tags: [{
    type: String,
    trim: true
  }],
  // Track usage statistics
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsed: {
    type: Date
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
PromptSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Increment usage count when prompt is used
PromptSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.lastUsed = Date.now();
  return this.save();
};

module.exports = mongoose.model('Prompt', PromptSchema);