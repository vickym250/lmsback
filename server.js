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

// ✅ Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// ✅ PORT config
const PORT = process.env.PORT || 10000;

// ✅ Initialize Firebase Admin SDK (Render-compatible)
try {
  if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Parse JSON from environment variable
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase Admin initialized from environment");
    } else {
      console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT env not found. Firebase not initialized.");
    }
  }
} catch (err) {
  console.error("❌ Firebase initialization error:", err.message);
}

// ✅ Connect MongoDB Atlas
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://vtech250m_db_user:OjGWnzoY6iT3cQP7@cluster0.uctpl7d.mongodb.net/lmsdb?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/course", course);
app.use("/api/payment", paymentRoutes);
app.use("/api/user", userData);
app.use("/api/email", email);
app.use("/api/admin", teacher);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🔥 Firebase + MongoDB backend is live on Render!");
});

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
