const mongoose = require('mongoose');

const AIModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a model name'],
    trim: true,
    unique: true
  },
  provider: {
    type: String,
    required: [true, 'Please provide a provider name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  maxTokens: {
    type: Number,
    default: 4096
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Reference to the user who created this AI model (if it's a custom model)
  // For system-defined models, this can be null
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
});

module.exports = mongoose.model('AIModel', AIModelSchema);