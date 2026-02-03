/**
 * Student Routes
 * RESTful API endpoints for Student CRUD operations
 */

const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Event = require('../models/Event');

router.get('/', async (req, res) => {
  try {
    const students = await Student.find().populate('registeredEvents', 'title date category');
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve students',
      message: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('registeredEvents', 'title date category');

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid student ID format'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve student',
      message: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, registeredEvents } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name and email are required'
      });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        error: 'Student with this email already exists'
      });
    }

    const student = new Student({
      name,
      email,
      registeredEvents: registeredEvents || []
    });

    const savedStudent = await student.save();

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: savedStudent
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
      error: 'Failed to create student',
      message: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, email, registeredEvents } = req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    if (name) student.name = name;
    if (email) {
      if (email !== student.email) {
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
          return res.status(400).json({
            success: false,
            error: 'Student with this email already exists'
          });
        }
      }
      student.email = email;
    }
    if (registeredEvents !== undefined) {
      for (const eventId of registeredEvents) {
        const event = await Event.findById(eventId);
        if (!event) {
          return res.status(400).json({
            success: false,
            error: `Event with ID ${eventId} not found`
          });
        }
      }
      student.registeredEvents = registeredEvents;
    }

    const updatedStudent = await student.save();

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid student ID format'
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
      error: 'Failed to update student',
      message: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    res.status(204).send();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid student ID format'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to delete student',
      message: error.message
    });
  }
});

module.exports = router;
