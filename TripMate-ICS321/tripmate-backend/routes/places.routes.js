import express from "express";
import Place from "../models/Place.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/places
router.get("/",  async (req, res) => {
    const { city, category } = req.query;
    const filter = {};
    if (city) filter.city = city;
    if (category) filter.category = category;

    try {
        const places = await Place.find(filter);
        res.json(places);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;