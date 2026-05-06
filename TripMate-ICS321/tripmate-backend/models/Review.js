import db from "../config/db.js";

export const getReviewsByPlace = async (placeId) => {
  const [rows] = await db.query(`
    SELECT REVIEW.*, USER.name AS user_name
    FROM REVIEW
    JOIN USER ON REVIEW.user_id = USER.user_id
    WHERE REVIEW.place_id = ?
  `, [placeId]);

  return rows;
};

export const createReview = async ({ userId, placeId, rating, comment }) => {
  const [result] = await db.query(
    "INSERT INTO REVIEW (user_id, place_id, rating, comment) VALUES (?, ?, ?, ?)",
    [userId, placeId, rating, comment]
  );

  return result.insertId;
};