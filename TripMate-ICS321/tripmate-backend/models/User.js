import db from "../config/db.js";

export const findUserByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM USER WHERE email = ?",
    [email.toLowerCase()]
  );
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM USER WHERE user_id = ?",
    [id]
  );
  return rows[0];
};

export const createUser = async ({ fullName, email, password }) => {
  const [result] = await db.query(
    "INSERT INTO USER (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [fullName, email.toLowerCase(), password, "Member"]
  );
  return result.insertId;
};

export const updateUserEmail = async (id, email) => {
  await db.query(
    "UPDATE USER SET email = ? WHERE user_id = ?",
    [email.toLowerCase(), id]
  );
};