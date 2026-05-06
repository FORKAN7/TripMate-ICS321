import express from "express";
import db from "../config/db.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/reviews/:placeId
router.get("/:placeId", async (req, res) => {
  try {
    const [reviews] = await db.query(
      `
      SELECT 
        r.review_id,
        r.place_id,
        r.user_id,
        u.name AS userName,
        r.rating,
        r.comment,
        r.created_at
      FROM REVIEW r
      JOIN USER u ON r.user_id = u.user_id
      WHERE r.place_id = ?
      ORDER BY r.created_at DESC
      `,
      [req.params.placeId]
    );

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/reviews/:placeId
router.post("/:placeId", protect, async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({ message: "Rating and comment required" });
  }

  try {
    const [existing] = await db.query(
      "SELECT * FROM REVIEW WHERE place_id = ? AND user_id = ?",
      [req.params.placeId, req.user.id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "You already reviewed this place" });
    }

    await db.query(
      "INSERT INTO REVIEW (user_id, place_id, rating, comment) VALUES (?, ?, ?, ?)",
      [req.user.id, req.params.placeId, rating, comment]
    );

    const [avg] = await db.query(
      "SELECT AVG(rating) AS newRating FROM REVIEW WHERE place_id = ?",
      [req.params.placeId]
    );

    res.status(201).json({
      message: "Review added",
      newRating: Number(avg[0].newRating).toFixed(1),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;