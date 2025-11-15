import express from "express";
import mongoose from "mongoose";
import admin from "firebase-admin";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

import authRoutes from "./src/routes/authRoutes.js";
import { course } from "./src/routes/course.js";
import paymentRoutes from "./src/routes/payment.js";
import userData from "./src/routes/Dash.js";
import email from "./src/routes/emailrout.js";
import teacher from "./src/routes/admin.js";

dotenv.config();

const app = express();

// ============================
// ⚙️ CORS FIX (IMPORTANT)
// ============================
app.use(
  cors({
    origin: [
      "https://vidiyalink.online",     // frontend
      "https://api.vidiyalink.online" ,// backend domain
       "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ============================
// 🔧 Middleware
// ============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// ============================
// 🔥 Initialize Firebase Admin
// ============================
try {
  const serviceAccount = JSON.parse(
    fs.readFileSync("./serviceAccountKey.json", "utf-8")
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("✅ Firebase connected successfully!");
} catch (error) {
  console.error("❌ Firebase connection failed:", error.message);
}

// ============================
// 🌍 Connect MongoDB
// ============================
const MONGO_URI = process.env.MONGO_URI;

const DEFAULT_MONGO =
  "mongodb+srv://vtech250m_db_user:OjGWnzoY6iT3cQP7@cluster0.uctpl7d.mongodb.net/";

mongoose
  .connect(MONGO_URI || DEFAULT_MONGO)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ============================
// 📦 Routes
// ============================
app.use("/api/auth", authRoutes);
app.use("/api/course", course);
app.use("/api/payment", paymentRoutes);
app.use("/api/user", userData);
app.use("/api/email", email);
app.use("/api/admin", teacher);

app.get("/", (req, res) => {
  res.send("🚀 Backend working successfully via HTTPS!");
});

// ============================
// ⚡ Start Server
// ============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`✅ Server running on https://api.vidiyalink.online (PORT: ${PORT})`)
);
