const express = require('express');
const router = express.Router();
const Course = require('../models/courseModel');
const auth = require('../middleware/auth');

// Create a Course
router.post('/', auth, async (req, res) => {
  const { course_name, course_description, course_video } = req.body;

  try {
    const course = new Course({
      course_name,
      course_description,
      course_video,
      userId: req.userId 
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update course by ID
router.put('/:id', auth, async (req, res) => {
  const { course_name, course_description, course_video } = req.body;
  const courseId = req.params.id;

  if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ msg: 'Invalid course ID' });
  }

  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { course_name, course_description, course_video },
      { new: true } 
    );

    if (!updatedCourse) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    res.json(updatedCourse);
  } catch (err) {
    console.error('Course update error:', err);
    res.status(500).json({ msg: 'Server error while updating course' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const courseId = req.params.id;

  try {
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.json({ msg: 'Course deleted successfully' });
  } catch (err) {
    console.error('Delete course error:', err);
    res.status(500).json({ msg: 'Server error while deleting course' });
  }
});

// GET courses created by logged-in user
router.get('/my', auth, async (req, res) => {
  try {
    const courses = await Course.find({ userId: req.userId });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch your courses' });
  }
});

// GET all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('userId', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch courses' });
  }
});

module.exports = router;
