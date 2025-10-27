import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import { getMe, showcourse, showStudentCourses } from "../Control/Dash.js";

// tumhara middleware

const router = express.Router();

// 🔹 Route: Get current logged-in student
router.post("/me", authMiddleware,getMe);
router.post("/showcourse",showcourse);
router.post("/student",showStudentCourses);

export default router;
