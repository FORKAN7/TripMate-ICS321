import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

const generateToken = (user) => {
    return jwt.sign(
        { id: user.user_id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );
};

// REGISTER
router.post("/register", async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        const [exists] = await db.query(
            "SELECT * FROM USER WHERE email = ?",
            [email.toLowerCase()]
        );

        if (exists.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO USER (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
            [fullName, email.toLowerCase(), hashedPassword, "Member"]
        );

        const [newUser] = await db.query(
            "SELECT * FROM USER WHERE email = ?",
            [email.toLowerCase()]
        );

        res.status(201).json({
            success: true,
            user: newUser[0],
            token: generateToken(newUser[0]),
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query(
            "SELECT * FROM USER WHERE email = ?",
            [email.toLowerCase()]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Wrong password" });
        }

        res.json({
            success: true,
            user,
            token: generateToken(user),
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CHECK EMAIL
router.get("/check-email", async (req, res) => {
    const { email } = req.query;

    try {
        const [users] = await db.query(
            "SELECT * FROM USER WHERE email = ?",
            [email.toLowerCase()]
        );

        if (users.length === 0) {
            return res.json({ exists: false });
        }

        res.json({ exists: true, user: users[0] });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;