import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import placesRoutes from "./routes/places.routes.js";
import tripRoutes from "./routes/trips.routes.js";
import reviewRoutes from "./routes/reviews.routes.js";
import adminRoutes from "./routes/admin.routes.js";



dotenv.config();

const app = express();

app.use(cors({
  origin: "https://tripmate-1-mc1w.onrender.com",
  credentials: true
}));
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.json({ message: "TripMate API is running ✅" });
});

app.use("/api/auth", authRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

