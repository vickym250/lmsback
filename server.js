import express from "express";
import mongoose from "mongoose";
import admin from "firebase-admin";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./src/routes/authRoutes.js";
import { course } from "./src/routes/course.js";
import paymentRoutes from "./src/routes/payment.js";
import userData from "./src/routes/Dash.js";
import email from "./src/routes/emailrout.js";
import teacher from "./src/routes/admin.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// ============================
// 🔥 Initialize Firebase Admin
// ============================
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("✅ Firebase admin initialized successfully");
} catch (err) {
  console.error("❌ Firebase initialization failed:", err.message);
}

<<<<<<< HEAD
// ============================
// 🌍 Connect MongoDB
// ============================
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ============================
// 📦 Routes
// ============================
=======
// Connect to MongoDB
const MONGO_URI ="mongodb+srv://vtech250m_db_user:OjGWnzoY6iT3cQP7@cluster0.uctpl7d.mongodb.net/"
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));
// Routes
>>>>>>> 025c9a7 (first commit)
app.use("/api/auth", authRoutes);
app.use("/api/course", course);
app.use("/api/payment", paymentRoutes);
app.use("/api/user", userData);
app.use("/api/email", email);
app.use("/api/admin", teacher);

app.get("/", (req, res) => {
  res.send("🚀 Firebase + MongoDB backend is running successfully!");
});

// ============================
// ⚡ Start Server
// ============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
