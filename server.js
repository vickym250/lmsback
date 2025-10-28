import express from "express";
import mongoose from "mongoose";
import admin from "firebase-admin";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser"
import authRoutes from "./src/routes/authRoutes.js";
import { course } from "./src/routes/course.js";
import paymentRoutes from "./src/routes/payment.js";
import userData from "./src/routes/Dash.js";
import email from "./src/routes/emailrout.js";
import teacher from "./src/routes/admin.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
dotenv.config();
app.use("/uploads", express.static("uploads"));
const PORT = process.env.PORT 
// Initialize Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./serviceAccountKey.json"),
  });
  console.log("Firebase admin initialized");
} catch (err) {
  console.warn("Firebase admin not initialized. Add serviceAccountKey.json to project root.");
}

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/testdb";
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // 10 seconds
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/course", course);
app.use("/api/payment", paymentRoutes);
app.use("/api/user",userData);
app.use("/api/email",email);
app.use("/api/admin",teacher);



app.get("/", (req, res) => res.send("Firebase + MongoDB backend is running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
