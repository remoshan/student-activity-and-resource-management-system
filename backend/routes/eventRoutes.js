/**
 * Event Routes
 * RESTful API endpoints for Event CRUD operations
 */

const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

router.get('/', async (req, res) => {
  try {
    const { category, date } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (date) {
      query.date = { $gte: new Date(date) };
    }

    const events = await Event.find(query).sort({ date: 1 });
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve events',
      message: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid event ID format'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve event',
      message: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, category, date, description, organizer } = req.body;

    if (!title || !category || !date || !organizer || !organizer.name) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, category, date, and organizer.name are required'
      });
    }

    const event = new Event({
      title,
      category,
      date: new Date(date),
      description: description || '',
      organizer
    });

    const savedEvent = await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: savedEvent
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to create event',
      message: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, category, date, description, organizer } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    if (title) event.title = title;
    if (category) event.category = category;
    if (date) event.date = new Date(date);
    if (description !== undefined) event.description = description;
    if (organizer) event.organizer = organizer;

    const updatedEvent = await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid event ID format'
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to update event',
      message: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.status(204).send();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid event ID format'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to delete event',
      message: error.message
    });
  }
});

module.exports = router;
