import express from "express";
import Review from "../models/Review.js";
import Place from "../models/Place.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/reviews/:placeId
router.get("/:placeId", async (req, res) => {
    try {
        const reviews = await Review.find({ placeId: req.params.placeId }).sort({ createdAt: -1 });
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
        const existingReview = await Review.findOne({
            placeId: req.params.placeId,
            userId: req.user.id,
        });

        if (existingReview) {
            return res.status(400).json({ message: "You already reviewed this place" });
        }

        await Review.create({
            placeId: req.params.placeId,
            userId: req.user.id,
            userName: req.user.name || req.user.email,
            rating,
            comment,
        });

        // احسب المتوسط الجديد وحدّث الـ Place
        const allReviews = await Review.find({ placeId: req.params.placeId });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await Place.findByIdAndUpdate(req.params.placeId, { rating: avgRating.toFixed(1) });

        res.status(201).json({ message: "Review added", newRating: avgRating.toFixed(1) });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;