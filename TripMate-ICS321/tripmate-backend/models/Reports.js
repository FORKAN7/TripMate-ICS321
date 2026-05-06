import db from "../config/db.js";

export const createReport = async (content) => {
  const [result] = await db.query(
    "INSERT INTO REPORT (content) VALUES (?)",
    [content]
  );
  return result.insertId;
};

export const getAllReports = async () => {
  const [rows] = await db.query("SELECT * FROM REPORT");
  return rows;
};