/**
 * Resource Routes
 * RESTful API endpoints for Resource CRUD operations
 */

const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

router.get('/', async (req, res) => {
  try {
    const { type, availability } = req.query;
    const query = {};

    if (type) {
      query.type = type;
    }

    if (availability) {
      query.availability = availability;
    }

    const resources = await Resource.find(query).sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve resources',
      message: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid resource ID format'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve resource',
      message: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, type, availability, description, location } = req.body;

    if (!name || !type || !availability) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, type, and availability are required'
      });
    }

    const resource = new Resource({
      name,
      type,
      availability,
      description: description || '',
      location: location || ''
    });

    const savedResource = await resource.save();

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: savedResource
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
      error: 'Failed to create resource',
      message: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, type, availability, description, location } = req.body;

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    if (name) resource.name = name;
    if (type) resource.type = type;
    if (availability) resource.availability = availability;
    if (description !== undefined) resource.description = description;
    if (location !== undefined) resource.location = location;

    const updatedResource = await resource.save();

    res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      data: updatedResource
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid resource ID format'
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
      error: 'Failed to update resource',
      message: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    res.status(204).send();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid resource ID format'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to delete resource',
      message: error.message
    });
  }
});

module.exports = router;
