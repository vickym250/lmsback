import mongoose from "mongoose";

// ===== Lesson Schema =====
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Lesson Title
  videoId: { type: String, required: true }, // YouTube Video ID
  duration: { type: String, default: "00:00" }, // Optional Duration
  completed: { type: Boolean, default: false }, // Tracking for students
});

// ===== Course Schema =====
const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Course Name
    fees: { type: Number, required: true }, // Course Fees
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    lessons: [lessonSchema], // Detailed lessons array

    thumbnail: {
      type: String,
      default: null, // will store file path like "/uploads/courses/filename.jpg"
    },

    studentsEnrolled: [
      { type: String }, // later change to ObjectId if needed
    ],

    // ✅ Progress field added
   studentsProgress: [
      {
        studentId: String, // user ka UID store hoga
        progress: { type: Number, default: 0 }, // frontend se percent aayega
      },
    ],
  
    deletedAt: { type: Date }, // Optional end date
  },
 
  { timestamps: true }
);

// ===== Export Model =====
const Course = mongoose.model("Course", courseSchema);
export default Course;
