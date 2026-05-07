import express from "express";
import db from "../config/db.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/reviews/:placeId — جيب كل reviews لمكان معين
router.get("/:placeId", async (req, res) => {
    try {
        const [reviews] = await db.query(
            `SELECT 
                r.review_id,
                r.rating,
                r.comment,
                r.created_at,
                u.name AS user_name
             FROM REVIEW r
             JOIN USER u ON r.user_id = u.user_id
             WHERE r.place_id = ?
             ORDER BY r.created_at DESC`,
            [req.params.placeId]
        );
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/reviews — أضف review جديد (يحتاج login)
router.post("/", protect, async (req, res) => {
    const { place_id, rating, comment } = req.body;

    if (!place_id || !rating || !comment) {
        return res.status(400).json({ message: "place_id, rating, and comment are required." });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO REVIEW (user_id, place_id, rating, comment)
             VALUES (?, ?, ?, ?)`,
            [req.user.id, place_id, rating, comment]
        );

        const [newReview] = await db.query(
            `SELECT 
                r.review_id,
                r.rating,
                r.comment,
                r.created_at,
                u.name AS user_name
             FROM REVIEW r
             JOIN USER u ON r.user_id = u.user_id
             WHERE r.review_id = ?`,
            [result.insertId]
        );

        res.status(201).json(newReview[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;