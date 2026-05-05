import express from "express";
import Trip from "../models/Trip.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

// GET /api/trips
router.get("/", async (req, res) => {
    try {
        const ownTrips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });

        const memberTrips = await Trip.find({
            "members.email": req.user.email,
            userId: { $ne: req.user.id } // مو organizer
        }).sort({ createdAt: -1 });

        const allTrips = [
            ...ownTrips.map(t => ({ ...t.toObject(), userRole: "Organizer" })),
            ...memberTrips.map(t => ({ ...t.toObject(), userRole: "Member" }))
        ];

        res.json(allTrips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/trips
router.post("/", async (req, res) => {
    const { name, destination, duration, itinerary, members, city, days } = req.body;
    try {
        const trip = await Trip.create({
            userId: req.user.id,
            name,
            destination: destination || city,
            duration: duration || days,
            itinerary: itinerary || {},
            members: members || [],
        });
        res.status(201).json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/trips/:id
router.put("/:id", async (req, res) => {
    try {
        // allow owner OR member to update
        const trip = await Trip.findOne({
            _id: req.params.id,
            $or: [
                { userId: req.user.id },
                { "members.email": req.user.email }
            ]
        });
        if (!trip) {
            return res.status(404).json({ message: "Trip not found." });
        }
        const updated = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/trips/:id
router.delete("/:id", async (req, res) => {
    try {
        const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
        if (!trip) {
            return res.status(404).json({ message: "Trip not found." });
        }
        await trip.deleteOne();
        res.json({ success: true, message: "Trip deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;