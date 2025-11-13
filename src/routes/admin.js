import express from "express";
import {
  getStudent,
  getTeachers,
  deleteTeacher,
  deleteStudent,
  createAdmin,
  adminLogin,
} from "../Control/admin.js";

const router = express.Router();

// Get teachers & students
router.post("/get", getTeachers);
router.post("/getStu", getStudent);

// Delete teacher & student
router.post("/deleteTeacher", deleteTeacher);
router.post("/deleteStudent", deleteStudent);
router.post("/regis",createAdmin);
router.post("/log",adminLogin);

export default router;
