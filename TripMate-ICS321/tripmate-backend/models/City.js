import db from "../config/db.js";

export const getAllCities = async () => {
  const [rows] = await db.query("SELECT * FROM CITY");
  return rows;
};

export const getCityById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM CITY WHERE city_id = ?",
    [id]
  );
  return rows[0];
};