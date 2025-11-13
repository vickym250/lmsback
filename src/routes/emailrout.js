import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import { sendMail } from "../Control/sendemail.js";

const router = express.Router();

router.post("/send", authMiddleware, sendMail);

export default router;
