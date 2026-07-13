const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameHindi: {
    type: String,
    trim: true
  },
  emoji: {
    type: String,
    default: '🌾'
  },
  season: {
    type: String,
    required: true,
    enum: ['Rabi', 'Kharif', 'Both']
  },
  description: {
    type: String,
    trim: true
  },
  diseases: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Crop', cropSchema);
