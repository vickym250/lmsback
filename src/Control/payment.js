import mongoose from "mongoose";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import User from "../models/User.js";
import Course from "../models/course.js";

dotenv.config();

const razorpay = new Razorpay({
  key_id: "rzp_live_RSbqXqGXXLi8VP",
  key_secret: "aEGGafcok6O17i7x0qTSjhqZ",
});

// =====================
// 🔹 Create Razorpay Order
// =====================
export const createOrder = async (req, res) => {
  try {
    const { amount, courseId } = req.body;

    if (!amount || !courseId) {
      return res.status(400).json({ error: "Amount or Course ID missing" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // ₹ → paise
      currency: "INR",
      receipt: "rcpt_" + Math.floor(Math.random() * 10000),
    });

    res.json(order);
  } catch (err) {
    console.error("❌ ORDER CREATION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// =====================
// 🔹 Verify Payment & Enroll User
// =====================
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      userId, // ✅ frontend se MongoDB _id aayega
    } = req.body;

    // ✅ Step 1: Basic validation
    if (!userId) return res.status(401).json({ error: "User ID missing" });
    if (!courseId) return res.status(400).json({ error: "Course ID missing" });

    // ✅ Step 2: Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment signature mismatch" });
    }

    // ✅ Step 3: Convert IDs properly
    const mongooseUserId = new mongoose.Types.ObjectId(userId);
    const mongooseCourseId = new mongoose.Types.ObjectId(courseId);

    // ✅ Step 4: Find user
    const user = await User.findById(mongooseUserId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Step 5: Check if already enrolled
    if (user.enrolledCourses.includes(mongooseCourseId)) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // ✅ Step 6: Update user enrolledCourses
    user.enrolledCourses.push(mongooseCourseId);
    await user.save();

    // ✅ Step 7: Update course studentsEnrolled with user's _id
    await Course.findByIdAndUpdate(
      mongooseCourseId,
      { $addToSet: { studentsEnrolled: mongooseUserId } },
      { new: true }
    );

    // ✅ Step 8: Send success response
    return res.json({
      success: true,
      message: "✅ Payment verified & enrollment successful!",
      enrolledCourse: courseId,
      userId: user._id,
    });
  } catch (err) {
    console.error("❌ VERIFY PAYMENT ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};
