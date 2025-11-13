import express from "express";
import * as courseController from "../Control/course.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// ======= MULTER SETUP =======

// ✅ Upload folder path
const uploadPath = path.resolve("uploads/courses");

// ✅ Folder create karo agar exist nahi karta
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("📁 uploads/courses folder created automatically");
}

// ✅ Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

// ✅ File type filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "video/mp4",
    "application/pdf",
  ];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else
    cb(
      new Error("Invalid file type. Only JPG, PNG, MP4, and PDF are allowed.")
    );
};

// ✅ Multer Middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

// ======= ROUTES =======

// ✅ Create Course (with file upload)
router.post(
  "/create/:teacherId",
  authMiddleware,
  upload.single("thumbnail"), // ✅ changed here (was "file")
  courseController.createCourse
);

// ✅ Get courses by teacher
router.get("/:teacherId/courses", courseController.getCoursesByTeacher);

// ✅ Get all courses
router.post("/allcourse", courseController.allCourse);

// ✅ Find course by ID
router.post("/coursebyid", courseController.findCourseById);

// ✅ Update course progress
router.put("/progress", courseController.updateProgress);

// ✅ Soft Delete Course
router.put("/delete", courseController.deleteC);

// ✅ Update Course (protected)
router.put(
  "/update",
  authMiddleware,
  upload.single("thumbnail"), // ✅ same change here
  courseController.updateCourse
);

export const course = router;
