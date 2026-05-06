import express from "express";
import db from "../config/db.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// PUBLIC
router.get("/cities-list", async (req, res) => {
  try {
    const [cities] = await db.query("SELECT * FROM CITY ORDER BY name");
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.use(protect, adminOnly);

// USERS
router.get("/users", async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT user_id, name, email, role, created_at FROM USER"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    await db.query(
      "UPDATE USER SET name = ?, email = ? WHERE user_id = ?",
      [req.body.fullName, req.body.email, req.params.id]
    );

    const [updated] = await db.query(
      "SELECT user_id, name, email, role, created_at FROM USER WHERE user_id = ?",
      [req.params.id]
    );

    if (updated.length === 0) return res.status(404).json({ message: "User not found." });

    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM REVIEW WHERE user_id = ?", [req.params.id]);
    await db.query("DELETE FROM TRIP_MEMBER WHERE user_id = ?", [req.params.id]);
    const [result] = await db.query("DELETE FROM USER WHERE user_id = ?", [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found." });

    res.json({ success: true, message: "User deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CITIES
router.post("/cities", async (req, res) => {
  const { cityName, region } = req.body;

  if (!cityName) return res.status(400).json({ message: "City name required" });

  try {
    const [exists] = await db.query("SELECT * FROM CITY WHERE name = ?", [cityName]);

    if (exists.length > 0) {
      return res.status(400).json({ message: "City already exists" });
    }

    const [result] = await db.query(
      "INSERT INTO CITY (name, region) VALUES (?, ?)",
      [cityName, region || "Saudi Arabia"]
    );

    const [city] = await db.query("SELECT * FROM CITY WHERE city_id = ?", [result.insertId]);

    res.status(201).json(city[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/cities/:id", async (req, res) => {
  try {
    await db.query(
      "UPDATE CITY SET name = ? WHERE city_id = ?",
      [req.body.cityName, req.params.id]
    );

    const [updated] = await db.query("SELECT * FROM CITY WHERE city_id = ?", [req.params.id]);

    if (updated.length === 0) return res.status(404).json({ message: "City not found." });

    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/cities/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM CITY WHERE city_id = ?", [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "City not found." });

    res.json({ success: true, message: "City deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PLACES
router.post("/places", async (req, res) => {
  const { name, city, category, description, image } = req.body;

  if (!name || !city || !category || !description) {
    return res.status(400).json({ message: "Please fill in all required fields." });
  }

  try {
    const [cities] = await db.query("SELECT city_id FROM CITY WHERE name = ?", [city]);

    if (cities.length === 0) {
      return res.status(400).json({ message: "City not found." });
    }

    const [result] = await db.query(
      `
      INSERT INTO PLACE (name, category, description, city_id, image_url)
      VALUES (?, ?, ?, ?, ?)
      `,
      [name, category, description, cities[0].city_id, image || ""]
    );

    const [place] = await db.query("SELECT * FROM PLACE WHERE place_id = ?", [result.insertId]);

    res.status(201).json(place[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/places/:id", async (req, res) => {
  const { name, category, description, image } = req.body;

  try {
    await db.query(
      `
      UPDATE PLACE
      SET name = COALESCE(?, name),
          category = COALESCE(?, category),
          description = COALESCE(?, description),
          image_url = COALESCE(?, image_url)
      WHERE place_id = ?
      `,
      [name, category, description, image, req.params.id]
    );

    const [updated] = await db.query("SELECT * FROM PLACE WHERE place_id = ?", [req.params.id]);

    if (updated.length === 0) return res.status(404).json({ message: "Place not found." });

    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/places/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM REVIEW WHERE place_id = ?", [req.params.id]);
    await db.query("DELETE FROM DAY_PLACE WHERE place_id = ?", [req.params.id]);

    const [result] = await db.query("DELETE FROM PLACE WHERE place_id = ?", [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Place not found." });

    res.json({ success: true, message: "Place deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// REPORTS
router.get("/reports", async (req, res) => {
  try {
    const [reports] = await db.query("SELECT * FROM REPORT ORDER BY created_at DESC");
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/reports/:id", async (req, res) => {
  try {
    await db.query(
      "UPDATE REPORT SET status = 'Reviewed' WHERE report_id = ?",
      [req.params.id]
    );

    const [updated] = await db.query(
      "SELECT * FROM REPORT WHERE report_id = ?",
      [req.params.id]
    );

    if (updated.length === 0) return res.status(404).json({ message: "Report not found." });

    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/reports/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM REPORT WHERE report_id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Report not found." });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;