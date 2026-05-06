import express from "express";
import db from "../config/db.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

// GET /api/trips
router.get("/", async (req, res) => {
  try {
    const [trips] = await db.query(
      `
      SELECT 
        t.*,
        CASE 
          WHEN t.organizer_id = ? THEN 'Organizer'
          ELSE 'Member'
        END AS userRole
      FROM TRIP t
      LEFT JOIN TRIP_MEMBER tm ON t.trip_id = tm.trip_id
      WHERE t.organizer_id = ? OR tm.user_id = ?
      ORDER BY t.start_date DESC
      `,
      [req.user.id, req.user.id, req.user.id]
    );

    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/trips
router.post("/", async (req, res) => {
  const { name, destination, duration, city, days } = req.body;

  try {
    const title = name || destination || city || "New Trip";
    const startDate = new Date().toISOString().slice(0, 10);

    const end = new Date();
    end.setDate(end.getDate() + Number(duration || days || 1));
    const endDate = end.toISOString().slice(0, 10);

    const inviteCode = `TRIP-${Date.now()}`;

    const [result] = await db.query(
      `
      INSERT INTO TRIP (title, start_date, end_date, organizer_id, invite_code)
      VALUES (?, ?, ?, ?, ?)
      `,
      [title, startDate, endDate, req.user.id, inviteCode]
    );

    const [trip] = await db.query(
      "SELECT * FROM TRIP WHERE trip_id = ?",
      [result.insertId]
    );

    res.status(201).json(trip[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/trips/:id
router.put("/:id", async (req, res) => {
  const { title, name, start_date, end_date } = req.body;

  try {
    const [allowed] = await db.query(
      `
      SELECT t.trip_id
      FROM TRIP t
      LEFT JOIN TRIP_MEMBER tm ON t.trip_id = tm.trip_id
      WHERE t.trip_id = ? AND (t.organizer_id = ? OR tm.user_id = ?)
      `,
      [req.params.id, req.user.id, req.user.id]
    );

    if (allowed.length === 0) {
      return res.status(404).json({ message: "Trip not found." });
    }

    await db.query(
      `
      UPDATE TRIP
      SET title = COALESCE(?, title),
          start_date = COALESCE(?, start_date),
          end_date = COALESCE(?, end_date)
      WHERE trip_id = ?
      `,
      [title || name, start_date, end_date, req.params.id]
    );

    const [updated] = await db.query(
      "SELECT * FROM TRIP WHERE trip_id = ?",
      [req.params.id]
    );

    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/trips/:id
router.delete("/:id", async (req, res) => {
  try {
    const [trip] = await db.query(
      "SELECT * FROM TRIP WHERE trip_id = ? AND organizer_id = ?",
      [req.params.id, req.user.id]
    );

    if (trip.length === 0) {
      return res.status(404).json({ message: "Trip not found." });
    }

    await db.query("DELETE FROM DAY_PLACE WHERE day_id IN (SELECT day_id FROM ITINERARY_DAY WHERE trip_id = ?)", [req.params.id]);
    await db.query("DELETE FROM ITINERARY_DAY WHERE trip_id = ?", [req.params.id]);
    await db.query("DELETE FROM TRIP_MEMBER WHERE trip_id = ?", [req.params.id]);
    await db.query("DELETE FROM TRIP WHERE trip_id = ?", [req.params.id]);

    res.json({ success: true, message: "Trip deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;