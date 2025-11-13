import User from "../models/User.js";
import Course from "../models/course.js";
// ✅ Get logged-in student info
export const getMe = async (req, res) => {
try {
    // Middleware se `req.user` me decoded token hoga
    const { uid } = req.user;
 
    const user = await User.findOne({ uid }).select(
      "name email picture role enrolledCourses"
   );

    if (!user) return res.status(404).json({ message: "User not found" });

     res.json(user);
  } catch (err) {
     console.error(err);
    res.status(500).json({ message: "Server error" });
  }

}


export const showcourse = async (req, res) => {
  try {
    const { teacherId } = req.body; // ya req.params se le sakte ho

    // Filter: deletedAt null aur teacherId match
    const allcourse = await Course.find({
      teacherId: teacherId,
      deletedAt: null
    });

    if (allcourse.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for this teacher.",
      });
    }

    res.status(200).json({
      success: true,
      count: allcourse.length,
      data: allcourse,
    });

  } catch (error) {
    console.error("❌ Error fetching teacher's courses:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const showStudentCourses = async (req, res) => {
  try {
    const { studentId } = req.body; // Student ki ID frontend se aayegi

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required.",
      });
    }

    // Find courses jisme student enrolled hai
    const enrolledCourses = await Course.find({
      deletedAt: null,
      studentsEnrolled: { $in: [studentId] },
    });

    if (enrolledCourses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for this student.",
      });
    }

    // Total fees and course count
    const totalFees = enrolledCourses.reduce(
      (sum, c) => sum + (c.fees || 0),
      0
    );

    res.status(200).json({
      success: true,
      count: enrolledCourses.length,
      totalFees,
      data: enrolledCourses,
    });

  } catch (error) {
    console.error("❌ Error fetching student's courses:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
