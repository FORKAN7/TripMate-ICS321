import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );
};

// POST /api/auth/register
router.post("/register", async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists) {
            return res.status(400).json({ message: "An account with this email already exists." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });
        res.status(201).json({
            success: true,
            user: {
                name: newUser.fullName,
                email: newUser.email,
                role: newUser.role,
                joinedAt: newUser.joinedAt,
            },
            token: generateToken(newUser),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "No account found with this email." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }
        res.json({
            success: true,
            user: {
                name: user.fullName,
                email: user.email,
                role: user.role,
                joinedAt: user.joinedAt,
            },
            token: generateToken(user),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/auth/check-email?email=test@test.com
router.get("/check-email", async (req, res) => {
    const { email } = req.query;
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ exists: false, message: "No account found with this email." });
        }
        res.json({ exists: true, name: user.fullName, email: user.email });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// PUT /api/auth/update-email
router.put("/update-email", protect, async (req, res) => {
    const { email } = req.body;
    try {
        const exists = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.user.id } });
        if (exists) return res.status(400).json({ message: "Email already in use." });
        await User.findByIdAndUpdate(req.user.id, { email: email.toLowerCase() });
        res.json({ success: true, message: "Email updated." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// POST /api/auth/photos
router.post("/photos", protect, async (req, res) => {
    const { photo } = req.body; // base64 string
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $push: { photos: photo } },
            { new: true }
        );
        res.json({ success: true, photos: user.photos });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/auth/photos
router.get("/photos", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("photos");
        res.json(user.photos || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/auth/photos/:index
router.delete("/photos/:index", protect, async (req, res) => {
    const index = parseInt(req.params.index);
    try {
        const user = await User.findById(req.user.id).select("photos");
        if (!user || index < 0 || index >= user.photos.length) {
            return res.status(404).json({ message: "Photo not found." });
        }
        const photoToRemove = user.photos[index];
        const updated = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { photos: photoToRemove } },
            { new: true }
        );
        res.json({ success: true, photos: updated.photos });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;