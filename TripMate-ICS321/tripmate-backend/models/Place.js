import db from "../config/db.js";

export const getAllPlaces = async () => {
  const [rows] = await db.query(`
    SELECT 
      PLACE.*,
      CITY.name AS city_name
    FROM PLACE
    JOIN CITY ON PLACE.city_id = CITY.city_id
  `);
  return rows;
};

export const getPlaceById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM PLACE WHERE place_id = ?",
    [id]
  );
  return rows[0];
};

export const getPlacesByCity = async (cityId) => {
  const [rows] = await db.query(
    "SELECT * FROM PLACE WHERE city_id = ?",
    [cityId]
  );
  return rows;
};