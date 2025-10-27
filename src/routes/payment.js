import express from "express";
import { createOrder, verifyPayment } from "../Control/payment.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/order",authMiddleware, createOrder);
router.post("/verify",authMiddleware, verifyPayment);

export default router;
