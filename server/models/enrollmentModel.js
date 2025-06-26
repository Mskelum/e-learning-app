const mongoose = require('mongoose');

const EnrollSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  progress: {
    type: Number,    
    default: 0
  }
}, { timestamps: true }); 

module.exports = mongoose.model('Enroll', EnrollSchema);
