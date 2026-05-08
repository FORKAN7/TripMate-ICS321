import express from "express";
import db from "../config/db.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(protect);

// GET /api/trips
router.get("/", async (req, res) => {
    try {
        const [trips] = await db.query(
            `SELECT t.*,
                CASE WHEN t.organizer_id = ? THEN 'Organizer' ELSE 'Member' END AS userRole
             FROM TRIP t
             LEFT JOIN TRIP_MEMBER tm ON t.trip_id = tm.trip_id
             WHERE t.organizer_id = ? OR tm.user_id = ?
             GROUP BY t.trip_id
             ORDER BY t.start_date DESC`,
            [req.user.user_id, req.user.user_id, req.user.user_id]
        );

        for (const trip of trips) {
            const [days] = await db.query(
                `SELECT id.day_id, id.day_number,
                        dp.place_id, dp.visit_order, dp.notes,
                        p.name, p.category, p.description, p.rating, p.image_url,
                        c.name AS city_name
                 FROM ITINERARY_DAY id
                 LEFT JOIN DAY_PLACE dp ON id.day_id = dp.day_id
                 LEFT JOIN PLACE p ON dp.place_id = p.place_id
                 LEFT JOIN CITY c ON p.city_id = c.city_id
                 WHERE id.trip_id = ?
                 ORDER BY id.day_number, dp.visit_order`,
                [trip.trip_id]
            );

            const itinerary = {};
            const dur = trip.duration || 1;
            for (let i = 1; i <= dur; i++) itinerary[i] = [];

            for (const row of days) {
                if (!row.place_id) continue;
                if (!itinerary[row.day_number]) itinerary[row.day_number] = [];
                itinerary[row.day_number].push({
                    place_id:    row.place_id,
                    name:        row.name,
                    category:    row.category,
                    description: row.description,
                    rating:      row.rating,
                    image_url:   row.image_url,
                    city_name:   row.city_name,
                    notes:       row.notes,
                });
            }

            trip.itinerary   = itinerary;
            trip.city        = trip.destination;
            trip.days        = trip.duration || 1;
            trip.name        = trip.title;
            trip.createdAt   = trip.start_date;
        }

        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/trips
router.post("/", async (req, res) => {
    const { name, destination, duration, city, days } = req.body;
    try {
        const title      = name || city || "New Trip";
        const dest       = destination || city || "";
        const dur        = Number(duration || days || 1);
        const startDate  = new Date().toISOString().slice(0, 10);
        const end        = new Date();
        end.setDate(end.getDate() + dur);
        const endDate    = end.toISOString().slice(0, 10);
        const inviteCode = `TRIP-${Date.now()}`;
        const userId     = req.user.user_id;

        const [result] = await db.query(
            `INSERT INTO TRIP (title, destination, duration, start_date, end_date, organizer_id, invite_code)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [title, dest, dur, startDate, endDate, userId, inviteCode]
        );

        const tripId = result.insertId;

        for (let i = 1; i <= dur; i++) {
            await db.query(
                `INSERT INTO ITINERARY_DAY (trip_id, day_number, date) VALUES (?, ?, ?)`,
                [tripId, i, startDate]
            );
        }

        const itinerary = {};
        for (let i = 1; i <= dur; i++) itinerary[i] = [];

        res.status(201).json({
            trip_id:      tripId,
            title,
            name:         title,
            destination:  dest,
            city:         dest,
            duration:     dur,
            days:         dur,
            organizer_id: userId,
            invite_code:  inviteCode,
            itinerary,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/trips/:id
router.put("/:id", async (req, res) => {
    const { name, title, itinerary } = req.body;
    const tripId = req.params.id;
    const userId = req.user.user_id;

    try {
        const [allowed] = await db.query(
            `SELECT t.trip_id FROM TRIP t
             LEFT JOIN TRIP_MEMBER tm ON t.trip_id = tm.trip_id
             WHERE t.trip_id = ? AND (t.organizer_id = ? OR tm.user_id = ?)`,
            [tripId, userId, userId]
        );
        if (allowed.length === 0) return res.status(404).json({ message: "Trip not found." });

        if (name || title) {
            await db.query(`UPDATE TRIP SET title = ? WHERE trip_id = ?`, [name || title, tripId]);
        }

        if (itinerary && typeof itinerary === "object") {
            for (const [dayNum, places] of Object.entries(itinerary)) {
                const [dayRows] = await db.query(
                    `SELECT day_id FROM ITINERARY_DAY WHERE trip_id = ? AND day_number = ?`,
                    [tripId, dayNum]
                );

                let dayId;
                if (dayRows.length > 0) {
                    dayId = dayRows[0].day_id;
                } else {
                    const [newDay] = await db.query(
                        `INSERT INTO ITINERARY_DAY (trip_id, day_number, date) VALUES (?, ?, ?)`,
                        [tripId, dayNum, new Date().toISOString().slice(0, 10)]
                    );
                    dayId = newDay.insertId;
                }

                await db.query(`DELETE FROM DAY_PLACE WHERE day_id = ?`, [dayId]);

                for (let i = 0; i < places.length; i++) {
                    await db.query(
                        `INSERT INTO DAY_PLACE (day_id, place_id, visit_order, notes) VALUES (?, ?, ?, ?)`,
                        [dayId, places[i].place_id, i + 1, places[i].notes || null]
                    );
                }
            }
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/trips/:id
router.delete("/:id", async (req, res) => {
    const userId = req.user.user_id;
    try {
        const [trip] = await db.query(
            "SELECT * FROM TRIP WHERE trip_id = ? AND organizer_id = ?",
            [req.params.id, userId]
        );
        if (trip.length === 0) return res.status(404).json({ message: "Trip not found." });

        await db.query(`DELETE FROM DAY_PLACE WHERE day_id IN (SELECT day_id FROM ITINERARY_DAY WHERE trip_id = ?)`, [req.params.id]);
        await db.query(`DELETE FROM ITINERARY_DAY WHERE trip_id = ?`, [req.params.id]);
        await db.query(`DELETE FROM TRIP_MEMBER WHERE trip_id = ?`, [req.params.id]);
        await db.query(`DELETE FROM TRIP WHERE trip_id = ?`, [req.params.id]);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;