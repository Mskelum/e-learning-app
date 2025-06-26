const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  course_name: String,
  course_description: String,
  course_video: String,

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

module.exports = mongoose.model('Course', CourseSchema);
