const express = require('express');
const router = express.Router();
const Enroll = require('../models/enrollmentModel');
const auth = require('../middleware/auth');


// Enroll in a course
router.post('/:id', auth, async (req, res) => {
  const { courseId } = req.body;

  try {
    const existingEnroll = await Enroll.findOne({ userId: req.userId, courseId });
    if (existingEnroll) return res.status(400).json({ msg: 'Already enrolled' });

    const enroll = new Enroll({ userId: req.userId, courseId });
    await enroll.save();

    res.status(201).json(enroll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all enrollments for a user with total enrolled students per course
router.get('/my-courses', auth, async (req, res) => {
  try {
    const enrollments = await Enroll.find({ userId: req.userId })
      .populate({
        path: 'courseId',
        select: 'course_name course_description course_video',
        model: 'Course',
      });

    // Filter out enrollments where the course has been deleted (i.e., courseId is null)
    const validEnrollments = enrollments.filter(enroll => enroll.courseId);

    // Add enrolled_students count for each valid course
    const enriched = await Promise.all(
      validEnrollments.map(async (enroll) => {
        const count = await Enroll.countDocuments({ courseId: enroll.courseId._id });
        return {
          ...enroll._doc,
          courseId: {
            ...enroll.courseId._doc,
            enrolled_students: count,
          },
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error("Error in /my-courses:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin: Get enrolled student count per course
router.get('/enrolled-stats', auth, async (req, res) => {
  try {
    const enrollStats = await Enroll.aggregate([
      {
        $group: {
          _id: '$courseId',
          enrolled_students: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course',
        },
      },
      {
        $unwind: '$course',
      },
      {
        $project: {
          _id: 0,
          course_id: '$_id',
          course_name: '$course.course_name',
          course_description: '$course.course_description',
          course_video: '$course.course_video',
          enrolled_students: 1,
        },
      },
      {
        $sort: { course_name: 1 },
      },
    ]);

    res.json(enrollStats);
  } catch (err) {
    console.error('Error fetching enrolled stats:', err);
    res.status(500).json({ msg: 'Server error fetching enrolled stats' });
  }
});

// Update course progress
router.put('/:id/status', auth, async (req, res) => {
  const { progress } = req.body;

  try {
    const enrollment = await Enroll.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ msg: 'Enrollment not found' });

    enrollment.progress = progress;
    await enrollment.save();

    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all users enrolled in a specific course
router.get('/course/:courseId', auth, async (req, res) => {
  const enrollments = await Enroll.find({ courseId: req.params.courseId }).populate({
    path: 'userId',
    select: 'name email',
  });

  const enrolledUsers = enrollments.map((enroll) => ({
    name: enroll.userId.name,
    email: enroll.userId.email,
  }));

  res.json(enrolledUsers);
});

// Check if user is enrolled in a course
router.get('/check/:courseId', auth, async (req, res) => {
  const { courseId } = req.params;

  try {
    const existingEnroll = await Enroll.findOne({
      userId: req.userId,
      courseId,
    });

    if (existingEnroll) {
      return res.status(200).json({ enrolled: true });
    } else {
      return res.status(200).json({ enrolled: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
