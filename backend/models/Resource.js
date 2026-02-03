/**
 * Resource Model
 * Represents campus resources (equipment, rooms, facilities)
 */

const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  type: {
    type: String,
    required: true,
    enum: ['Equipment', 'Room', 'Facility', 'Vehicle', 'Technology', 'Other'],
    default: 'Other'
  },
  availability: {
    type: String,
    required: true,
    enum: ['Available', 'In Use', 'Maintenance', 'Reserved'],
    default: 'Available'
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  location: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for common queries
resourceSchema.index({ type: 1 });
resourceSchema.index({ availability: 1 });

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
