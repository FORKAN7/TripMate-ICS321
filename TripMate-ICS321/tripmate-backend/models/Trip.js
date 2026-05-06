import db from "../config/db.js";

export const getTripsByUser = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM TRIP WHERE organizer_id = ?",
    [userId]
  );
  return rows;
};

export const getTripById = async (tripId) => {
  const [rows] = await db.query(
    "SELECT * FROM TRIP WHERE trip_id = ?",
    [tripId]
  );
  return rows[0];
};

export const createTrip = async ({ title, startDate, endDate, organizerId, inviteCode }) => {
  const [result] = await db.query(
    `INSERT INTO TRIP 
     (title, start_date, end_date, organizer_id, invite_code)
     VALUES (?, ?, ?, ?, ?)`,
    [title, startDate, endDate, organizerId, inviteCode]
  );

  return result.insertId;
};