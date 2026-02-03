/**
 * Event Model
 * Represents campus events with embedded organizer information
 */

const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  contact: {
    type: String,
    trim: true
  }
}, { _id: false });

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  category: {
    type: String,
    required: true,
    enum: ['Academic', 'Sports', 'Cultural', 'Workshop', 'Seminar', 'Social', 'Other'],
    default: 'Other'
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  organizer: {
    type: organizerSchema,
    required: true
  }
}, {
  timestamps: true
});

eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
