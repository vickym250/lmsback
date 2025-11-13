import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

// ✅ Get all teachers
export const getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "Teacher", deletedAt: null });

    if (teachers.length === 0) {
      return res.status(404).json({ message: "No teachers found" });
    }

    res.status(200).json({
      success: true,
      count: teachers.length,
      teachers,
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching teachers",
      error: error.message,
    });
  }
};

// ✅ Get all students
export const getStudent = async (req, res) => {
  try {
    const students = await User.find({ role: "Student", deletedAt: null });

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching students",
      error: error.message,
    });
  }
};

// ✅ Soft delete Teacher
export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.body;

    const teacher = await User.findOneAndUpdate(
      { _id: id, role: "Teacher" },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
      teacher,
    });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting teacher",
      error: error.message,
    });
  }
};

// ✅ Soft delete Student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.body;

    const student = await User.findOneAndUpdate(
      { _id: id, role: "Student" },
      { deletedAt: new Date() },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      student,
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting student",
      error: error.message,
    });
  }
};

 // model banaya niche


export const adminLogin = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const admin = await Admin.findOne({ userId });
    if (!admin) {
      return res.json({ success: false, message: "Invalid User ID" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Login successful",
      token,
      admin: { name: admin.name, userId: admin.userId },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};
export const createAdmin = async (req, res) => {
  try {
    const { name, userId, password } = req.body;

    const existing = await Admin.findOne({ userId });
    if (existing) {
      return res.json({ success: false, message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      name,
      userId,
      password: hashedPassword,
    });

    res.json({
      success: true,
      message: "Admin created successfully",
      admin: { name: newAdmin.name, userId: newAdmin.userId },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};