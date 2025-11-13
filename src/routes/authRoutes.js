import express from "express";
import User from "../models/User.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

// ------------------------------
// Login Route
// ------------------------------
router.post("/login", authMiddleware, async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user;
    const { role } = req.body;

   
    if (role) console.log("ROLE from frontend:", role);

    if (!uid) return res.status(400).json({ error: "UID missing!" });

    let user = await User.findOne({ uid });

    if (!user) {
      // New user create
      user = await User.create({
        uid,
        email: email || "",
        name: name || "",
        picture: picture || "",
        role: role || "", // initially empty
        lastLogin: new Date(),
      });
    } else {
      // Existing user update
      user.lastLogin = new Date();
      await user.save();
    }

    return res.json({ message: "User logged in ✅", user });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ------------------------------
// Update Role Route
// ------------------------------
router.post("/update-role", authMiddleware, async (req, res) => {
  try {
    const { uid } = req.user;
    const { role } = req.body;

    if (!uid || !role) return res.status(400).json({ error: "UID or role missing!" });

    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "User not found!" });

    user.role = role;
    await user.save();

    return res.json({ message: "Role updated ✅", user });
  } catch (err) {
    console.error("Update role error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
