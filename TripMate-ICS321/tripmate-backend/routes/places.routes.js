import express from "express";
import db from "../config/db.js";

const router = express.Router();

// GET /api/places?city=Riyadh&category=Culture
router.get("/", async (req, res) => {
  const { city, category } = req.query;

  try {
    let sql = `
      SELECT 
        p.place_id,
        p.name,
        p.category,
        p.description,
        p.image_url AS image,
        c.name AS city
      FROM PLACE p
      JOIN CITY c ON p.city_id = c.city_id
      WHERE 1=1
    `;

    const values = [];

    if (city) {
      sql += " AND c.name = ?";
      values.push(city);
    }

    if (category) {
      sql += " AND p.category = ?";
      values.push(category);
    }

    const [places] = await db.query(sql, values);
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;