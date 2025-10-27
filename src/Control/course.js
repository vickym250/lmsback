import Course from "../models/course.js"

import fs from "fs";

export const createCourse = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { title, fees, lessons } = req.body;
    const file = req.file ? req.file.filename : null;

    // 🧩 Validation
    if (!title || !fees || !teacherId) {
      return res.status(400).json({
        success: false,
        message: "❌ Title, Fees aur Teacher ID required hain!",
      });
    }

    // 🧩 Parse Lessons safely
    let lessonArray = [];
    try {
      lessonArray =
        typeof lessons === "string" ? JSON.parse(lessons) : lessons || [];
    } catch {
      lessonArray = [];
    }

    // 🧩 Course Create
    const newCourse = new Course({
      title,
      fees,
      teacherId,
      lessons: lessonArray,
      thumbnail: file ? `/uploads/courses/${file}` : null,
    });

    await newCourse.save();

    return res.status(201).json({
      success: true,
      message: "✅ Course created successfully!",
      course: newCourse,
    });
  } catch (error) {
    console.error("❌ Error creating course:", error);
    res.status(500).json({
      success: false,
      message: "Error creating course",
      error: error.message,
    });
  }
};

// ✅ Get all courses by teacher
export const getCoursesByTeacher = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const courses = await Course.find({ teacherId }).populate(
      "studentsEnrolled",
      "name email"
    );

    if (!courses.length) {
      return res.status(404).json({
        success: false,
        message: "No courses found for this teacher",
      });
    }

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
};

// ✅ Get all courses (for home / all courses page)
// ✅ Get All Courses (Public Access)
export const allCourse = async (req, res) => {
  try {
    // Sirf wahi course dikhe jinka deletedAt field khali ho (null)
    const courses = await Course.find({ deletedAt: null });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("❌ Error fetching all courses:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export const findCourseById = async (req, res) => {
  try {
    const { Id } = req.body; // URL से ID प्राप्त करना
    const getCourse = await Course.findById(Id);

    if (!getCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(getCourse);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
// ✅ Enroll a user/student in a course

export const updateProgress = async (req, res) => {
  try {
    const { userId, courseId, percent } = req.body;

    if (!userId || !courseId || percent === undefined) {
      return res
        .status(400)
        .json({ message: "userId, courseId aur percent required hai" });
    }

    // Course find karo
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Dekho student already enrolled hai kya
    let student = course.studentsProgress.find((s) => s.studentId === userId);

    if (student) {
      // Update karo progress
      student.progress = percent;
    } else {
      // Naya student add karo
      course.studentsProgress.push({ studentId: userId, progress: percent });
    }

    await course.save();

    console.log(`✅ Progress updated for user ${userId}: ${percent}%`);

    res.status(200).json({
      message: "Progress updated",
      userId,
      courseId,
      progress: percent,
    });
  } catch (err) {
    console.error("❌ Error in updateProgress:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



// Soft delete course
export const deleteC = async (req, res) => {
  try {
    const { id } = req.body;

    // Course find and update
    const course = await Course.findByIdAndUpdate(
     id,
      { 
        deletedAt: new Date()  // current date store
      },
      { new: true } // updated document return kare
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully", course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const updateCourse = async (req, res) => {
  try {
    const { id, title, fees, lessons } = req.body;
    const file = req.file ? req.file.filename : null;

    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return res.status(404).json({ success: false, message: "❌ Course not found" });
    }

    let lessonArray = [];
    try {
      lessonArray =
        typeof lessons === "string" ? JSON.parse(lessons) : lessons || [];
    } catch {
      lessonArray = [];
    }

    if (title) existingCourse.title = title;
    if (fees) existingCourse.fees = fees;
    if (lessonArray.length > 0) existingCourse.lessons = lessonArray;

    if (file) {
      if (existingCourse.thumbnail) {
        const oldPath = existingCourse.thumbnail.replace("/uploads/courses/", "");
        if (fs.existsSync(`uploads/courses/${oldPath}`)) {
          fs.unlinkSync(`uploads/courses/${oldPath}`);
        }
      }
      existingCourse.thumbnail = `/uploads/courses/${file}`;
    }

    await existingCourse.save();

    res.status(200).json({
      success: true,
      message: "✅ Course updated successfully",
      course: existingCourse,
    });
  } catch (error) {
    console.error("❌ Error updating course:", error);
    res.status(500).json({
      success: false,
      message: "Error updating course",
      error: error.message,
    });
  }
};