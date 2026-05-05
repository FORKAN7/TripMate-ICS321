import express from "express";
import User from "../models/User.js";
import City from "../models/City.js";
import Place from "../models/Place.js";
import Report from "../models/Reports.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// PUBLIC — no auth needed
router.get("/cities-list", async (req, res) => {
    try {
        const cities = await City.find();
        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Everything below requires admin
router.use(protect, adminOnly);

// GET /api/admin/users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/admin/users/:id
router.put("/users/:id", async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { fullName: req.body.fullName, email: req.body.email },
            { new: true }
        ).select("-password");
        if (!updated) return res.status(404).json({ message: "User not found." });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/admin/users/:id
router.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found." });
        res.json({ success: true, message: "User deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/admin/cities
router.post("/cities", async (req, res) => {
    const { cityName } = req.body;
    if (!cityName) return res.status(400).json({ message: "City name required" });
    try {
        const exists = await City.findOne({ name: cityName });
        if (exists) return res.status(400).json({ message: "City already exists" });
        const city = await City.create({ name: cityName });
        res.status(201).json(city);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/admin/cities/:id
router.put("/cities/:id", async (req, res) => {
    try {
        const updated = await City.findByIdAndUpdate(
            req.params.id,
            { name: req.body.cityName },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "City not found." });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/admin/cities/:id
router.delete("/cities/:id", async (req, res) => {
    try {
        const city = await City.findByIdAndDelete(req.params.id);
        if (!city) return res.status(404).json({ message: "City not found." });
        res.json({ success: true, message: "City deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/admin/places
router.post("/places", async (req, res) => {
    const { name, city, category, description, image, rating } = req.body;
    if (!name || !city || !category || !description) {
        return res.status(400).json({ message: "Please fill in all required fields." });
    }
    try {
        const place = await Place.create({ name, city, category, description, image: image || "", rating: rating || 0 });
        res.status(201).json(place);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/admin/places/:id
router.put("/places/:id", async (req, res) => {
    try {
        const updated = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Place not found." });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/admin/places/:id
router.delete("/places/:id", async (req, res) => {
    try {
        const place = await Place.findByIdAndDelete(req.params.id);
        if (!place) return res.status(404).json({ message: "Place not found." });
        res.json({ success: true, message: "Place deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// GET /api/admin/reports
router.get("/reports", async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/admin/reports/:id
router.put("/reports/:id", async (req, res) => {
    try {
        const updated = await Report.findByIdAndUpdate(
            req.params.id,
            { status: "Reviewed" },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Report not found." });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/admin/reports/:id
router.delete("/reports/:id", async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        if (!report) return res.status(404).json({ message: "Report not found." });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;