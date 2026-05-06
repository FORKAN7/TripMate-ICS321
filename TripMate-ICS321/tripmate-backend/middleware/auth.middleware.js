import jwt from "jsonwebtoken";
import db from "../config/db.js";

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [users] = await db.query(
            "SELECT user_id, name, email, role FROM `USER` WHERE user_id = ?",
            [decoded.id]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = users[0];

        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user?.role !== "Admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};

export { protect, adminOnly };